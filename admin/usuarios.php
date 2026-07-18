<?php require_once 'includes/auth.php';
$activePage = 'usuarios';

$users = $pdo->query("SELECT id, name, email, role, created_at FROM users ORDER BY id")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuarios — Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
<?php include 'includes/sidebar.php'; ?>

<main class="main-content">
    <header class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
            <button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open');document.querySelector('.sidebar-overlay').classList.toggle('active')">&#9776;</button>
            <h1>Usuarios</h1>
        </div>
    </header>

    <div class="page-body">
        <div class="card">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Creado</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $u): ?>
                        <tr>
                            <td style="font-weight:500;"><?php echo htmlspecialchars($u['name']); ?></td>
                            <td><?php echo htmlspecialchars($u['email']); ?></td>
                            <td><span class="badge badge-<?php echo $u['role']==='admin'?'green':'blue'; ?>"><?php echo $u['role']; ?></span></td>
                            <td><?php echo date('d/m/Y', strtotime($u['created_at'])); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>
</body>
</html>
