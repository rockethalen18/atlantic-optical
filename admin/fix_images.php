<?php
/**
 * One-time script to assign product images based on SKU.
 * Run once: visit /admin/fix_images.php
 * Then DELETE this file for security.
 */
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$updated = 0;
$skipped = 0;
$noimage = 0;
$errors = [];

$products = db()->query('SELECT id, sku, image FROM products ORDER BY id')->fetchAll();

foreach ($products as $p) {
    if (!empty($p['image']) && $p['image'] !== 'null') {
        $skipped++;
        continue;
    }
    $sku = trim($p['sku']);
    if ($sku === '') {
        $errors[] = "Product #{$p['id']}: no SKU";
        continue;
    }
    $imagePath = '/images/products/' . $sku . '.jpg';
    db()->prepare('UPDATE products SET image = ? WHERE id = ?')->execute([$imagePath, $p['id']]);
    $updated++;
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Fix Product Images</title>
    <link rel="stylesheet" href="assets/css/crm.css">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script>var t=localStorage.getItem('admin-theme');if(t)document.documentElement.setAttribute('data-theme',t);</script>
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header"><h1>Fix Product Images</h1></header>
            <div class="crm-content">
                <div class="crm-card">
                    <div class="crm-card-body">
                        <p style="color:#d1d5db;font-size:14px;margin-bottom:12px">
                            <strong style="color:#60a5fa"><?php echo $updated; ?></strong> productos actualizados con imagen.<br>
                            <strong style="color:#9ca3af"><?php echo $skipped; ?></strong> productos ya tenían imagen (sin cambio).
                        </p>
                        <?php if ($errors): ?>
                        <p style="color:#f87171;font-size:13px"><?php echo count($errors); ?> errores:</p>
                        <ul style="color:#f87171;font-size:12px">
                            <?php foreach ($errors as $e): ?><li><?php echo htmlspecialchars($e); ?></li><?php endforeach; ?>
                        </ul>
                        <?php endif; ?>
                        <p style="color:#6b7280;font-size:12px;margin-top:16px">
                            Ruta asignada: <code>/images/products/{SKU}.jpg</code><br>
                            <strong>Elimina este archivo despu&eacute;s de usarlo.</strong>
                        </p>
                        <a href="/admin/productos" class="btn-primary" style="display:inline-block;margin-top:12px">Ver Productos</a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
