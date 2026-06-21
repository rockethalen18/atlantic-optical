<?php
/**
 * Atlantic Optical - Excel Export API
 * Export products to CSV with calculated prices including shipping
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$userId = requireAuth();
$db = (new Database())->connect();

// Get parameters
$format = $_GET['format'] ?? 'csv';
$category = $_GET['category'] ?? null;
$status = $_GET['status'] ?? null;
$includeShipping = $_GET['include_shipping'] ?? '1';

// Get current rates
$stmtRate = $db->prepare("SELECT usd_to_mxn FROM exchange_rates ORDER BY id DESC LIMIT 1");
$stmtRate->execute();
$rate = $stmtRate->fetch();
$exchangeRate = $rate ? $rate['usd_to_mxn'] : 17.50;

$stmtShip = $db->prepare("SELECT * FROM shipping_rates WHERE is_active = 1 ORDER BY price_per_kg_usd ASC");
$stmtShip->execute();
$shippingMethods = $stmtShip->fetchAll();

// Build query
$where = [];
$params = [];
if ($category) {
    $where[] = "c.slug = ?";
    $params[] = $category;
}
if ($status) {
    $where[] = "p.status = ?";
    $params[] = $status;
}
$whereClause = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

$stmt = $db->prepare("
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    $whereClause
    ORDER BY p.name ASC
");
$stmt->execute($params);
$products = $stmt->fetchAll();

// Generate CSV
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="atlantic_optical_products_' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');

// Add BOM for Excel UTF-8 compatibility
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// Headers
$headers = [
    'SKU',
    'Nombre',
    'Descripción',
    'Descripción Corta',
    'Costo Base (USD)',
    'Peso (kg)',
    'Margen',
    'Categoría',
    'Stock',
    'Estado',
    'Destacado',
    'Nuevo',
    'SEO Title',
    'SEO Description',
    'Precio Actual (MXN)'
];

// Add shipping method columns
if ($includeShipping === '1') {
    foreach ($shippingMethods as $method) {
        $headers[] = 'Precio ' . $method['method_label'] . ' (MXN)';
    }
    $headers[] = 'Tipo de Cambio USD/MXN';
}

fputcsv($output, $headers);

// Data rows
foreach ($products as $product) {
    $row = [
        $product['sku'],
        sanitizeCsvValue($product['name']),
        sanitizeCsvValue($product['description'] ?? ''),
        sanitizeCsvValue($product['short_description'] ?? ''),
        $product['base_cost_usd'],
        $product['weight_kg'],
        $product['margin'],
        sanitizeCsvValue($product['category_name'] ?? ''),
        $product['stock'],
        $product['status'],
        $product['is_featured'] ? 'Sí' : 'No',
        $product['is_new'] ? 'Sí' : 'No',
        sanitizeCsvValue($product['seo_title'] ?? ''),
        sanitizeCsvValue($product['seo_description'] ?? ''),
        $product['price_mxn']
    ];

    if ($includeShipping === '1') {
        foreach ($shippingMethods as $method) {
            $price = calculatePriceMXN(
                $product['base_cost_usd'],
                $product['margin'],
                $method['price_per_kg_usd'],
                $product['weight_kg'],
                $exchangeRate
            );
            $row[] = $price;
        }
        $row[] = $exchangeRate;
    }

    fputcsv($output, $row);
}

fclose($output);
exit;
