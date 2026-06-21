<?php
/**
 * Atlantic Optical - Categories API
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $slug = $_GET['slug'] ?? null;
        $parentId = $_GET['parent_id'] ?? null;
        $withProducts = $_GET['with_products'] ?? false;

        if ($id || $slug) {
            $field = $id ? 'c.id' : 'c.slug';
            $value = $id ?: $slug;
            
            $stmt = $db->prepare("
                SELECT c.*, 
                (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'published') as product_count
                FROM categories c WHERE $field = ?
            ");
            $stmt->execute([$value]);
            $category = $stmt->fetch();
            if (!$category) jsonError('Category not found', 404);
            
            // Get subcategories
            $stmtSub = $db->prepare("
                SELECT c.*, 
                (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'published') as product_count
                FROM categories c WHERE c.parent_id = ? AND c.is_active = 1 ORDER BY c.sort_order
            ");
            $stmtSub->execute([$category['id']]);
            $category['children'] = $stmtSub->fetchAll();
            
            jsonSuccess($category);
        }

        // Build tree
        $where = "c.is_active = 1";
        $params = [];
        
        if ($parentId !== null) {
            $where .= " AND c.parent_id = ?";
            $params[] = $parentId ?: null;
        }

        $stmt = $db->prepare("
            SELECT c.*, 
            (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'published') as product_count
            FROM categories c WHERE $where ORDER BY c.sort_order, c.name
        ");
        $stmt->execute($params);
        $categories = $stmt->fetchAll();

        // Build tree structure
        $tree = [];
        $lookup = [];
        foreach ($categories as $cat) {
            $cat['children'] = [];
            $lookup[$cat['id']] = $cat;
        }
        foreach ($lookup as $id => &$cat) {
            if ($cat['parent_id'] && isset($lookup[$cat['parent_id']])) {
                $lookup[$cat['parent_id']]['children'][] = &$cat;
            } else {
                $tree[] = &$cat;
            }
        }

        jsonSuccess($tree);
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();

        if (!$data || !isset($data['name'])) {
            jsonError('Name is required');
        }

        $slug = generateSlug($data['name']);
        $stmt = $db->prepare("SELECT id FROM categories WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) $slug .= '-' . time();

        $stmt = $db->prepare("
            INSERT INTO categories (name, slug, description, image, parent_id, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['name'],
            $slug,
            $data['description'] ?? null,
            $data['image'] ?? null,
            $data['parent_id'] ?? null,
            $data['sort_order'] ?? 0,
            $data['is_active'] ?? 1
        ]);

        jsonSuccess(['id' => $db->lastInsertId(), 'slug' => $slug], 'Category created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Category ID required');

        $data = getJsonBody();
        $fields = [];
        $params = [];
        $allowed = ['name', 'slug', 'description', 'image', 'parent_id', 'sort_order', 'is_active'];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;

        $stmt = $db->prepare("UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);

        jsonSuccess(null, 'Category updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Category ID required');

        // Check if has products
        $stmt = $db->prepare("SELECT COUNT(*) FROM products WHERE category_id = ?");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            jsonError('Cannot delete category with products. Move products first.');
        }

        // Delete subcategories first
        $db->prepare("DELETE FROM categories WHERE parent_id = ?")->execute([$id]);

        $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) jsonError('Category not found', 404);

        jsonSuccess(null, 'Category deleted');
        break;
}
