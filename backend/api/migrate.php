<?php
require_once __DIR__ . '/../config/database.php';

$secret = $_GET['secret'] ?? '';
if ($secret !== 'atlantic-migrate-2026') {
    http_response_code(403);
    echo 'Forbidden';
    exit;
}

$db = (new Database())->connect();

$migrationFile = __DIR__ . '/../migrations/003_add_customer_email.sql';
$sql = file_get_contents($migrationFile);

if ($sql === false) {
    echo json_encode(['error' => 'Migration file not found']);
    exit;
}

$lines = explode("\n", $sql);
$clean = [];
foreach ($lines as $line) {
    $trimmed = trim($line);
    if ($trimmed === '' || str_starts_with($trimmed, '--')) continue;
    $clean[] = $trimmed;
}
$sql = implode(' ', $clean);

$statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => !empty($s));

$results = [];
foreach ($statements as $stmt) {
    try {
        $db->exec($stmt);
        $results[] = ['sql' => substr($stmt, 0, 100), 'status' => 'OK'];
    } catch (PDOException $e) {
        $results[] = ['sql' => substr($stmt, 0, 100), 'status' => 'ERROR', 'error' => $e->getMessage()];
    }
}

echo json_encode(['results' => $results], JSON_PRETTY_PRINT);
