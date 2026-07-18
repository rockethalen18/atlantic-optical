<?php
define('CURRENT_PAGE', 'index');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_login();

$totalProducts = db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
$totalOrders = db()->query('SELECT COUNT(*) FROM orders')->fetchColumn();
$totalCategories = db()->query('SELECT COUNT(*) FROM categories')->fetchColumn();
$totalUsers = db()->query('SELECT COUNT(*) FROM users')->fetchColumn();

$pendingOrders = db()->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();
$recentOrders = db()->query('SELECT id, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5')->fetchAll();

$statusColors = [
    'pending' => 'status-pending',
    'processing' => 'status-processing',
    'shipped' => 'status-shipped',
    'delivered' => 'status-delivered',
    'cancelled' => 'status-cancelled',
];

$setStatus = $_GET['set_status'] ?? null;
$setId = $_GET['set_id'] ?? null;
if ($setStatus && $setId) {
    $allowed = ['pending','processing','shipped','delivered','cancelled'];
    if (in_array($setStatus, $allowed)) {
        $stmt = db()->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$setStatus, $setId]);
        header('Location: index.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1>Dashboard</h1>
                <span class="crm-header-user"><?php echo htmlspecialchars(admin_name()); ?></span>
            </header>
            <div class="crm-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue"><?php echo crm_icon('box'); ?></div>
                        <div class="stat-info">
                            <span class="stat-number"><?php echo $totalProducts; ?></span>
                            <span class="stat-label">Productos</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon yellow"><?php echo crm_icon('shopping-cart'); ?></div>
                        <div class="stat-info">
                            <span class="stat-number"><?php echo $totalOrders; ?></span>
                            <span class="stat-label">Pedidos</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green"><?php echo crm_icon('tag'); ?></div>
                        <div class="stat-info">
                            <span class="stat-number"><?php echo $totalCategories; ?></span>
                            <span class="stat-label">Categorias</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon red"><?php echo crm_icon('users'); ?></div>
                        <div class="stat-info">
                            <span class="stat-number"><?php echo $totalUsers; ?></span>
                            <span class="stat-label">Usuarios</span>
                        </div>
                    </div>
                </div>

                <?php if ($pendingOrders > 0): ?>
                <div class="alert alert-warning">
                    <?php echo crm_icon('refresh'); ?>
                    <span>Tienes <?php echo $pendingOrders; ?> pedido(s) pendiente(s)</span>
                </div>
                <?php endif; ?>

                <div class="crm-card">
                    <div class="crm-card-header">
                        <h2>Pedidos Recientes</h2>
                    </div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($recentOrders)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No hay pedidos aun</td></tr>
                                <?php else: ?>
                                <?php foreach ($recentOrders as $order): ?>
                                <tr>
                                    <td>#<?php echo $order['id']; ?></td>
                                    <td><?php echo htmlspecialchars($order['customer_name']); ?></td>
                                    <td>$<?php echo number_format($order['total'], 2); ?></td>
                                    <td>
                                        <select class="status-select <?php echo $statusColors[$order['status']] ?? ''; ?>" onchange="changeStatus(<?php echo $order['id']; ?>, this.value)">
                                            <?php foreach ($statusColors as $val => $cls): ?>
                                            <option value="<?php echo $val; ?>" <?php if ($order['status'] === $val) echo 'selected'; ?>><?php echo ucfirst($val); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </td>
                                    <td><?php echo date('d/m/Y', strtotime($order['created_at'])); ?></td>
                                    <td>
                                        <a href="pedidos.php?view=<?php echo $order['id']; ?>" class="btn-sm"><?php echo crm_icon('eye'); ?></a>
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
    function changeStatus(id, status) {
        window.location.href = 'index.php?set_id=' + id + '&set_status=' + status;
    }
    </script>
</body>
</html>
