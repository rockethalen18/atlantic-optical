<?php
define('CURRENT_PAGE', 'index');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();

$db = db();
$action = $_GET['action'] ?? 'preview';
$report = [];

// Get all products
$products = $db->query('SELECT id, sku, name, image, category_id FROM products ORDER BY id')->fetchAll();
$report['total_products'] = count($products);

// Image directory on server
$imgDir = $_SERVER['DOCUMENT_ROOT'] . '/images/products/';
if (!is_dir($imgDir)) {
    // Try alternate path for this hosting
    $imgDir = '/home/azjnptoj/equipos.atlanticopticalgroup.com/images/products/';
}

// List all image files
$imageFiles = [];
if (is_dir($imgDir)) {
    foreach (glob($imgDir . '*.jpg') as $f) {
        $base = basename($f, '.jpg');
        $imageFiles[strtoupper($base)] = $f;
    }
    foreach (glob($imgDir . '*.jpeg') as $f) {
        $base = basename($f, '.jpeg');
        $imageFiles[strtoupper($base)] = $f;
    }
    foreach (glob($imgDir . '*.png') as $f) {
        $base = basename($f, '.png');
        $imageFiles[strtoupper($base)] = $f;
    }
    foreach (glob($imgDir . '*.webp') as $f) {
        $base = basename($f, '.webp');
        $imageFiles[strtoupper($base)] = $f;
    }
} else {
    $report['error'] = "Image directory not found: $imgDir";
}
$report['total_images'] = count($imageFiles);

$matched = [];
$unmatched_products = [];
$unmatched_images = array_keys($imageFiles);
$updated = 0;

foreach ($products as $p) {
    $sku = strtoupper(trim($p['sku']));
    $found = false;

    // Try exact SKU match: AO-{SKU}.jpg
    $key = $sku;
    if (isset($imageFiles[$key])) {
        $imagePath = '/images/products/' . basename($imageFiles[$key]);
        $matched[] = ['product' => $p, 'image' => $imagePath, 'file' => $imageFiles[$key]];
        $unmatched_images = array_diff($unmatched_images, [$key]);
        $found = true;

        if ($action === 'apply' && $p['image'] !== $imagePath) {
            $stmt = $db->prepare('UPDATE products SET image = ? WHERE id = ?');
            $stmt->execute([$imagePath, $p['id']]);
            $updated++;
        }
    }

    // Try without AO- prefix: if SKU is "AO-104", also try "104"
    if (!$found) {
        $clean = preg_replace('/^AO-?/i', '', $sku);
        if ($clean !== $sku) {
            foreach ($imageFiles as $fileKey => $filePath) {
                if (strtoupper($clean) === strtoupper(preg_replace('/^AO-?/i', '', $fileKey))) {
                    $imagePath = '/images/products/' . basename($filePath);
                    $matched[] = ['product' => $p, 'image' => $imagePath, 'file' => $filePath];
                    $unmatched_images = array_diff($unmatched_images, [$fileKey]);
                    $found = true;

                    if ($action === 'apply' && $p['image'] !== $imagePath) {
                        $stmt = $db->prepare('UPDATE products SET image = ? WHERE id = ?');
                        $stmt->execute([$imagePath, $p['id']]);
                        $updated++;
                    }
                    break;
                }
            }
        }
    }

    // Try fuzzy name match
    if (!$found) {
        $normalizedName = preg_replace('/[^a-z0-9]/i', '', strtolower($p['name']));
        foreach ($imageFiles as $fileKey => $filePath) {
            $normalizedFile = preg_replace('/[^a-z0-9]/i', '', strtolower($fileKey));
            if (strlen($normalizedFile) > 3 && strpos($normalizedName, $normalizedFile) !== false) {
                $imagePath = '/images/products/' . basename($filePath);
                $matched[] = ['product' => $p, 'image' => $imagePath, 'file' => $filePath];
                $unmatched_images = array_diff($unmatched_images, [$fileKey]);
                $found = true;

                if ($action === 'apply' && $p['image'] !== $imagePath) {
                    $stmt = $db->prepare('UPDATE products SET image = ? WHERE id = ?');
                    $stmt->execute([$imagePath, $p['id']]);
                    $updated++;
                }
                break;
            }
        }
    }

    if (!$found) {
        $unmatched_products[] = $p;
    }
}

$report['matched'] = count($matched);
$report['unmatched_products'] = count($unmatched_products);
$report['unmatched_images'] = count($unmatched_images);
$report['updated'] = $updated;

// Get category names for unmatched products
$catNames = [];
foreach ($db->query('SELECT id, name FROM categories') as $c) $catNames[$c['id']] = $c['name'];

