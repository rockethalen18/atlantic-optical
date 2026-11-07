<?php
/**
 * Sync the admin gallery (product_images table) with the catalog gallery.
 *
 * The static frontend renders `images[]` from catalogos/products.json.
 * This endpoint mirrors that exact array into MySQL `product_images`,
 * so the admin panel shows precisely the same photos as the public site.
 *
 * Rules:
 * - Idempotent: safe to run on every deploy.
 * - Never touches admin-uploaded photos (URLs under /admin/uploads/).
 * - Never re-inserts a photo the admin removed (the `hidden` flag wins).
 * - Hides catalog photos that disappeared from products.json.
 *
 * Protected by IMAGE_SYNC_SECRET.
 */
header('Content-Type: application/json; charset=utf-8');

$secret = $_GET['key'] ?? $_SERVER['HTTP_X_SYNC_KEY'] ?? '';
$expected = getenv('IMAGE_SYNC_SECRET') ?: 'atlantic-sync-2026';

if (!hash_equals($expected, (string)$secret)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Invalid key']);
    exit;
}

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/gallery.php';
$db = db();

// Locate the catalog file. It lives next to the deployed site root.
$docRoot = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
$candidates = [
    $docRoot . '/catalogos/products.json',
    dirname(__DIR__) . '/catalogos/products.json',
    dirname(__DIR__, 2) . '/catalogos/products.json',
];
$catalogFile = null;
foreach ($candidates as $c) {
    if (is_file($c)) { $catalogFile = $c; break; }
}

if (!$catalogFile) {
    echo json_encode(['ok' => false, 'error' => 'products.json not found', 'tried' => $candidates]);
    exit;
}

$raw = @file_get_contents($catalogFile);
$catalog = $raw !== false ? json_decode($raw, true) : null;
if (!is_array($catalog)) {
    echo json_encode(['ok' => false, 'error' => 'products.json is not valid JSON']);
    exit;
}

// Ensure table exists (and has the `hidden` column)
try {
    $db->exec("CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255) DEFAULT NULL,
        sort_order INT DEFAULT 0,
        is_primary TINYINT(1) DEFAULT 0,
        hidden TINYINT(1) NOT NULL DEFAULT 0,
        INDEX idx_pi_product (product_id)
    )");
} catch (Throwable $e) {
    echo json_encode(['ok' => false, 'error' => 'Cannot prepare product_images: ' . $e->getMessage()]);
    exit;
}
try {
    $cols = $db->query("SHOW COLUMNS FROM product_images LIKE 'hidden'")->fetchAll();
    if (empty($cols)) {
        $db->exec("ALTER TABLE product_images ADD COLUMN hidden TINYINT(1) NOT NULL DEFAULT 0 AFTER is_primary");
    }
} catch (Throwable $e) {
    // The hidden column may be unavailable; the merge still works without it
}

// Load DB products indexed by SKU
$dbProducts = [];
foreach ($db->query('SELECT id, sku, image FROM products') as $p) {
    $dbProducts[strtoupper(trim((string)$p['sku']))] = $p;
}

// Load existing gallery rows grouped by product
$existing = [];   // product_id => [url => ['id' => int, 'hidden' => int]]
foreach ($db->query('SELECT id, product_id, url, hidden FROM product_images') as $r) {
    $pid = (int)$r['product_id'];
    $url = ao_normalize_image_url($r['url']);
    if ($url === '') continue;
    $existing[$pid][$url] = [
        'id'     => (int)$r['id'],
        'hidden' => (int)($r['hidden'] ?? 0),
    ];
}

$inserted = 0;
$productsSynced = 0;
$skippedNoProduct = 0;
$hiddenKept = 0;
$hiddenRemoved = 0;

