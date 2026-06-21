<?php
/**
 * Atlantic Optical - Pricing API
 * Calculate real-time prices with variable shipping costs
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

try {
    $db = (new Database())->connect();

    $productIds = $_GET['product_ids'] ?? null;
    $method = $_GET['method'] ?? 'maritimo';

    // Get exchange rate
    $stmtRate = $db->prepare("SELECT usd_to_mxn FROM exchange_rates ORDER BY id DESC LIMIT 1");
    $stmtRate->execute();
    $rate = $stmtRate->fetch();
    $exchangeRate = $rate ? $rate['usd_to_mxn'] : 17.50;

    // Get all active shipping rates
    $stmtShip = $db->prepare("SELECT * FROM shipping_rates WHERE is_active = 1 ORDER BY price_per_kg_usd ASC");
    $stmtShip->execute();
    $shippingMethods = $stmtShip->fetchAll();

    if ($productIds) {
        $ids = explode(',', $productIds);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        
        $stmt = $db->prepare("SELECT * FROM products WHERE id IN ($placeholders) AND status = 'published'");
        $stmt->execute($ids);
    } else {
        $stmt = $db->prepare("SELECT * FROM products WHERE status = 'published' LIMIT 50");
        $stmt->execute();
    }

    $products = $stmt->fetchAll();

    $pricing = [];
    foreach ($products as $product) {
        $prices = [
            'product_id' => $product['id'],
            'sku' => $product['sku'],
            'name' => $product['name'],
            'base_cost_usd' => $product['base_cost_usd'],
            'weight_kg' => $product['weight_kg'],
            'margin' => $product['margin'],
            'methods' => []
        ];

        foreach ($shippingMethods as $ship) {
            $prices['methods'][$ship['method']] = [
                'label' => $ship['method_label'],
                'price_mxn' => calculatePriceMXN(
                    $product['base_cost_usd'],
                    $product['margin'],
                    $ship['price_per_kg_usd'],
                    $product['weight_kg'],
                    $exchangeRate
                ),
                'shipping_cost_kg' => $ship['price_per_kg_usd'],
                'total_shipping' => round($ship['price_per_kg_usd'] * $product['weight_kg'], 2),
                'delivery_days' => $ship['min_days'] . '-' . $ship['max_days']
            ];
        }

        $pricing[] = $prices;
    }

    jsonSuccess([
        'exchange_rate' => $exchangeRate,
        'shipping_methods' => $shippingMethods,
        'products' => $pricing
    ]);
} catch (Exception $e) {
    jsonError('Pricing calculation failed: ' . $e->getMessage(), 500);
}
