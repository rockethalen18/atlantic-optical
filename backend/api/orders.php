<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $action = $_GET['action'] ?? null;
        
        if ($action === 'validate-discount') {
            validate_discount_api($db);
            break;
        }
        
        if ($id) {
            $stmt = $db->prepare("SELECT o.*, u.name as customer_name FROM orders o LEFT JOIN users u ON o.customer_email = u.email WHERE o.id = ?");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            if (!$order) jsonError('Order not found', 404);
            
            $items = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $items->execute([$id]);
            $order['items'] = $items->fetchAll();
            
            $payments = $db->prepare("SELECT * FROM payments WHERE order_id = ?");
            $payments->execute([$id]);
            $order['payments'] = $payments->fetchAll();
            
            jsonSuccess($order);
        } else {
            $status = $_GET['status'] ?? null;
            $sql = "SELECT o.*, u.name as customer_name FROM orders o LEFT JOIN users u ON o.customer_email = u.email";
            $params = [];
            if ($status) {
                $sql .= " WHERE o.status = ?";
                $params[] = $status;
            }
            $sql .= " ORDER BY o.created_at DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            jsonSuccess($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJsonBody();
        if (!$data || empty($data['items'])) jsonError('Order items are required');
        
        $db->beginTransaction();
        try {
            $orderNumber = generateOrderNumber();
            $subtotal = 0;
            $totalWeight = 0;
            
            foreach ($data['items'] as $item) {
                $subtotal += ($item['unit_price_mxn'] ?? 0) * ($item['quantity'] ?? 1);
                $totalWeight += ($item['weight_kg'] ?? 0) * ($item['quantity'] ?? 1);
            }
            
            $shippingMethod = $data['shipping_method'] ?? 'maritimo';
            $shippingCost = 0;
            try {
                $shipStmt = $db->prepare("SELECT cost_per_kg FROM shipping_rates WHERE method = ? AND is_active = 1 LIMIT 1");
                $shipStmt->execute([$shippingMethod]);
                $ship = $shipStmt->fetch();
                if ($ship) $shippingCost = $ship['cost_per_kg'] * $totalWeight;
            } catch (Exception $e) {}
            
            $discountAmount = 0;
            $discountCode = null;
            if (!empty($data['discount_code'])) {
                $discStmt = $db->prepare("SELECT * FROM discount_codes WHERE code = ? AND is_active = 1");
                $discStmt->execute([strtoupper(trim($data['discount_code']))]);
                $disc = $discStmt->fetch();
                if ($disc) {
                    $valid = true;
                    if ($disc['expires_at'] && strtotime($disc['expires_at']) < time()) $valid = false;
                    if ($disc['starts_at'] && strtotime($disc['starts_at']) > time()) $valid = false;
                    if ($disc['max_uses'] > 0 && $disc['used_count'] >= $disc['max_uses']) $valid = false;
                    if ($disc['min_order_usd'] > 0 && $subtotal < $disc['min_order_usd']) $valid = false;
                    
                    if ($valid) {
                        if ($disc['type'] === 'percentage') {
                            $discountAmount = $subtotal * ($disc['value'] / 100);
                        } else {
                            $discountAmount = min($disc['value'], $subtotal);
                        }
                        $discountCode = $disc['code'];
                        $db->prepare("UPDATE discount_codes SET used_count = used_count + 1 WHERE id = ?")->execute([$disc['id']]);
                    }
                }
            }
            
            $tax = ($subtotal - $discountAmount) * 0.16;
            $total = $subtotal - $discountAmount + $shippingCost + $tax;
            
            $stmt = $db->prepare("INSERT INTO orders (order_number, customer_name, status, shipping_address, shipping_method, shipping_cost, subtotal, discount_amount, discount_code, tax, total, currency, payment_method, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $orderNumber,
                $data['customer_name'] ?? null,
                $data['status'] ?? 'pending',
                $data['shipping_address'] ?? null,
                $shippingMethod,
                $shippingCost,
                $subtotal,
                $discountAmount,
                $discountCode,
                $tax,
                $total,
                $data['currency'] ?? 'MXN',
                $data['payment_method'] ?? null,
                'pending',
                $data['notes'] ?? null
            ]);
            $orderId = $db->lastInsertId();
            
            $itemStmt = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price_usd, unit_price_mxn, total_price_mxn, weight_kg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($data['items'] as $item) {
                $qty = $item['quantity'] ?? 1;
                $unitMxn = $item['unit_price_mxn'] ?? 0;
                $itemStmt->execute([
                    $orderId,
                    $item['product_id'] ?? null,
                    $item['product_name'] ?? '',
                    $item['product_sku'] ?? '',
                    $qty,
                    $item['unit_price_usd'] ?? 0,
                    $unitMxn,
                    $unitMxn * $qty,
                    $item['weight_kg'] ?? 0
                ]);
            }
            
            $db->commit();
            jsonSuccess([
                'id' => $orderId,
                'order_number' => $orderNumber,
                'total' => $total,
                'discount_amount' => $discountAmount
            ], 'Order created');
        } catch (Exception $e) {
            $db->rollBack();
            jsonError('Failed to create order: ' . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['status', 'shipping_method', 'payment_method', 'payment_status', 'notes'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;
        $db->prepare("UPDATE orders SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Order updated');
        break;
}

function validate_discount_api($db) {
    $code = $_GET['code'] ?? '';
    if (!$code) jsonError('Code required');
    
    $stmt = $db->prepare("SELECT * FROM discount_codes WHERE code = ? AND is_active = 1");
    $stmt->execute([strtoupper(trim($code))]);
    $discount = $stmt->fetch();
    
    if (!$discount) jsonError('Invalid discount code');
    if ($discount['expires_at'] && strtotime($discount['expires_at']) < time()) jsonError('Discount code has expired');
    if ($discount['starts_at'] && strtotime($discount['starts_at']) > time()) jsonError('Discount code is not yet active');
    if ($discount['max_uses'] > 0 && $discount['used_count'] >= $discount['max_uses']) jsonError('Discount code has been fully redeemed');
    
    jsonSuccess($discount, 'Valid discount code');
}
