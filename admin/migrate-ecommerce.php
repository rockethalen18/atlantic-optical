<?php
require_once __DIR__ . '/../config/database.php';

$db = (new Database())->connect();

$migration = file_get_contents(__DIR__ . '/../migrations/002_ecommerce.sql');

$statements = array_filter(array_map('trim', explode(';', $migration)));

$results = [];
foreach ($statements as $sql) {
    if (empty($sql) || preg_match('/^--/', $sql)) continue;
    try {
        $db->exec($sql);
        $results[] = 'OK: ' . substr($sql, 0, 60) . '...';
    } catch (PDOException $e) {
        $results[] = 'SKIP: ' . substr($sql, 0, 60) . '... -> ' . $e->getMessage();
    }
}

echo "<pre>";
echo "=== ECOMMERCE MIGRATION ===\n\n";
echo implode("\n", $results);
echo "\n\nDone! Delete this file for security.";
echo "</pre>";
