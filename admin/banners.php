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
        $id = $_POST['id'] ?? 0;
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
    <title>Banners - Atlantic Optical International Limited</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.png">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
<div class="layout">
<?php require_once __DIR__ . '/includes/sidebar.php'; ?>
<main class="main-content">
<div class="page-header">
    <div>
        <h1 class="page-title">Banners</h1>
        <p class="page-subtitle">Banners animados personalizables para el sitio</p>
    </div>
    <a href="/admin/banners?new=1" class="btn btn-primary">+ Nuevo Banner</a>
</div>

<?php if ($msg): ?>
<div class="alert alert-success"><?= $msg === 'created' ? 'Banner creado' : ($msg === 'updated' ? 'Banner actualizado' : 'Banner eliminado') ?></div>
<?php endif; ?>

<?php if ($editing || ($_GET['new'] ?? null)): ?>
<div class="card mb-6">
    <div class="card-header"><h2><?= $editing ? 'Editar Banner' : 'Nuevo Banner' ?></h2></div>
    <div class="card-body">
        <form method="POST">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="save">
            <div class="grid grid-2">
                <div class="form-group">
                    <label>Titulo</label>
                    <input type="text" name="title" value="<?= htmlspecialchars($editing['title'] ?? '') ?>" required>
                </div>
                <div class="form-group">
                    <label>Subtitulo</label>
                    <input type="text" name="subtitle" value="<?= htmlspecialchars($editing['subtitle'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>Imagen URL</label>
                    <input type="text" name="image" value="<?= htmlspecialchars($editing['image'] ?? '') ?>" placeholder="/images/banner.jpg">
                </div>
                <div class="form-group">
                    <label>Link</label>
                    <input type="text" name="link" value="<?= htmlspecialchars($editing['link'] ?? '') ?>" placeholder="/productos">
                </div>
                <div class="form-group">
                    <label>Texto del boton</label>
                    <input type="text" name="link_text" value="<?= htmlspecialchars($editing['link_text'] ?? '') ?>" placeholder="Ver Mas">
                </div>
                <div class="form-group">
                    <label>Posicion</label>
                    <select name="position">
                        <option value="home" <?= ($editing['position'] ?? '') === 'home' ? 'selected' : '' ?>>Inicio</option>
                        <option value="category" <?= ($editing['position'] ?? '') === 'category' ? 'selected' : '' ?>>Categoria</option>
                        <option value="all" <?= ($editing['position'] ?? '') === 'all' ? 'selected' : '' ?>>Todas las paginas</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Animacion</label>
                    <select name="animation">
                        <option value="fade" <?= ($editing['animation'] ?? '') === 'fade' ? 'selected' : '' ?>>Fade</option>
                        <option value="slide" <?= ($editing['animation'] ?? '') === 'slide' ? 'selected' : '' ?>>Slide</option>
                        <option value="zoom" <?= ($editing['animation'] ?? '') === 'zoom' ? 'selected' : '' ?>>Zoom</option>
                        <option value="none" <?= ($editing['animation'] ?? '') === 'none' ? 'selected' : '' ?>>Ninguna</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Orden</label>
                    <input type="number" name="sort_order" value="<?= $editing['sort_order'] ?? '0' ?>">
                </div>
                <div class="form-group">
                    <label>Color de fondo</label>
                    <input type="color" name="bg_color" value="<?= $editing['bg_color'] ?? '#0a1628' ?>">
                </div>
                <div class="form-group">
                    <label>Color de texto</label>
                    <input type="color" name="text_color" value="<?= $editing['text_color'] ?? '#ffffff' ?>">
                </div>
                <div class="form-group">
                    <label>Fecha inicio</label>
                    <input type="datetime-local" name="starts_at" value="<?= $editing['starts_at'] ? date('Y-m-d\TH:i', strtotime($editing['starts_at'])) : '' ?>">
                </div>
                <div class="form-group">
                    <label>Fecha fin</label>
                    <input type="datetime-local" name="expires_at" value="<?= $editing['expires_at'] ? date('Y-m-d\TH:i', strtotime($editing['expires_at'])) : '' ?>">
                </div>
            </div>
            <div class="form-group">
                <label><input type="checkbox" name="is_active" value="1" <?= ($editing['is_active'] ?? 1) ? 'checked' : '' ?>> Activo</label>
            </div>
            <div class="flex gap-3">
                <button type="submit" class="btn btn-primary"><?= $editing ? 'Actualizar' : 'Crear' ?></button>
                <a href="/admin/banners" class="btn btn-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
<?php endif; ?>

<div class="card">
    <div class="card-body" style="padding:0">
        <table class="table">
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
                <?php foreach ($banners as $b): ?>
                <tr>
                    <td><?= $b['sort_order'] ?></td>
                    <td><strong><?= htmlspecialchars($b['title']) ?></strong></td>
                    <td><?= ucfirst($b['position']) ?></td>
                    <td><?= ucfirst($b['animation']) ?></td>
                    <td><?= $b['is_active'] ? '<span class="badge badge-green">Si</span>' : '<span class="badge badge-red">No</span>' ?></td>
                    <td>
                        <a href="/admin/banners?edit=<?= $b['id'] ?>" class="btn btn-sm">Editar</a>
                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar?')">
                            <?= csrf_field() ?>
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="<?= $b['id'] ?>">
                            <button class="btn btn-sm btn-danger">Eliminar</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
</main>
</div>
<script src="/admin/assets/js/theme.js"></script>
</body>
</html>
