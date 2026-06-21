<?php
/**
 * Atlantic Optical - Shipping Rates API
 * Manages variable shipping costs from China to various countries
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $country = $_GET['country'] ?? null;
        $active = $_GET['active'] ?? null;

        $where = [];
        $params = [];

        if ($country) {
            $where[] = "destination_country = ?";
            $params[] = $country;
        }
        if ($active !== null) {
            $where[] = "is_active = ?";
            $params[] = intval($active);
        }

        $whereClause = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

        $stmt = $db->prepare("SELECT * FROM shipping_rates $whereClause ORDER BY price_per_kg_usd ASC");
        $stmt->execute($params);
        $rates = $stmt->fetchAll();

        // Get latest exchange rate
        $stmtRate = $db->prepare("SELECT * FROM exchange_rates ORDER BY id DESC LIMIT 1");
        $stmtRate->execute();
        $exchangeRate = $stmtRate->fetch();

        jsonSuccess([
            'rates' => $rates,
            'exchange_rate' => $exchangeRate
        ]);
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();

        if (!$data || !isset($data['method']) || !isset($data['price_per_kg_usd'])) {
            jsonError('Method and price_per_kg_usd are required');
        }

        $stmt = $db->prepare("
            INSERT INTO shipping_rates (method, method_label, price_per_kg_usd, min_days, max_days, origin_country, destination_country, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['method'],
            $data['method_label'] ?? $data['method'],
            $data['price_per_kg_usd'],
            $data['min_days'] ?? 1,
            $data['max_days'] ?? 30,
            $data['origin_country'] ?? 'China',
            $data['destination_country'] ?? 'México',
            $data['is_active'] ?? 1
        ]);

        jsonSuccess(['id' => $db->lastInsertId()], 'Shipping rate created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        
        // Special: Update exchange rate
        if (!$id && isset($_GET['action']) && $_GET['action'] === 'exchange-rate') {
            $data = getJsonBody();
            if (!$data || !isset($data['usd_to_mxn'])) {
                jsonError('Exchange rate value required');
            }
            
            $stmt = $db->prepare("INSERT INTO exchange_rates (usd_to_mxn, source) VALUES (?, ?)");
            $stmt->execute([$data['usd_to_mxn'], $data['source'] ?? 'manual']);
            
            // Recalculate all product prices
            recalculateAllPrices($db);
            
            jsonSuccess(null, 'Exchange rate updated and prices recalculated');
            break;
        }

        if (!$id) jsonError('Rate ID required');
        $data = getJsonBody();

        $fields = [];
        $params = [];
        $allowed = ['method', 'method_label', 'price_per_kg_usd', 'min_days', 'max_days', 'destination_country', 'is_active'];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) jsonError('No fields to update');

        $params[] = $id;
        $sql = "UPDATE shipping_rates SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        // Recalculate prices if shipping rate changed
        if (isset($data['price_per_kg_usd'])) {
            recalculateAllPrices($db);
        }

        jsonSuccess(null, 'Shipping rate updated');
        break;
}

/**
 * Recalculate all product prices based on current shipping rates and exchange rate
 */
function recalculateAllPrices($db) {
    // Get latest exchange rate
    $stmtRate = $db->prepare("SELECT usd_to_mxn FROM exchange_rates ORDER BY id DESC LIMIT 1");
    $stmtRate->execute();
    $rate = $stmtRate->fetch();
    $exchangeRate = $rate ? $rate['usd_to_mxn'] : 17.50;

    // Get default shipping rate (maritimo)
    $stmtShip = $db->prepare("SELECT price_per_kg_usd FROM shipping_rates WHERE method = 'maritimo' AND is_active = 1 LIMIT 1");
    $stmtShip->execute();
    $ship = $stmtShip->fetch();
    $shippingPerKg = $ship ? $ship['price_per_kg_usd'] : 4.50;

    // Get tax rate from settings
    $stmtTax = $db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'tax_rate'");
    $stmtTax->execute();
    $taxSetting = $stmtTax->fetch();
    $taxRate = $taxSetting ? floatval($taxSetting['setting_value']) : 0.16;

    // Update all products
    $stmtProducts = $db->prepare("SELECT id, base_cost_usd, margin, weight_kg FROM products WHERE status != 'archived'");
    $stmtProducts->execute();
    $products = $stmtProducts->fetchAll();

    $updateStmt = $db->prepare("UPDATE products SET price_mxn = ? WHERE id = ?");

    foreach ($products as $product) {
        $newPrice = calculatePriceMXN(
            $product['base_cost_usd'],
            $product['margin'],
            $shippingPerKg,
            $product['weight_kg'],
            $exchangeRate,
            $taxRate
        );
        $updateStmt->execute([$newPrice, $product['id']]);
    }

    return count($products);
}
