<?php require_once 'includes/auth.php';
$activePage = 'categorias';

$categories = $pdo->query("SELECT * FROM categories ORDER BY name")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Categorías — Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
<?php include 'includes/sidebar.php'; ?>

<main class="main-content">
    <header class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
            <button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open');document.querySelector('.sidebar-overlay').classList.toggle('active')">&#9776;</button>
            <h1>Categorías</h1>
        </div>
    </header>

    <div class="page-body">
        <div class="card">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Nombre</th><th>Slug</th><th>Descripción</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($categories as $c): ?>
                        <tr>
                            <td style="font-weight:500;"><?php echo htmlspecialchars($c['name']); ?></td>
                            <td style="font-family:monospace;font-size:12px;"><?php echo htmlspecialchars($c['slug']); ?></td>
                            <td><?php echo htmlspecialchars($c['description'] ?: '—'); ?></td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if (empty($categories)): ?>
                        <tr><td colspan="3" style="text-align:center; color:var(--text-muted); padding:40px;">No hay categorías</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>
</body>
</html>
