<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/includes/db.php';

echo "=== Exchange Rate Updater ===\n\n";

// Free API: frankfurter.app (no key needed)
$apiUrl = 'https://api.frankfurter.app/latest?from=USD&to=MXN,COP,CNY,EUR';

echo "Fetching from: $apiUrl\n";
$response = @file_get_contents($apiUrl);

if ($response === false) {
    echo "ERROR: Could not fetch rates from API\n";
    
    // Fallback: try another API
    $apiUrl2 = 'https://open.er-api.com/v6/latest/USD';
    echo "Trying fallback: $apiUrl2\n";
    $response = @file_get_contents($apiUrl2);
    
    if ($response === false) {
        echo "ERROR: Both APIs failed\n";
        exit(1);
    }
    
    $data = json_decode($response, true);
    if (isset($data['rates'])) {
        $rates = $data['rates'];
        echo "Fallback API response received\n";
    } else {
        echo "ERROR: Invalid fallback response\n";
        exit(1);
    }
} else {
    $data = json_decode($response, true);
    if (isset($data['rates'])) {
        $rates = $data['rates'];
        echo "Primary API response received\n";
    } else {
        echo "ERROR: Invalid response\n";
        exit(1);
    }
}

echo "\nCurrent rates (1 USD =):\n";
foreach ($rates as $currency => $rate) {
    echo "  $currency: $rate\n";
}

// Save to database
$currencies = ['MXN', 'COP', 'CNY', 'EUR'];
foreach ($currencies as $cur) {
    if (isset($rates[$cur])) {
        $rate = floatval($rates[$cur]);
        // Delete old entries for this pair
        db()->prepare('DELETE FROM exchange_rates WHERE currency_from = ? AND currency_to = ?')->execute(['USD', $cur]);
        // Insert new rate
        db()->prepare('INSERT INTO exchange_rates (currency_from, currency_to, rate, usd_to_mxn, usd_mxn, source) VALUES (?, ?, ?, ?, ?, ?)')
            ->execute(['USD', $cur, $rate, $cur === 'MXN' ? $rate : 0, $cur === 'MXN' ? $rate : 0, 'frankfurter-api']);
        echo "Saved USD/$cur: $rate\n";
    }
}

// Also update the latest MXN rate in the old format
if (isset($rates['MXN'])) {
    db()->prepare('UPDATE exchange_rates SET usd_to_mxn = ?, usd_mxn = ? WHERE currency_from = "USD" AND currency_to = "MXN"')
        ->execute([$rates['MXN'], $rates['MXN']]);
}

echo "\n=== Done ===\n";
