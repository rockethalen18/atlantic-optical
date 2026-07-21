<?php
define('CURRENT_PAGE', 'categorias');
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
        $slug = trim($_POST['slug'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $image = trim($_POST['image'] ?? '');
        $parentId = sanitize_int($_POST['parent_id'] ?? 0);
        $sortOrder = sanitize_int($_POST['sort_order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        if ($name === '') {
            header('Location: /admin/categorias?error=name_required');
            exit;
        }

        if ($slug === '') {
            $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower($name));
            $slug = trim($slug, '-');
        }

        if ($id > 0) {
            db()->prepare('UPDATE categories SET name=?, slug=?, description=?, image=?, parent_id=?, sort_order=?, is_active=? WHERE id=?')
                ->execute([$name, $slug, $description, $image, $parentId, $sortOrder, $isActive, $id]);
        } else {
            db()->prepare('INSERT INTO categories (name, slug, description, image, parent_id, sort_order, is_active) VALUES (?,?,?,?,?,?,?)')
                ->execute([$name, $slug, $description, $image, $parentId, $sortOrder, $isActive]);
        }
        header('Location: /admin/categorias');
        exit;
    }

    if ($action === 'delete') {
        $delId = sanitize_int($_POST['id'] ?? 0);
        if ($delId > 0) {
            db()->prepare('DELETE FROM categories WHERE id = ?')->execute([$delId]);
        }
        header('Location: /admin/categorias');
        exit;
    }
}

$editId = isset($_GET['edit']) ? intval($_GET['edit']) : 0;
$isNew = isset($_GET['new']);
$category = null;
$allCategories = db()->query('SELECT id, name FROM categories ORDER BY name')->fetchAll();

if ($editId > 0) {
    $stmt = db()->prepare('SELECT * FROM categories WHERE id = ?');
    $stmt->execute([$editId]);
    $category = $stmt->fetch();
    if (!$category) {
        header('Location: /admin/categorias');
        exit;
    }
}

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
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo ($editId > 0 || $isNew) ? 'Editar Categoria' : 'Categorias'; ?> - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1><?php echo ($editId > 0 || $isNew) ? ($category ? 'Editar: ' . htmlspecialchars($category['name']) : 'Nueva Categoria') : 'Categorias'; ?></h1>
                <div class="crm-header-actions">
                    <?php if ($editId > 0 || $isNew): ?>
                    <a href="/admin/categorias" class="btn-secondary"><?php echo crm_icon('refresh'); ?> Cancelar</a>
                    <?php else: ?>
                    <a href="/admin/categorias?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nueva Categoria</a>
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar categoria..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="/admin/categorias" class="btn-clear"><?php echo crm_icon('x'); ?></a>
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
                            <?php if ($category): ?>
                            <input type="hidden" name="id" value="<?php echo intval($category['id']); ?>">
                            <?php endif; ?>

                            <div class="form-grid">
                                <div class="form-group"><label>Nombre *</label><input type="text" name="name" value="<?php echo htmlspecialchars($category['name'] ?? ''); ?>" required></div>
                                <div class="form-group"><label>Slug</label><input type="text" name="slug" value="<?php echo htmlspecialchars($category['slug'] ?? ''); ?>" placeholder="auto-generado"></div>
                            </div>

                            <div class="form-group"><label>Descripcion</label><textarea name="description" rows="3"><?php echo htmlspecialchars($category['description'] ?? ''); ?></textarea></div>

                            <div class="form-grid form-grid-3">
                                <div class="form-group"><label>Imagen URL</label><input type="text" name="image" value="<?php echo htmlspecialchars($category['image'] ?? ''); ?>" placeholder="https://..."></div>
                                <div class="form-group"><label>Categoria Padre</label>
                                    <select name="parent_id">
                                        <option value="0">-- Ninguna --</option>
                                        <?php foreach ($allCategories as $pc): ?>
                                        <?php if (!$category || intval($pc['id']) !== intval($category['id'])): ?>
                                        <option value="<?php echo intval($pc['id']); ?>" <?php if (intval($category['parent_id'] ?? 0) === intval($pc['id'])) echo 'selected'; ?>><?php echo htmlspecialchars($pc['name']); ?></option>
                                        <?php endif; ?>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="form-group"><label>Orden</label><input type="number" name="sort_order" min="0" value="<?php echo intval($category['sort_order'] ?? 0); ?>"></div>
                            </div>

                            <label class="checkbox-label" style="margin:16px 0">
                                <input type="checkbox" name="is_active" value="1" <?php if (isset($category['is_active']) ? $category['is_active'] : true) echo 'checked'; ?>> Activa
                            </label>

                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> <?php echo $category ? 'Guardar Cambios' : 'Crear Categoria'; ?></button>
                                <a href="/admin/categorias" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
                <?php else: ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $total; ?> categoria(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>ID</th><th>Nombre</th><th>Slug</th><th>Orden</th><th>Estado</th><th>Acciones</th></tr></thead>
                            <tbody>
                                <?php if (empty($categories)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No se encontraron categorias</td></tr>
                                <?php else: ?>
                                <?php foreach ($categories as $c): ?>
                                <tr>
                                    <td><?php echo intval($c['id']); ?></td>
                                    <td><?php echo htmlspecialchars($c['name']); ?></td>
                                    <td><code><?php echo htmlspecialchars($c['slug']); ?></code></td>
                                    <td><?php echo intval($c['sort_order']); ?></td>
                                    <td>
                                        <span class="status-badge <?php echo $c['is_active'] ? 'status-active' : 'status-inactive'; ?>">
                                            <?php echo $c['is_active'] ? 'Activa' : 'Inactiva'; ?>
                                        </span>
                                    </td>
                                    <td class="actions-cell">
                                        <a href="/admin/categorias?edit=<?php echo intval($c['id']); ?>" class="btn-sm" title="Editar"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo intval($c['id']); ?>">
                                            <button type="submit" class="btn-sm btn-danger" onclick="return confirm('Eliminar esta categoria?')"><?php echo crm_icon('trash'); ?></button>
                                        </form>
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
                        <a href="/admin/categorias?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="/admin/categorias?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="/admin/categorias?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
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
