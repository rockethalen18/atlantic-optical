<?php
define('CURRENT_PAGE', 'pedidos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $setStatus = $_POST['set_status'] ?? null;
    $setId = sanitize_int($_POST['set_id'] ?? 0);
    $allowed = ['pending','processing','shipped','delivered','cancelled'];
    if ($setStatus && $setId > 0 && in_array($setStatus, $allowed)) {
        $stmt = db()->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$setStatus, $setId]);
    }
    header('Location: /admin/pedidos');
    exit;
}

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;

if ($search !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.name LIKE ? OR o.id LIKE ? OR o.order_number LIKE ?');
    $countStmt->execute(["%$search%", "%$search%", "%$search%"]);
    $total = $countStmt->fetchColumn();
    $stmt = db()->prepare('SELECT o.*, u.name AS customer_name, u.email AS customer_email FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.name LIKE ? OR o.id LIKE ? OR o.order_number LIKE ? ORDER BY o.created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute(["%$search%", "%$search%", "%$search%", $perPage, $offset]);
} else {
    $total = db()->query('SELECT COUNT(*) FROM orders')->fetchColumn();
    $stmt = db()->prepare('SELECT o.*, u.name AS customer_name, u.email AS customer_email FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute([$perPage, $offset]);
}
$orders = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));

$statusLabels = ['pending'=>'Pendiente','processing'=>'Procesando','shipped'=>'Enviado','delivered'=>'Entregado','cancelled'=>'Cancelado'];
$statusColors = ['pending'=>'status-pending','processing'=>'status-processing','shipped'=>'status-shipped','delivered'=>'status-delivered','cancelled'=>'status-cancelled'];

$viewId = isset($_GET['view']) ? intval($_GET['view']) : 0;
$order = null;
$items = [];
if ($viewId > 0) {
    $stmt3 = db()->prepare('SELECT o.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?');
    $stmt3->execute([$viewId]);
    $order = $stmt3->fetch();
    if (!$order) {
        header('Location: /admin/pedidos');
        exit;
    }
    $stmt4 = db()->prepare('SELECT * FROM order_items WHERE order_id = ?');
    $stmt4->execute([$viewId]);
    $items = $stmt4->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedidos - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1><?php echo $order ? 'Pedido #' . intval($order['id']) : 'Pedidos'; ?></h1>
                <div class="crm-header-actions">
                    <?php if ($order): ?>
                    <a href="/admin/pedidos" class="btn-secondary"><?php echo crm_icon('refresh'); ?> Volver</a>
                    <?php else: ?>
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar por cliente o ID..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="/admin/pedidos" class="btn-clear"><?php echo crm_icon('x'); ?></a>
                        <?php endif; ?>
                    </form>
                    <?php endif; ?>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($order): ?>
                <div class="crm-card">
                    <div class="order-detail">
                        <div class="order-info-grid">
                            <div><label>Cliente</label><p><?php echo htmlspecialchars($order['customer_name'] ?? 'N/A'); ?></p></div>
                            <div><label>Email</label><p><?php echo htmlspecialchars($order['customer_email'] ?? ''); ?></p></div>
                            <div><label>Telefono</label><p><?php echo htmlspecialchars($order['customer_phone'] ?? ''); ?></p></div>
                            <div>
                                <label>Estado</label>
                                <form method="POST" style="display:inline">
                                    <?php echo csrf_field(); ?>
                                    <input type="hidden" name="set_id" value="<?php echo intval($order['id']); ?>">
                                    <select name="set_status" class="status-select <?php echo $statusColors[$order['status']] ?? ''; ?>" onchange="this.form.submit()">
                                        <?php foreach ($statusLabels as $val => $lbl): ?>
                                        <option value="<?php echo $val; ?>" <?php if ($order['status'] === $val) echo 'selected'; ?>><?php echo $lbl; ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </form>
                            </div>
                            <div><label>Total</label><p class="text-lg">$<?php echo number_format($order['total'], 2); ?></p></div>
                            <div><label>Fecha</label><p><?php echo date('d/m/Y H:i', strtotime($order['created_at'])); ?></p></div>
                        </div>
                        <?php if (!empty($order['shipping_address'])): ?>
                        <div class="order-address"><label>Direccion de envio</label><p><?php echo nl2br(htmlspecialchars($order['shipping_address'])); ?></p></div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php if (!empty($items)): ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2>Items</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
                            <tbody>
                                <?php foreach ($items as $item): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($item['product_name'] ?? $item['product_id']); ?></td>
                                    <td><?php echo intval($item['quantity']); ?></td>
                                    <td>$<?php echo number_format($item['unit_price'], 2); ?></td>
                                    <td>$<?php echo number_format($item['total_price'], 2); ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php endif; ?>
                <?php else: ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $total; ?> pedido(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
                            <tbody>
                                <?php if (empty($orders)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No se encontraron pedidos</td></tr>
                                <?php else: ?>
                                <?php foreach ($orders as $o): ?>
                                <tr>
                                    <td>#<?php echo intval($o['id']); ?></td>
                                    <td><?php echo htmlspecialchars($o['customer_name'] ?? 'N/A'); ?></td>
                                    <td>$<?php echo number_format($o['total'], 2); ?></td>
                                    <td>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="set_id" value="<?php echo intval($o['id']); ?>">
                                            <select name="set_status" class="status-select <?php echo $statusColors[$o['status']] ?? ''; ?>" onchange="this.form.submit()">
                                                <?php foreach ($statusLabels as $val => $lbl): ?>
                                                <option value="<?php echo $val; ?>" <?php if ($o['status'] === $val) echo 'selected'; ?>><?php echo $lbl; ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </form>
                                    </td>
                                    <td><?php echo date('d/m/Y', strtotime($o['created_at'])); ?></td>
                                    <td class="actions-cell"><a href="/admin/pedidos?view=<?php echo intval($o['id']); ?>" class="btn-sm"><?php echo crm_icon('eye'); ?></a></td>
                                </tr>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php if ($totalPages > 1): ?>
                    <div class="pagination">
                        <?php if ($page > 1): ?>
                        <a href="/admin/pedidos?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="/admin/pedidos?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="/admin/pedidos?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>
