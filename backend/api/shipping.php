<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $stmt = $db->prepare("SELECT * FROM shipping_rates WHERE is_active = 1 ORDER BY cost_per_kg ASC");
        $stmt->execute();
        $rates = $stmt->fetchAll();

        $stmtRate = $db->prepare("SELECT * FROM exchange_rates ORDER BY id DESC LIMIT 1");
        $stmtRate->execute();
        $exchangeRate = $stmtRate->fetch();

        jsonSuccess(['rates' => $rates, 'exchange_rate' => $exchangeRate]);
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['method']) || !isset($data['cost_per_kg'])) {
            jsonError('Method and cost_per_kg are required');
        }
        $stmt = $db->prepare("INSERT INTO shipping_rates (method, cost_per_kg, description, estimated_days, is_active) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['method'], $data['cost_per_kg'], $data['description'] ?? null, $data['estimated_days'] ?? null, $data['is_active'] ?? 1]);
        jsonSuccess(['id' => $db->lastInsertId()], 'Shipping rate created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;

        if (!$id && isset($_GET['action']) && $_GET['action'] === 'exchange-rate') {
            $data = getJsonBody();
            if (!$data || !isset($data['usd_mxn'])) jsonError('usd_mxn value required');
            $db->prepare("INSERT INTO exchange_rates (usd_mxn) VALUES (?)")->execute([$data['usd_mxn']]);
            jsonSuccess(null, 'Exchange rate updated');
            break;
        }

        if (!$id) jsonError('Rate ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['method', 'cost_per_kg', 'description', 'estimated_days', 'is_active'] as $f) {
            if (array_key_exists($f, $data)) { $fields[] = "$f = ?"; $params[] = $data[$f]; }
        }
        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;
        $db->prepare("UPDATE shipping_rates SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Shipping rate updated');
        break;
}
