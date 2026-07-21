<?php
define('CURRENT_PAGE', 'costos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'save_exchange') {
        $id = sanitize_int($_POST['id'] ?? 0);
        $rate = sanitize_float($_POST['usd_to_mxn'] ?? 0);
        $source = trim($_POST['source'] ?? 'admin');
        if ($rate > 0) {
            if ($id > 0) {
                db()->prepare('UPDATE exchange_rates SET usd_to_mxn=?, usd_mxn=?, source=? WHERE id=?')
                    ->execute([$rate, $rate, $source, $id]);
            } else {
                db()->prepare('INSERT INTO exchange_rates (usd_to_mxn, usd_mxn, source) VALUES (?,?,?)')
                    ->execute([$rate, $rate, $source]);
            }
        }
        header('Location: /admin/costos');
        exit;
    }

    if ($action === 'save_shipping') {
        $id = sanitize_int($_POST['id'] ?? 0);
        $method = trim($_POST['method'] ?? '');
        $methodLabel = trim($_POST['method_label'] ?? '');
        $costKg = sanitize_float($_POST['cost_per_kg'] ?? 0);
        $desc = trim($_POST['description'] ?? '');
        $minDays = sanitize_int($_POST['min_days'] ?? 0);
        $maxDays = sanitize_int($_POST['max_days'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        if ($method !== '' && $costKg > 0) {
            if ($id > 0) {
                db()->prepare('UPDATE shipping_rates SET method=?, method_label=?, cost_per_kg=?, description=?, min_days=?, max_days=?, is_active=? WHERE id=?')
                    ->execute([$method, $methodLabel ?: $method, $costKg, $desc, $minDays, $maxDays, $isActive, $id]);
            } else {
                db()->prepare('INSERT INTO shipping_rates (method, method_label, cost_per_kg, description, min_days, max_days, is_active) VALUES (?,?,?,?,?,?,?)')
                    ->execute([$method, $methodLabel ?: $method, $costKg, $desc, $minDays, $maxDays, $isActive]);
            }
        }
        header('Location: /admin/costos');
        exit;
    }

    if ($action === 'delete') {
        $delId = sanitize_int($_POST['id'] ?? 0);
        $delType = $_POST['delt'] ?? '';
        $table = $delType === 'shipping' ? 'shipping_rates' : ($delType === 'exchange' ? 'exchange_rates' : null);
        $allowedTables = ['shipping_rates', 'exchange_rates'];
        if ($delId > 0 && $table && in_array($table, $allowedTables)) {
            db()->prepare("DELETE FROM `$table` WHERE id = ?")->execute([$delId]);
        }
        header('Location: /admin/costos');
        exit;
    }
}

$editExchangeId = isset($_GET['edit_exchange']) ? intval($_GET['edit_exchange']) : 0;
$editShippingId = isset($_GET['edit_shipping']) ? intval($_GET['edit_shipping']) : 0;
$newExchange = isset($_GET['new_exchange']);
$newShipping = isset($_GET['new_shipping']);
$editExchange = null;
$editShipping = null;

if ($editExchangeId > 0) {
    $editExchange = db()->prepare('SELECT * FROM exchange_rates WHERE id = ?');
    $editExchange->execute([$editExchangeId]);
    $editExchange = $editExchange->fetch();
    if (!$editExchange) { header('Location: /admin/costos'); exit; }
}
if ($editShippingId > 0) {
    $editShipping = db()->prepare('SELECT * FROM shipping_rates WHERE id = ?');
    $editShipping->execute([$editShippingId]);
    $editShipping = $editShipping->fetch();
    if (!$editShipping) { header('Location: /admin/costos'); exit; }
}

$shippingRates = db()->query('SELECT * FROM shipping_rates ORDER BY cost_per_kg ASC')->fetchAll();
$exchangeRates = db()->query('SELECT * FROM exchange_rates ORDER BY id DESC LIMIT 10')->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Costos - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1><?php echo ($editExchangeId > 0 || $newExchange) ? 'Editar Tipo de Cambio' : (($editShippingId > 0 || $newShipping) ? 'Editar Tarifa de Envio' : 'Costos y Tarifas'); ?></h1>
                <div class="crm-header-actions">
                    <?php if ($editExchangeId > 0 || $newExchange || $editShippingId > 0 || $newShipping): ?>
                    <a href="/admin/costos" class="btn-secondary"><?php echo crm_icon('refresh'); ?> Cancelar</a>
                    <?php endif; ?>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($editExchangeId > 0 || $newExchange): ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo crm_icon('globe'); ?> <?php echo $editExchange ? 'Editar Tipo de Cambio' : 'Nuevo Tipo de Cambio'; ?></h2></div>
                    <div class="crm-card-body">
                        <form method="POST">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save_exchange">
                            <?php if ($editExchange): ?>
                            <input type="hidden" name="id" value="<?php echo intval($editExchange['id']); ?>">
                            <?php endif; ?>
                            <div class="form-grid form-grid-3">
                                <div class="form-group"><label>1 USD = (MXN) *</label><input type="number" name="usd_to_mxn" step="0.0001" min="0" value="<?php echo htmlspecialchars($editExchange['usd_to_mxn'] ?? '56.00'); ?>" required></div>
                                <div class="form-group"><label>Fuente</label><input type="text" name="source" value="<?php echo htmlspecialchars($editExchange['source'] ?? 'admin'); ?>" placeholder="admin, api, etc."></div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> <?php echo $editExchange ? 'Guardar' : 'Crear'; ?></button>
                                <a href="/admin/costos" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>

                <?php elseif ($editShippingId > 0 || $newShipping): ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo crm_icon('truck'); ?> <?php echo $editShipping ? 'Editar Tarifa de Envio' : 'Nueva Tarifa de Envio'; ?></h2></div>
                    <div class="crm-card-body">
                        <form method="POST">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save_shipping">
                            <?php if ($editShipping): ?>
                            <input type="hidden" name="id" value="<?php echo intval($editShipping['id']); ?>">
                            <?php endif; ?>
                            <div class="form-grid">
                                <div class="form-group"><label>Metodo *</label><input type="text" name="method" value="<?php echo htmlspecialchars($editShipping['method'] ?? ''); ?>" required placeholder="ej: standard, express"></div>
                                <div class="form-group"><label>Nombre</label><input type="text" name="method_label" value="<?php echo htmlspecialchars($editShipping['method_label'] ?? ''); ?>" placeholder="Envio Estandar"></div>
                            </div>
                            <div class="form-grid form-grid-3">
                                <div class="form-group"><label>Costo por kg (USD) *</label><input type="number" name="cost_per_kg" step="0.01" min="0" value="<?php echo htmlspecialchars($editShipping['cost_per_kg'] ?? '0'); ?>" required></div>
                                <div class="form-group"><label>Dias Min</label><input type="number" name="min_days" min="0" value="<?php echo intval($editShipping['min_days'] ?? 3); ?>"></div>
                                <div class="form-group"><label>Dias Max</label><input type="number" name="max_days" min="0" value="<?php echo intval($editShipping['max_days'] ?? 7); ?>"></div>
                            </div>
                            <div class="form-group"><label>Descripcion</label><input type="text" name="description" value="<?php echo htmlspecialchars($editShipping['description'] ?? ''); ?>"></div>
                            <label class="checkbox-label" style="margin:12px 0">
                                <input type="checkbox" name="is_active" value="1" <?php if ($editShipping ? $editShipping['is_active'] : true) echo 'checked'; ?>> Activo
                            </label>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> <?php echo $editShipping ? 'Guardar' : 'Crear'; ?></button>
                                <a href="/admin/costos" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>

                <?php else: ?>
                <div class="crm-card">
                    <div class="crm-card-header">
                        <h2><?php echo crm_icon('truck'); ?> Tarifas de Envio</h2>
                        <a href="/admin/costos?new_shipping=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nueva</a>
                    </div>
                    <?php if (!empty($shippingRates)): ?>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>Metodo</th><th>Costo/kg</th><th>Dias</th><th>Activo</th><th>Acciones</th></tr></thead>
                            <tbody>
                                <?php foreach ($shippingRates as $sr): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($sr['method_label'] ?: $sr['method']); ?></td>
                                    <td><strong>$<?php echo number_format($sr['cost_per_kg'], 2); ?></strong>/kg</td>
                                    <td><?php echo intval($sr['min_days']); ?>-<?php echo intval($sr['max_days']); ?> dias</td>
                                    <td>
                                        <span class="status-badge <?php echo $sr['is_active'] ? 'status-active' : 'status-inactive'; ?>">
                                            <?php echo $sr['is_active'] ? 'Si' : 'No'; ?>
                                        </span>
                                    </td>
                                    <td class="actions-cell">
                                        <a href="/admin/costos?edit_shipping=<?php echo intval($sr['id']); ?>" class="btn-sm" title="Editar"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo intval($sr['id']); ?>">
                                            <input type="hidden" name="delt" value="shipping">
                                            <button type="submit" class="btn-sm btn-danger" onclick="return confirm('Eliminar?')"><?php echo crm_icon('trash'); ?></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php else: ?>
                    <div class="crm-card-body text-center text-muted">No hay tarifas de envio registradas</div>
                    <?php endif; ?>
                </div>

                <div class="crm-card">
                    <div class="crm-card-header">
                        <h2><?php echo crm_icon('globe'); ?> Tipo de Cambio (USD/MXN)</h2>
                        <a href="/admin/costos?new_exchange=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo</a>
                    </div>
                    <?php if (!empty($exchangeRates)): ?>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>USD to MXN</th><th>Fuente</th><th>Fecha</th><th>Acciones</th></tr></thead>
                            <tbody>
                                <?php foreach ($exchangeRates as $er): ?>
                                <tr>
                                    <td><strong><?php echo number_format($er['usd_to_mxn'], 4); ?></strong></td>
                                    <td><?php echo htmlspecialchars($er['source'] ?? '-'); ?></td>
                                    <td><?php echo isset($er['updated_at']) ? date('d/m/Y H:i', strtotime($er['updated_at'])) : '-'; ?></td>
                                    <td class="actions-cell">
                                        <a href="/admin/costos?edit_exchange=<?php echo intval($er['id']); ?>" class="btn-sm" title="Editar"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo intval($er['id']); ?>">
                                            <input type="hidden" name="delt" value="exchange">
                                            <button type="submit" class="btn-sm btn-danger" onclick="return confirm('Eliminar?')"><?php echo crm_icon('trash'); ?></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php else: ?>
                    <div class="crm-card-body text-center text-muted">No hay tipos de cambio registrados</div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>
