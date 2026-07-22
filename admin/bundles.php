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
        $id = intval($_POST['id'] ?? 0);
        db()->prepare('DELETE FROM bundle_items WHERE bundle_id = ?')->execute([$id]);
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
        $msgType = 'updated';
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
        $msgType = 'created';
    }
    
    if (!empty($_POST['product_ids']) && is_array($_POST['product_ids'])) {
        $itemStmt = db()->prepare('INSERT INTO bundle_items (bundle_id, product_id, quantity) VALUES (?,?,?)');
        foreach ($_POST['product_ids'] as $idx => $pid) {
            if (!empty($pid)) {
                $qty = intval($_POST['product_qty'][$idx] ?? 1);
                $itemStmt->execute([$bundleId, $pid, $qty]);
            }
        }
    }
    
    header('Location: /admin/bundles?msg=' . $msgType);
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
    <title>Bundles - Atlantic Optical International Limited Admin</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.png">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1>Bundles</h1>
                <div class="crm-header-actions">
                    <a href="/admin/bundles?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo Bundle</a>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($msg): ?>
                <div class="alert alert-success"><?php echo $msg === 'created' ? 'Bundle creado' : ($msg === 'updated' ? 'Bundle actualizado' : 'Bundle eliminado'); ?></div>
                <?php endif; ?>

                <?php if ($editing || (isset($_GET['new']) && $_GET['new'])): ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $editing ? 'Editar Bundle' : 'Nuevo Bundle'; ?></h2></div>
                    <div class="crm-card-body">
                        <form method="POST" id="bundleForm">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Nombre</label>
                                    <input type="text" name="name" value="<?php echo htmlspecialchars($editing['name'] ?? ''); ?>" required>
                                </div>
                                <div class="form-group">
                                    <label>Precio del Bundle (USD)</label>
                                    <input type="number" step="0.01" name="bundle_price_usd" value="<?php echo $editing['bundle_price_usd'] ?? ''; ?>" required>
                                </div>
                                <div class="form-group" style="grid-column:1/-1">
                                    <label>Descripcion</label>
                                    <textarea name="description" rows="3"><?php echo htmlspecialchars($editing['description'] ?? ''); ?></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Imagen URL</label>
                                    <input type="text" name="image" value="<?php echo htmlspecialchars($editing['image'] ?? ''); ?>">
                                </div>
                                <div class="form-group">
                                    <label>Orden</label>
                                    <input type="number" name="sort_order" value="<?php echo $editing['sort_order'] ?? '0'; ?>">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label"><input type="checkbox" name="is_active" value="1" <?php echo ($editing['is_active'] ?? 1) ? 'checked' : ''; ?>> Activo</label>
                            </div>
                            <div class="form-section-title">Productos en el bundle</div>
                            <div id="bundle-items">
                                <?php if (!empty($editing['items'])): ?>
                                    <?php foreach ($editing['items'] as $item): ?>
                                    <div class="form-row" style="margin-bottom:8px">
                                        <div class="form-group" style="flex:1">
                                            <select name="product_ids[]" style="width:100%">
                                                <option value="">Seleccionar producto...</option>
                                                <?php foreach ($allProducts as $p): ?>
                                                <option value="<?php echo $p['id']; ?>" <?php echo $p['id'] == $item['product_id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($p['name']); ?> (<?php echo $p['sku']; ?>)</option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>
                                        <div class="form-group" style="width:80px">
                                            <input type="number" name="product_qty[]" value="<?php echo $item['quantity']; ?>" min="1" placeholder="Cant.">
                                        </div>
                                        <button type="button" class="btn-sm btn-danger" onclick="this.closest('.form-row').remove()" style="height:32px;width:32px"><?php echo crm_icon('x'); ?></button>
                                    </div>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <div class="form-row" style="margin-bottom:8px">
                                        <div class="form-group" style="flex:1">
                                            <select name="product_ids[]" style="width:100%">
                                                <option value="">Seleccionar producto...</option>
                                                <?php foreach ($allProducts as $p): ?>
                                                <option value="<?php echo $p['id']; ?>"><?php echo htmlspecialchars($p['name']); ?> (<?php echo $p['sku']; ?>)</option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>
                                        <div class="form-group" style="width:80px">
                                            <input type="number" name="product_qty[]" value="1" min="1" placeholder="Cant.">
                                        </div>
                                        <button type="button" class="btn-sm btn-danger" onclick="this.closest('.form-row').remove()" style="height:32px;width:32px"><?php echo crm_icon('x'); ?></button>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div style="margin:12px 0">
                                <button type="button" class="btn-secondary" onclick="addBundleItem()"><?php echo crm_icon('plus'); ?> Agregar producto</button>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo $editing ? 'Actualizar' : 'Crear'; ?></button>
                                <a href="/admin/bundles" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
                <?php endif; ?>

                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo count($bundles); ?> bundle(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
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
                                <?php if (empty($bundles)): ?>
                                <tr><td colspan="5" class="text-center text-muted">No hay bundles</td></tr>
                                <?php else: ?>
                                <?php foreach ($bundles as $b): ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($b['name']); ?></strong></td>
                                    <td>$<?php echo number_format($b['bundle_price_usd'], 2); ?> USD</td>
                                    <td><?php echo $b['item_count']; ?> producto(s)</td>
                                    <td><?php echo $b['is_active'] ? '<span class="status-badge status-active">Activo</span>' : '<span class="status-badge status-inactive">Inactivo</span>'; ?></td>
                                    <td class="actions-cell">
                                        <a href="/admin/bundles?edit=<?php echo $b['id']; ?>" class="btn-sm"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar este bundle?')">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $b['id']; ?>">
                                            <button class="btn-sm btn-danger"><?php echo crm_icon('trash-2'); ?></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script>
    var allProducts = <?php echo json_encode($allProducts); ?>;
    function addBundleItem() {
        var html = '<div class="form-row" style="margin-bottom:8px"><div class="form-group" style="flex:1"><select name="product_ids[]" style="width:100%"><option value="">Seleccionar producto...</option>';
        allProducts.forEach(function(p) { html += '<option value="'+p.id+'">'+p.name+' ('+p.sku+')</option>'; });
        html += '</select></div><div class="form-group" style="width:80px"><input type="number" name="product_qty[]" value="1" min="1" placeholder="Cant."></div><button type="button" class="btn-sm btn-danger" onclick="this.closest(\'.form-row\').remove()" style="height:32px;width:32px"><?php echo crm_icon("x"); ?></button></div>';
        document.getElementById('bundle-items').insertAdjacentHTML('beforeend', html);
    }
    </script>
</body>
</html>
