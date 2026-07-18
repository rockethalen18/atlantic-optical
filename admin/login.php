<?php
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';

session_start();

if (isset($_SESSION['admin_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        $error = 'Completa todos los campos';
    } else {
        try {
            $stmt = db()->prepare('SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_name'] = $user['name'];
                $_SESSION['admin_email'] = $user['email'];
                header('Location: index.php');
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
    <title>Atlantic Optical - Admin Login</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0a0e1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .login-box { background: #111827; border-radius: 12px; padding: 40px; width: 100%; max-width: 400px; border: 1px solid #1f2937; }
        .login-logo { text-align: center; margin-bottom: 32px; }
        .login-logo h1 { color: #fff; font-size: 22px; margin: 0 0 6px; }
        .login-logo p { color: #6b7280; font-size: 14px; margin: 0; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; color: #9ca3af; font-size: 13px; margin-bottom: 6px; font-weight: 500; }
        .form-group input { width: 100%; padding: 12px 14px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #fff; font-size: 14px; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
        .form-group input:focus { border-color: #3b82f6; }
        .form-group input::placeholder { color: #6b7280; }
        .btn-login { width: 100%; padding: 12px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-login:hover { background: #1d4ed8; }
        .error-msg { background: #7f1d1d; color: #fca5a5; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="login-box">
        <div class="login-logo">
            <h1><?php echo crm_icon('eye', 'login-icon'); ?> Atlantic Optical</h1>
            <p>Panel de Administracion</p>
        </div>

        <?php if ($error): ?>
            <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="admin@atlanticopticalgroup.com" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>
            <div class="form-group">
                <label>Contrasena</label>
                <input type="password" name="password" placeholder="Tu contrasena" required>
            </div>
            <button type="submit" class="btn-login">Iniciar Sesion</button>
        </form>
    </div>
</body>
</html>
