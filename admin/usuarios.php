<?php
define('CURRENT_PAGE', 'usuarios');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'save') {
        $id = sanitize_int($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $role = in_array($_POST['role'] ?? '', ['admin','user']) ? $_POST['role'] : 'user';
        $phone = trim($_POST['phone'] ?? '');

        if ($name === '' || $email === '') {
            header('Location: /admin/usuarios?error=required');
            exit;
        }

        if ($id > 0) {
            if ($password !== '') {
                $hash = password_hash($password, PASSWORD_DEFAULT);
                db()->prepare('UPDATE users SET name=?, email=?, password_hash=?, role=?, phone=? WHERE id=?')
                    ->execute([$name, $email, $hash, $role, $phone, $id]);
            } else {
                db()->prepare('UPDATE users SET name=?, email=?, role=?, phone=? WHERE id=?')
                    ->execute([$name, $email, $role, $phone, $id]);
            }
        } else {
            if ($password === '') {
                header('Location: /admin/usuarios?error=password_required');
                exit;
            }
            $hash = password_hash($password, PASSWORD_DEFAULT);
            db()->prepare('INSERT INTO users (name, email, password_hash, role, phone) VALUES (?,?,?,?,?)')
                ->execute([$name, $email, $hash, $role, $phone]);
        }
        header('Location: /admin/usuarios');
        exit;
    }

    if ($action === 'delete') {
        $delId = sanitize_int($_POST['id'] ?? 0);
        if ($delId > 0 && $delId !== intval($_SESSION['admin_id'])) {
            db()->prepare('DELETE FROM users WHERE id = ?')->execute([$delId]);
        }
        header('Location: /admin/usuarios');
        exit;
    }
}

$editId = isset($_GET['edit']) ? intval($_GET['edit']) : 0;
$isNew = isset($_GET['new']);
$userEdit = null;

if ($editId > 0) {
    $stmt = db()->prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?');
    $stmt->execute([$editId]);
    $userEdit = $stmt->fetch();
    if (!$userEdit) {
        header('Location: /admin/usuarios');
        exit;
    }
}

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;

if ($search !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM users WHERE name LIKE ? OR email LIKE ?');
    $countStmt->execute(["%$search%", "%$search%"]);
    $total = $countStmt->fetchColumn();
    $stmt = db()->prepare('SELECT id, name, email, role, phone, created_at FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute(["%$search%", "%$search%", $perPage, $offset]);
} else {
    $total = db()->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $stmt = db()->prepare('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute([$perPage, $offset]);
}
$users = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo ($editId > 0 || $isNew) ? 'Editar Usuario' : 'Usuarios'; ?> - Atlantic Optical International Limited Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.png">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1><?php echo ($editId > 0 || $isNew) ? ($userEdit ? 'Editar: ' . htmlspecialchars($userEdit['name']) : 'Nuevo Usuario') : 'Usuarios'; ?></h1>
                <div class="crm-header-actions">
                    <?php if ($editId > 0 || $isNew): ?>
                    <a href="/admin/usuarios" class="btn-secondary"><?php echo crm_icon('refresh'); ?> Cancelar</a>
                    <?php else: ?>
                    <a href="/admin/usuarios?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo Usuario</a>
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar usuario..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="/admin/usuarios" class="btn-clear"><?php echo crm_icon('x'); ?></a>
                        <?php endif; ?>
                    </form>
                    <?php endif; ?>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($editId > 0 || $isNew): ?>
                <div class="crm-card">
                    <div class="crm-card-body">
                        <form method="POST">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save">
                            <?php if ($userEdit): ?>
                            <input type="hidden" name="id" value="<?php echo intval($userEdit['id']); ?>">
                            <?php endif; ?>

                            <div class="form-grid">
                                <div class="form-group"><label>Nombre *</label><input type="text" name="name" value="<?php echo htmlspecialchars($userEdit['name'] ?? ''); ?>" required></div>
                                <div class="form-group"><label>Email *</label><input type="email" name="email" value="<?php echo htmlspecialchars($userEdit['email'] ?? ''); ?>" required></div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Contrasena <?php echo $userEdit ? '(dejar vacio para no cambiar)' : '*'; ?></label>
                                    <input type="password" name="password" <?php if (!$userEdit) echo 'required'; ?> autocomplete="new-password">
                                </div>
                                <div class="form-group">
                                    <label>Telefono</label>
                                    <input type="text" name="phone" value="<?php echo htmlspecialchars($userEdit['phone'] ?? ''); ?>">
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Rol</label>
                                <select name="role">
                                    <option value="user" <?php if (($userEdit['role'] ?? 'user') === 'user') echo 'selected'; ?>>Usuario</option>
                                    <option value="admin" <?php if (($userEdit['role'] ?? '') === 'admin') echo 'selected'; ?>>Admin</option>
                                </select>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> <?php echo $userEdit ? 'Guardar Cambios' : 'Crear Usuario'; ?></button>
                                <a href="/admin/usuarios" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
                <?php else: ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $total; ?> usuario(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Telefono</th><th>Rol</th><th>Creado</th><th>Acciones</th></tr></thead>
                            <tbody>
                                <?php if (empty($users)): ?>
                                <tr><td colspan="7" class="text-center text-muted">No se encontraron usuarios</td></tr>
                                <?php else: ?>
                                <?php foreach ($users as $u): ?>
                                <tr>
                                    <td><?php echo intval($u['id']); ?></td>
                                    <td><?php echo htmlspecialchars($u['name']); ?></td>
                                    <td><?php echo htmlspecialchars($u['email']); ?></td>
                                    <td><?php echo htmlspecialchars($u['phone'] ?? '-'); ?></td>
                                    <td><span class="role-badge"><?php echo htmlspecialchars(ucfirst($u['role'] ?? 'user')); ?></span></td>
                                    <td><?php echo isset($u['created_at']) ? date('d/m/Y', strtotime($u['created_at'])) : '-'; ?></td>
                                    <td class="actions-cell">
                                        <a href="/admin/usuarios?edit=<?php echo intval($u['id']); ?>" class="btn-sm" title="Editar"><?php echo crm_icon('edit'); ?></a>
                                        <?php if (intval($u['id']) !== intval($_SESSION['admin_id'])): ?>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo intval($u['id']); ?>">
                                            <button type="submit" class="btn-sm btn-danger" onclick="return confirm('Eliminar este usuario?')"><?php echo crm_icon('trash'); ?></button>
                                        </form>
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
                        <a href="/admin/usuarios?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="/admin/usuarios?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="/admin/usuarios?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
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
