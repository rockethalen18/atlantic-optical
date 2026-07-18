<?php
define('CURRENT_PAGE', 'categorias');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_login();

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;

if ($search !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM categories WHERE name LIKE ?');
    $countStmt->execute(["%$search%"]);
    $total = $countStmt->fetchColumn();
    $stmt = db()->prepare('SELECT * FROM categories WHERE name LIKE ? ORDER BY sort_order ASC, name ASC LIMIT ? OFFSET ?');
    $stmt->execute(["%$search%", $perPage, $offset]);
} else {
    $total = db()->query('SELECT COUNT(*) FROM categories')->fetchColumn();
    $stmt = db()->prepare('SELECT * FROM categories ORDER BY sort_order ASC, name ASC LIMIT ? OFFSET ?');
    $stmt->execute([$perPage, $offset]);
}
$categories = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));

$delId = $_GET['del'] ?? null;
if ($delId) {
    $stmt3 = db()->prepare('DELETE FROM categories WHERE id = ?');
    $stmt3->execute([$delId]);
    header('Location: categorias.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Categorias - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1>Categorias</h1>
                <div class="crm-header-actions">
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar categoria..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="categorias.php" class="btn-clear"><?php echo crm_icon('x'); ?></a>
                        <?php endif; ?>
                    </form>
                </div>
            </header>
            <div class="crm-content">
                <div class="crm-card">
                    <div class="crm-card-header">
                        <h2><?php echo $total; ?> categoria(s)</h2>
                    </div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Slug</th>
                                    <th>Orden</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($categories)): ?>
                                <tr><td colspan="5" class="text-center text-muted">No se encontraron categorias</td></tr>
                                <?php else: ?>
                                <?php foreach ($categories as $c): ?>
                                <tr>
                                    <td><?php echo $c['id']; ?></td>
                                    <td><?php echo htmlspecialchars($c['name']); ?></td>
                                    <td><code><?php echo htmlspecialchars($c['slug']); ?></code></td>
                                    <td><?php echo $c['sort_order']; ?></td>
                                    <td class="actions-cell">
                                        <a href="categorias.php?del=<?php echo $c['id']; ?>" class="btn-sm btn-danger" onclick="return confirm('Eliminar esta categoria?')"><?php echo crm_icon('trash'); ?></a>
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
                        <a href="categorias.php?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="categorias.php?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="categorias.php?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
