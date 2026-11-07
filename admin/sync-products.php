<?php
/**
 * Sync the product list between the public catalog and the admin database.
 *
 * The catalog (catalogos/products.json) is what the static frontend renders,
 * so it decides WHICH products exist on the site. The database is what the
 * admin panel manages, so it must contain the same products.
 *
 * This endpoint:
 *   1. Creates a database row for every catalog product that is missing
 *      (so the owner can edit products that are already published).
 *   2. Deactivates leftover "ghost" rows: products that are in the database
 *      but not in the catalog AND whose photo file does not exist. Those are
 *      broken import records - they show an empty image in the admin panel
 *      and have no page on the site.
 *
 * Existing rows are never overwritten, so manual edits in the admin panel
 * always win.
 *
 * Idempotent: safe to run on every deploy.
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

// ---------------------------------------------------------------- catalog ---
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

// -------------------------------------------------------------- taxonomies ---
// categories holds both the top level categories and the sub categories
// (with parent_id). The `subcategories` table mirrors the child categories.
$catBySlug = [];
$childBySlug = [];
try {
    foreach ($db->query('SELECT id, name, slug, parent_id FROM categories') as $c) {
        $slug = strtolower(trim((string)$c['slug']));
        if ($slug === '') continue;
        $catBySlug[$slug] = $c;
        if (!empty($c['parent_id'])) $childBySlug[$slug] = $c;
    }
} catch (Throwable $e) {
    echo json_encode(['ok' => false, 'error' => 'Cannot read categories: ' . $e->getMessage()]);
    exit;
}

$subBySlug = [];
try {
    foreach ($db->query('SELECT id, name, slug, category_id FROM subcategories') as $s) {
        $slug = strtolower(trim((string)$s['slug']));
        if ($slug !== '') $subBySlug[$slug] = $s;
    }
} catch (Throwable $e) {
    // the table may not exist - the products still work without it
}

// ------------------------------------------------------------ db products ---
$dbBySku = [];
try {
    foreach ($db->query('SELECT id, sku, slug, name, image, status, is_active FROM products') as $p) {
        $sku = strtoupper(trim((string)$p['sku']));
        if ($sku !== '') $dbBySku[$sku] = $p;
    }
} catch (Throwable $e) {
    echo json_encode(['ok' => false, 'error' => 'Cannot read products: ' . $e->getMessage()]);
    exit;
}

// ------------------------------------------------------- image file check ---
// Safety net: only trust the file system when a known good image resolves.
$fsTrusted = false;
if ($docRoot !== '') {
    $probe = $docRoot . '/images/extracted_images/AO-104.jpg';
    $fsTrusted = is_file($probe);
}

// --------------------------------------------------------------- sync run ---
$created = [];
$alreadyOk = 0;
$deactivated = [];
$keptActive = [];
$skipped = [];

$insert = $db->prepare(
    'INSERT INTO products (name, slug, sku, reference, description, short_description, barcode,
                           image, category_id, subcategory_id, status, is_active)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,1)'
);

foreach ($catalog as $cp) {
    $sku = strtoupper(trim((string)($cp['sku'] ?? '')));
    if ($sku === '') continue;

    if (isset($dbBySku[$sku])) { $alreadyOk++; continue; }

    $slug = trim((string)($cp['slug'] ?? ''));
    if ($slug === '') $slug = strtolower($sku);
    $name = trim((string)($cp['name'] ?? $sku));
    $description = trim((string)($cp['description'] ?? ''));
    $image = ao_normalize_image_url($cp['image'] ?? '');

    $categoryId = null;
    $subcategoryId = null;
    $subSlug = strtolower(trim((string)($cp['subcategory_slug'] ?? '')));
    $catSlug = strtolower(trim((string)($cp['category_slug'] ?? '')));
    if ($subSlug !== '' && isset($childBySlug[$subSlug])) {
        $categoryId = (int)$childBySlug[$subSlug]['id'];
    } elseif ($catSlug !== '' && isset($catBySlug[$catSlug])) {
        $categoryId = (int)$catBySlug[$catSlug]['id'];
    }
    if ($subSlug !== '' && isset($subBySlug[$subSlug])) {
        $subcategoryId = (int)$subBySlug[$subSlug]['id'];
    }

    // A slug may already be taken by another row - make it unique
    $checkSlug = $db->prepare('SELECT id FROM products WHERE slug = ?');
    $checkSlug->execute([$slug]);
    if ($checkSlug->fetch()) {
        $slug .= '-' . strtolower(str_replace([' ', '/'], '-', $sku));
        $checkSlug->execute([$slug]);
        if ($checkSlug->fetch()) $slug .= '-' . substr(bin2hex(random_bytes(3)), 0, 6);
    }

    try {
        $insert->execute([
            $name,
            $slug,
            $cp['sku'] ?? $sku,
            trim((string)($cp['reference'] ?? '')),
            $description,
            mb_substr($description, 0, 250),
            trim((string)($cp['barcode'] ?? '')),
            $image,
            $categoryId,
            $subcategoryId,
            'active',
        ]);
        $created[] = ['sku' => $cp['sku'] ?? $sku, 'id' => (int)$db->lastInsertId(), 'slug' => $slug];
    } catch (Throwable $e) {
        $skipped[] = ['sku' => $cp['sku'] ?? $sku, 'error' => $e->getMessage()];
    }
}

// ---------------------------------------------------- ghost clean-up pass ---
// Products that exist in the database but not in the catalog and whose photo
// file is missing are broken records. Hide them so the admin panel and the
// public site show the same products.
$catalogSkus = [];
foreach ($catalog as $cp) {
    $s = strtoupper(trim((string)($cp['sku'] ?? '')));
    if ($s !== '') $catalogSkus[$s] = true;
}

if ($fsTrusted) {
    $deactivate = $db->prepare("UPDATE products SET status = 'inactive', is_active = 0 WHERE id = ?");
    foreach ($dbBySku as $sku => $p) {
        if (isset($catalogSkus[$sku])) continue;
        if ((int)($p['is_active'] ?? 1) === 0) continue;   // already hidden

        $img = ao_normalize_image_url($p['image'] ?? '');
        $file = '';
        if ($img !== '' && strpos($img, '/images/') === 0) {
            $file = $docRoot . $img;
        }
        if ($file !== '' && is_file($file)) {
            // Has a real photo: keep it, the owner may add it to the catalog
            $keptActive[] = ['sku' => $sku, 'image' => $img];
            continue;
        }
        $deactivate->execute([(int)$p['id']]);
        $deactivated[] = ['sku' => $sku, 'image' => $img];
    }
} else {
    $keptActive[] = ['note' => 'File system check skipped (document root not readable)'];
}

$totalActive = (int)$db->query('SELECT COUNT(*) FROM products WHERE is_active = 1')->fetchColumn();
$totalAll = (int)$db->query('SELECT COUNT(*) FROM products')->fetchColumn();

echo json_encode([
    'ok' => true,
    'catalog_file' => $catalogFile,
    'catalog_products' => count($catalog),
    'db_products_total' => $totalAll,
    'db_products_active' => $totalActive,
    'created' => $created,
    'created_count' => count($created),
    'already_in_db' => $alreadyOk,
    'deactivated_ghosts' => $deactivated,
    'deactivated_count' => count($deactivated),
    'kept_active_not_in_catalog' => $keptActive,
    'skipped' => $skipped,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
