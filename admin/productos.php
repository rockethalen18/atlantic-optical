<?php
define('CURRENT_PAGE', 'productos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

function upload_image($file, $uploadDir) {
    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($file['type'], $allowed)) return null;
    if ($file['size'] > 5 * 1024 * 1024) return null;
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $name = 'prod_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $uploadDir . $name)) {
        return $name;
    }
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'save') {
        $id = sanitize_int($_POST['id'] ?? 0);
        $data = [
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
            'subcategory_id' => sanitize_int($_POST['subcategory_id'] ?? 0),
            'stock' => sanitize_int($_POST['stock'] ?? 0),
            'status' => in_array($_POST['status'] ?? '', ['active','inactive','draft','published']) ? $_POST['status'] : 'active',
            'is_featured' => isset($_POST['is_featured']) ? 1 : 0,
            'is_new' => isset($_POST['is_new']) ? 1 : 0,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
            'seo_title' => trim($_POST['seo_title'] ?? ''),
            'seo_description' => trim($_POST['seo_description'] ?? ''),
        ];

        if ($data['name'] === '') {
            header('Location: /admin/productos?error=name_required');
            exit;
        }

        if ($data['slug'] === '' || !isset($_POST['slug'])) {
            $data['slug'] = preg_replace('/[^a-z0-9]+/', '-', strtolower($data['name']));
            $data['slug'] = trim($data['slug'], '-');
        } else {
            $data['slug'] = trim($_POST['slug'] ?? '');
        }

        if ($id > 0) {
            $fields = [];
            $vals = [];
            foreach ($data as $k => $v) {
                $fields[] = "$k = ?";
                $vals[] = $v;
            }
            $vals[] = $id;
            db()->prepare('UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
        } else {
            $cols = array_keys($data);
            $placeholders = array_fill(0, count($cols), '?');
            db()->prepare('INSERT INTO products (' . implode(',', $cols) . ') VALUES (' . implode(',', $placeholders) . ')')->execute(array_values($data));
            $id = db()->lastInsertId();
        }

        // Handle main image upload
        if (!empty($_FILES['main_image']['name'])) {
            $uploaded = upload_image($_FILES['main_image'], $uploadDir);
            if ($uploaded) {
                db()->prepare('UPDATE products SET image = ? WHERE id = ?')->execute(["uploads/$uploaded", $id]);
            }
        }

        header('Location: /admin/productos?edit=' . intval($id));
        exit;
    }

    if ($action === 'add_photo') {
        $productId = sanitize_int($_POST['product_id'] ?? 0);
        if ($productId > 0) {
            $count = db()->prepare('SELECT COUNT(*) FROM product_images WHERE product_id = ?');
            $count->execute([$productId]);
            if ($count->fetchColumn() >= 9) {
                header('Location: /admin/productos?edit=' . $productId . '&error=max_photos');
                exit;
            }

            // Handle URL
            $url = trim($_POST['photo_url'] ?? '');
            $alt = trim($_POST['photo_alt'] ?? '');
            $isPrimary = isset($_POST['is_primary']) ? 1 : 0;

            // Handle file upload
            if (!empty($_FILES['photo_file']['name'])) {
                $uploaded = upload_image($_FILES['photo_file'], $uploadDir);
                if ($uploaded) {
                    $url = "uploads/$uploaded";
                }
            }

            if ($url !== '') {
                if ($isPrimary) {
                    db()->prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = ?')->execute([$productId]);
                }
                $sort = db()->prepare('SELECT COALESCE(MAX(sort_order),0)+1 FROM product_images WHERE product_id = ?');
                $sort->execute([$productId]);
                $sortOrder = $sort->fetchColumn();

                db()->prepare('INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES (?,?,?,?,?)')
                    ->execute([$productId, $url, $alt ?: '', $sortOrder, $isPrimary]);
            }
        }
        header('Location: /admin/productos?edit=' . intval($productId));
        exit;
    }

    if ($action === 'delete_photo') {
        $photoId = sanitize_int($_POST['photo_id'] ?? 0);
        $productId = sanitize_int($_POST['product_id'] ?? 0);
        if ($photoId > 0) {
            $photo = db()->prepare('SELECT url FROM product_images WHERE id = ?');
            $photo->execute([$photoId]);
            $photo = $photo->fetch();
            if ($photo && strpos($photo['url'], 'uploads/') === 0) {
                $file = __DIR__ . '/' . $photo['url'];
                if (file_exists($file)) unlink($file);
            }
            db()->prepare('DELETE FROM product_images WHERE id = ?')->execute([$photoId]);
        }
        header('Location: /admin/productos?edit=' . intval($productId));
        exit;
    }

    if ($action === 'set_primary') {
        $photoId = sanitize_int($_POST['photo_id'] ?? 0);
        $productId = sanitize_int($_POST['product_id'] ?? 0);
        if ($photoId > 0 && $productId > 0) {
            db()->prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = ?')->execute([$productId]);
            db()->prepare('UPDATE product_images SET is_primary = 1 WHERE id = ?')->execute([$photoId]);
        }
        header('Location: /admin/productos?edit=' . intval($productId));
        exit;
    }

    if ($action === 'delete') {
        $delId = sanitize_int($_POST['id'] ?? 0);
        if ($delId > 0) {
            $images = db()->prepare('SELECT url FROM product_images WHERE product_id = ?');
            $images->execute([$delId]);
            foreach ($images->fetchAll() as $img) {
                if (strpos($img['url'], 'uploads/') === 0) {
                    $f = __DIR__ . '/' . $img['url'];
                    if (file_exists($f)) unlink($f);
                }
            }
            db()->prepare('DELETE FROM product_images WHERE product_id = ?')->execute([$delId]);
            db()->prepare('DELETE FROM products WHERE id = ?')->execute([$delId]);
        }
        header('Location: /admin/productos');
        exit;
    }

    if ($action === 'toggle_status') {
        $setId = sanitize_int($_POST['id'] ?? 0);
        $newStatus = $_POST['new_status'] ?? '';
        if ($setId > 0 && in_array($newStatus, ['active','inactive'])) {
            db()->prepare('UPDATE products SET status = ? WHERE id = ?')->execute([$newStatus, $setId]);
        }
        header('Location: /admin/productos');
        exit;
    }
}

