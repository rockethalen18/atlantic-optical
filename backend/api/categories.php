<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $slug = $_GET['slug'] ?? null;

        if ($id || $slug) {
            $field = $id ? 'c.id' : 'c.slug';
            $value = $id ?: $slug;
            $stmt = $db->prepare("
                SELECT c.*, 
                (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as product_count
                FROM categories c WHERE $field = ?
            ");
            $stmt->execute([$value]);
            $category = $stmt->fetch();
            if (!$category) jsonError('Category not found', 404);

            $stmtSub = $db->prepare("
                SELECT s.*, 
                (SELECT COUNT(*) FROM products WHERE subcategory_id = s.id AND is_active = 1) as product_count
                FROM subcategories s WHERE s.category_id = ? AND s.is_active = 1 ORDER BY s.name
            ");
            $stmtSub->execute([$category['id']]);
            $category['children'] = $stmtSub->fetchAll();
            jsonSuccess($category);
        }

        $stmt = $db->prepare("
            SELECT c.*, 
            (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as product_count
            FROM categories c WHERE c.is_active = 1 ORDER BY c.name
        ");
        $stmt->execute();
        $categories = $stmt->fetchAll();

        foreach ($categories as &$cat) {
            $stmtSub = $db->prepare("
                SELECT s.*,
                (SELECT COUNT(*) FROM products WHERE subcategory_id = s.id AND is_active = 1) as product_count
                FROM subcategories s WHERE s.category_id = ? AND s.is_active = 1 ORDER BY s.name
            ");
            $stmtSub->execute([$cat['id']]);
            $cat['children'] = $stmtSub->fetchAll();
        }

        jsonSuccess($categories);
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['name'])) jsonError('Name is required');

        $slug = generateSlug($data['name']);
        $stmt = $db->prepare("SELECT id FROM categories WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) $slug .= '-' . time();

        $stmt = $db->prepare("INSERT INTO categories (name, slug, description, image, is_active) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['name'], $slug, $data['description'] ?? null, $data['image'] ?? null, $data['is_active'] ?? 1]);
        jsonSuccess(['id' => $db->lastInsertId(), 'slug' => $slug], 'Category created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Category ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['name', 'slug', 'description', 'image', 'is_active'] as $f) {
            if (array_key_exists($f, $data)) { $fields[] = "$f = ?"; $params[] = $data[$f]; }
        }
        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;
        $db->prepare("UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Category updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Category ID required');
        $stmt = $db->prepare("SELECT COUNT(*) FROM products WHERE category_id = ?");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) jsonError('Cannot delete category with products.');
        $db->prepare("DELETE FROM subcategories WHERE category_id = ?")->execute([$id]);
        $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) jsonError('Category not found', 404);
        jsonSuccess(null, 'Category deleted');
        break;
}
