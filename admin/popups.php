<?php
require_once __DIR__ . '/includes/security.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/sidebar.php';

init_session();
require_login();
CURRENT_PAGE = 'popups';

$editing = null;
$editId = $_GET['edit'] ?? null;
if ($editId) {
    $stmt = db()->prepare('SELECT * FROM popups WHERE id = ?');
    $stmt->execute([$editId]);
    $editing = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete') {
        $id = $_POST['id'] ?? 0;
        db()->prepare('DELETE FROM popups WHERE id = ?')->execute([$id]);
        header('Location: /admin/popups?msg=deleted');
        exit;
    }
    
    $data = [
        $_POST['title'] ?? '',
        $_POST['content'] ?? '',
        $_POST['image'] ?? null,
        $_POST['bg_color'] ?? '#ffffff',
        $_POST['text_color'] ?? '#1a1a1a',
        $_POST['button_text'] ?? null,
        $_POST['button_color'] ?? '#2563eb',
        $_POST['button_link'] ?? null,
        $_POST['position'] ?? 'center',
        $_POST['trigger'] ?? 'delay',
        intval($_POST['trigger_value'] ?? 3000),
        $_POST['frequency'] ?? 'once',
        isset($_POST['is_active']) ? 1 : 0,
        $_POST['starts_at'] ?: null,
        $_POST['expires_at'] ?: null,
    ];
    
    if ($editId) {
        $stmt = db()->prepare('UPDATE popups SET title=?, content=?, image=?, bg_color=?, text_color=?, button_text=?, button_color=?, button_link=?, position=?, `trigger`=?, trigger_value=?, frequency=?, is_active=?, starts_at=?, expires_at=? WHERE id=?');
        $data[] = $editId;
        $stmt->execute($data);
        header('Location: /admin/popups?msg=updated');
    } else {
        $stmt = db()->prepare('INSERT INTO popups (title, content, image, bg_color, text_color, button_text, button_color, button_link, position, `trigger`, trigger_value, frequency, is_active, starts_at, expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute($data);
        header('Location: /admin/popups?msg=created');
    }
    exit;
}

$popups = db()->query('SELECT * FROM popups ORDER BY created_at DESC')->fetchAll();
$msg = $_GET['msg'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Popups - Atlantic Optical International Limited</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.png">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
</head>
<body>
<?php include __DIR__ . '/includes/header.php'; ?>
<div class="layout">
<?php include __DIR__ . '/includes/sidebar.php'; ?>
<main class="main-content">
<div class="page-header">
    <div>
        <h1 class="page-title">Popups</h1>
        <p class="page-subtitle">Popups informativos personalizables</p>
    </div>
    <a href="/admin/popups?new=1" class="btn btn-primary">+ Nuevo Popup</a>
</div>

<?php if ($msg): ?>
<div class="alert alert-success"><?= $msg === 'created' ? 'Popup creado' : ($msg === 'updated' ? 'Popup actualizado' : 'Popup eliminado') ?></div>
<?php endif; ?>

<?php if ($editing || ($_GET['new'] ?? null)): ?>
<div class="card mb-6">
    <div class="card-header"><h2><?= $editing ? 'Editar Popup' : 'Nuevo Popup' ?></h2></div>
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
                    <label>Imagen URL</label>
                    <input type="text" name="image" value="<?= htmlspecialchars($editing['image'] ?? '') ?>">
                </div>
                <div class="form-group" style="grid-column:1/-1">
                    <label>Contenido (HTML permitido)</label>
                    <textarea name="content" rows="4" required><?= htmlspecialchars($editing['content'] ?? '') ?></textarea>
                </div>
                <div class="form-group">
                    <label>Texto del boton</label>
                    <input type="text" name="button_text" value="<?= htmlspecialchars($editing['button_text'] ?? '') ?>" placeholder="Ver Mas">
                </div>
                <div class="form-group">
                    <label>Link del boton</label>
                    <input type="text" name="button_link" value="<?= htmlspecialchars($editing['button_link'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>Posicion</label>
                    <select name="position">
                        <option value="center" <?= ($editing['position'] ?? '') === 'center' ? 'selected' : '' ?>>Centro</option>
                        <option value="bottom-right" <?= ($editing['position'] ?? '') === 'bottom-right' ? 'selected' : '' ?>>Abajo derecha</option>
                        <option value="bottom-left" <?= ($editing['position'] ?? '') === 'bottom-left' ? 'selected' : '' ?>>Abajo izquierda</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Trigger</label>
                    <select name="trigger">
                        <option value="delay" <?= ($editing['trigger'] ?? '') === 'delay' ? 'selected' : '' ?>>Despues de tiempo</option>
                        <option value="scroll" <?= ($editing['trigger'] ?? '') === 'scroll' ? 'selected' : '' ?>>Al hacer scroll</option>
                        <option value="exit-intent" <?= ($editing['trigger'] ?? '') === 'exit-intent' ? 'selected' : '' ?>>Al salir de pagina</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Trigger valor (ms o %)</label>
                    <input type="number" name="trigger_value" value="<?= $editing['trigger_value'] ?? '3000' ?>">
                </div>
                <div class="form-group">
                    <label>Frecuencia</label>
                    <select name="frequency">
                        <option value="once" <?= ($editing['frequency'] ?? '') === 'once' ? 'selected' : '' ?>>Una vez</option>
                        <option value="daily" <?= ($editing['frequency'] ?? '') === 'daily' ? 'selected' : '' ?>>Diario</option>
                        <option value="always" <?= ($editing['frequency'] ?? '') === 'always' ? 'selected' : '' ?>>Siempre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Color de fondo</label>
                    <input type="color" name="bg_color" value="<?= $editing['bg_color'] ?? '#ffffff' ?>">
                </div>
                <div class="form-group">
                    <label>Color de texto</label>
                    <input type="color" name="text_color" value="<?= $editing['text_color'] ?? '#1a1a1a' ?>">
                </div>
                <div class="form-group">
                    <label>Color del boton</label>
                    <input type="color" name="button_color" value="<?= $editing['button_color'] ?? '#2563eb' ?>">
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
                <a href="/admin/popups" class="btn btn-secondary">Cancelar</a>
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
                    <th>Titulo</th>
                    <th>Posicion</th>
                    <th>Trigger</th>
                    <th>Frecuencia</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($popups as $p): ?>
                <tr>
                    <td><strong><?= htmlspecialchars($p['title']) ?></strong></td>
                    <td><?= ucfirst($p['position']) ?></td>
                    <td><?= $p['trigger'] ?> (<?= $p['trigger_value'] ?>)</td>
                    <td><?= ucfirst($p['frequency']) ?></td>
                    <td><?= $p['is_active'] ? '<span class="badge badge-green">Si</span>' : '<span class="badge badge-red">No</span>' ?></td>
                    <td>
                        <a href="/admin/popups?edit=<?= $p['id'] ?>" class="btn btn-sm">Editar</a>
                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar?')">
                            <?= csrf_field() ?>
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="<?= $p['id'] ?>">
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
