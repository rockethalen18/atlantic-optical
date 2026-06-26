<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $slug = $_GET['slug'] ?? null;
        $category = $_GET['category'] ?? null;
        $subcategory = $_GET['subcategory'] ?? null;
        $search = $_GET['search'] ?? null;
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        if ($id || $slug) {
            $col = $slug ? 'p.slug' : 'p.id';
            $val = $slug ?: $id;
            $stmt = $db->prepare("
                SELECT p.*, c.name as category_name, c.slug as category_slug,
                       s.name as subcategory_name, s.slug as subcategory_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN subcategories s ON p.subcategory_id = s.id
                WHERE $col = ?
            ");
            $stmt->execute([$val]);
            $product = $stmt->fetch();
            if (!$product) jsonError('Product not found', 404);
            jsonSuccess($product);
        }

        $where = ["p.is_active = 1"];
        $params = [];

        if ($category) {
            $where[] = "c.slug = ?";
            $params[] = $category;
        }
        if ($subcategory) {
            $where[] = "s.slug = ?";
            $params[] = $subcategory;
        }
        if ($search) {
            $where[] = "(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ? OR p.reference LIKE ?)";
            $term = "%$search%";
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $whereClause = implode(' AND ', $where);

        $countStmt = $db->prepare("SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN subcategories s ON p.subcategory_id = s.id WHERE $whereClause");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        $stmt = $db->prepare("
            SELECT p.*, c.name as category_name, c.slug as category_slug,
                   s.name as subcategory_name, s.slug as subcategory_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            WHERE $whereClause
            ORDER BY p.name ASC
            LIMIT $limit OFFSET $offset
        ");
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        jsonSuccess([
            'products' => $products,
            'pagination' => [
                'total' => intval($total),
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ]);
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['name']) || empty($data['sku'])) {
            jsonError('Name and SKU are required');
        }

        $slug = generateSlug($data['name']);
        $stmt = $db->prepare("SELECT id FROM products WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) $slug .= '-' . time();

        $stmt = $db->prepare("
            INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['sku'], $data['name'], $slug,
            $data['reference'] ?? '', $data['description'] ?? '',
            $data['image'] ?? '', $data['barcode'] ?? '',
            json_encode($data['specs'] ?? []),
            $data['category_id'] ?? 1, $data['subcategory_id'] ?? 1,
            $data['is_active'] ?? 1
        ]);
        jsonSuccess(['id' => $db->lastInsertId(), 'slug' => $slug], 'Product created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Product ID required');
        $data = getJsonBody();
        if (!$data) jsonError('No data provided');

        $fields = [];
        $params = [];
        $allowed = ['sku', 'name', 'slug', 'reference', 'description', 'image', 'barcode', 'specs', 'category_id', 'subcategory_id', 'is_active'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $val = $field === 'specs' ? json_encode($data[$field]) : $data[$field];
                $fields[] = "$field = ?";
                $params[] = $val;
            }
        }
        if (empty($fields)) jsonError('No valid fields');
        $params[] = $id;
        $db->prepare("UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Product updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Product ID required');
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) jsonError('Product not found', 404);
        jsonSuccess(null, 'Product deleted');
        break;
}
