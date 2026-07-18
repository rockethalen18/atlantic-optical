<?php
require_once 'includes/db.php';

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['install'])) {
    try {
        // Create users table
        $pdo->exec("CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('admin', 'editor', 'customer') DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        // Check if admin exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute(['admin@atlanticopticalgroup.com']);
        if (!$stmt->fetch()) {
            $hash = password_hash('Atl@nt!c#2026$ecur3', PASSWORD_BCRYPT, ['cost' => 12]);
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')");
            $stmt->execute(['Admin', 'admin@atlanticopticalgroup.com', $hash]);
            $message = '✅ Admin user created! Email: admin@atlanticopticalgroup.com / Password: Atl@nt!c#2026$ecur3';
        } else {
            $message = 'ℹ️ Admin user already exists.';
        }
    } catch (PDOException $e) {
        $message = '❌ Error: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup — Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
<div class="login-wrapper">
    <div class="login-card">
        <div class="login-brand">
            <div class="logo">AO</div>
            <h1>Atlantic Optical</h1>
            <p>Admin Panel Setup</p>
        </div>
        <?php if ($message): ?>
            <div class="alert alert-<?php echo strpos($message, '❌') === 0 ? 'danger' : 'success'; ?>"><?php echo $message; ?></div>
        <?php endif; ?>
        <form method="POST">
            <button type="submit" name="install" class="btn btn-primary" style="width:100%;justify-content:center;">Install / Create Admin User</button>
        </form>
        <div class="login-footer">
            <a href="login.php">← Go to Login</a>
        </div>
    </div>
</div>
</body>
</html>
