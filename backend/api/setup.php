<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'run';

if ($method !== 'POST' || $action !== 'run') {
    jsonError('POST /api/setup?action=run required');
}

$db = (new Database())->connect();

$migrationFile = __DIR__ . '/../migrations/002_ecommerce.sql';
if (!file_exists($migrationFile)) {
    jsonError('Migration file not found');
}

$sql = file_get_contents($migrationFile);
$statements = array_filter(array_map('trim', explode(';', $sql)));

$results = [];
$success = 0;
$skipped = 0;

foreach ($statements as $stmt) {
    $stmt = trim($stmt);
    if (empty($stmt) || str_starts_with($stmt, '--')) continue;
    try {
        $db->exec($stmt);
        $success++;
    } catch (PDOException $e) {
        if (str_contains($e->getMessage(), 'already exists')) {
            $skipped++;
        } else {
            $results[] = 'ERROR: ' . substr($stmt, 0, 80) . '... -> ' . $e->getMessage();
        }
    }
}

jsonSuccess([
    'created' => $success,
    'skipped' => $skipped,
    'errors' => count($results),
    'error_details' => $results
], 'Migration completed');
