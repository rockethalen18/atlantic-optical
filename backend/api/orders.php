<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $status = $_GET['status'] ?? null;
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        if ($id) {
            $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            if (!$order) jsonError('Order not found', 404);
            $stmtItems = $db->prepare("
                SELECT oi.*, p.name as product_name, p.sku
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            ");
            $stmtItems->execute([$id]);
            $order['items'] = $stmtItems->fetchAll();
            jsonSuccess($order);
        }

        $where = ["1=1"];
        $params = [];
        if ($status) { $where[] = "o.status = ?"; $params[] = $status; }
        $whereClause = implode(' AND ', $where);

        $countStmt = $db->prepare("SELECT COUNT(*) FROM orders o WHERE $whereClause");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        $stmt = $db->prepare("SELECT * FROM orders o WHERE $whereClause ORDER BY o.created_at DESC LIMIT $limit OFFSET $offset");
        $stmt->execute($params);
        jsonSuccess(['orders' => $stmt->fetchAll(), 'pagination' => ['total' => intval($total), 'page' => $page, 'limit' => $limit, 'pages' => ceil($total / $limit)]]);
        break;

    case 'POST':
        $data = getJsonBody();
        if (!$data || empty($data['customer_name']) || empty($data['customer_email'])) {
            jsonError('Customer name and email are required');
        }

        $stmt = $db->prepare("
            INSERT INTO orders (customer_name, customer_email, customer_phone, status, total, shipping_method, shipping_cost, notes)
            VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['customer_name'], $data['customer_email'], $data['customer_phone'] ?? null,
            $data['total'] ?? 0, $data['shipping_method'] ?? 'maritimo',
            $data['shipping_cost'] ?? 0, $data['notes'] ?? null
        ]);
        $orderId = $db->lastInsertId();

        if (!empty($data['items']) && is_array($data['items'])) {
            $stmtItem = $db->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
            foreach ($data['items'] as $item) {
                $stmtItem->execute([$orderId, $item['product_id'], $item['quantity'] ?? 1, $item['unit_price'] ?? 0]);
            }
        }

        jsonSuccess(['id' => $orderId], 'Order created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Order ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['status', 'shipping_method', 'notes'] as $f) {
            if (array_key_exists($f, $data)) { $fields[] = "$f = ?"; $params[] = $data[$f]; }
        }
        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;
        $db->prepare("UPDATE orders SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Order updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Order ID required');
        $db->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$id]);
        $stmt = $db->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) jsonError('Order not found', 404);
        jsonSuccess(null, 'Order deleted');
        break;
}
