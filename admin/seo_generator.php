<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/includes/db.php';

echo "=== SEO Generator ===\n\n";

$products = db()->query('SELECT id, name, sku, short_description, description, seo_title, seo_description FROM products ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);
echo "Total products: " . count($products) . "\n\n";

$count = 0;
$stmt = db()->prepare('UPDATE products SET seo_title = ?, seo_description = ? WHERE id = ?');

foreach ($products as $p) {
    $name = $p['name'];
    $sku = $p['sku'];
    $short = $p['short_description'] ?: $p['description'] ?: $name;

    // Generate SEO title: "Nombre - SKU | Atlantic Optical"
    $seoTitle = $name . ' - ' . $sku . ' | Atlantic Optical';
    if (strlen($seoTitle) > 255) {
        $seoTitle = substr($seoTitle, 0, 252) . '...';
    }

    // Generate SEO description
    $seoDesc = $short;
    if (strlen($seoDesc) < 50) {
        $seoDesc = $name . '. ' . $short . '. Disponible en Atlantic Optical. Equipo de laboratorio y oftalmologia de alta calidad.';
    }
    if (strlen($seoDesc) > 500) {
        $seoDesc = substr($seoDesc, 0, 497) . '...';
    }

    $stmt->execute([$seoTitle, $seoDesc, $p['id']]);
    $count++;
}

echo "Updated $count products with SEO data\n";

// Verify
$sample = db()->query('SELECT id, name, seo_title, seo_description FROM products LIMIT 5')->fetchAll(PDO::FETCH_ASSOC);
echo "\nSample:\n";
foreach ($sample as $s) {
    echo "  ID:{$s['id']}\n";
    echo "    Name: {$s['name']}\n";
    echo "    SEO Title: {$s['seo_title']}\n";
    echo "    SEO Desc: {$s['seo_description']}\n\n";
}
