<?php require_once 'includes/auth.php';
$activePage = 'costos';

$rates = $pdo->query("SELECT * FROM shipping_rates ORDER BY method")->fetchAll();
$exchange = $pdo->query("SELECT * FROM exchange_rates ORDER BY id DESC LIMIT 1")->fetch();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Costos y Envío — Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
<?php include 'includes/sidebar.php'; ?>

<main class="main-content">
    <header class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
            <button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open');document.querySelector('.sidebar-overlay').classList.toggle('active')">&#9776;</button>
            <h1>Costos y Envío</h1>
        </div>
    </header>

    <div class="page-body">
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><h3>Tipo de Cambio</h3></div>
                <div class="card-body">
                    <?php if ($exchange): ?>
                    <p style="font-size:28px;font-weight:700;font-family:'Space Grotesk',sans-serif;">$<?php echo number_format($exchange['usd_to_mxn'], 2); ?> MXN</p>
                    <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">Fuente: <?php echo htmlspecialchars($exchange['source'] ?? 'manual'); ?></p>
                    <?php else: ?>
                    <p style="color:var(--text-muted);">Sin tipo de cambio configurado</p>
                    <?php endif; ?>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>Métodos de Envío</h3></div>
                <div class="table-wrapper">
                    <table>
                        <thead><tr><th>Método</th><th>Precio/kg USD</th><th>Días</th></tr></thead>
                        <tbody>
                            <?php foreach ($rates as $r): ?>
                            <tr>
                                <td style="font-weight:500;"><?php echo htmlspecialchars($r['method']); ?></td>
                                <td>$<?php echo number_format($r['price_per_kg_usd'], 2); ?></td>
                                <td><?php echo $r['min_days']; ?>-<?php echo $r['max_days']; ?> días</td>
                            </tr>
                            <?php endforeach; ?>
                            <?php if (empty($rates)): ?>
                            <tr><td colspan="3" style="text-align:center; color:var(--text-muted);">Sin métodos configurados</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</main>
</body>
</html>
