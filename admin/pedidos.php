<?php require_once 'includes/auth.php';
$activePage = 'pedidos';

$orders = $pdo->query("SELECT id, order_number, status, total_usd, shipping_method, created_at FROM orders ORDER BY created_at DESC LIMIT 50")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedidos — Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
<?php include 'includes/sidebar.php'; ?>

<main class="main-content">
    <header class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
            <button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open');document.querySelector('.sidebar-overlay').classList.toggle('active')">&#9776;</button>
            <h1>Pedidos</h1>
        </div>
    </header>

    <div class="page-body">
        <div class="card">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Pedido</th><th>Estado</th><th>Envío</th><th>Total</th><th>Fecha</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($orders as $o): ?>
                        <tr>
                            <td style="font-weight:500;font-family:monospace;font-size:12px;"><?php echo htmlspecialchars($o['order_number']); ?></td>
                            <td><span class="badge badge-<?php echo $o['status']==='delivered'?'green':($o['status']==='pending'?'orange':($o['status']==='shipped'?'blue':($o['status']==='cancelled'?'red':'gray'))); ?>"><?php echo $o['status']; ?></span></td>
                            <td><?php echo htmlspecialchars($o['shipping_method'] ?: '—'); ?></td>
                            <td>$<?php echo number_format($o['total_usd'], 2); ?></td>
                            <td><?php echo date('d/m/Y H:i', strtotime($o['created_at'])); ?></td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if (empty($orders)): ?>
                        <tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:40px;">No hay pedidos aún</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>
</body>
</html>
