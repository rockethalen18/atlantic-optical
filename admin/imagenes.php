<?php
define('CURRENT_PAGE', 'index');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();

$db = db();
$action = $_GET['action'] ?? 'preview';
$messages = [];

// Paths
$docRoot = $_SERVER['DOCUMENT_ROOT'];
$basePath = realpath($docRoot) ?: $docRoot;
$imagesDir = $basePath . '/images/extracted_images/';
$catalogDir = $basePath . '/../catalogos/extracted_images/';
if (!is_dir($catalogDir)) {
    $catalogDir = $basePath . '/catalogos/extracted_images/';
}
if (!is_dir($catalogDir)) {
    // Fallback: try common paths
    foreach (['/home/azjnptoj/equipos.atlanticopticalgroup.com/catalogos/extracted_images/',
              $basePath . '/catalogos/extracted_images/'] as $try) {
        if (is_dir($try)) { $catalogDir = $try; break; }
    }
}

// Get all products from DB
$products = $db->query('SELECT id, sku, name, image, category_id FROM products ORDER BY sku')->fetchAll();
$catNames = [];
foreach ($db->query('SELECT id, name FROM categories') as $c) $catNames[$c['id']] = $c['name'];

// ─── SCAN: extracted_images folders ───
$catalogFolders = [];
if (is_dir($catalogDir)) {
    foreach (scandir($catalogDir) as $entry) {
        if ($entry === '.' || $entry === '..') continue;
        $fullPath = $catalogDir . $entry;
        if (!is_dir($fullPath)) continue;

        // Parse folder name: "REF - NAME" or "REF - NAME"
        $parts = preg_split('/\s*-\s*/', $entry, 2);
        $ref = trim($parts[0] ?? '');
        $folderName = trim($parts[1] ?? $entry);

        // Find images in folder
        $images = [];
        foreach (['*.jpg', '*.jpeg', '*.png', '*.webp'] as $pattern) {
            foreach (glob($fullPath . '/' . $pattern) as $img) {
                $images[] = basename($img);
            }
        }

        // Build SKU: AO-{REF} (remove hyphens for SKU)
        $skuRef = preg_replace('/[^a-zA-Z0-9]/', '', $ref);
        $sku = 'AO-' . $skuRef;
        $imageFile = $sku . '.jpg';

        $catalogFolders[] = [
            'folder' => $entry,
            'ref' => $ref,
            'skuRef' => $skuRef,
            'sku' => $sku,
            'name' => $folderName,
            'images' => $images,
            'imageFile' => $imageFile,
            'deployPath' => $imagesDir . $imageFile,
            'hasImage' => file_exists($imagesDir . $imageFile),
        ];
    }
}

// ─── SCAN: images in public/images/products ───
$deployImages = [];
if (is_dir($imagesDir)) {
    foreach (glob($imagesDir . '*.jpg') as $f) {
        $base = basename($f, '.jpg');
        $deployImages[strtoupper($base)] = $f;
    }
}

// ─── MATCH: products ↔ images ───
$matched = [];
$noImage = [];
$orphanImages = array_keys($deployImages);

foreach ($products as $p) {
    $sku = strtoupper(trim($p['sku']));
    $found = false;

    // Exact match
    if (isset($deployImages[$sku])) {
        $imagePath = '/images/extracted_images/' . basename($deployImages[$sku]);
        $matched[] = ['product' => $p, 'image' => $imagePath, 'source' => 'deploy'];
        $orphanImages = array_diff($orphanImages, [$sku]);
        $found = true;

        if ($action === 'apply' && ($p['image'] ?? '') !== $imagePath) {
            $stmt = $db->prepare('UPDATE products SET image = ? WHERE id = ?');
            $stmt->execute([$imagePath, $p['id']]);
        }
    }

    // Try without AO- prefix
    if (!$found) {
        $clean = preg_replace('/^AO-?/i', '', $sku);
        if ($clean !== $sku && isset($deployImages['AO-' . $clean])) {
            $imagePath = '/images/extracted_images/AO-' . $clean . '.jpg';
            $matched[] = ['product' => $p, 'image' => $imagePath, 'source' => 'deploy'];
            $orphanImages = array_diff($orphanImages, ['AO-' . $clean]);
            $found = true;

            if ($action === 'apply' && ($p['image'] ?? '') !== $imagePath) {
                $stmt = $db->prepare('UPDATE products SET image = ? WHERE id = ?');
                $stmt->execute([$imagePath, $p['id']]);
            }
        }
    }

    if (!$found) {
        $noImage[] = $p;
    }
}

