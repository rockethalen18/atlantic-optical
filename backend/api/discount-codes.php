<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM discount_codes WHERE id = ?");
            $stmt->execute([$id]);
            $rate = $stmt->fetch();
            if (!$rate) jsonError('Discount code not found', 404);
            jsonSuccess($rate);
        } else {
            $rates = $db->query("SELECT * FROM discount_codes ORDER BY created_at DESC")->fetchAll();
            jsonSuccess($rates);
        }
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['code']) || empty($data['type']) || !isset($data['value'])) {
            jsonError('code, type, and value are required');
        }
        $code = strtoupper(trim($data['code']));
        $stmt = $db->prepare("INSERT INTO discount_codes (code, type, value, min_order_usd, max_uses, applies_to, applies_to_id, starts_at, expires_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $code,
            $data['type'],
            $data['value'],
            $data['min_order_usd'] ?? 0,
            $data['max_uses'] ?? 0,
            $data['applies_to'] ?? 'all',
            $data['applies_to_id'] ?? null,
            $data['starts_at'] ?? null,
            $data['expires_at'] ?? null,
            $data['is_active'] ?? 1
        ]);
        jsonSuccess(['id' => $db->lastInsertId()], 'Discount code created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['code', 'type', 'value', 'min_order_usd', 'max_uses', 'applies_to', 'applies_to_id', 'starts_at', 'expires_at', 'is_active'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;
        $db->prepare("UPDATE discount_codes SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Discount code updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $db->prepare("DELETE FROM discount_codes WHERE id = ?")->execute([$id]);
        jsonSuccess(null, 'Discount code deleted');
        break;
}

// Validate a discount code (called from frontend)
function validate_discount($db) {
    $data = getJsonBody();
    if (!$data || empty($data['code'])) jsonError('Code required');
    
    $code = strtoupper(trim($data['code']));
    $stmt = $db->prepare("SELECT * FROM discount_codes WHERE code = ? AND is_active = 1");
    $stmt->execute([$code]);
    $discount = $stmt->fetch();
    
    if (!$discount) jsonError('Invalid discount code');
    
    if ($discount['expires_at'] && strtotime($discount['expires_at']) < time()) {
        jsonError('Discount code has expired');
    }
    if ($discount['starts_at'] && strtotime($discount['starts_at']) > time()) {
        jsonError('Discount code is not yet active');
    }
    if ($discount['max_uses'] > 0 && $discount['used_count'] >= $discount['max_uses']) {
        jsonError('Discount code has been fully redeemed');
    }
    
    jsonSuccess($discount, 'Valid discount code');
}
