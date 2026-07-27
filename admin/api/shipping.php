<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../includes/db.php';

try {
    $rates = db()->query('SELECT method, method_label, cost_per_kg, description, min_days, max_days FROM shipping_rates WHERE is_active = 1 ORDER BY cost_per_kg ASC')->fetchAll();
    echo json_encode(['success' => true, 'rates' => $rates]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
