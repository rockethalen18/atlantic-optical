<?php
define('CURRENT_PAGE', 'productos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_once __DIR__ . '/includes/exchange.php';
require_login();
security_headers();

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) { @mkdir($uploadDir, 0755, true); }

function do_upload_image($file, $dir) {
    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($file['type'] ?? '', $allowed)) return null;
    if (($file['size'] ?? 0) > 5 * 1024 * 1024) return null;
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name = 'prod_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $dir . $name)) return $name;
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'save') {
        $id = sanitize_int($_POST['id'] ?? 0);
        $fields = [
            'name' => trim($_POST['name'] ?? ''),
            'sku' => trim($_POST['sku'] ?? ''),
            'reference' => trim($_POST['reference'] ?? ''),
            'description' => trim($_POST['description'] ?? ''),
            'short_description' => trim($_POST['short_description'] ?? ''),
            'barcode' => trim($_POST['barcode'] ?? ''),
            'specs' => trim($_POST['specs'] ?? ''),
            'base_cost_usd' => sanitize_float($_POST['base_cost_usd'] ?? 0),
            'weight_kg' => sanitize_float($_POST['weight_kg'] ?? 0),
            'margin' => sanitize_float($_POST['margin'] ?? 0),
            'price_mxn' => sanitize_float($_POST['price_mxn'] ?? 0),
            'compare_price_mxn' => sanitize_float($_POST['compare_price_mxn'] ?? 0),
            'category_id' => sanitize_int($_POST['category_id'] ?? 0),
            'stock' => sanitize_int($_POST['stock'] ?? 0),
            'status' => in_array($_POST['status'] ?? '', ['active','inactive']) ? $_POST['status'] : 'active',
            'is_featured' => isset($_POST['is_featured']) ? 1 : 0,
            'is_new' => isset($_POST['is_new']) ? 1 : 0,
            'seo_title' => trim($_POST['seo_title'] ?? ''),
            'seo_description' => trim($_POST['seo_description'] ?? ''),
        ];

        if ($fields['name'] === '') { header('Location: /admin/productos'); exit; }

        if ($id > 0) {
            $sets = [];
            $vals = [];
            foreach ($fields as $k => $v) { $sets[] = "$k = ?"; $vals[] = $v; }
            $vals[] = $id;
            db()->prepare('UPDATE products SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
        } else {
            $cols = array_keys($fields);
            $ph = array_fill(0, count($cols), '?');
            db()->prepare('INSERT INTO products (' . implode(',', $cols) . ') VALUES (' . implode(',', $ph) . ')')->execute(array_values($fields));
            $id = db()->lastInsertId();
        }

        if (!empty($_FILES['main_image']['name'])) {
            $uploaded = do_upload_image($_FILES['main_image'], $uploadDir);
            if ($uploaded) db()->prepare('UPDATE products SET image = ? WHERE id = ?')->execute(["uploads/$uploaded", $id]);
        }

        header('Location: /admin/productos?edit=' . intval($id));
        exit;
    }

    if ($action === 'add_photo') {
        $pid = sanitize_int($_POST['product_id'] ?? 0);
        if ($pid > 0) {
            $cnt = db()->prepare('SELECT COUNT(*) FROM product_images WHERE product_id = ?');
            $cnt->execute([$pid]);
            if ($cnt->fetchColumn() < 9) {
                $url = trim($_POST['photo_url'] ?? '');
                $alt = trim($_POST['photo_alt'] ?? '');
                $isPri = isset($_POST['is_primary']) ? 1 : 0;
                if (!empty($_FILES['photo_file']['name'])) {
                    $up = do_upload_image($_FILES['photo_file'], $uploadDir);
                    if ($up) $url = "uploads/$up";
                }
                if ($url !== '') {
                    if ($isPri) db()->prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = ?')->execute([$pid]);
                    $srt = db()->prepare('SELECT COALESCE(MAX(sort_order),0)+1 FROM product_images WHERE product_id = ?');
                    $srt->execute([$pid]);
                    db()->prepare('INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES (?,?,?,?,?)')
                        ->execute([$pid, $url, $alt, $srt->fetchColumn(), $isPri]);
                }
            }
        }
        header('Location: /admin/productos?edit=' . $pid);
        exit;
    }

    if ($action === 'set_primary') {
        $phId = sanitize_int($_POST['photo_id'] ?? 0);
        $pId = sanitize_int($_POST['product_id'] ?? 0);
        if ($phId > 0 && $pId > 0) {
            db()->prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = ?')->execute([$pId]);
            db()->prepare('UPDATE product_images SET is_primary = 1 WHERE id = ?')->execute([$phId]);
        }
        header('Location: /admin/productos?edit=' . $pId);
        exit;
    }

    if ($action === 'delete_photo') {
        $phId = sanitize_int($_POST['photo_id'] ?? 0);
        $pId = sanitize_int($_POST['product_id'] ?? 0);
        if ($phId > 0) {
            $row = db()->prepare('SELECT url FROM product_images WHERE id = ?');
            $row->execute([$phId]);
            $img = $row->fetch();
            if ($img && strpos($img['url'], 'uploads/') === 0) {
                $f = __DIR__ . '/' . $img['url'];
                if (file_exists($f)) @unlink($f);
            }
            db()->prepare('DELETE FROM product_images WHERE id = ?')->execute([$phId]);
        }
        header('Location: /admin/productos?edit=' . $pId);
        exit;
    }

    if ($action === 'delete') {
        $dId = sanitize_int($_POST['id'] ?? 0);
        if ($dId > 0) {
            $imgs = db()->prepare('SELECT url FROM product_images WHERE product_id = ?');
            $imgs->execute([$dId]);
            foreach ($imgs->fetchAll() as $im) {
                if (strpos($im['url'], 'uploads/') === 0) { $f = __DIR__ . '/' . $im['url']; if (file_exists($f)) @unlink($f); }
            }
            db()->prepare('DELETE FROM product_images WHERE product_id = ?')->execute([$dId]);
            db()->prepare('DELETE FROM products WHERE id = ?')->execute([$dId]);
        }
        header('Location: /admin/productos');
        exit;
    }

    if ($action === 'toggle_status') {
        $tId = sanitize_int($_POST['id'] ?? 0);
        $ns = $_POST['new_status'] ?? '';
        if ($tId > 0 && in_array($ns, ['active','inactive'])) {
            db()->prepare('UPDATE products SET status = ? WHERE id = ?')->execute([$ns, $tId]);
        }
        header('Location: /admin/productos');
        exit;
    }
}