$editId = isset($_GET['edit']) ? intval($_GET['edit']) : 0;
$isNew = isset($_GET['new']);
$product = null;
$categories = db()->query('SELECT id, name FROM categories WHERE is_active = 1 AND parent_id IS NOT NULL ORDER BY name')->fetchAll();
$parentCategories = db()->query('SELECT id, name FROM categories WHERE is_active = 1 AND parent_id IS NULL ORDER BY name')->fetchAll();
$productImages = [];

if ($editId > 0) {
    $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$editId]);
    $product = $stmt->fetch();
    if (!$product) {
        header('Location: /admin/productos');
        exit;
    }
    $imgStmt = db()->prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC');
    $imgStmt->execute([$editId]);
    $productImages = $imgStmt->fetchAll();
}

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;

if ($search !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM products WHERE name LIKE ? OR sku LIKE ?');
    $countStmt->execute(["%$search%", "%$search%"]);
    $total = $countStmt->fetchColumn();
    $stmt = db()->prepare('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.name LIKE ? OR p.sku LIKE ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute(["%$search%", "%$search%", $perPage, $offset]);
} else {
    $total = db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $stmt = db()->prepare('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute([$perPage, $offset]);
}
$products = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));
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
        .photo-upload-box { border: 2px dashed #374151; border-radius: 8px; padding: 20px; text-align: center; color: #6b7280; cursor: pointer; transition: border-color 0.2s; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
        .photo-upload-box:hover { border-color: #3b82f6; color: #9ca3af; }
        .photo-upload-box .crm-icon { width: 24px; height: 24px; }
        .photo-upload-form { background: #0f1629; border-radius: 8px; padding: 16px; margin-top: 12px; }
        .form-group textarea { width: 100%; padding: 10px 12px; background: #1f2937; border: 1px solid #374151; border-radius: 6px; color: #fff; font-size: 14px; box-sizing: border-box; resize: vertical; }
        .form-group textarea:focus { outline: none; border-color: #3b82f6; }
        .product-thumb { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; background: #1f2937; border: 1px solid #374151; }
        .product-thumb-placeholder { width: 48px; height: 48px; border-radius: 6px; background: #1f2937; border: 1px solid #374151; display: flex; align-items: center; justify-content: center; color: #6b7280; }
        .product-thumb-placeholder .crm-icon { width: 20px; height: 20px; }
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
                    <a href="/admin/productos?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo Producto</a>
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar por nombre o SKU..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="/admin/productos" class="btn-clear"><?php echo crm_icon('x'); ?></a>
                        <?php endif; ?>
                    </form>
                    <?php endif; ?>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($editId > 0 || $isNew): ?>
                <form method="POST" enctype="multipart/form-data">
                    <?php echo csrf_field(); ?>
                    <input type="hidden" name="action" value="save">
                    <?php if ($product): ?>
                    <input type="hidden" name="id" value="<?php echo intval($product['id']); ?>">
                    <?php endif; ?>

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
                                        <?php foreach ($parentCategories as $pc): ?>
                                        <optgroup label="<?php echo htmlspecialchars($pc['name']); ?>">
                                        <?php foreach ($categories as $c): ?>
                                        <?php
                                        $catParent = db()->prepare('SELECT parent_id FROM categories WHERE id = ?');
                                        $catParent->execute([$c['id']]);
                                        $cp = $catParent->fetchColumn();
                                        if ($cp == $pc['id']):
                                        ?>
                                        <option value="<?php echo intval($c['id']); ?>" <?php if (intval($product['category_id'] ?? 0) === intval($c['id'])) echo 'selected'; ?>><?php echo htmlspecialchars($c['name']); ?></option>
                                        <?php endif; ?>
                                        <?php endforeach; ?>
                                        </optgroup>
                                        <?php endforeach; ?>
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
                            <div class="form-grid form-grid-4">
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
                            <div class="form-grid form-grid-3">
                                <div class="form-group"><label>Stock</label><input type="number" name="stock" min="0" value="<?php echo intval($product['stock'] ?? 0); ?>"></div>
                                <div class="form-group"><label>Peso (kg)</label><input type="number" name="weight_kg" step="0.01" min="0" value="<?php echo htmlspecialchars($product['weight_kg'] ?? '0'); ?>"></div>
                                <div class="form-group"><label>Estado</label>
                                    <select name="status">
                                        <option value="active" <?php if (($product['status'] ?? 'active') === 'active') echo 'selected'; ?>>Activo</option>
                                        <option value="inactive" <?php if (($product['status'] ?? '') === 'inactive') echo 'selected'; ?>>Inactivo</option>
                                        <option value="draft" <?php if (($product['status'] ?? '') === 'draft') echo 'selected'; ?>>Borrador</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row" style="gap:24px;margin-top:12px">
                                <label class="checkbox-label"><input type="checkbox" name="is_featured" value="1" <?php if (!empty($product['is_featured'])) echo 'checked'; ?>> Destacado</label>
                                <label class="checkbox-label"><input type="checkbox" name="is_new" value="1" <?php if (!empty($product['is_new'])) echo 'checked'; ?>> Nuevo</label>
                                <label class="checkbox-label"><input type="checkbox" name="is_active" value="1" <?php if (isset($product['is_active']) ? $product['is_active'] : true) echo 'checked'; ?>> Activo en tienda</label>
                            </div>
                        </div>
                    </div>

                    <?php if ($editId > 0): ?>
                    <div class="crm-card">
                        <div class="crm-card-header">
                            <h2>Fotos del Producto (<?php echo count($productImages); ?>/9)</h2>
                        </div>
                        <div class="crm-card-body">
                            <div class="photo-grid">
                                <?php if (!empty($product['image'])): ?>
                                <div class="photo-item">
                                    <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="Principal">
                                    <span class="photo-badge">Principal</span>
                                </div>
                                <?php endif; ?>
                                <?php foreach ($productImages as $img): ?>
                                <div class="photo-item <?php echo $img['is_primary'] ? 'is-primary' : ''; ?>">
                                    <img src="<?php echo htmlspecialchars($img['url']); ?>" alt="<?php echo htmlspecialchars($img['alt_text']); ?>">
                                    <?php if ($img['is_primary']): ?><span class="photo-badge">Principal</span><?php endif; ?>
                                    <div class="photo-actions">
                                        <?php if (!$img['is_primary']): ?>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="set_primary">
                                            <input type="hidden" name="photo_id" value="<?php echo intval($img['id']); ?>">
                                            <input type="hidden" name="product_id" value="<?php echo intval($editId); ?>">
                                            <button type="submit" title="Hacer principal" style="background:#2563eb;color:#fff;">&#9733;</button>
                                        </form>
                                        <?php endif; ?>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete_photo">
                                            <input type="hidden" name="photo_id" value="<?php echo intval($img['id']); ?>">
                                            <input type="hidden" name="product_id" value="<?php echo intval($editId); ?>">
                                            <button type="submit" onclick="return confirm('Eliminar foto?')" style="background:#991b1b;color:#fca5a5;">&times;</button>
                                        </form>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                                <?php if (count($productImages) < 9): ?>
                                <div class="photo-upload-box" onclick="document.getElementById('photoUploadForm').style.display='block'">
                                    <?php echo crm_icon('plus'); ?>
                                    <span>Agregar Foto</span>
                                </div>
                                <?php endif; ?>
                            </div>

                            <?php if (count($productImages) < 9): ?>
                            <div class="photo-upload-form" id="photoUploadForm" style="display:none">
                                <h3 style="color:#fff;font-size:14px;margin-bottom:12px">Agregar Nueva Foto</h3>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label>Subir Archivo</label>
                                        <input type="file" name="photo_file" accept="image/*" style="color:#fff">
                                        <small style="color:#6b7280">JPG, PNG, WebP (max 5MB)</small>
                                    </div>
                                    <div class="form-group">
                                        <label>O URL de imagen</label>
                                        <input type="url" name="photo_url" placeholder="https://...">
                                    </div>
                                </div>
                                <div class="form-grid">
                                    <div class="form-group"><label>Texto Alt</label><input type="text" name="photo_alt" placeholder="Descripcion de la imagen"></div>
                                    <div class="form-group" style="display:flex;align-items:flex-end">
                                        <label class="checkbox-label"><input type="checkbox" name="is_primary"> Imagen Principal</label>
                                    </div>
                                </div>
                                <div style="margin-top:12px;display:flex;gap:8px">
                                    <button type="hidden" name="action" value="add_photo" style="display:none">
                                    <input type="hidden" name="action" value="add_photo">
                                    <input type="hidden" name="product_id" value="<?php echo intval($editId); ?>">
                                    <button type="submit" class="btn-primary"><?php echo crm_icon('plus'); ?> Agregar Foto</button>
                                    <button type="button" class="btn-secondary" onclick="document.getElementById('photoUploadForm').style.display='none'">Cancelar</button>
                                </div>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endif; ?>

                    <div class="crm-card">
                        <div class="crm-card-header"><h2>SEO</h2></div>
                        <div class="crm-card-body">
                            <div class="form-group"><label>Titulo SEO</label><input type="text" name="seo_title" value="<?php echo htmlspecialchars($product['seo_title'] ?? ''); ?>" maxlength="255" placeholder="Titulo para buscadores"></div>
                            <div class="form-group"><label>Descripcion SEO</label><textarea name="seo_description" rows="2" maxlength="500" placeholder="Descripcion para buscadores"><?php echo htmlspecialchars($product['seo_description'] ?? ''); ?></textarea></div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> <?php echo $product ? 'Guardar Cambios' : 'Crear Producto'; ?></button>
                        <a href="/admin/productos" class="btn-secondary">Cancelar</a>
                    </div>
                </form>

                <?php else: ?>
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
                                        <?php if (!empty($p['image'])): ?>
                                        <img src="<?php echo htmlspecialchars($p['image']); ?>" alt="" class="product-thumb" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                        <div class="product-thumb-placeholder" style="display:none"><?php echo crm_icon('box'); ?></div>
                                        <?php else: ?>
                                        <div class="product-thumb-placeholder"><?php echo crm_icon('box'); ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td><code><?php echo htmlspecialchars($p['sku']); ?></code></td>
                                    <td><?php echo htmlspecialchars($p['name']); ?></td>
                                    <td><?php echo htmlspecialchars($p['category_name'] ?? '-'); ?></td>
                                    <td>$<?php echo number_format($p['price_mxn'], 2); ?></td>
                                    <td><?php echo intval($p['stock']); ?></td>
                                    <td>
                                        <?php if (!empty($p['seo_title'])): ?>
                                        <span class="status-badge status-active">SEO</span>
                                        <?php else: ?>
                                        <span class="status-badge status-inactive">Sin SEO</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="toggle_status">
                                            <input type="hidden" name="id" value="<?php echo intval($p['id']); ?>">
                                            <input type="hidden" name="new_status" value="<?php echo $p['status'] === 'active' ? 'inactive' : 'active'; ?>">
                                            <button type="submit" class="status-badge <?php echo $p['status'] === 'active' ? 'status-active' : 'status-inactive'; ?>" style="border:none;cursor:pointer;">
                                                <?php echo $p['status'] === 'active' ? 'Activo' : 'Inactivo'; ?>
                                            </button>
                                        </form>
                                    </td>
                                    <td class="actions-cell">
                                        <a href="/admin/productos?edit=<?php echo intval($p['id']); ?>" class="btn-sm" title="Editar"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo intval($p['id']); ?>">
                                            <button type="submit" class="btn-sm btn-danger" onclick="return confirm('Eliminar este producto?')"><?php echo crm_icon('trash'); ?></button>
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
                        <?php if ($page > 1): ?>
                        <a href="/admin/productos?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="/admin/productos?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="/admin/productos?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>