foreach ($catalog as $cp) {
    if (empty($cp['sku'])) continue;
    $sku = strtoupper(trim((string)$cp['sku']));
    if (!isset($dbProducts[$sku])) { $skippedNoProduct++; continue; }
    $product = $dbProducts[$sku];
    $pid = (int)$product['id'];

    $catalogImgs = [];
    foreach (($cp['images'] ?? []) as $img) {
        $img = ao_normalize_image_url($img);
        if ($img !== '' && !in_array($img, $catalogImgs, true)) $catalogImgs[] = $img;
    }

    $current = $existing[$pid] ?? [];

    // 1) Make sure every catalog photo has a row
    $sort = 0;
    $ins = $db->prepare('INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary, hidden) VALUES (?,?,?,?,?,0)');
    foreach ($catalogImgs as $img) {
        $sort++;
        if (isset($current[$img])) {
            // Already synced. Respect the admin's choice: never unhide.
            if ($current[$img]['hidden'] === 1) $hiddenKept++;
            continue;
        }
        $isPrimary = ($sort === 1) ? 1 : 0;
        $ins->execute([$pid, $img, '', $sort, $isPrimary]);
        $current[$img] = ['id' => 0, 'hidden' => 0];
        $inserted++;
    }

    // 2) Hide catalog photos that are no longer in products.json
    //    (admin uploads are never touched)
    $catSet = array_flip($catalogImgs);
    $hid = $db->prepare('UPDATE product_images SET hidden = 1, is_primary = 0 WHERE product_id = ? AND url = ?');
    foreach ($current as $url => $info) {
        if (isset($catSet[$url])) continue;
        if (strpos($url, '/admin/uploads/') === 0 || strpos($url, 'uploads/') === 0) continue;
        if ($info['hidden'] === 1) continue;
        $hid->execute([$pid, $url]);
        $hiddenRemoved++;
    }

    $productsSynced++;

    // 3) Keep products.image pointing at the gallery's primary photo
    $primStmt = $db->prepare('SELECT url FROM product_images WHERE product_id = ? AND hidden = 0 ORDER BY is_primary DESC, sort_order ASC, id ASC LIMIT 1');
    $primStmt->execute([$pid]);
    $primary = ao_normalize_image_url($primStmt->fetchColumn());
    if ($primary && ((string)$product['image']) !== $primary) {
        $db->prepare('UPDATE products SET image = ? WHERE id = ?')->execute([$primary, $pid]);
    }
}

// 4) Make sure every product has exactly one primary (visible) photo
$db->exec("UPDATE product_images SET is_primary = 0 WHERE hidden = 1");

$visibleRows = $db->query("SELECT id, product_id, is_primary, sort_order FROM product_images WHERE hidden = 0 ORDER BY product_id, is_primary DESC, sort_order ASC, id ASC")->fetchAll();

$grouped = [];
foreach ($visibleRows as $r) {
    $grouped[(int)$r['product_id']][] = $r;
}

$setPrimary = $db->prepare('UPDATE product_images SET is_primary = ? WHERE id = ?');
foreach ($grouped as $group) {
    // Keep the photo the admin marked as primary; otherwise use the first one
    $primaryId = null;
    foreach ($group as $r) {
        if ((int)($r['is_primary'] ?? 0) === 1) { $primaryId = (int)$r['id']; break; }
    }
    if ($primaryId === null) $primaryId = (int)$group[0]['id'];

    foreach ($group as $r) {
        $want = ((int)$r['id'] === $primaryId) ? 1 : 0;
        if ((int)($r['is_primary'] ?? 0) !== $want) {
            $setPrimary->execute([$want, (int)$r['id']]);
        }
    }
}

$total = $db->query('SELECT COUNT(*) FROM product_images')->fetchColumn();

echo json_encode([
    'ok' => true,
    'catalog_file' => $catalogFile,
    'catalog_products' => count($catalog),
    'db_products' => count($dbProducts),
    'products_synced' => $productsSynced,
    'images_inserted' => $inserted,
    'hidden_kept' => $hiddenKept,
    'hidden_removed' => $hiddenRemoved,
    'skipped_no_db_product' => $skippedNoProduct,
    'total_product_images' => (int)$total,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
