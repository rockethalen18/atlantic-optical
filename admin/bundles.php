<?php
define('CURRENT_PAGE', 'bundles');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$editing = null;
$editId = $_GET['edit'] ?? null;
if ($editId) {
    $stmt = db()->prepare('SELECT * FROM bundles WHERE id = ?');
    $stmt->execute([$editId]);
    $editing = $stmt->fetch();
    if ($editing) {
        $itemStmt = db()->prepare('SELECT bi.*, p.name, p.sku FROM bundle_items bi LEFT JOIN products p ON bi.product_id = p.id WHERE bi.bundle_id = ?');
        $itemStmt->execute([$editId]);
        $editing['items'] = $itemStmt->fetchAll();
    }
}

$allProducts = db()->query('SELECT id, name, sku FROM products ORDER BY name')->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete') {
        $id = $_POST['id'] ?? 0;
        db()->prepare('DELETE FROM bundles WHERE id = ?')->execute([$id]);
        header('Location: /admin/bundles?msg=deleted');
        exit;
    }
    
    $name = trim($_POST['name'] ?? '');
    $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', strtolower($name)));
    $slug = trim($slug, '-');
    
    if ($editId) {
        $stmt = db()->prepare('UPDATE bundles SET name=?, slug=?, description=?, bundle_price_usd=?, image=?, is_active=?, sort_order=? WHERE id=?');
        $stmt->execute([
            $name, $slug,
            $_POST['description'] ?? null,
            floatval($_POST['bundle_price_usd'] ?? 0),
            $_POST['image'] ?? null,
            isset($_POST['is_active']) ? 1 : 0,
            intval($_POST['sort_order'] ?? 0),
            $editId
        ]);
        db()->prepare('DELETE FROM bundle_items WHERE bundle_id = ?')->execute([$editId]);
        $bundleId = $editId;
        header('Location: /admin/bundles?msg=updated');
    } else {
        $stmt = db()->prepare('INSERT INTO bundles (name, slug, description, bundle_price_usd, image, is_active, sort_order) VALUES (?,?,?,?,?,?,?)');
        $stmt->execute([
            $name, $slug,
            $_POST['description'] ?? null,
            floatval($_POST['bundle_price_usd'] ?? 0),
            $_POST['image'] ?? null,
            isset($_POST['is_active']) ? 1 : 0,
            intval($_POST['sort_order'] ?? 0)
        ]);
        $bundleId = db()->lastInsertId();
        header('Location: /admin/bundles?msg=created');
    }
    
    if (!empty($_POST['product_ids']) && is_array($_POST['product_ids'])) {
        $itemStmt = db()->prepare('INSERT INTO bundle_items (bundle_id, product_id, quantity) VALUES (?,?,?)');
        foreach ($_POST['product_ids'] as $idx => $pid) {
            if (!empty($pid)) {
                $qty = $_POST['product_qty'][$idx] ?? 1;
                $itemStmt->execute([$bundleId, $pid, intval($qty)]);
            }
        }
    }
    
    exit;
}

