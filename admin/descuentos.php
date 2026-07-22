<?php
require_once __DIR__ . '/includes/security.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/sidebar.php';

init_session();
require_login();
CURRENT_PAGE = 'descuentos';

$editing = null;
$editId = $_GET['edit'] ?? null;
if ($editId) {
    $stmt = db()->prepare('SELECT * FROM discount_codes WHERE id = ?');
    $stmt->execute([$editId]);
    $editing = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete') {
        $id = $_POST['id'] ?? 0;
        db()->prepare('DELETE FROM discount_codes WHERE id = ?')->execute([$id]);
        header('Location: /admin/descuentos?msg=deleted');
        exit;
    }
    
    $code = strtoupper(trim($_POST['code'] ?? ''));
    $type = $_POST['type'] ?? 'percentage';
    $value = floatval($_POST['value'] ?? 0);
    $min_order = floatval($_POST['min_order_usd'] ?? 0);
    $max_uses = intval($_POST['max_uses'] ?? 0);
    $applies_to = $_POST['applies_to'] ?? 'all';
    $applies_to_id = $_POST['applies_to_id'] ?: null;
    $starts_at = $_POST['starts_at'] ?: null;
    $expires_at = $_POST['expires_at'] ?: null;
    $is_active = isset($_POST['is_active']) ? 1 : 0;
    
    if ($editId) {
        $stmt = db()->prepare('UPDATE discount_codes SET code=?, type=?, value=?, min_order_usd=?, max_uses=?, applies_to=?, applies_to_id=?, starts_at=?, expires_at=?, is_active=? WHERE id=?');
        $stmt->execute([$code, $type, $value, $min_order, $max_uses, $applies_to, $applies_to_id, $starts_at, $expires_at, $is_active, $editId]);
        header('Location: /admin/descuentos?msg=updated');
    } else {
        $stmt = db()->prepare('INSERT INTO discount_codes (code, type, value, min_order_usd, max_uses, applies_to, applies_to_id, starts_at, expires_at, is_active) VALUES (?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$code, $type, $value, $min_order, $max_uses, $applies_to, $applies_to_id, $starts_at, $expires_at, $is_active]);
        header('Location: /admin/descuentos?msg=created');
    }
    exit;
}

$codes = db()->query('SELECT * FROM discount_codes ORDER BY created_at DESC')->fetchAll();
$msg = $_GET['msg'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Descuentos - Atlantic Optical International Limited</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.png">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
<?php include __DIR__ . '/includes/header.php'; ?>
<div class="layout">
<?php include __DIR__ . '/includes/sidebar.php'; ?>
<main class="main-content">
<div class="page-header">
    <div>
        <h1 class="page-title">Codigos de Descuento</h1>
        <p class="page-subtitle">Gestiona descuentos fijos y por tiempo determinado</p>
    </div>
    <a href="/admin/descuentos?new=1" class="btn btn-primary">+ Nuevo Codigo</a>
</div>

<?php if ($msg): ?>
<div class="alert alert-success"><?= $msg === 'created' ? 'Codigo creado' : ($msg === 'updated' ? 'Codigo actualizado' : 'Codigo eliminado') ?></div>
<?php endif; ?>

<?php if ($editing || ($_GET['new'] ?? null)): ?>
<div class="card mb-6">
    <div class="card-header"><h2><?= $editing ? 'Editar Codigo' : 'Nuevo Codigo' ?></h2></div>
    <div class="card-body">
        <form method="POST">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="save">
            <div class="grid grid-2">
                <div class="form-group">
                    <label>Codigo</label>
                    <input type="text" name="code" value="<?= htmlspecialchars($editing['code'] ?? '') ?>" required style="text-transform:uppercase" placeholder="EJEMPLO20">
                </div>
                <div class="form-group">
                    <label>Tipo</label>
                    <select name="type">
                        <option value="percentage" <?= ($editing['type'] ?? '') === 'percentage' ? 'selected' : '' ?>>Porcentaje (%)</option>
                        <option value="fixed" <?= ($editing['type'] ?? '') === 'fixed' ? 'selected' : '' ?>>Monto Fijo (USD)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Valor</label>
                    <input type="number" step="0.01" name="value" value="<?= $editing['value'] ?? '' ?>" required placeholder="20">
                </div>
                <div class="form-group">
                    <label>Minimo de orden (USD)</label>
                    <input type="number" step="0.01" name="min_order_usd" value="<?= $editing['min_order_usd'] ?? '0' ?>">
                </div>
                <div class="form-group">
                    <label>Maximo de usos (0 = ilimitado)</label>
                    <input type="number" name="max_uses" value="<?= $editing['max_uses'] ?? '0' ?>">
                </div>
                <div class="form-group">
                    <label>Aplica a</label>
                    <select name="applies_to">
                        <option value="all">Todos los productos</option>
                        <option value="category" <?= ($editing['applies_to'] ?? '') === 'category' ? 'selected' : '' ?>>Categoria</option>
                        <option value="product" <?= ($editing['applies_to'] ?? '') === 'product' ? 'selected' : '' ?>>Producto</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Fecha inicio</label>
                    <input type="datetime-local" name="starts_at" value="<?= $editing['starts_at'] ? date('Y-m-d\TH:i', strtotime($editing['starts_at'])) : '' ?>">
                </div>
                <div class="form-group">
                    <label>Fecha fin</label>
                    <input type="datetime-local" name="expires_at" value="<?= $editing['expires_at'] ? date('Y-m-d\TH:i', strtotime($editing['expires_at'])) : '' ?>">
                </div>
            </div>
            <div class="form-group">
                <label><input type="checkbox" name="is_active" value="1" <?= ($editing['is_active'] ?? 1) ? 'checked' : '' ?>> Activo</label>
            </div>
            <div class="flex gap-3">
                <button type="submit" class="btn btn-primary"><?= $editing ? 'Actualizar' : 'Crear' ?></button>
                <a href="/admin/descuentos" class="btn btn-secondary">Cancelar</a>
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
                    <th>Codigo</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Min. Orden</th>
                    <th>Usos</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($codes as $c): ?>
                <tr>
                    <td><strong><?= htmlspecialchars($c['code']) ?></strong></td>
                    <td><?= $c['type'] === 'percentage' ? 'Porcentaje' : 'Fijo' ?></td>
                    <td><?= $c['type'] === 'percentage' ? $c['value'].'%' : '$'.$c['value'].' USD' ?></td>
                    <td>$<?= number_format($c['min_order_usd'], 2) ?></td>
                    <td><?= $c['used_count'] ?><?= $c['max_uses'] > 0 ? ' / '.$c['max_uses'] : ' / &infin;' ?></td>
                    <td><?= $c['is_active'] ? '<span class="badge badge-green">Si</span>' : '<span class="badge badge-red">No</span>' ?></td>
                    <td>
                        <a href="/admin/descuentos?edit=<?= $c['id'] ?>" class="btn btn-sm">Editar</a>
                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar?')">
                            <?= csrf_field() ?>
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="<?= $c['id'] ?>">
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
</body>
</html>
