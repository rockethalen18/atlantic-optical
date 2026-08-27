<?php
/**
 * Auto-sync product images: scan /images/extracted_images/ and update DB.
 * Called by GitHub Actions deploy workflow with a secret key.
 * No login required — protected by IMAGE_SYNC_SECRET.
 */
header('Content-Type: application/json; charset=utf-8');

$secret = $_GET['key'] ?? $_SERVER['HTTP_X_SYNC_KEY'] ?? '';
$expected = getenv('IMAGE_SYNC_SECRET') ?: 'atlantic-sync-2026';

if (!hash_equals($expected, $secret)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Invalid key']);
    exit;
}

require_once __DIR__ . '/includes/db.php';
$db = db();

$docRoot = $_SERVER['DOCUMENT_ROOT'];
$imagesDir = realpath($docRoot) . '/images/extracted_images/';

if (!is_dir($imagesDir)) {
    echo json_encode(['ok' => false, 'error' => 'Images directory not found: ' . $imagesDir]);
    exit;
}

// Scan deployed images
$deployImages = [];
foreach (glob($imagesDir . '*.jpg') as $f) {
    $base = strtoupper(basename($f, '.jpg'));
    $deployImages[$base] = '/images/extracted_images/' . basename($f);
}
foreach (glob($imagesDir . '*.png') as $f) {
    $base = strtoupper(basename($f, '.png'));
    $deployImages[$base] = '/images/extracted_images/' . basename($f);
}
foreach (glob($imagesDir . '*.webp') as $f) {
    $base = strtoupper(basename($f, '.webp'));
    $deployImages[$base] = '/images/extracted_images/' . basename($f);
}

// Get all products
$products = $db->query('SELECT id, sku, image FROM products ORDER BY sku')->fetchAll();

$updated = 0;
$already = 0;
$notfound = 0;
$results = [];

foreach ($products as $p) {
    $sku = strtoupper(trim($p['sku']));
    $currentImage = $p['image'] ?? '';
    $newPath = null;

    // Exact match: AO-104.jpg for SKU AO-104
    if (isset($deployImages[$sku])) {
        $newPath = $deployImages[$sku];
    }

    // Try without AO- prefix: AO-104 -> check 104
    if (!$newPath) {
        $clean = preg_replace('/^AO-?/i', '', $sku);
        if ($clean !== $sku && isset($deployImages['AO-' . $clean])) {
            $newPath = '/images/extracted_images/AO-' . $clean . '.jpg';
        }
    }

    // Try with AO- prefix: if SKU is just a number like 104
    if (!$newPath && !str_starts_with($sku, 'AO-')) {
        if (isset($deployImages['AO-' . $sku])) {
            $newPath = '/images/extracted_images/AO-' . $sku . '.jpg';
        }
    }

    if ($newPath) {
        if ($currentImage !== $newPath) {
            $stmt = $db->prepare('UPDATE products SET image = ? WHERE id = ?');
            $stmt->execute([$newPath, $p['id']]);
            $updated++;
            $results[] = ['sku' => $p['sku'], 'old' => $currentImage, 'new' => $newPath, 'action' => 'updated'];
        } else {
            $already++;
            $results[] = ['sku' => $p['sku'], 'path' => $newPath, 'action' => 'ok'];
        }
    } else {
        $notfound++;
        $results[] = ['sku' => $p['sku'], 'action' => 'not_found'];
    }
}

echo json_encode([
    'ok' => true,
    'total_products' => count($products),
    'total_images' => count($deployImages),
    'updated' => $updated,
    'already_ok' => $already,
    'not_found' => $notfound,
    'results' => $results,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
