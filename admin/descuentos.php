<?php
define('CURRENT_PAGE', 'descuentos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$editing = null;
$editId = $_GET['edit'] ?? null;
if ($editId) {
    $stmt = db()->prepare('SELECT * FROM discount_codes WHERE id = ?');
    $stmt->execute([$editId]);
    $editing = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
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
    <title>Descuentos - Atlantic Optical International Limited Admin</title>
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
                <h1>Descuentos</h1>
                <div class="crm-header-actions">
                    <a href="/admin/descuentos?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo Codigo</a>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($msg): ?>
                <div class="alert alert-success"><?php echo $msg === 'created' ? 'Codigo creado' : ($msg === 'updated' ? 'Codigo actualizado' : 'Codigo eliminado'); ?></div>
                <?php endif; ?>

                <?php if ($editing || (isset($_GET['new']) && $_GET['new'])): ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $editing ? 'Editar Codigo' : 'Nuevo Codigo'; ?></h2></div>
                    <div class="crm-card-body">
                        <form method="POST">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Codigo</label>
                                    <input type="text" name="code" value="<?php echo htmlspecialchars($editing['code'] ?? ''); ?>" required style="text-transform:uppercase" placeholder="EJEMPLO20">
                                </div>
                                <div class="form-group">
                                    <label>Tipo</label>
                                    <select name="type">
                                        <option value="percentage" <?php echo ($editing['type'] ?? '') === 'percentage' ? 'selected' : ''; ?>>Porcentaje (%)</option>
                                        <option value="fixed" <?php echo ($editing['type'] ?? '') === 'fixed' ? 'selected' : ''; ?>>Monto Fijo (USD)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Valor</label>
                                    <input type="number" step="0.01" name="value" value="<?php echo $editing['value'] ?? ''; ?>" required placeholder="20">
                                </div>
                                <div class="form-group">
                                    <label>Minimo de orden (USD)</label>
                                    <input type="number" step="0.01" name="min_order_usd" value="<?php echo $editing['min_order_usd'] ?? '0'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Maximo de usos (0 = ilimitado)</label>
                                    <input type="number" name="max_uses" value="<?php echo $editing['max_uses'] ?? '0'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Aplica a</label>
                                    <select name="applies_to">
                                        <option value="all">Todos los productos</option>
                                        <option value="category" <?php echo ($editing['applies_to'] ?? '') === 'category' ? 'selected' : ''; ?>>Categoria</option>
                                        <option value="product" <?php echo ($editing['applies_to'] ?? '') === 'product' ? 'selected' : ''; ?>>Producto</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Fecha inicio</label>
                                    <input type="datetime-local" name="starts_at" value="<?php echo $editing['starts_at'] ? date('Y-m-d\TH:i', strtotime($editing['starts_at'])) : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Fecha fin</label>
                                    <input type="datetime-local" name="expires_at" value="<?php echo $editing['expires_at'] ? date('Y-m-d\TH:i', strtotime($editing['expires_at'])) : ''; ?>">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label"><input type="checkbox" name="is_active" value="1" <?php echo ($editing['is_active'] ?? 1) ? 'checked' : ''; ?>> Activo</label>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo $editing ? 'Actualizar' : 'Crear'; ?></button>
                                <a href="/admin/descuentos" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
                <?php endif; ?>

                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo count($codes); ?> codigo(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
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
                                <?php if (empty($codes)): ?>
                                <tr><td colspan="7" class="text-center text-muted">No hay codigos de descuento</td></tr>
                                <?php else: ?>
                                <?php foreach ($codes as $c): ?>
                                <tr>
                                    <td><code><?php echo htmlspecialchars($c['code']); ?></code></td>
                                    <td><?php echo $c['type'] === 'percentage' ? 'Porcentaje' : 'Fijo'; ?></td>
                                    <td><?php echo $c['type'] === 'percentage' ? $c['value'].'%' : '$'.$c['value'].' USD'; ?></td>
                                    <td>$<?php echo number_format($c['min_order_usd'], 2); ?></td>
                                    <td><?php echo $c['used_count']; ?><?php echo $c['max_uses'] > 0 ? ' / '.$c['max_uses'] : ' / &infin;'; ?></td>
                                    <td><?php echo $c['is_active'] ? '<span class="status-badge status-active">Activo</span>' : '<span class="status-badge status-inactive">Inactivo</span>'; ?></td>
                                    <td class="actions-cell">
                                        <a href="/admin/descuentos?edit=<?php echo $c['id']; ?>" class="btn-sm"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar este codigo?')">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $c['id']; ?>">
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
</body>
</html>