$editId = isset($_GET['edit']) ? intval($_GET['edit']) : 0;
$isNew = isset($_GET['new']);
$product = null;
$categories = db()->query('SELECT id, name, parent_id FROM categories WHERE is_active = 1 ORDER BY CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END, name')->fetchAll();
$productImages = [];

if ($editId > 0) {
    $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$editId]);
    $product = $stmt->fetch();
    if (!$product) { header('Location: /admin/productos'); exit; }
    $imgStmt = db()->prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC');
    $imgStmt->execute([$editId]);
    $productImages = $imgStmt->fetchAll();
}

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;
$fCategory = intval($_GET['cat'] ?? 0);
$fStatus = $_GET['status'] ?? '';
$fPriceMin = isset($_GET['price_min']) ? floatval($_GET['price_min']) : '';
$fPriceMax = isset($_GET['price_max']) ? floatval($_GET['price_max']) : '';
$fStock = $_GET['stock'] ?? '';
$fSeo = $_GET['seo'] ?? '';

$conditions = [];
$params = [];

if ($search !== '') {
    $conditions[] = '(p.name LIKE ? OR p.sku LIKE ? OR p.reference LIKE ?)';
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}
if ($fCategory > 0) {
    $conditions[] = 'p.category_id = ?';
    $params[] = $fCategory;
}
if ($fStatus !== '' && in_array($fStatus, ['active', 'inactive'])) {
    $conditions[] = 'p.status = ?';
    $params[] = $fStatus;
}
if ($fPriceMin !== '') {
    $conditions[] = 'p.price_mxn >= ?';
    $params[] = $fPriceMin;
}
if ($fPriceMax !== '') {
    $conditions[] = 'p.price_mxn <= ?';
    $params[] = $fPriceMax;
}
if ($fStock === 'out') {
    $conditions[] = 'p.stock <= 0';
} elseif ($fStock === 'low') {
    $conditions[] = 'p.stock > 0 AND p.stock <= 5';
} elseif ($fStock === 'ok') {
    $conditions[] = 'p.stock > 5';
}
if ($fSeo === 'yes') {
    $conditions[] = "p.seo_title != ''";
} elseif ($fSeo === 'no') {
    $conditions[] = "(p.seo_title IS NULL OR p.seo_title = '')";
}

