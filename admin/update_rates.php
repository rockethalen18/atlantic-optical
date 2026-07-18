<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/includes/db.php';

echo "=== Exchange Rate Updater ===\n\n";

$apiUrl = 'https://api.frankfurter.app/latest?from=USD&to=MXN,COP,CNY,EUR';
echo "Fetching from: $apiUrl\n";
$response = @file_get_contents($apiUrl);

if ($response) {
    $data = json_decode($response, true);
    if (isset($data['rates'])) {
        $mxn = floatval($data['rates']['MXN'] ?? 0);
        $cop = floatval($data['rates']['COP'] ?? 0);
        $cny = floatval($data['rates']['CNY'] ?? 0);
        $eur = floatval($data['rates']['EUR'] ?? 0);
        
        echo "MXN: $mxn\nCOP: $cop\nCNY: $cny\nEUR: $eur\n\n";
        
        db()->prepare('INSERT INTO exchange_rates (usd_to_mxn, usd_mxn, usd_to_cop, usd_to_cny, usd_to_eur, source) VALUES (?, ?, ?, ?, ?, ?)')
            ->execute([$mxn, $mxn, $cop, $cny, $eur, 'frankfurter-api']);
        echo "Saved!\n";
        exit(0);
    }
}

echo "Primary API failed, trying fallback...\n";
$response2 = @file_get_contents('https://open.er-api.com/v6/latest/USD');
if ($response2) {
    $data2 = json_decode($response2, true);
    if (isset($data2['rates'])) {
        $mxn = floatval($data2['rates']['MXN'] ?? 0);
        $cop = floatval($data2['rates']['COP'] ?? 0);
        $cny = floatval($data2['rates']['CNY'] ?? 0);
        $eur = floatval($data2['rates']['EUR'] ?? 0);
        
        echo "MXN: $mxn\nCOP: $cop\nCNY: $cny\nEUR: $eur\n\n";
        
        db()->prepare('INSERT INTO exchange_rates (usd_to_mxn, usd_mxn, usd_to_cop, usd_to_cny, usd_to_eur, source) VALUES (?, ?, ?, ?, ?, ?)')
            ->execute([$mxn, $mxn, $cop, $cny, $eur, 'er-api']);
        echo "Saved!\n";
        exit(0);
    }
}

echo "ERROR: Both APIs failed\n";
exit(1);
