<?php
define('CURRENT_PAGE', 'divisas');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_once __DIR__ . '/includes/exchange.php';
require_login();
security_headers();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'refresh') {
        $apiUrl = 'https://api.frankfurter.app/latest?from=USD&to=MXN,COP,CNY,EUR';
        $response = @file_get_contents($apiUrl);
        $saved = 0;

        if ($response) {
            $data = json_decode($response, true);
            if (isset($data['rates'])) {
                foreach ($data['rates'] as $cur => $rate) {
                    $rate = floatval($rate);
                    db()->prepare('DELETE FROM exchange_rates WHERE currency_from = ? AND currency_to = ?')->execute(['USD', $cur]);
                    db()->prepare('INSERT INTO exchange_rates (currency_from, currency_to, rate, usd_to_mxn, usd_mxn, source) VALUES (?, ?, ?, ?, ?, ?)')
                        ->execute(['USD', $cur, $rate, $cur === 'MXN' ? $rate : 0, $cur === 'MXN' ? $rate : 0, 'frankfurter-api']);
                    $saved++;
                }
            }
        }

        if ($saved === 0) {
            // Fallback API
            $response2 = @file_get_contents('https://open.er-api.com/v6/latest/USD');
            if ($response2) {
                $data2 = json_decode($response2, true);
                if (isset($data2['rates'])) {
                    foreach (['MXN', 'COP', 'CNY', 'EUR'] as $cur) {
                        if (isset($data2['rates'][$cur])) {
                            $rate = floatval($data2['rates'][$cur]);
                            db()->prepare('DELETE FROM exchange_rates WHERE currency_from = ? AND currency_to = ?')->execute(['USD', $cur]);
                            db()->prepare('INSERT INTO exchange_rates (currency_from, currency_to, rate, usd_to_mxn, usd_mxn, source) VALUES (?, ?, ?, ?, ?, ?)')
                                ->execute(['USD', $cur, $rate, $cur === 'MXN' ? $rate : 0, $cur === 'MXN' ? $rate : 0, 'er-api']);
                            $saved++;
                        }
                    }
                }
            }
        }

        header('Location: /admin/divisas' . ($saved > 0 ? '?updated=1' : '?error=api'));
        exit;
    }

    if ($action === 'save_rate') {
        $currency = strtoupper(trim($_POST['currency'] ?? ''));
        $rate = sanitize_float($_POST['rate'] ?? 0);
        $allowed = ['MXN', 'COP', 'CNY', 'EUR'];

        if (in_array($currency, $allowed) && $rate > 0) {
            db()->prepare('DELETE FROM exchange_rates WHERE currency_from = ? AND currency_to = ?')->execute(['USD', $currency]);
            db()->prepare('INSERT INTO exchange_rates (currency_from, currency_to, rate, usd_to_mxn, usd_mxn, source) VALUES (?, ?, ?, ?, ?, ?)')
                ->execute(['USD', $currency, $rate, $currency === 'MXN' ? $rate : 0, $currency === 'MXN' ? $rate : 0, 'manual']);
        }
        header('Location: /admin/divisas?saved=1');
        exit;
    }
}

$rates = [];
try {
    $stmt = db()->query('SELECT currency_to, rate, source, updated_at FROM exchange_rates WHERE currency_from = "USD" AND rate > 0 ORDER BY currency_to');
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $rates[$row['currency_to']] = $row;
    }
} catch (Exception $e) {}

$history = db()->query('SELECT * FROM exchange_rates WHERE currency_from = "USD" ORDER BY updated_at DESC LIMIT 20')->fetchAll();

