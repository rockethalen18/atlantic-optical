<?php require_once 'includes/auth.php';
$activePage = 'dashboard';

$totalProducts = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
$publishedProducts = $pdo->query("SELECT COUNT(*) FROM products WHERE status='published'")->fetchColumn();
$totalCategories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$totalOrders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
$pendingOrders = $pdo->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn();

$recentOrders = $pdo->query("SELECT id, order_number, status, total_usd, created_at FROM orders ORDER BY created_at DESC LIMIT 10")->fetchAll();
$recentProducts = $pdo->query("SELECT id, name, sku, category, status FROM products ORDER BY id DESC LIMIT 8")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard — Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
<?php include 'includes/sidebar.php'; ?>

<main class="main-content">
    <header class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
            <button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open');document.querySelector('.sidebar-overlay').classList.toggle('active')">&#9776;</button>
            <h1>Dashboard</h1>
        </div>
        <div class="header-actions">
            <div class="user-info">
                <span><?php echo htmlspecialchars($current_user['name']); ?></span>
                <div class="user-avatar"><?php echo strtoupper(substr($current_user['name'],0,1)); ?></div>
            </div>
        </div>
    </header>

    <div class="page-body">
        <div class="stats-grid fade-in">
            <div class="stat-card">
                <div class="stat-glow cyan"></div>
                <div class="stat-icon cyan">&#9733;</div>
                <div class="stat-value"><?php echo $totalProducts; ?></div>
                <div class="stat-label">Total Productos</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow green" style="background:var(--green)"></div>
                <div class="stat-icon green">&#10003;</div>
                <div class="stat-value"><?php echo $publishedProducts; ?></div>
                <div class="stat-label">Publicados</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange">&#9993;</div>
                <div class="stat-value"><?php echo $totalOrders; ?></div>
                <div class="stat-label">Total Pedidos</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow purple"></div>
                <div class="stat-icon purple">&#9654;</div>
                <div class="stat-value"><?php echo $totalCategories; ?></div>
                <div class="stat-label">Categorías</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Productos Recientes</h3>
                    <a href="productos.php" class="btn btn-sm btn-secondary">Ver todos</a>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Estado</th></tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recentProducts as $p): ?>
                            <tr>
                                <td style="font-weight:500;"><?php echo htmlspecialchars($p['name']); ?></td>
                                <td style="font-family:monospace;font-size:12px;"><?php echo htmlspecialchars($p['sku']); ?></td>
                                <td><?php echo htmlspecialchars($p['category'] ?: '—'); ?></td>
                                <td><span class="badge badge-<?php echo $p['status']==='published'?'green':'gray'; ?>"><?php echo $p['status']; ?></span></td>
                            </tr>
                            <?php endforeach; ?>
                            <?php if (empty($recentProducts)): ?>
                            <tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No hay productos aún</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Pedidos Recientes</h3>
                    <a href="pedidos.php" class="btn btn-sm btn-secondary">Ver todos</a>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>Pedido</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recentOrders as $o): ?>
                            <tr>
                                <td style="font-weight:500;font-family:monospace;font-size:12px;"><?php echo htmlspecialchars($o['order_number']); ?></td>
                                <td>$<?php echo number_format($o['total_usd'], 2); ?></td>
                                <td><span class="badge badge-<?php echo $o['status']==='delivered'?'green':($o['status']==='pending'?'orange':($o['status']==='shipped'?'blue':'gray')); ?>"><?php echo $o['status']; ?></span></td>
                                <td><?php echo date('d/m/Y', strtotime($o['created_at'])); ?></td>
                            </tr>
                            <?php endforeach; ?>
                            <?php if (empty($recentOrders)): ?>
                            <tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No hay pedidos aún</td></tr>
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
