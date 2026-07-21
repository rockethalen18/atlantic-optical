<?php
$sessionDir = __DIR__ . '/includes/sessions';
if (!is_dir($sessionDir)) {
    mkdir($sessionDir, 0733, true);
}
ini_set('session.save_path', $sessionDir);
session_start();

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';

$message = '';
$error = '';

$adminCount = 0;
try {
    $adminCount = db()->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
} catch (PDOException $e) {
    // Table might not exist yet
}

if ($adminCount > 0) {
    header('Location: /admin/login');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create_user') {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if ($name === '' || $email === '' || $password === '') {
            $error = 'Completa todos los campos';
        } elseif (strlen($password) < 8) {
            $error = 'Minimo 8 caracteres';
        } else {
            try {
                $stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
                $stmt->execute([$email]);
                if ($stmt->fetch()) {
                    $error = 'Ya existe un usuario con ese email';
                } else {
                    $hash = password_hash($password, PASSWORD_DEFAULT);
                    $stmt2 = db()->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
                    $stmt2->execute([$name, $email, $hash, 'admin']);
                    $message = 'Usuario creado. Redirigiendo al login...';
                    header('Refresh: 2; url=/admin/login');
                }
            } catch (PDOException $e) {
                $error = 'Error: ' . $e->getMessage();
            }
        }
    }

    if ($action === 'create_tables') {
        try {
            $sql = file_get_contents(__DIR__ . '/../database/banahosting_setup.sql');
            if ($sql) {
                db()->exec($sql);
                $message = 'Tablas creadas correctamente';
            } else {
                $error = 'No se encontro banahosting_setup.sql';
            }
        } catch (PDOException $e) {
            $error = 'Error creando tablas: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup - Atlantic Optical Admin</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
    <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0a0e1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .setup-box { background: #111827; border-radius: 12px; padding: 40px; width: 100%; max-width: 500px; border: 1px solid #1f2937; }
        .setup-box h1 { color: #fff; margin: 0 0 8px; font-size: 22px; }
        .setup-box .subtitle { color: #6b7280; margin: 0 0 24px; font-size: 14px; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .alert-success { background: #064e3b; color: #6ee7b7; border: 1px solid #065f46; }
        .alert-error { background: #7f1d1d; color: #fca5a5; border: 1px solid #991b1b; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; color: #9ca3af; font-size: 13px; margin-bottom: 4px; }
        .form-group input { width: 100%; padding: 10px 12px; background: #1f2937; border: 1px solid #374151; border-radius: 6px; color: #fff; font-size: 14px; box-sizing: border-box; }
        .form-group input:focus { outline: none; border-color: #3b82f6; }
        .btn { padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; box-sizing: border-box; }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-green { background: #065f46; color: #fff; }
        .btn-green:hover { background: #047857; }
    </style>
</head>
<body>
    <div class="setup-box">
        <h1><?php echo crm_icon('eye'); ?> Atlantic Optical</h1>
        <p class="subtitle">Configuracion inicial — solo accesible una vez</p>

        <?php if ($message): ?>
            <div class="alert alert-success"><?php echo $message; ?></div>
        <?php endif; ?>
        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo $error; ?></div>
        <?php endif; ?>

        <?php if ($adminCount === 0): ?>

        <form method="POST">
            <input type="hidden" name="action" value="create_tables">
            <button type="submit" class="btn btn-green">1. Crear Tablas en MySQL</button>
        </form>

        <form method="POST" style="margin-top: 16px;">
            <input type="hidden" name="action" value="create_user">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" name="name" placeholder="Tu nombre" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="admin@atlanticopticalgroup.com" required>
            </div>
            <div class="form-group">
                <label>Contrasena (minimo 8 caracteres)</label>
                <input type="password" name="password" placeholder="Minimo 8 caracteres" required minlength="8">
            </div>
            <button type="submit" class="btn btn-primary">2. Crear Usuario Admin</button>
        </form>

        <?php else: ?>

        <div class="alert alert-success">
            Ya existe un admin. <a href="/admin/login" style="color:#6ee7b7;">Ir al Login</a>
        </div>

        <?php endif; ?>
    </div>
</body>
</html>
