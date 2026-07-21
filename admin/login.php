<?php
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/security.php';

init_session();

if (isset($_SESSION['admin_id'])) {
    header('Location: /admin/');
    exit;
}

$error = '';
if (isset($_GET['timeout'])) {
    $error = 'Sesion expirada. Inicia sesion de nuevo.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        $error = 'Completa todos los campos';
    } else {
        try {
            $stmt = db()->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                session_regenerate_id(true);
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_name'] = $user['name'];
                $_SESSION['admin_email'] = $user['email'];
                $_SESSION['last_activity'] = time();
                header('Location: /admin/');
                exit;
            } else {
                $error = 'Email o contrasena incorrectos';
            }
        } catch (PDOException $e) {
            $error = 'Error de conexion';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atlantic Optical International Limited - Admin Login</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" href="/favicon.ico">
    <script>var t=localStorage.getItem('admin-theme');document.documentElement.setAttribute('data-theme',t||'light');</script>
    <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg-body); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: var(--text-body); }
        .login-box { background: var(--bg-card); border-radius: 12px; padding: 40px; width: 100%; max-width: 400px; border: 1px solid var(--border-card); }
        .login-logo { text-align: center; margin-bottom: 32px; }
        .login-logo img { height: 80px; margin-bottom: 20px; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15)); }
        [data-theme="dark"] .login-logo img { filter: brightness(0) invert(1) drop-shadow(0 2px 8px rgba(255,255,255,0.15)); }
        .login-logo h1 { color: var(--text-header-title); font-size: 22px; margin: 0 0 6px; }
        .login-logo p { color: var(--text-muted); font-size: 14px; margin: 0; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; color: var(--text-label); font-size: 13px; margin-bottom: 6px; font-weight: 500; }
        .form-group input { width: 100%; padding: 12px 14px; background: var(--bg-form-input); border: 1px solid var(--border-input); border-radius: 8px; color: var(--text-input); font-size: 14px; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
        .form-group input:focus { border-color: var(--accent-primary); }
        .form-group input::placeholder { color: var(--text-input-placeholder); }
        .btn-login { width: 100%; padding: 14px; background: #1e3a5f; color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; }
        .btn-login:hover { background: #162d4a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(30,58,95,0.3); }
        .error-msg { background: var(--accent-status-inactive-bg); color: var(--accent-status-inactive-text); padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; text-align: center; }
        .theme-toggle-login { position: fixed; top: 16px; right: 16px; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 8px; padding: 8px 12px; cursor: pointer; color: var(--text-body); font-size: 13px; display: flex; align-items: center; gap: 6px; }
        .theme-toggle-login:hover { background: var(--bg-table-hover); }
    </style>
</head>
<body>
    <button class="theme-toggle-login" onclick="toggleLoginTheme()" id="loginThemeBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <span id="loginThemeLabel">Modo Oscuro</span>
    </button>
    <div class="login-box">
        <div class="login-logo">
            <img src="/images/logo-atlantic.png" alt="Atlantic Optical International Limited" style="width:200px;height:auto;max-width:100%">
            <h1 style="margin-top:12px">Atlantic Optical International Limited</h1>
            <p>Panel de Administracion</p>
        </div>

        <?php if ($error): ?>
            <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <?php echo csrf_field(); ?>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="admin@atlanticopticalgroup.com" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label>Contrasena</label>
                <input type="password" name="password" placeholder="Tu contrasena" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn-login">Iniciar Sesion</button>
        </form>
    </div>
    <script src="/admin/assets/js/theme.js"></script>
    <script>
    (function(){
        var saved = localStorage.getItem('admin-theme');
        if (!saved) saved = 'light';
        document.documentElement.setAttribute('data-theme', saved);
        updateLoginLabel();
    })();
    function toggleLoginTheme() {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('admin-theme', next);
        updateLoginLabel();
    }
    function updateLoginLabel() {
        var theme = document.documentElement.getAttribute('data-theme') || 'light';
        var label = document.getElementById('loginThemeLabel');
        var btn = document.getElementById('loginThemeBtn');
        if (!btn) return;
        if (theme === 'dark') {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span id="loginThemeLabel">Modo Claro</span>';
        } else {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span id="loginThemeLabel">Modo Oscuro</span>';
        }
    }
    </script>
</body>
</html>
