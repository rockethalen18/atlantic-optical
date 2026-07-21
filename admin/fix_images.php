<?php
/**
 * One-time script to assign product images based on SKU.
 * Run once: visit /admin/fix_images.php?token=atlantic_fix_images_2026
 * Then DELETE this file for security.
 */
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/security.php';
init_session();

$token = $_GET['token'] ?? '';
$validToken = 'atlantic_fix_images_2026';

if ($token !== $validToken) {
    require_once __DIR__ . '/includes/auth.php';
    require_login();
}

header('Content-Type: text/plain; charset=utf-8');

$updated = 0;
$skipped = 0;
$errors = [];

$products = db()->query('SELECT id, sku, image FROM products ORDER BY id')->fetchAll();

foreach ($products as $p) {
    if (!empty($p['image']) && $p['image'] !== 'null') {
        $skipped++;
        continue;
    }
    $sku = trim($p['sku']);
    if ($sku === '') {
        $errors[] = "Product #{$p['id']}: no SKU";
        continue;
    }
    $imagePath = '/images/products/' . $sku . '.jpg';
    db()->prepare('UPDATE products SET image = ? WHERE id = ?')->execute([$imagePath, $p['id']]);
    $updated++;
}

echo "=== Fix Product Images ===\n";
echo "Updated: $updated products (assigned /images/products/{SKU}.jpg)\n";
echo "Skipped: $skipped products (already had image)\n";
echo "Errors: " . count($errors) . "\n";
if ($errors) {
    foreach ($errors as $e) {
        echo "  - $e\n";
    }
}
echo "Done.\n";
