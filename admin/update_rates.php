<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/includes/db.php';

echo "=== Exchange Rate Updater ===\n\n";

function fetch_url($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
    return @file_get_contents($url);
}

function fetch_rates($url) {
    $response = fetch_url($url);
    if ($response) {
        $data = json_decode($response, true);
        if (isset($data['rates'])) {
            return $data['rates'];
        }
    }
    return null;
}

$rates = fetch_rates('https://api.frankfurter.app/latest?from=USD&to=MXN,COP,CNY,EUR');
$source = 'frankfurter-api';

if (!$rates) {
    echo "Primary API failed, trying fallback...\n";
    $rates = fetch_rates('https://open.er-api.com/v6/latest/USD');
    $source = 'er-api';
}

if (!$rates) {
    echo "ERROR: Both APIs failed\n";
    exit(1);
}

$mxn = floatval($rates['MXN'] ?? 0);
$cop = floatval($rates['COP'] ?? 0);
$cny = floatval($rates['CNY'] ?? 0);
$eur = floatval($rates['EUR'] ?? 0);

echo "MXN: $mxn\nCOP: $cop\nCNY: $cny\nEUR: $eur\nSource: $source\n\n";

db()->prepare('INSERT INTO exchange_rates (usd_to_mxn, usd_mxn, usd_to_cop, usd_to_cny, usd_to_eur, source) VALUES (?, ?, ?, ?, ?, ?)')
    ->execute([$mxn, $mxn, $cop, $cny, $eur, $source]);

echo "Saved!\n";