$where = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';

$cntS = db()->prepare("SELECT COUNT(*) FROM products p $where");
$cntS->execute($params);
$total = $cntS->fetchColumn();

$stmt = db()->prepare("SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id $where ORDER BY p.created_at DESC LIMIT ? OFFSET ?");
$allParams = array_merge($params, [$perPage, $offset]);
$stmt->execute($allParams);
$products = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));

function build_filter_url($overrides = []) {
    $base = '/admin/productos';
    $params = [];
    foreach (['q', 'cat', 'status', 'price_min', 'price_max', 'stock', 'seo', 'page'] as $key) {
        $val = $overrides[$key] ?? ($_GET[$key] ?? '');
        if ($val !== '' && $val !== null && $val !== 0) {
            $params[] = $key . '=' . urlencode($val);
        }
    }
    return $base . ($params ? '?' . implode('&', $params) : '');
}

$hasFilters = ($search !== '' || $fCategory > 0 || $fStatus !== '' || $fPriceMin !== '' || $fPriceMax !== '' || $fStock !== '' || $fSeo !== '');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo ($editId > 0 || $isNew) ? 'Editar Producto' : 'Productos'; ?> - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <style>
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-top: 12px; }
        .photo-item { position: relative; background: #1f2937; border-radius: 8px; overflow: hidden; border: 2px solid transparent; }
        .photo-item.is-primary { border-color: #2563eb; }
        .photo-item img { width: 100%; height: 120px; object-fit: cover; display: block; }
        .photo-item .photo-actions { position: absolute; top: 4px; right: 4px; display: flex; gap: 4px; }
        .photo-item .photo-actions button { width: 28px; height: 28px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .photo-item .photo-badge { position: absolute; bottom: 4px; left: 4px; background: #2563eb; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        .photo-upload-form { background: #0f1629; border-radius: 8px; padding: 16px; margin-top: 12px; }
        .product-thumb { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; background: #1f2937; border: 1px solid #374151; }
        .product-thumb-placeholder { width: 48px; height: 48px; border-radius: 6px; background: #1e3a5f; border: 1px solid #374151; display: flex; align-items: center; justify-content: center; color: #60a5fa; font-size: 13px; font-weight: 700; }
        .product-thumb-container.has-img .product-thumb { border-color: #2563eb; }
        .filter-form { display: block; }
        .filter-row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
        .filter-group { display: flex; flex-direction: column; gap: 4px; }
        .filter-group label { color: #6b7280; font-size: 11px; font-weight: 500; text-transform: uppercase; }
        .filter-group input, .filter-group select { background: #1f2937; border: 1px solid #374151; border-radius: 6px; color: #d1d5db; padding: 7px 10px; font-size: 13px; min-width: 100px; }
        .filter-group input:focus, .filter-group select:focus { outline: none; border-color: #3b82f6; }
    </style>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1><?php echo ($editId > 0 || $isNew) ? ($product ? 'Editar: ' . htmlspecialchars($product['name']) : 'Nuevo Producto') : 'Productos'; ?></h1>
                <div class="crm-header-actions">
                    <?php if ($editId > 0 || $isNew): ?>
                    <a href="/admin/productos" class="btn-secondary"><?php echo crm_icon('refresh'); ?> Cancelar</a>
                    <?php else: ?>
                    <a href="/admin/productos?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo</a>
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?><a href="/admin/productos" class="btn-clear"><?php echo crm_icon('x'); ?></a><?php endif; ?>
                    </form>
                    <?php endif; ?>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($editId > 0 || $isNew): ?>
                <form method="POST" enctype="multipart/form-data">
                    <?php echo csrf_field(); ?>
                    <input type="hidden" name="action" value="save">
                    <?php if ($product): ?><input type="hidden" name="id" value="<?php echo intval($product['id']); ?>"><?php endif; ?>

                    <div class="crm-card">
                        <div class="crm-card-header"><h2>Informacion del Producto</h2></div>
                        <div class="crm-card-body">
                            <div class="form-grid">
                                <div class="form-group"><label>Nombre *</label><input type="text" name="name" value="<?php echo htmlspecialchars($product['name'] ?? ''); ?>" required></div>
                                <div class="form-group"><label>SKU</label><input type="text" name="sku" value="<?php echo htmlspecialchars($product['sku'] ?? ''); ?>"></div>
                                <div class="form-group"><label>Referencia</label><input type="text" name="reference" value="<?php echo htmlspecialchars($product['reference'] ?? ''); ?>"></div>
                                <div class="form-group"><label>Codigo de Barras</label><input type="text" name="barcode" value="<?php echo htmlspecialchars($product['barcode'] ?? ''); ?>"></div>
                            </div>
                            <div class="form-grid">
                                <div class="form-group"><label>Descripcion Corta</label><input type="text" name="short_description" value="<?php echo htmlspecialchars($product['short_description'] ?? ''); ?>"></div>
                                <div class="form-group"><label>Categoria</label>
                                    <select name="category_id">
                                        <option value="0">-- Sin categoria --</option>
                                        <?php
                                        $parentId = 0;
                                        $catById = [];
                                        foreach ($categories as $c) $catById[$c['id']] = $c;
                                        foreach ($categories as $c):
                                            if ($c['parent_id'] == null):
                                                if ($parentId > 0) echo '</optgroup>';
                                                $parentId = $c['id'];
                                        ?>
                                        <optgroup label="<?php echo htmlspecialchars($c['name']); ?>">
                                        <?php else: ?>
                                        <option value="<?php echo intval($c['id']); ?>" <?php if (intval($product['category_id'] ?? 0) === intval($c['id'])) echo 'selected'; ?>><?php echo htmlspecialchars($c['name']); ?></option>
                                        <?php endif; endforeach; if ($parentId > 0) echo '</optgroup>'; ?>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group"><label>Descripcion</label><textarea name="description" rows="4"><?php echo htmlspecialchars($product['description'] ?? ''); ?></textarea></div>
                            <div class="form-group"><label>Especificaciones</label><textarea name="specs" rows="3"><?php echo htmlspecialchars($product['specs'] ?? ''); ?></textarea></div>
                        </div>
                    </div>

                    <div class="crm-card">
                        <div class="crm-card-header"><h2>Costos y Precios</h2></div>
                        <div class="crm-card-body">
                            <div class="form-grid">
                                <div class="form-group"><label>Costo Base (USD)</label><input type="number" name="base_cost_usd" step="0.01" min="0" value="<?php echo htmlspecialchars($product['base_cost_usd'] ?? '0.00'); ?>"></div>
                                <div class="form-group"><label>Margen (%)</label><input type="number" name="margin" step="0.01" min="0" value="<?php echo htmlspecialchars($product['margin'] ?? '0'); ?>"></div>
                                <div class="form-group"><label>Precio (MXN)</label><input type="number" name="price_mxn" step="0.01" min="0" value="<?php echo htmlspecialchars($product['price_mxn'] ?? '0.00'); ?>"></div>
                                <div class="form-group"><label>Precio Comparar (MXN)</label><input type="number" name="compare_price_mxn" step="0.01" min="0" value="<?php echo htmlspecialchars($product['compare_price_mxn'] ?? '0.00'); ?>"></div>
                            </div>
                        </div>
                    </div>

                    <div class="crm-card">
                        <div class="crm-card-header"><h2>Inventario</h2></div>
                        <div class="crm-card-body">
                            <div class="form-grid">
                                <div class="form-group"><label>Stock</label><input type="number" name="stock" min="0" value="<?php echo intval($product['stock'] ?? 0); ?>"></div>
                                <div class="form-group"><label>Peso (kg)</label><input type="number" name="weight_kg" step="0.01" min="0" value="<?php echo htmlspecialchars($product['weight_kg'] ?? '0'); ?>"></div>
                                <div class="form-group"><label>Estado</label>
                                    <select name="status">
                                        <option value="active" <?php if (($product['status'] ?? 'active') === 'active') echo 'selected'; ?>>Activo</option>
                                        <option value="inactive" <?php if (($product['status'] ?? '') === 'inactive') echo 'selected'; ?>>Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div style="display:flex;gap:24px;margin-top:12px">
                                <label style="color:#9ca3af;font-size:13px;display:flex;align-items:center;gap:6px"><input type="checkbox" name="is_featured" value="1" <?php if (!empty($product['is_featured'])) echo 'checked'; ?>> Destacado</label>
                                <label style="color:#9ca3af;font-size:13px;display:flex;align-items:center;gap:6px"><input type="checkbox" name="is_new" value="1" <?php if (!empty($product['is_new'])) echo 'checked'; ?>> Nuevo</label>
                            </div>
                        </div>
                    </div>

                    <div class="crm-card">
                        <div class="crm-card-header"><h2>SEO</h2></div>
                        <div class="crm-card-body">
                            <div class="form-group"><label>Titulo SEO</label><input type="text" name="seo_title" value="<?php echo htmlspecialchars($product['seo_title'] ?? ''); ?>"></div>
                            <div class="form-group"><label>Descripcion SEO</label><textarea name="seo_description" rows="2"><?php echo htmlspecialchars($product['seo_description'] ?? ''); ?></textarea></div>
                        </div>
                    </div>

                    <div style="display:flex;gap:12px;margin-top:16px">
                        <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> Guardar</button>
                        <a href="/admin/productos" class="btn-secondary">Cancelar</a>
                    </div>
                </form>

                <?php if ($editId > 0 && $product): ?>
                <div class="crm-card" style="margin-top:16px">
                    <div class="crm-card-header"><h2>Fotos (<?php echo count($productImages); ?>/9)</h2></div>
                    <div class="crm-card-body">
                        <?php if (!empty($productImages)): ?>
                        <div class="photo-grid">
                            <?php foreach ($productImages as $img): ?>
                            <div class="photo-item <?php if ($img['is_primary']) echo 'is-primary'; ?>">
                                <img src="<?php echo htmlspecialchars($img['url']); ?>" alt="<?php echo htmlspecialchars($img['alt_text']); ?>">
                                <div class="photo-actions">
                                    <?php if (!$img['is_primary']): ?>
                                    <form method="POST" style="display:inline"><?php echo csrf_field(); ?>
                                        <input type="hidden" name="action" value="set_primary">
                                        <input type="hidden" name="photo_id" value="<?php echo intval($img['id']); ?>">
                                        <input type="hidden" name="product_id" value="<?php echo intval($product['id']); ?>">
                                        <button type="submit" title="Principal" style="background:#2563eb;color:#fff"><?php echo crm_icon('star'); ?></button>
                                    </form>
                                    <?php endif; ?>
                                    <form method="POST" style="display:inline"><?php echo csrf_field(); ?>
                                        <input type="hidden" name="action" value="delete_photo">
                                        <input type="hidden" name="photo_id" value="<?php echo intval($img['id']); ?>">
                                        <input type="hidden" name="product_id" value="<?php echo intval($product['id']); ?>">
                                        <button type="submit" title="Eliminar" style="background:#dc2626;color:#fff" onclick="return confirm('Eliminar foto?')"><?php echo crm_icon('trash'); ?></button>
                                    </form>
                                </div>
                                <?php if ($img['is_primary']): ?><div class="photo-badge">Principal</div><?php endif; ?>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        <?php endif; ?>
                        <form method="POST" enctype="multipart/form-data" class="photo-upload-form">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="add_photo">
                            <input type="hidden" name="product_id" value="<?php echo intval($product['id']); ?>">
                            <div class="form-grid">
                                <div class="form-group"><label>Subir archivo</label><input type="file" name="photo_file" accept="image/*"></div>
                                <div class="form-group"><label>O URL</label><input type="text" name="photo_url" placeholder="https://..."></div>
                            </div>
                            <div class="form-group"><label>Alt</label><input type="text" name="photo_alt" placeholder="Texto alternativo"></div>
                            <button type="submit" class="btn-primary"><?php echo crm_icon('plus'); ?> Agregar Foto</button>
                        </form>
                    </div>
                </div>
                <?php endif; ?>
                <?php else: ?>
                <div class="crm-card" style="margin-bottom:16px">
                    <div class="crm-card-body" style="padding:12px 16px">
                        <form method="GET" class="filter-form">
                            <div class="filter-row">
                                <div class="filter-group">
                                    <label>Buscar</label>
                                    <input type="text" name="q" placeholder="Nombre, SKU..." value="<?php echo htmlspecialchars($search); ?>">
                                </div>
                                <div class="filter-group">
                                    <label>Categoria</label>
                                    <select name="cat">
                                        <option value="">Todas</option>
                                        <?php foreach ($categories as $c): ?>
                                        <?php if ($c['parent_id'] == null): ?>
                                        <optgroup label="<?php echo htmlspecialchars($c['name']); ?>">
                                        <?php else: ?>
                                        <option value="<?php echo intval($c['id']); ?>" <?php if ($fCategory === intval($c['id'])) echo 'selected'; ?>><?php echo htmlspecialchars($c['name']); ?></option>
                                        <?php endif; endforeach; ?>
                                    </select>
                                </div>
                                <div class="filter-group">
                                    <label>Estado</label>
                                    <select name="status">
                                        <option value="">Todos</option>
                                        <option value="active" <?php if ($fStatus === 'active') echo 'selected'; ?>>Activo</option>
                                        <option value="inactive" <?php if ($fStatus === 'inactive') echo 'selected'; ?>>Inactivo</option>
                                    </select>
                                </div>
                                <div class="filter-group">
                                    <label>Precio Min</label>
                                    <input type="number" name="price_min" step="0.01" min="0" placeholder="$0" value="<?php echo htmlspecialchars($fPriceMin); ?>">
                                </div>
                                <div class="filter-group">
                                    <label>Precio Max</label>
                                    <input type="number" name="price_max" step="0.01" min="0" placeholder="$9999" value="<?php echo htmlspecialchars($fPriceMax); ?>">
                                </div>
                                <div class="filter-group">
                                    <label>Stock</label>
                                    <select name="stock">
                                        <option value="">Todos</option>
                                        <option value="out" <?php if ($fStock === 'out') echo 'selected'; ?>>Agotado</option>
                                        <option value="low" <?php if ($fStock === 'low') echo 'selected'; ?>>Bajo (1-5)</option>
                                        <option value="ok" <?php if ($fStock === 'ok') echo 'selected'; ?>>Suficiente (6+)</option>
                                    </select>
                                </div>
                                <div class="filter-group">
                                    <label>SEO</label>
                                    <select name="seo">
                                        <option value="">Todos</option>
                                        <option value="yes" <?php if ($fSeo === 'yes') echo 'selected'; ?>>Con SEO</option>
                                        <option value="no" <?php if ($fSeo === 'no') echo 'selected'; ?>>Sin SEO</option>
                                    </select>
                                </div>
                                <div class="filter-group" style="align-self:flex-end">
                                    <button type="submit" class="btn-primary"><?php echo crm_icon('search'); ?> Filtrar</button>
                                    <?php if ($hasFilters): ?>
                                    <a href="/admin/productos" class="btn-secondary" style="margin-left:4px">Limpiar</a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $total; ?> producto(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th></th><th>SKU</th><th>Nombre</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>SEO</th><th>Estado</th><th>Acciones</th></tr></thead>
                            <tbody>
                                <?php if (empty($products)): ?>
                                <tr><td colspan="9" class="text-center text-muted">No se encontraron productos</td></tr>
                                <?php else: ?>
                                <?php foreach ($products as $p): ?>
                                <tr>
                                    <td>
                                        <div class="product-thumb-container" data-sku="<?php echo htmlspecialchars($p['sku']); ?>">
                                        <?php if (!empty($p['image'])): ?>
                                        <img src="https://atlanticopticalgroup.com<?php echo htmlspecialchars($p['image']); ?>" alt="" class="product-thumb" onload="this.parentElement.classList.add('has-img')" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                        <div class="product-thumb-placeholder" style="display:none"><?php echo strtoupper(substr($p['sku'], -2)); ?></div>
                                        <?php else: ?>
                                        <div class="product-thumb-placeholder"><?php echo strtoupper(substr($p['sku'], -2)); ?></div>
                                        <?php endif; ?>
                                        </div>
                                    </td>
                                    <td><code><?php echo htmlspecialchars($p['sku']); ?></code></td>
                                    <td><?php echo htmlspecialchars($p['name']); ?></td>
                                    <td><?php echo htmlspecialchars($p['category_name'] ?? '-'); ?></td>
                                    <td>$<?php echo number_format($p['price_mxn'], 2); ?></td>
                                    <td><?php echo intval($p['stock']); ?></td>
                                    <td><?php if (!empty($p['seo_title'])): ?><span class="status-badge status-active">SEO</span><?php else: ?><span class="status-badge status-inactive">Sin SEO</span><?php endif; ?></td>
                                    <td>
                                        <form method="POST" style="display:inline"><?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="toggle_status">
                                            <input type="hidden" name="id" value="<?php echo intval($p['id']); ?>">
                                            <input type="hidden" name="new_status" value="<?php echo $p['status'] === 'active' ? 'inactive' : 'active'; ?>">
                                            <button type="submit" class="status-badge <?php echo $p['status'] === 'active' ? 'status-active' : 'status-inactive'; ?>" style="border:none;cursor:pointer">
                                                <?php echo $p['status'] === 'active' ? 'Activo' : 'Inactivo'; ?>
                                            </button>
                                        </form>
                                    </td>
                                    <td style="display:flex;gap:4px">
                                        <a href="/admin/productos?edit=<?php echo intval($p['id']); ?>" class="btn-sm"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline"><?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo intval($p['id']); ?>">
                                            <button type="submit" class="btn-sm btn-danger" onclick="return confirm('Eliminar?')"><?php echo crm_icon('trash'); ?></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php if ($totalPages > 1): ?>
                    <div class="pagination">
                        <?php if ($page > 1): ?><a href="<?php echo build_filter_url(['page' => $page - 1]); ?>" class="btn-page">&laquo;</a><?php endif; ?>
                        <?php for ($i = max(1,$page-3); $i <= min($totalPages,$page+3); $i++): ?>
                        <a href="<?php echo build_filter_url(['page' => $i]); ?>" class="btn-page <?php if ($i===$page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?><a href="<?php echo build_filter_url(['page' => $page + 1]); ?>" class="btn-page">&raquo;</a><?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>