// ─── ACTION: sync catalog → deploy ───
if ($action === 'sync') {
    if (!is_dir($imagesDir)) mkdir($imagesDir, 0755, true);
    $synced = 0;
    foreach ($catalogFolders as $cf) {
        if (!empty($cf['images']) && !$cf['hasImage']) {
            $srcFile = $catalogDir . $cf['folder'] . '/' . $cf['images'][0];
            $dstFile = $imagesDir . $cf['imageFile'];
            if (copy($srcFile, $dstFile)) {
                $synced++;
                $messages[] = "Synced: {$cf['folder']} → {$cf['imageFile']}";
            }
        }
    }
    $messages[] = "Synced $synced images from catalog to deploy folder";
}

// ─── ACTION: apply to DB ───
if ($action === 'apply') {
    $updated = 0;
    foreach ($products as $p) {
        $sku = strtoupper(trim($p['sku']));
        if (isset($deployImages[$sku])) {
            $imagePath = '/images/extracted_images/' . basename($deployImages[$sku]);
            if (($p['image'] ?? '') !== $imagePath) {
                $stmt = $db->prepare('UPDATE products SET image = ? WHERE id = ?');
                $stmt->execute([$imagePath, $p['id']]);
                $updated++;
            }
        }
    }
    $messages[] = "Updated $updated products in DB";
}

