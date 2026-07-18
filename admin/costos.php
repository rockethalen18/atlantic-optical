<?php
define('CURRENT_PAGE', 'costos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$shippingRates = db()->query('SELECT * FROM shipping_rates ORDER BY min_weight ASC')->fetchAll();
$exchangeRates = db()->query('SELECT * FROM exchange_rates ORDER BY id DESC LIMIT 10')->fetchAll();
$exchangeRate = db()->query('SELECT rate FROM exchange_rates ORDER BY id DESC LIMIT 1')->fetchColumn() ?: 1.00;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $type = $_POST['type'] ?? '';

    if ($type === 'exchange_rate') {
        $rate = sanitize_float($_POST['rate'] ?? 0);
        if ($rate > 0) {
            $stmt = db()->prepare('INSERT INTO exchange_rates (currency_from, currency_to, rate) VALUES (?, ?, ?)');
            $stmt->execute(['USD', 'DOP', $rate]);
        }
    }

    if ($type === 'shipping_rate') {
        $zone = trim($_POST['zone_name'] ?? '');
        $minW = sanitize_float($_POST['min_weight'] ?? 0);
        $maxW = sanitize_float($_POST['max_weight'] ?? 0);
        $price = sanitize_float($_POST['price'] ?? 0);
        if ($zone !== '' && $price > 0) {
            $stmt = db()->prepare('INSERT INTO shipping_rates (zone_name, min_weight, max_weight, price) VALUES (?, ?, ?, ?)');
            $stmt->execute([$zone, $minW, $maxW, $price]);
        }
    }

    if ($type === 'delete') {
        $delId = sanitize_int($_POST['id'] ?? 0);
        $delType = $_POST['delt'] ?? '';
        $allowedTables = ['shipping_rates', 'exchange_rates'];
        $table = $delType === 'shipping' ? 'shipping_rates' : ($delType === 'exchange' ? 'exchange_rates' : null);
        if ($delId > 0 && $table && in_array($table, $allowedTables)) {
            $stmt = db()->prepare("DELETE FROM $table WHERE id = ?");
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
                    <div class="crm-card-header"><h2><?php echo crm_icon('globe'); ?> Tipo de Cambio (USD/DOP)</h2></div>
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
                            <thead><tr><th>De</th><th>A</th><th>Rate</th><th>Fecha</th><th></th></tr></thead>
                            <tbody>
                                <?php foreach ($exchangeRates as $er): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($er['currency_from']); ?></td>
                                    <td><?php echo htmlspecialchars($er['currency_to']); ?></td>
                                    <td><strong><?php echo number_format($er['rate'], 4); ?></strong></td>
                                    <td><?php echo isset($er['created_at']) ? date('d/m/Y H:i', strtotime($er['created_at'])) : '-'; ?></td>
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
                                <div class="form-group"><label>Zona</label><input type="text" name="zone_name" placeholder="ej: Santo Domingo" required maxlength="100"></div>
                                <div class="form-group"><label>Peso Min (kg)</label><input type="number" name="min_weight" step="0.01" value="0"></div>
                                <div class="form-group"><label>Peso Max (kg)</label><input type="number" name="max_weight" step="0.01" value="50"></div>
                                <div class="form-group"><label>Precio ($)</label><input type="number" name="price" step="0.01" min="0" required></div>
                            </div>
                            <button type="submit" class="btn-primary"><?php echo crm_icon('plus'); ?> Agregar</button>
                        </form>
                    </div>
                    <?php if (!empty($shippingRates)): ?>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>Zona</th><th>Peso Min</th><th>Peso Max</th><th>Precio</th><th></th></tr></thead>
                            <tbody>
                                <?php foreach ($shippingRates as $sr): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($sr['zone_name']); ?></td>
                                    <td><?php echo $sr['min_weight']; ?> kg</td>
                                    <td><?php echo $sr['max_weight']; ?> kg</td>
                                    <td><strong>$<?php echo number_format($sr['price'], 2); ?></strong></td>
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
