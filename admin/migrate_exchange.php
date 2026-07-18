<?php
require_once __DIR__ . '/includes/db.php';

echo "=== Adding exchange rate columns ===\n";

$cols = db()->query('SHOW COLUMNS FROM exchange_rates')->fetchAll(PDO::FETCH_COLUMN);
$needed = ['usd_to_cop', 'usd_to_cny', 'usd_to_eur'];

foreach ($needed as $col) {
    if (!in_array($col, $cols)) {
        db()->exec("ALTER TABLE exchange_rates ADD COLUMN $col DECIMAL(12,4) DEFAULT 0 AFTER usd_to_mxn");
        echo "Added: $col\n";
    } else {
        echo "Already exists: $col\n";
    }
}

echo "\n=== Done ===\n";
