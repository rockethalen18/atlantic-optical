<?php
define('CURRENT_PAGE', 'costos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$shippingRates = db()->query('SELECT * FROM shipping_rates ORDER BY cost_per_kg ASC')->fetchAll();
$exchangeRates = db()->query('SELECT * FROM exchange_rates ORDER BY id DESC LIMIT 10')->fetchAll();
$latestRate = db()->query('SELECT usd_to_mxn FROM exchange_rates ORDER BY id DESC LIMIT 1')->fetchColumn();
$exchangeRate = $latestRate ?: 56.00;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $type = $_POST['type'] ?? '';

    if ($type === 'exchange_rate') {
        $rate = sanitize_float($_POST['rate'] ?? 0);
        if ($rate > 0) {
            $stmt = db()->prepare('INSERT INTO exchange_rates (usd_to_mxn, usd_mxn, source) VALUES (?, ?, ?)');
            $stmt->execute([$rate, $rate, 'admin']);
        }
    }

    if ($type === 'shipping_rate') {
        $method = trim($_POST['method'] ?? '');
        $methodLabel = trim($_POST['method_label'] ?? '');
        $costKg = sanitize_float($_POST['cost_per_kg'] ?? 0);
        $desc = trim($_POST['description'] ?? '');
        $minDays = sanitize_int($_POST['min_days'] ?? 0);
        $maxDays = sanitize_int($_POST['max_days'] ?? 0);
        if ($method !== '' && $costKg > 0) {
            $stmt = db()->prepare('INSERT INTO shipping_rates (method, method_label, cost_per_kg, description, min_days, max_days, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)');
            $stmt->execute([$method, $methodLabel ?: $method, $costKg, $desc, $minDays, $maxDays]);
        }
    }

    if ($type === 'delete') {
        $delId = sanitize_int($_POST['id'] ?? 0);
        $delType = $_POST['delt'] ?? '';
        $table = $delType === 'shipping' ? 'shipping_rates' : ($delType === 'exchange' ? 'exchange_rates' : null);
        $allowedTables = ['shipping_rates', 'exchange_rates'];
        if ($delId > 0 && $table && in_array($table, $allowedTables)) {
            $stmt = db()->prepare("DELETE FROM `$table` WHERE id = ?");
            $stmt->execute([$delId]);
        }
    }
    header('Location: /admin/costos');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Costos - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header"><h1>Costos y Tarifas</h1></header>
            <div class="crm-content">
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo crm_icon('globe'); ?> Tipo de Cambio (USD/MXN)</h2></div>
                    <div class="crm-card-body">
                        <form method="POST" class="inline-form">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="type" value="exchange_rate">
                            <div class="form-row">
                                <div class="form-group"><label>1 USD =</label><input type="number" name="rate" step="0.01" min="0" value="<?php echo htmlspecialchars($exchangeRate); ?>" required></div>
                                <div class="form-group"><button type="submit" class="btn-primary"><?php echo crm_icon('plus'); ?> Guardar</button></div>
                            </div>
                        </form>
                    </div>
                    <?php if (!empty($exchangeRates)): ?>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>USD to MXN</th><th>Fuente</th><th>Fecha</th><th></th></tr></thead>
                            <tbody>
                                <?php foreach ($exchangeRates as $er): ?>
                                <tr>
                                    <td><strong><?php echo number_format($er['usd_to_mxn'], 4); ?></strong></td>
                                    <td><?php echo htmlspecialchars($er['source'] ?? '-'); ?></td>
                                    <td><?php echo isset($er['updated_at']) ? date('d/m/Y H:i', strtotime($er['updated_at'])) : '-'; ?></td>
                                    <td>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="type" value="delete">
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
                    <?php endif; ?>
                </div>

                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo crm_icon('truck'); ?> Tarifas de Envio</h2></div>
                    <div class="crm-card-body">
                        <form method="POST" class="inline-form">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="type" value="shipping_rate">
                            <div class="form-row form-row-4">
                                <div class="form-group"><label>Metodo</label><input type="text" name="method" placeholder="ej: standard" required maxlength="100"></div>
                                <div class="form-group"><label>Nombre</label><input type="text" name="method_label" placeholder="Envio Estandar" maxlength="100"></div>
                                <div class="form-group"><label>Costo/kg ($)</label><input type="number" name="cost_per_kg" step="0.01" min="0" required></div>
                                <div class="form-group"><label>Dias Min</label><input type="number" name="min_days" value="3"></div>
                            </div>
                            <div class="form-row form-row-4">
                                <div class="form-group"><label>Dias Max</label><input type="number" name="max_days" value="7"></div>
                                <div class="form-group" style="flex:2"><label>Descripcion</label><input type="text" name="description" placeholder="Descripcion del envio" maxlength="255"></div>
                            </div>
                            <button type="submit" class="btn-primary"><?php echo crm_icon('plus'); ?> Agregar</button>
                        </form>
                    </div>
                    <?php if (!empty($shippingRates)): ?>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>Metodo</th><th>Costo/kg</th><th>Dias</th><th>Activo</th><th></th></tr></thead>
                            <tbody>
                                <?php foreach ($shippingRates as $sr): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($sr['method_label'] ?: $sr['method']); ?></td>
                                    <td><strong>$<?php echo number_format($sr['cost_per_kg'], 2); ?></strong>/kg</td>
                                    <td><?php echo intval($sr['min_days']); ?>-<?php echo intval($sr['max_days']); ?> dias</td>
                                    <td><?php echo $sr['is_active'] ? 'Si' : 'No'; ?></td>
                                    <td>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="type" value="delete">
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
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
