<?php
define('CURRENT_PAGE', 'usuarios');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_login();

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;

if ($search !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM users WHERE name LIKE ? OR email LIKE ?');
    $countStmt->execute(["%$search%", "%$search%"]);
    $total = $countStmt->fetchColumn();
    $stmt = db()->prepare('SELECT id, name, email, role, created_at FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute(["%$search%", "%$search%", $perPage, $offset]);
} else {
    $total = db()->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $stmt = db()->prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute([$perPage, $offset]);
}
$users = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));

$delId = $_GET['del'] ?? null;
if ($delId && intval($delId) !== intval($_SESSION['admin_id'])) {
    $stmt3 = db()->prepare('DELETE FROM users WHERE id = ?');
    $stmt3->execute([$delId]);
    header('Location: usuarios.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuarios - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1>Usuarios</h1>
                <div class="crm-header-actions">
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar usuario..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="usuarios.php" class="btn-clear"><?php echo crm_icon('x'); ?></a>
                        <?php endif; ?>
                    </form>
                </div>
            </header>
            <div class="crm-content">
                <div class="crm-card">
                    <div class="crm-card-header">
                        <h2><?php echo $total; ?> usuario(s)</h2>
                    </div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Creado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($users)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No se encontraron usuarios</td></tr>
                                <?php else: ?>
                                <?php foreach ($users as $u): ?>
                                <tr>
                                    <td><?php echo $u['id']; ?></td>
                                    <td><?php echo htmlspecialchars($u['name']); ?></td>
                                    <td><?php echo htmlspecialchars($u['email']); ?></td>
                                    <td><span class="role-badge"><?php echo ucfirst($u['role'] ?? 'user'); ?></span></td>
                                    <td><?php echo isset($u['created_at']) ? date('d/m/Y', strtotime($u['created_at'])) : '-'; ?></td>
                                    <td class="actions-cell">
                                        <?php if (intval($u['id']) !== intval($_SESSION['admin_id'])): ?>
                                        <a href="usuarios.php?del=<?php echo $u['id']; ?>" class="btn-sm btn-danger" onclick="return confirm('Eliminar este usuario?')"><?php echo crm_icon('trash'); ?></a>
                                        <?php endif; ?>
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
                        <a href="usuarios.php?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="usuarios.php?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="usuarios.php?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
