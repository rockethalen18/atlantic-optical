<?php
define('CURRENT_PAGE', 'popups');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$editing = null;
$editId = $_GET['edit'] ?? null;
if ($editId) {
    $stmt = db()->prepare('SELECT * FROM popups WHERE id = ?');
    $stmt->execute([$editId]);
    $editing = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
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
        $_POST['trigger_type'] ?? 'delay',
        intval($_POST['trigger_value'] ?? 3000),
        $_POST['frequency'] ?? 'once',
        isset($_POST['is_active']) ? 1 : 0,
        $_POST['starts_at'] ?: null,
        $_POST['expires_at'] ?: null,
    ];
    
    if ($editId) {
        $stmt = db()->prepare('UPDATE popups SET title=?, content=?, image=?, bg_color=?, text_color=?, button_text=?, button_color=?, button_link=?, position=?, trigger_type=?, trigger_value=?, frequency=?, is_active=?, starts_at=?, expires_at=? WHERE id=?');
        $data[] = $editId;
        $stmt->execute($data);
        header('Location: /admin/popups?msg=updated');
    } else {
        $stmt = db()->prepare('INSERT INTO popups (title, content, image, bg_color, text_color, button_text, button_color, button_link, position, trigger_type, trigger_value, frequency, is_active, starts_at, expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
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
    <title>Popups - Atlantic Optical International Limited Admin</title>
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
                <h1>Popups</h1>
                <div class="crm-header-actions">
                    <a href="/admin/popups?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo Popup</a>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($msg): ?>
                <div class="alert alert-success"><?php echo $msg === 'created' ? 'Popup creado' : ($msg === 'updated' ? 'Popup actualizado' : 'Popup eliminado'); ?></div>
                <?php endif; ?>

                <?php if ($editing || (isset($_GET['new']) && $_GET['new'])): ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $editing ? 'Editar Popup' : 'Nuevo Popup'; ?></h2></div>
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
                                    <label>Imagen URL</label>
                                    <input type="text" name="image" value="<?php echo htmlspecialchars($editing['image'] ?? ''); ?>">
                                </div>
                                <div class="form-group" style="grid-column:1/-1">
                                    <label>Contenido</label>
                                    <textarea name="content" rows="4" required><?php echo htmlspecialchars($editing['content'] ?? ''); ?></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Texto del boton</label>
                                    <input type="text" name="button_text" value="<?php echo htmlspecialchars($editing['button_text'] ?? ''); ?>" placeholder="Ver Mas">
                                </div>
                                <div class="form-group">
                                    <label>Link del boton</label>
                                    <input type="text" name="button_link" value="<?php echo htmlspecialchars($editing['button_link'] ?? ''); ?>">
                                </div>
                                <div class="form-group">
                                    <label>Posicion</label>
                                    <select name="position">
                                        <option value="center" <?php echo ($editing['position'] ?? '') === 'center' ? 'selected' : ''; ?>>Centro</option>
                                        <option value="bottom-right" <?php echo ($editing['position'] ?? '') === 'bottom-right' ? 'selected' : ''; ?>>Abajo derecha</option>
                                        <option value="bottom-left" <?php echo ($editing['position'] ?? '') === 'bottom-left' ? 'selected' : ''; ?>>Abajo izquierda</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Trigger</label>
                                    <select name="trigger_type">
                                        <option value="delay" <?php echo ($editing['trigger_type'] ?? '') === 'delay' ? 'selected' : ''; ?>>Despues de tiempo</option>
                                        <option value="scroll" <?php echo ($editing['trigger_type'] ?? '') === 'scroll' ? 'selected' : ''; ?>>Al hacer scroll</option>
                                        <option value="exit-intent" <?php echo ($editing['trigger_type'] ?? '') === 'exit-intent' ? 'selected' : ''; ?>>Al salir de pagina</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Trigger valor (ms o %)</label>
                                    <input type="number" name="trigger_value" value="<?php echo $editing['trigger_value'] ?? '3000'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Frecuencia</label>
                                    <select name="frequency">
                                        <option value="once" <?php echo ($editing['frequency'] ?? '') === 'once' ? 'selected' : ''; ?>>Una vez</option>
                                        <option value="daily" <?php echo ($editing['frequency'] ?? '') === 'daily' ? 'selected' : ''; ?>>Diario</option>
                                        <option value="always" <?php echo ($editing['frequency'] ?? '') === 'always' ? 'selected' : ''; ?>>Siempre</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Color de fondo</label>
                                    <input type="color" name="bg_color" value="<?php echo $editing['bg_color'] ?? '#ffffff'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Color de texto</label>
                                    <input type="color" name="text_color" value="<?php echo $editing['text_color'] ?? '#1a1a1a'; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Color del boton</label>
                                    <input type="color" name="button_color" value="<?php echo $editing['button_color'] ?? '#2563eb'; ?>">
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
                                <a href="/admin/popups" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
                <?php endif; ?>

                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo count($popups); ?> popup(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
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
                                <?php if (empty($popups)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No hay popups</td></tr>
                                <?php else: ?>
                                <?php foreach ($popups as $p): ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($p['title']); ?></strong></td>
                                    <td><?php echo ucfirst($p['position']); ?></td>
                                    <td><?php echo $p['trigger_type']; ?> (<?php echo $p['trigger_value']; ?>)</td>
                                    <td><?php echo ucfirst($p['frequency']); ?></td>
                                    <td><?php echo $p['is_active'] ? '<span class="status-badge status-active">Activo</span>' : '<span class="status-badge status-inactive">Inactivo</span>'; ?></td>
                                    <td class="actions-cell">
                                        <a href="/admin/popups?edit=<?php echo $p['id']; ?>" class="btn-sm"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline" onsubmit="return confirm('Eliminar este popup?')">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $p['id']; ?>">
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
