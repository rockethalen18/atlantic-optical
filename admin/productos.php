<?php
define('CURRENT_PAGE', 'productos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_login();

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;

if ($search !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM products WHERE name LIKE ? OR sku LIKE ?');
    $countStmt->execute(["%$search%", "%$search%"]);
    $total = $countStmt->fetchColumn();
    $stmt = db()->prepare('SELECT * FROM products WHERE name LIKE ? OR sku LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute(["%$search%", "%$search%", $perPage, $offset]);
} else {
    $total = db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $stmt = db()->prepare('SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute([$perPage, $offset]);
}
$products = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));

$setStatus = $_GET['set'] ?? null;
$setVal = $_GET['val'] ?? null;
$setId = $_GET['sid'] ?? null;
if ($setStatus && $setId) {
    $allowed = ['active','inactive'];
    if (in_array($setVal, $allowed)) {
        $stmt2 = db()->prepare("UPDATE products SET status = ? WHERE id = ?");
        $stmt2->execute([$setVal, $setId]);
        header('Location: productos.php');
        exit;
    }
}

$delId = $_GET['del'] ?? null;
if ($delId) {
    $stmt3 = db()->prepare('DELETE FROM products WHERE id = ?');
    $stmt3->execute([$delId]);
    header('Location: productos.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1>Productos</h1>
                <div class="crm-header-actions">
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar por nombre o SKU..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="productos.php" class="btn-clear"><?php echo crm_icon('x'); ?></a>
                        <?php endif; ?>
                    </form>
                </div>
            </header>
            <div class="crm-content">
                <div class="crm-card">
                    <div class="crm-card-header">
                        <h2><?php echo $total; ?> producto(s)</h2>
                    </div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($products)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No se encontraron productos</td></tr>
                                <?php else: ?>
                                <?php foreach ($products as $p): ?>
                                <tr>
                                    <td><code><?php echo htmlspecialchars($p['sku']); ?></code></td>
                                    <td><?php echo htmlspecialchars($p['name']); ?></td>
                                    <td>$<?php echo number_format($p['price'], 2); ?></td>
                                    <td><?php echo $p['stock']; ?></td>
                                    <td>
                                        <a href="productos.php?set=status&val=<?php echo $p['status'] === 'active' ? 'inactive' : 'active'; ?>&sid=<?php echo $p['id']; ?>" class="status-badge <?php echo $p['status'] === 'active' ? 'status-active' : 'status-inactive'; ?>">
                                            <?php echo $p['status'] === 'active' ? 'Activo' : 'Inactivo'; ?>
                                        </a>
                                    </td>
                                    <td class="actions-cell">
                                        <a href="productos.php?del=<?php echo $p['id']; ?>" class="btn-sm btn-danger" onclick="return confirm('Eliminar este producto?')"><?php echo crm_icon('trash'); ?></a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php if ($totalPages > 1): ?>
                    <div class="pagination">
                        <?php if ($page > 1): ?>
                        <a href="productos.php?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="productos.php?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="productos.php?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
