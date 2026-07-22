<?php
define('CURRENT_PAGE', 'banners');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$editing = null;
$editId = $_GET['edit'] ?? null;
if ($editId) {
    $stmt = db()->prepare('SELECT * FROM banners WHERE id = ?');
    $stmt->execute([$editId]);
    $editing = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        db()->prepare('DELETE FROM banners WHERE id = ?')->execute([$id]);
        header('Location: /admin/banners?msg=deleted');
        exit;
    }
    
    $data = [
        $_POST['title'] ?? '',
        $_POST['subtitle'] ?? null,
        $_POST['image'] ?? null,
        $_POST['link'] ?? null,
        $_POST['link_text'] ?? null,
        $_POST['bg_color'] ?? '#0a1628',
        $_POST['text_color'] ?? '#ffffff',
        $_POST['position'] ?? 'home',
        intval($_POST['sort_order'] ?? 0),
        isset($_POST['is_active']) ? 1 : 0,
        $_POST['starts_at'] ?: null,
        $_POST['expires_at'] ?: null,
        $_POST['animation'] ?? 'fade',
    ];
    
    if ($editId) {
        $stmt = db()->prepare('UPDATE banners SET title=?, subtitle=?, image=?, link=?, link_text=?, bg_color=?, text_color=?, position=?, sort_order=?, is_active=?, starts_at=?, expires_at=?, animation=? WHERE id=?');
        $data[] = $editId;
        $stmt->execute($data);
        header('Location: /admin/banners?msg=updated');
    } else {
        $stmt = db()->prepare('INSERT INTO banners (title, subtitle, image, link, link_text, bg_color, text_color, position, sort_order, is_active, starts_at, expires_at, animation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute($data);
        header('Location: /admin/banners?msg=created');
    }
    exit;
}

$banners = db()->query('SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC')->fetchAll();
$msg = $_GET['msg'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banners - Atlantic Optical International Limited Admin</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.png">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1>Banners</h1>
                <div class="crm-header-actions">
                    <a href="/admin/banners?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo Banner</a>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($msg): ?>
                <div class="alert alert-success"><?php echo $msg === 'created' ? 'Banner creado' : ($msg === 'updated' ? 'Banner actualizado' : 'Banner eliminado'); ?></div>
                <?php endif; ?>

                <?php if ($editing || (isset($_GET['new']) && $_GET['new'])): ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $editing ? 'Editar Banner' : 'Nuevo Banner'; ?></h2></div>
                    <div class="crm-card-body">
                        <form method="POST">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Titulo</label>
                                    <input type="text" name="title" value="<?php echo htmlspecialchars($editing['title'] ?? ''); ?>" required>
                                </div>
                                <div class="form-group">
                                    <label>Subtitulo</label>
                                    <input type="text" name="subtitle" value="<?php echo htmlspecialchars($editing['subtitle'] ?? ''); ?>">
                                </div>
                                <div class="form-group">
                                    <label>Imagen URL</label>
                                    <input type="text" name="image" value="<?php echo htmlspecialchars($editing['image'] ?? ''); ?>" placeholder="/images/banner.jpg">
                                </div>
                                <div class="form-group">
                                    <label>Link</label>
                                    <input type="text" name="link" value="<?php echo htmlspecialchars($editing['link'] ?? ''); ?>" placeholder="/productos">
                                </div>
                                <div class="form-group">
                                    <label>Texto del boton</label>
                                    <input type="text" name="link_text" value="<?php echo htmlspecialchars($editing['link_text'] ?? ''); ?>" placeholder="Ver Mas">
                                </div>
                                <div class="form-group">
                                    <label>Posicion</label>
                                    <select name="position">
                                        <option value="home" <?php echo ($editing['position'] ?? '') === 'home' ? 'selected' : ''; ?>>Inicio</option>
                                        <option value="category" <?php echo ($editing['position'] ?? '') === 'category' ? 'selected' : ''; ?>>Categoria</option>
                                        <option value="all" <?php echo ($editing['position'] ?? '') === 'all' ? 'selected' : ''; ?>>Todas las paginas</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Animacion</label>
                                    <select name="animation">
                                        <option value="fade" <?php echo ($editing['animation'] ?? '') === 'fade' ? 'selected' : ''; ?>>Fade</option>
                                        <option value="slide" <?php echo ($editing['animation'] ?? '') === 'slide' ? 'selected' : ''; ?>>Slide</option>
                                        <option value="zoom" <?php echo ($editing['animation'] ?? '') === 'zoom' ? 'selected' : ''; ?>>Zoom</option>
                                        <option value="none" <?php echo ($editing['animation'] ?? '') === 'none' ? 'selected' : ''; ?>>Ninguna</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Orden</label>
                                    <input type="number" name="sort_order" value="<?php echo $editing['sort_order'] ?? '0'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Color de fondo</label>
                                    <input type="color" name="bg_color" value="<?php echo $editing['bg_color'] ?? '#0a1628'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Color de texto</label>
                                    <input type="color" name="text_color" value="<?php echo $editing['text_color'] ?? '#ffffff'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Fecha inicio</label>
                                    <input type="datetime-local" name="starts_at" value="<?php echo $editing['starts_at'] ? date('Y-m-d\TH:i', strtotime($editing['starts_at'])) : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Fecha fin</label>
                                    <input type="datetime-local" name="expires_at" value="<?php echo $editing['expires_at'] ? date('Y-m-d\TH:i', strtotime($editing['expires_at'])) : ''; ?>">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label"><input type="checkbox" name="is_active" value="1" <?php echo ($editing['is_active'] ?? 1) ? 'checked' : ''; ?>> Activo</label>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo $editing ? 'Actualizar' : 'Crear'; ?></button>
                                <a href="/admin/banners" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
                <?php endif; ?>

                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo count($banners); ?> banner(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead>
                                <tr>
                                    <th>Orden</th>
                                    <th>Titulo</th>
                                    <th>Posicion</th>
                                    <th>Animacion</th>
                                    <th>Activo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($banners)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No hay banners</td></tr>
                                <?php else: ?>
                                <?php foreach ($banners as $b): ?>
                                <tr>
                                    <td><?php echo $b['sort_order']; ?></td>
                                    <td><strong><?php echo htmlspecialchars($b['title']); ?></strong></td>
                                    <td><?php echo ucfirst($b['position']); ?></td>
                                    <td><?php echo ucfirst($b['animation']); ?></td>
                                    <td><?php echo $b['is_active'] ? '<span class="status-badge status-active">Activo</span>' : '<span class="status-badge status-inactive">Inactivo</span>'; ?></td>
                                    <td class="actions-cell">
                                        <a href="/admin/banners?edit=<?php echo $b['id']; ?>" class="btn-sm"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar este banner?')">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $b['id']; ?>">
                                            <button class="btn-sm btn-danger"><?php echo crm_icon('trash-2'); ?></button>
                                        </form>
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
</body>
</html>
