<?php
/**
 * Atlantic Optical - Orders API
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $userId = requireAuth();
        $id = $_GET['id'] ?? null;
        $isAdmin = ($_SESSION['user_role'] ?? '') === 'admin';

        if ($id) {
            $stmt = $db->prepare("
                SELECT o.*, u.name as customer_name, u.email as customer_email
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                WHERE o.id = ?
            ");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            if (!$order) jsonError('Order not found', 404);

            $stmtItems = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $stmtItems->execute([$id]);
            $order['items'] = $stmtItems->fetchAll();

            jsonSuccess($order);
        }

        $where = $isAdmin ? "1=1" : "o.user_id = ?";
        $params = $isAdmin ? [] : [$userId];

        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = min(100, intval($_GET['limit'] ?? 20));
        $offset = ($page - 1) * $limit;

        $status = $_GET['status'] ?? null;
        if ($status) {
            $where .= " AND o.status = ?";
            $params[] = $status;
        }

        $countStmt = $db->prepare("SELECT COUNT(*) FROM orders o WHERE $where");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        $stmt = $db->prepare("
            SELECT o.*, u.name as customer_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE $where
            ORDER BY o.created_at DESC
            LIMIT $limit OFFSET $offset
        ");
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        jsonSuccess([
            'orders' => $orders,
            'pagination' => ['total' => $total, 'page' => $page, 'limit' => $limit, 'pages' => ceil($total / $limit)]
        ]);
        break;

    case 'POST':
        $userId = requireAuth();
        $data = getJsonBody();
        if (!$data || empty($data['items'])) {
            jsonError('Cart items required');
        }

        try {
            $db->beginTransaction();

            // Calculate totals and validate stock
            $subtotal = 0;
            $shippingCost = floatval($data['shipping_cost'] ?? 0);
            
            $orderItems = [];
            foreach ($data['items'] as $item) {
                $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
                $stmt->execute([$item['product_id']]);
                $product = $stmt->fetch();
                if (!$product) {
                    $db->rollBack();
                    jsonError("Product ID {$item['product_id']} not found");
                }

                $qty = intval($item['quantity'] ?? 1);
                if ($product['stock'] < $qty) {
                    $db->rollBack();
                    jsonError("Insufficient stock for {$product['name']} (available: {$product['stock']}, requested: {$qty})");
                }

                $unitPrice = $product['price_mxn'];
                $totalPrice = $unitPrice * $qty;
                $subtotal += $totalPrice;

                $orderItems[] = [
                    'product_id' => $product['id'],
                    'product_name' => $product['name'],
                    'sku' => $product['sku'],
                    'quantity' => $qty,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice
                ];
            }

            $taxRate = 0.16;
            $stmtTax = $db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'tax_rate'");
            $stmtTax->execute();
            $taxSetting = $stmtTax->fetch();
            if ($taxSetting) $taxRate = floatval($taxSetting['setting_value']);

            $tax = $subtotal * $taxRate;
            $total = $subtotal + $shippingCost + $tax;
            $orderNumber = generateOrderNumber();

            $stmt = $db->prepare("
                INSERT INTO orders (user_id, order_number, status, subtotal, shipping_cost, tax, total, shipping_method, shipping_address, billing_address, notes)
                VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $userId,
                $orderNumber,
                $subtotal,
                $shippingCost,
                $tax,
                $total,
                $data['shipping_method'] ?? null,
                json_encode($data['shipping_address'] ?? null),
                json_encode($data['billing_address'] ?? null),
                $data['notes'] ?? null
            ]);

            $orderId = $db->lastInsertId();

            // Insert order items and decrease stock
            $stmtItem = $db->prepare("
                INSERT INTO order_items (order_id, product_id, product_name, sku, quantity, unit_price, total_price)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmtStock = $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
            foreach ($orderItems as $oi) {
                $stmtItem->execute([
                    $orderId, $oi['product_id'], $oi['product_name'], $oi['sku'],
                    $oi['quantity'], $oi['unit_price'], $oi['total_price']
                ]);
                $stmtStock->execute([$oi['quantity'], $oi['product_id']]);
            }

            $db->commit();

            jsonSuccess([
                'order_id' => $orderId,
                'order_number' => $orderNumber,
                'total' => $total
            ], 'Order created');
        } catch (Exception $e) {
            $db->rollBack();
            jsonError('Failed to create order: ' . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Order ID required');

        $data = getJsonBody();
        $allowed = ['status', 'shipping_method', 'notes'];
        $fields = [];
        $params = [];

        foreach ($allowed as $f) {
            if (isset($data[$f])) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }

        if (!empty($fields)) {
            $params[] = $id;
            $stmt = $db->prepare("UPDATE orders SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($params);
        }

        jsonSuccess(null, 'Order updated');
        break;
}
