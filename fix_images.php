<?php
/**
 * STANDALONE FIX: Assign product images based on SKU
 * 
 * Upload this file to the ROOT of your website (public_html/)
 * Visit: https://equipos.atlanticopticalgroup.com/fix_images.php
 * Then DELETE this file immediately after use.
 */

// Database config
$db_host = 'localhost';
$db_name = 'azjnptoj_atlantic';
$db_user = 'azjnptoj_atlantic';
$db_pass = ''; // <-- FILL THIS with your MySQL password

if (empty($db_pass)) {
    die('<h1 style="color:red;font-family:sans-serif">ERROR: Fill in the database password in this file before running.</h1>');
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('<h1 style="color:red;font-family:sans-serif">DB Error: ' . htmlspecialchars($e->getMessage()) . '</h1>');
}

$updated = 0;
$skipped = 0;
$products = $pdo->query('SELECT id, sku, image FROM products ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);

foreach ($products as $p) {
    if (!empty($p['image']) && $p['image'] !== 'null') {
        $skipped++;
        continue;
    }
    $sku = trim($p['sku']);
    if ($sku === '') continue;
    $imagePath = '/images/extracted_images/' . $sku . '.jpg';
    $stmt = $pdo->prepare('UPDATE products SET image = ? WHERE id = ?');
    $stmt->execute([$imagePath, $p['id']]);
    $updated++;
}

?>
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Fix Images</title></head>
<body style="font-family:sans-serif;padding:40px;background:#0a0e1a;color:#d1d5db">
<h1 style="color:#60a5fa">Product Images Fixed</h1>
<p><strong style="color:#34d399"><?php echo $updated; ?></strong> products updated with image paths.</p>
<p><strong style="color:#9ca3af"><?php echo $skipped; ?></strong> products already had images (skipped).</p>
<p style="margin-top:20px;color:#f87171;font-weight:bold">DELETE THIS FILE NOW for security!</p>
<p><a href="/admin/productos" style="color:#60a5fa">Go to Admin Panel &rarr;</a></p>
</body>
</html>