// Create missing images folder
$missingDir = $_SERVER['DOCUMENT_ROOT'] . '/images/products/missing/';
if ($action === 'apply') {
    if (!is_dir($missingDir)) mkdir($missingDir, 0755, true);
    // Create placeholder for each missing product
    foreach ($unmatched_products as $p) {
        $placeholder = $missingDir . strtoupper($p['sku']) . '.txt';
        if (!file_exists($placeholder)) {
            file_put_contents($placeholder, "Product: {$p['name']}\nSKU: {$p['sku']}\nCategory: " . ($catNames[$p['category_id']] ?? 'N/A') . "\nNeeds: /images/products/" . strtoupper($p['sku']) . ".jpg\n");
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Product Images - Atlantic Optical</title>
    <style>
        body { font-family: -apple-system, sans-serif; padding: 20px; background: #0f172a; color: #e2e8f0; }
        h1 { color: #60a5fa; font-size: 22px; }
        h2 { color: #94a3b8; font-size: 16px; margin-top: 30px; }
        .stats { display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0; }
        .stat { background: #1e293b; padding: 16px 20px; border-radius: 10px; border: 1px solid #334155; min-width: 140px; }
        .stat .num { font-size: 28px; font-weight: 700; }
        .stat .label { color: #94a3b8; font-size: 12px; margin-top: 4px; }
        .stat.ok .num { color: #4ade80; }
        .stat.warn .num { color: #fbbf24; }
        .stat.err .num { color: #f87171; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th { background: #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 12px; text-align: left; }
        td { padding: 8px 12px; border-bottom: 1px solid #1e293b; font-size: 13px; }
        tr:hover td { background: #1e293b; }
        .img-preview { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; background: #334155; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 13px; text-decoration: none; display: inline-block; }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-danger { background: #dc2626; color: #fff; }
        .btn-secondary { background: #374151; color: #d1d5db; }
        .actions { display: flex; gap: 10px; margin: 16px 0; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .badge-ok { background: rgba(74,222,128,0.15); color: #4ade80; }
        .badge-err { background: rgba(248,113,113,0.15); color: #f87171; }
        .file-list { background: #1e293b; padding: 12px; border-radius: 8px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; margin: 8px 0; }
    </style>
</head>
<body>
    <h1>Product Images Manager</h1>

    <div class="stats">
        <div class="stat"><div class="num"><?php echo $report['total_products']; ?></div><div class="label">Productos en DB</div></div>
        <div class="stat"><div class="num"><?php echo $report['total_images']; ?></div><div class="label">Imágenes en disco</div></div>
        <div class="stat ok"><div class="num"><?php echo $report['matched']; ?></div><div class="label">Emparejados</div></div>
        <div class="stat err"><div class="num"><?php echo $report['unmatched_products']; ?></div><div class="label">Sin imagen</div></div>
        <div class="stat warn"><div class="num"><?php echo $report['unmatched_images']; ?></div><div class="label">Imágenes huérfanas</div></div>
        <?php if ($action === 'apply'): ?>
        <div class="stat ok"><div class="num"><?php echo $report['updated']; ?></div><div class="label">DB actualizados</div></div>
        <?php endif; ?>
    </div>

    <div class="actions">
        <a href="?action=preview" class="btn btn-secondary">Vista previa</a>
        <a href="?action=apply" class="btn btn-primary" onclick="return confirm('Actualizar image column en la DB para <?php echo $report['matched']; ?> productos?')">Aplicar a DB</a>
        <a href="/admin/productos" class="btn btn-secondary">Ir a Productos</a>
    </div>

    <?php if ($report['unmatched_products'] > 0): ?>
    <h2>Productos sin imagen (<?php echo $report['unmatched_products']; ?>)</h2>
    <table>
        <tr><th>SKU</th><th>Nombre</th><th>Categoría</th><th>Imagen esperada</th></tr>
        <?php foreach ($unmatched_products as $p): ?>
        <tr>
            <td><?php echo htmlspecialchars($p['sku']); ?></td>
            <td><?php echo htmlspecialchars($p['name']); ?></td>
            <td><?php echo htmlspecialchars($catNames[$p['category_id']] ?? 'N/A'); ?></td>
            <td><code>/images/products/<?php echo strtoupper($p['sku']); ?>.jpg</code></td>
        </tr>
        <?php endforeach; ?>
    </table>
    <?php endif; ?>

    <?php if ($report['unmatched_images'] > 0): ?>
    <h2>Imágenes sin producto en DB (<?php echo $report['unmatched_images']; ?>)</h2>
    <div class="file-list">
        <?php foreach ($unmatched_images as $img): ?>
        <?php echo htmlspecialchars($img); ?><br>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <?php if ($report['matched'] > 0): ?>
    <h2>Productos con imagen emparejada (<?php echo $report['matched']; ?>)</h2>
    <table>
        <tr><th>Preview</th><th>SKU</th><th>Nombre</th><th>Imagen</th><th>Estado</th></tr>
        <?php foreach ($matched as $m): ?>
        <tr>
            <td><img src="<?php echo htmlspecialchars($m['image']); ?>" class="img-preview" onerror="this.style.background='#7f1d1d'"></td>
            <td><?php echo htmlspecialchars($m['product']['sku']); ?></td>
            <td><?php echo htmlspecialchars($m['product']['name']); ?></td>
            <td><code><?php echo htmlspecialchars($m['image']); ?></code></td>
            <td><span class="badge badge-ok">OK</span></td>
        </tr>
        <?php endforeach; ?>
    </table>
    <?php endif; ?>
</body>
</html>