$currencies = [
    'MXN' => ['name' => 'Peso Mexicano', 'flag' => '🇲🇽'],
    'COP' => ['name' => 'Peso Colombiano', 'flag' => '🇨🇴'],
    'CNY' => ['name' => 'Yuan Chino', 'flag' => '🇨🇳'],
    'EUR' => ['name' => 'Euro', 'flag' => '🇪🇺'],
];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Divisas - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <style>
        .rate-card { background: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 24px; display: flex; align-items: center; gap: 20px; }
        .rate-flag { font-size: 36px; }
        .rate-info { flex: 1; }
        .rate-info .currency { color: #fff; font-size: 16px; font-weight: 600; }
        .rate-info .name { color: #6b7280; font-size: 13px; }
        .rate-value { text-align: right; }
        .rate-value .amount { color: #60a5fa; font-size: 28px; font-weight: 700; }
        .rate-value .per { color: #6b7280; font-size: 12px; }
        .rate-value .source { color: #6b7280; font-size: 11px; margin-top: 4px; }
        .rate-value .updated { color: #6b7280; font-size: 11px; }
        .rates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .edit-inline { display: flex; gap: 8px; align-items: flex-end; }
        .edit-inline input { width: 160px; }
    </style>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1>Tipo de Cambio (USD)</h1>
                <div class="crm-header-actions">
                    <form method="POST" style="display:inline">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="action" value="refresh">
                        <button type="submit" class="btn-primary"><?php echo crm_icon('refresh'); ?> Actualizar desde API</button>
                    </form>
                </div>
            </header>
            <div class="crm-content">
                <?php if (isset($_GET['updated'])): ?>
                <div class="alert alert-success" style="background:#064e3b;color:#34d399;border:1px solid #065f46">Tasas actualizadas correctamente desde la API</div>
                <?php endif; ?>
                <?php if (isset($_GET['saved'])): ?>
                <div class="alert alert-success" style="background:#064e3b;color:#34d399;border:1px solid #065f46">Tasa guardada manualmente</div>
                <?php endif; ?>
                <?php if (isset($_GET['error'])): ?>
                <div class="alert alert-warning">Error al conectar con la API. Intenta de nuevo o edita manualmente.</div>
                <?php endif; ?>

                <h2 style="color:#fff;font-size:16px;margin-bottom:16px">Tasas Actuales</h2>
                <div class="rates-grid">
                    <?php foreach ($currencies as $cur => $info): ?>
                    <div class="rate-card">
                        <div class="rate-flag"><?php echo $info['flag']; ?></div>
                        <div class="rate-info">
                            <div class="currency">USD / <?php echo $cur; ?></div>
                            <div class="name"><?php echo $info['name']; ?></div>
                        </div>
                        <div class="rate-value">
                            <?php if (isset($rates[$cur])): ?>
                            <div class="amount"><?php echo currency_symbol($cur); ?><?php echo format_rate($rates[$cur]['rate'], $cur); ?></div>
                            <div class="per">1 USD = <?php echo format_rate($rates[$cur]['rate'], $cur); ?> <?php echo $cur; ?></div>
                            <div class="source">Fuente: <?php echo htmlspecialchars($rates[$cur]['source'] ?? 'api'); ?></div>
                            <?php else: ?>
                            <div class="amount" style="color:#6b7280">Sin datos</div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <div class="crm-card">
                    <div class="crm-card-header"><h2>Editar Tasa Manual</h2></div>
                    <div class="crm-card-body">
                        <form method="POST">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save_rate">
                            <div class="edit-inline">
                                <div class="form-group">
                                    <label>Moneda</label>
                                    <select name="currency">
                                        <option value="MXN">MXN - Peso Mexicano</option>
                                        <option value="COP">COP - Peso Colombiano</option>
                                        <option value="CNY">CNY - Yuan Chino</option>
                                        <option value="EUR">EUR - Euro</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>1 USD =</label>
                                    <input type="number" name="rate" step="0.0001" min="0" required placeholder="Ej: 20.50">
                                </div>
                                <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="crm-card">
                    <div class="crm-card-header"><h2>Historial de Tasas</h2></div>
                    <?php if (!empty($history)): ?>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>Par</th><th>Tasa</th><th>Fuente</th><th>Fecha</th></tr></thead>
                            <tbody>
                                <?php foreach ($history as $h): ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($h['currency_from'] . '/' . $h['currency_to']); ?></strong></td>
                                    <td><?php echo format_rate($h['rate'], $h['currency_to']); ?></td>
                                    <td><?php echo htmlspecialchars($h['source'] ?? '-'); ?></td>
                                    <td><?php echo date('d/m/Y H:i', strtotime($h['updated_at'])); ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php else: ?>
                    <div class="crm-card-body text-center text-muted">No hay historial de tasas</div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