// ─── STATS ───
$catalogWithImages = count(array_filter($catalogFolders, fn($f) => !empty($f['images'])));
$catalogEmpty = count($catalogFolders) - $catalogWithImages;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Images Manager - Atlantic Optical</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: #0f172a; color: #e2e8f0; margin: 0; }
        h1 { color: #60a5fa; font-size: 22px; margin-bottom: 4px; }
        h2 { color: #94a3b8; font-size: 15px; margin-top: 30px; margin-bottom: 10px; }
        .subtitle { color: #64748b; font-size: 13px; margin-bottom: 20px; }
        .stats { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0; }
        .stat { background: #1e293b; padding: 14px 18px; border-radius: 10px; border: 1px solid #334155; min-width: 120px; }
        .stat .num { font-size: 26px; font-weight: 700; }
        .stat .label { color: #94a3b8; font-size: 11px; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat.ok .num { color: #4ade80; }
        .stat.warn .num { color: #fbbf24; }
        .stat.err .num { color: #f87171; }
        .stat.info .num { color: #60a5fa; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-success { background: #16a34a; color: #fff; }
        .btn-warning { background: #d97706; color: #fff; }
        .btn-secondary { background: #374151; color: #d1d5db; }
        .btn:hover { opacity: 0.9; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th { background: #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 12px; text-align: left; position: sticky; top: 0; }
        td { padding: 8px 12px; border-bottom: 1px solid #1e293b; font-size: 13px; }
        tr:hover td { background: rgba(30,41,59,0.5); }
        .img-preview { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; background: #1e293b; border: 1px solid #374151; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .badge-ok { background: rgba(74,222,128,0.15); color: #4ade80; }
        .badge-err { background: rgba(248,113,113,0.15); color: #f87171; }
        .badge-warn { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .badge-info { background: rgba(96,165,250,0.15); color: #60a5fa; }
        code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #94a3b8; }
        .msg { background: #1e293b; border-left: 3px solid #4ade80; padding: 10px 14px; border-radius: 0 8px 8px 0; margin: 8px 0; font-size: 13px; }
        .folder-tree { background: #1e293b; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto; margin: 10px 0; border: 1px solid #334155; }
        .folder-item { padding: 3px 0; display: flex; align-items: center; gap: 8px; }
        .folder-item .icon { color: #fbbf24; }
        .folder-item .file { color: #4ade80; }
        .folder-item .missing { color: #f87171; }
        .section { background: #1e293b; border-radius: 12px; border: 1px solid #334155; margin: 16px 0; overflow: hidden; }
        .section-header { padding: 14px 18px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .section-body { padding: 0; }
        .scroll-table { max-height: 500px; overflow-y: auto; }
    </style>
</head>
<body>
    <h1>Image Manager</h1>
    <p class="subtitle">Sync catalog images → deploy → database</p>

    <?php if ($messages): ?>
    <?php foreach ($messages as $msg): ?>
    <div class="msg"><?php echo htmlspecialchars($msg); ?></div>
    <?php endforeach; ?>
    <?php endif; ?>

    <div class="stats">
        <div class="stat info"><div class="num"><?php echo count($products); ?></div><div class="label">Productos DB</div></div>
        <div class="stat info"><div class="num"><?php echo count($catalogFolders); ?></div><div class="label">Carpetas catálogo</div></div>
        <div class="stat ok"><div class="num"><?php echo $catalogWithImages; ?></div><div class="label">Con imagen</div></div>
        <div class="stat warn"><div class="num"><?php echo $catalogEmpty; ?></div><div class="label">Sin imagen</div></div>
        <div class="stat ok"><div class="num"><?php echo count($matched); ?></div><div class="label">Emparejados</div></div>
        <div class="stat err"><div class="num"><?php echo count($noImage); ?></div><div class="label">Sin imagen DB</div></div>
    </div>

    <div class="actions">
        <a href="?action=preview" class="btn btn-secondary">Vista previa</a>
        <a href="?action=sync" class="btn btn-success" onclick="return confirm('Copiar imágenes del catálogo a la carpeta de deploy?')">Sync catálogo → deploy</a>
        <a href="?action=apply" class="btn btn-primary" onclick="return confirm('Actualizar image column en la DB?')">Aplicar a DB</a>
        <a href="/admin/productos" class="btn btn-secondary">Productos</a>
    </div>

    <!-- SECTION 1: Catalog folders -->
    <div class="section">
        <div class="section-header">
            <h2 style="margin:0">Carpetas del catálogo (<?php echo count($catalogFolders); ?>)</h2>
        </div>
        <div class="section-body">
            <div class="scroll-table">
                <table>
                    <tr><th>Referencia</th><th>Nombre</th><th>SKU</th><th>Imagen archivo</th><th>En deploy</th><th>En DB</th></tr>
                    <?php foreach ($catalogFolders as $cf):
                        $dbMatch = null;
                        foreach ($products as $p) {
                            if (strtoupper(trim($p['sku'])) === strtoupper($cf['sku'])) {
                                $dbMatch = $p; break;
                            }
                        }
                    ?>
                    <tr>
                        <td><code><?php echo htmlspecialchars($cf['ref']); ?></code></td>
                        <td><?php echo htmlspecialchars($cf['name']); ?></td>
                        <td><code><?php echo htmlspecialchars($cf['sku']); ?></code></td>
                        <td>
                            <?php if (!empty($cf['images'])): ?>
                                <span class="badge badge-ok"><?php echo htmlspecialchars($cf['images'][0]); ?></span>
                            <?php else: ?>
                                <span class="badge badge-err">Sin imagen</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ($cf['hasImage']): ?>
                                <img src="/images/extracted_images/<?php echo htmlspecialchars($cf['imageFile']); ?>" class="img-preview" onerror="this.style.background='#7f1d1d'">
                            <?php else: ?>
                                <span class="badge badge-err">No</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ($dbMatch && $dbMatch['image']): ?>
                                <span class="badge badge-ok">OK</span>
                            <?php elseif ($dbMatch): ?>
                                <span class="badge badge-warn">Sin image</span>
                            <?php else: ?>
                                <span class="badge badge-err">No en DB</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </table>
            </div>
        </div>
    </div>

    <!-- SECTION 2: Products without image -->
    <?php if (count($noImage) > 0): ?>
    <div class="section">
        <div class="section-header">
            <h2 style="margin:0">Productos sin imagen (<?php echo count($noImage); ?>)</h2>
        </div>
        <div class="section-body">
            <div class="scroll-table">
                <table>
                    <tr><th>SKU</th><th>Nombre</th><th>Categoría</th><th>Imagen esperada</th><th>Carpeta catálogo</th></tr>
                    <?php foreach ($noImage as $p):
                        $cleanSku = preg_replace('/^AO-?/i', '', strtoupper($p['sku']));
                        $catalogFolder = null;
                        foreach ($catalogFolders as $cf) {
                            if (strtoupper($cf['skuRef']) === $cleanSku || strtoupper($cf['sku']) === strtoupper($p['sku'])) {
                                $catalogFolder = $cf;
                                break;
                            }
                        }
                    ?>
                    <tr>
                        <td><code><?php echo htmlspecialchars($p['sku']); ?></code></td>
                        <td><?php echo htmlspecialchars($p['name']); ?></td>
                        <td><?php echo htmlspecialchars($catNames[$p['category_id']] ?? 'N/A'); ?></td>
                        <td><code>/images/extracted_images/<?php echo strtoupper(htmlspecialchars($p['sku'])); ?>.jpg</code></td>
                        <td>
                            <?php if ($catalogFolder): ?>
                                <code><?php echo htmlspecialchars($catalogFolder['folder']); ?></code>
                                <?php if (!empty($catalogFolder['images'])): ?>
                                    <br><span class="badge badge-warn">Tiene imagen en catálogo — ejecutar Sync</span>
                                <?php else: ?>
                                    <br><span class="badge badge-err">Carpeta vacía — agregar imagen</span>
                                <?php endif; ?>
                            <?php else: ?>
                                <span class="badge badge-err">Sin carpeta</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </table>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- SECTION 3: Orphan images -->
    <?php if (count($orphanImages) > 0): ?>
    <div class="section">
        <div class="section-header">
            <h2 style="margin:0">Imágenes sin producto en DB (<?php echo count($orphanImages); ?>)</h2>
        </div>
        <div class="section-body">
            <div class="folder-tree">
                <?php foreach ($orphanImages as $img): ?>
                <div class="folder-item"><span class="file">●</span> <?php echo htmlspecialchars($img); ?>.jpg</div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>
</body>
</html>
