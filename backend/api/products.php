<?php
/**
 * Atlantic Optical - Products API
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $featured = $_GET['featured'] ?? null;
        $status = $_GET['status'] ?? 'published';
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        if ($id) {
            $stmt = $db->prepare("
                SELECT p.*, c.name as category_name, c.slug as category_slug,
                (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            ");
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if (!$product) jsonError('Product not found', 404);
            
            // Get all images
            $stmtImg = $db->prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order");
            $stmtImg->execute([$id]);
            $product['images'] = $stmtImg->fetchAll();
            
            // Get variants
            $stmtVar = $db->prepare("SELECT * FROM product_variants WHERE product_id = ?");
            $stmtVar->execute([$id]);
            $product['variants'] = $stmtVar->fetchAll();
            
            jsonSuccess($product);
        }

        // Build query
        $where = ["p.status = ?"];
        $params = [$status];

        if ($category) {
            $where[] = "(c.slug = ? OR c.id = (SELECT parent_id FROM categories WHERE slug = ?))";
            $params[] = $category;
            $params[] = $category;
        }
        if ($search) {
            $where[] = "(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        if ($featured === '1') {
            $where[] = "p.is_featured = 1";
        }

        $whereClause = implode(' AND ', $where);

        // Count total
        $countStmt = $db->prepare("
            SELECT COUNT(*) FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE $whereClause
        ");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        // Fetch products
        $stmt = $db->prepare("
            SELECT p.*, c.name as category_name, c.slug as category_slug,
            (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE $whereClause
            ORDER BY p.is_featured DESC, p.created_at DESC
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
        
        if (!$data || !isset($data['name']) || !isset($data['sku'])) {
            jsonError('Name and SKU are required');
        }

        $slug = generateSlug($data['name']);
        
        // Check unique slug
        $stmt = $db->prepare("SELECT id FROM products WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) {
            $slug .= '-' . time();
        }

        // Calculate price
        $exchangeRate = 17.50;
        $stmtRate = $db->prepare("SELECT usd_to_mxn FROM exchange_rates ORDER BY id DESC LIMIT 1");
        $stmtRate->execute();
        $rate = $stmtRate->fetch();
        if ($rate) $exchangeRate = $rate['usd_to_mxn'];

        $shippingPerKg = 4.50;
        $stmtShip = $db->prepare("SELECT price_per_kg_usd FROM shipping_rates WHERE method = 'maritimo' AND is_active = 1 LIMIT 1");
        $stmtShip->execute();
        $ship = $stmtShip->fetch();
        if ($ship) $shippingPerKg = $ship['price_per_kg_usd'];

        $priceMXN = calculatePriceMXN(
            $data['base_cost_usd'] ?? 0,
            $data['margin'] ?? 2.0,
            $shippingPerKg,
            $data['weight_kg'] ?? 0,
            $exchangeRate
        );

        $stmt = $db->prepare("
            INSERT INTO products (name, slug, sku, description, short_description, base_cost_usd, weight_kg, margin, price_mxn, compare_price_mxn, category_id, stock, status, is_featured, is_new, seo_title, seo_description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['name'],
            $slug,
            $data['sku'],
            $data['description'] ?? null,
            $data['short_description'] ?? null,
            $data['base_cost_usd'] ?? 0,
            $data['weight_kg'] ?? 0,
            $data['margin'] ?? 2.0,
            $priceMXN,
            $data['compare_price_mxn'] ?? null,
            $data['category_id'] ?? null,
            $data['stock'] ?? 0,
            $data['status'] ?? 'draft',
            $data['is_featured'] ?? 0,
            $data['is_new'] ?? 0,
            $data['seo_title'] ?? null,
            $data['seo_description'] ?? null
        ]);

        $productId = $db->lastInsertId();

        // Handle images
        if (!empty($data['images']) && is_array($data['images'])) {
            $stmtImg = $db->prepare("INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)");
            foreach ($data['images'] as $i => $img) {
                $stmtImg->execute([
                    $productId,
                    $img['url'] ?? $img,
                    $img['alt'] ?? $data['name'],
                    $i,
                    $i === 0 ? 1 : 0
                ]);
            }
        }

        jsonSuccess(['id' => $productId, 'slug' => $slug], 'Product created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Product ID required');

        $data = getJsonBody();
        if (!$data) jsonError('No data provided');

        // Recalculate price if cost/weight/margin changed
        $exchangeRate = 17.50;
        $stmtRate = $db->prepare("SELECT usd_to_mxn FROM exchange_rates ORDER BY id DESC LIMIT 1");
        $stmtRate->execute();
        $rate = $stmtRate->fetch();
        if ($rate) $exchangeRate = $rate['usd_to_mxn'];

        $shippingPerKg = 4.50;
        $stmtShip = $db->prepare("SELECT price_per_kg_usd FROM shipping_rates WHERE method = 'maritimo' AND is_active = 1 LIMIT 1");
        $stmtShip->execute();
        $ship = $stmtShip->fetch();
        if ($ship) $shippingPerKg = $ship['price_per_kg_usd'];

        $priceMXN = calculatePriceMXN(
            $data['base_cost_usd'] ?? 0,
            $data['margin'] ?? 2.0,
            $shippingPerKg,
            $data['weight_kg'] ?? 0,
            $exchangeRate
        );

        $fields = [];
        $params = [];
        $allowed = ['name', 'sku', 'description', 'short_description', 'base_cost_usd', 'weight_kg', 'margin', 'compare_price_mxn', 'category_id', 'stock', 'status', 'is_featured', 'is_new', 'seo_title', 'seo_description'];
        
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        
        $fields[] = "price_mxn = ?";
        $params[] = $priceMXN;
        $params[] = $id;

        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        // Update images if provided
        if (!empty($data['images']) && is_array($data['images'])) {
            $db->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$id]);
            $stmtImg = $db->prepare("INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)");
            foreach ($data['images'] as $i => $img) {
                $stmtImg->execute([
                    $id,
                    $img['url'] ?? $img,
                    $img['alt'] ?? ($data['name'] ?? ''),
                    $i,
                    $i === 0 ? 1 : 0
                ]);
            }
        }

        jsonSuccess(null, 'Product updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Product ID required');

        // Delete associated images and variants first
        $db->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$id]);
        $db->prepare("DELETE FROM product_variants WHERE product_id = ?")->execute([$id]);

        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) jsonError('Product not found', 404);
        jsonSuccess(null, 'Product deleted');
        break;
}
