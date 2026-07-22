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
            $field = $id ? 'b.id' : 'b.slug';
            $val = $id ?: $slug;
            $stmt = $db->prepare("SELECT b.* FROM bundles b WHERE $field = ?");
            $stmt->execute([$val]);
            $bundle = $stmt->fetch();
            if (!$bundle) jsonError('Bundle not found', 404);
            
            $items = $db->prepare("SELECT bi.*, p.name, p.sku, p.image, p.reference FROM bundle_items bi LEFT JOIN products p ON bi.product_id = p.id WHERE bi.bundle_id = ?");
            $items->execute([$bundle['id']]);
            $bundle['items'] = $items->fetchAll();
            jsonSuccess($bundle);
        } else {
            $bundles = $db->query("SELECT b.*, (SELECT COUNT(*) FROM bundle_items WHERE bundle_id = b.id) as item_count FROM bundles b ORDER BY b.sort_order, b.created_at DESC")->fetchAll();
            jsonSuccess($bundles);
        }
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['name']) || !isset($data['bundle_price_usd'])) {
            jsonError('name and bundle_price_usd are required');
        }
        $slug = generateSlug($data['name']);
        $stmt = $db->prepare("INSERT INTO bundles (name, slug, description, bundle_price_usd, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $slug,
            $data['description'] ?? null,
            $data['bundle_price_usd'],
            $data['image'] ?? null,
            $data['is_active'] ?? 1,
            $data['sort_order'] ?? 0
        ]);
        $bundleId = $db->lastInsertId();
        
        if (!empty($data['items']) && is_array($data['items'])) {
            $itemStmt = $db->prepare("INSERT INTO bundle_items (bundle_id, product_id, quantity) VALUES (?, ?, ?)");
            foreach ($data['items'] as $item) {
                if (!empty($item['product_id'])) {
                    $itemStmt->execute([$bundleId, $item['product_id'], $item['quantity'] ?? 1]);
                }
            }
        }
        
        jsonSuccess(['id' => $bundleId], 'Bundle created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['name', 'description', 'bundle_price_usd', 'image', 'is_active', 'sort_order'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (!empty($fields)) {
            $params[] = $id;
            $db->prepare("UPDATE bundles SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        }
        
        if (isset($data['items']) && is_array($data['items'])) {
            $db->prepare("DELETE FROM bundle_items WHERE bundle_id = ?")->execute([$id]);
            $itemStmt = $db->prepare("INSERT INTO bundle_items (bundle_id, product_id, quantity) VALUES (?, ?, ?)");
            foreach ($data['items'] as $item) {
                if (!empty($item['product_id'])) {
                    $itemStmt->execute([$id, $item['product_id'], $item['quantity'] ?? 1]);
                }
            }
        }
        
        jsonSuccess(null, 'Bundle updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $db->prepare("DELETE FROM bundles WHERE id = ?")->execute([$id]);
        jsonSuccess(null, 'Bundle deleted');
        break;
}