$bundles = db()->query('SELECT b.*, (SELECT COUNT(*) FROM bundle_items WHERE bundle_id = b.id) as item_count FROM bundles b ORDER BY b.sort_order, b.created_at DESC')->fetchAll();
$msg = $_GET['msg'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundles - Atlantic Optical International Limited</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.png">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
<div class="layout">
<?php require_once __DIR__ . '/includes/sidebar.php'; ?>
<main class="main-content">
<div class="page-header">
    <div>
        <h1 class="page-title">Bundles / Paquetes</h1>
        <p class="page-subtitle">Agrupa productos en paquetes con precio especial</p>
    </div>
    <a href="/admin/bundles?new=1" class="btn btn-primary">+ Nuevo Bundle</a>
</div>

<?php if ($msg): ?>
<div class="alert alert-success"><?= $msg === 'created' ? 'Bundle creado' : ($msg === 'updated' ? 'Bundle actualizado' : 'Bundle eliminado') ?></div>
<?php endif; ?>

<?php if ($editing || ($_GET['new'] ?? null)): ?>
<div class="card mb-6">
    <div class="card-header"><h2><?= $editing ? 'Editar Bundle' : 'Nuevo Bundle' ?></h2></div>
    <div class="card-body">
        <form method="POST">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="save">
            <div class="grid grid-2">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($editing['name'] ?? '') ?>" required>
                </div>
                <div class="form-group">
                    <label>Precio del Bundle (USD)</label>
                    <input type="number" step="0.01" name="bundle_price_usd" value="<?= $editing['bundle_price_usd'] ?? '' ?>" required>
                </div>
                <div class="form-group" style="grid-column:1/-1">
                    <label>Descripcion</label>
                    <textarea name="description" rows="3"><?= htmlspecialchars($editing['description'] ?? '') ?></textarea>
                </div>
                <div class="form-group">
                    <label>Imagen URL</label>
                    <input type="text" name="image" value="<?= htmlspecialchars($editing['image'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>Orden</label>
                    <input type="number" name="sort_order" value="<?= $editing['sort_order'] ?? '0' ?>">
                </div>
            </div>
            
            <div class="form-group">
                <label><input type="checkbox" name="is_active" value="1" <?= ($editing['is_active'] ?? 1) ? 'checked' : '' ?>> Activo</label>
            </div>
            
            <div class="form-group">
                <label>Productos en el bundle</label>
                <div id="bundle-items">
                    <?php if (!empty($editing['items'])): ?>
                        <?php foreach ($editing['items'] as $item): ?>
                        <div class="flex gap-2 mb-2 bundle-item-row">
                            <select name="product_ids[]" class="flex-1">
                                <option value="">Seleccionar producto...</option>
                                <?php foreach ($allProducts as $p): ?>
                                <option value="<?= $p['id'] ?>" <?= $p['id'] == $item['product_id'] ? 'selected' : '' ?>><?= htmlspecialchars($p['name']) ?> (<?= $p['sku'] ?>)</option>
                                <?php endforeach; ?>
                            </select>
                            <input type="number" name="product_qty[]" value="<?= $item['quantity'] ?>" min="1" style="width:80px" placeholder="Cant.">
                            <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.bundle-item-row').remove()">X</button>
                        </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="flex gap-2 mb-2 bundle-item-row">
                            <select name="product_ids[]" class="flex-1">
                                <option value="">Seleccionar producto...</option>
                                <?php foreach ($allProducts as $p): ?>
                                <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['name']) ?> (<?= $p['sku'] ?>)</option>
                                <?php endforeach; ?>
                            </select>
                            <input type="number" name="product_qty[]" value="1" min="1" style="width:80px" placeholder="Cant.">
                            <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.bundle-item-row').remove()">X</button>
                        </div>
                    <?php endif; ?>
                </div>
                <button type="button" class="btn btn-sm" onclick="addBundleItem()">+ Agregar producto</button>
            </div>
            
            <div class="flex gap-3">
                <button type="submit" class="btn btn-primary"><?= $editing ? 'Actualizar' : 'Crear' ?></button>
                <a href="/admin/bundles" class="btn btn-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
<?php endif; ?>

<div class="card">
    <div class="card-body" style="padding:0">
        <table class="table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Productos</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($bundles as $b): ?>
                <tr>
                    <td><strong><?= htmlspecialchars($b['name']) ?></strong></td>
                    <td>$<?= number_format($b['bundle_price_usd'], 2) ?> USD</td>
                    <td><?= $b['item_count'] ?> productos</td>
                    <td><?= $b['is_active'] ? '<span class="badge badge-green">Si</span>' : '<span class="badge badge-red">No</span>' ?></td>
                    <td>
                        <a href="/admin/bundles?edit=<?= $b['id'] ?>" class="btn btn-sm">Editar</a>
                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar?')">
                            <?= csrf_field() ?>
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="<?= $b['id'] ?>">
                            <button class="btn btn-sm btn-danger">Eliminar</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
</main>
</div>
<script src="/admin/assets/js/theme.js"></script>
<script>
var allProducts = <?= json_encode($allProducts) ?>;
function addBundleItem() {
    var html = '<div class="flex gap-2 mb-2 bundle-item-row"><select name="product_ids[]" class="flex-1"><option value="">Seleccionar producto...</option>';
    allProducts.forEach(function(p) { html += '<option value="'+p.id+'">'+p.name+' ('+p.sku+')</option>'; });
    html += '</select><input type="number" name="product_qty[]" value="1" min="1" style="width:80px" placeholder="Cant."><button type="button" class="btn btn-sm btn-danger" onclick="this.closest(\'.bundle-item-row\').remove()">X</button></div>';
    document.getElementById('bundle-items').insertAdjacentHTML('beforeend', html);
}
</script>
</body>
</html>
