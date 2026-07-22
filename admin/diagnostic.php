<?php
define('CURRENT_PAGE', 'index');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
$db = db();
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Diagnostic</title>
<style>body{font-family:monospace;padding:20px;background:#0f172a;color:#e2e8f0}table{border-collapse:collapse;width:100%;margin:10px 0}th,td{border:1px solid #334155;padding:6px 10px;text-align:left;font-size:12px}th{background:#1e293b;color:#94a3b8}td{color:#e2e8f0}.ok{color:#4ade80}.err{color:#f87171}h2{color:#60a5fa;margin-top:20px}a{color:#60a5fa}
</style></head><body>
<h2>1. Categories (<?php echo $db->query('SELECT COUNT(*) FROM categories')->fetchColumn(); ?>)</h2>
<table><tr><th>ID</th><th>Name</th><th>is_active</th></tr>
<?php foreach ($db->query('SELECT id, name, is_active FROM categories ORDER BY id') as $r): ?>
<tr><td><?php echo $r['id']; ?></td><td><?php echo $r['name']; ?></td><td><?php echo $r['is_active']; ?></td></tr>
<?php endforeach; ?></table>

<h2>2. Subcategories (<?php echo $db->query('SELECT COUNT(*) FROM subcategories')->fetchColumn(); ?>)</h2>
<table><tr><th>ID</th><th>Name</th><th>category_id (parent)</th><th>is_active</th></tr>
<?php foreach ($db->query('SELECT id, name, category_id, is_active FROM subcategories ORDER BY category_id, id') as $r): ?>
<tr><td><?php echo $r['id']; ?></td><td><?php echo $r['name']; ?></td><td><?php echo $r['category_id']; ?></td><td><?php echo $r['is_active']; ?></td></tr>
<?php endforeach; ?></table>

<h2>3. Products (<?php echo $db->query('SELECT COUNT(*) FROM products')->fetchColumn(); ?>)</h2>
<table><tr><th>ID</th><th>SKU</th><th>Name</th><th>category_id</th><th>status</th><th>price_mxn</th></tr>
<?php foreach ($db->query('SELECT id, sku, name, category_id, status, price_mxn FROM products ORDER BY id LIMIT 20') as $r): ?>
<tr><td><?php echo $r['id']; ?></td><td><?php echo $r['sku']; ?></td><td><?php echo $r['name']; ?></td><td><?php echo $r['category_id']; ?></td><td><?php echo $r['status']; ?></td><td><?php echo $r['price_mxn']; ?></td></tr>
<?php endforeach; ?></table>

<h2>4. Products table columns:</h2>
<table><tr><th>Field</th><th>Type</th></tr>
<?php foreach ($db->query('SHOW COLUMNS FROM products') as $r): ?>
<tr><td><?php echo $r['Field']; ?></td><td><?php echo $r['Type']; ?></td></tr>
<?php endforeach; ?></table>

<h2>5. Subcategories table columns:</h2>
<table><tr><th>Field</th><th>Type</th></tr>
<?php foreach ($db->query('SHOW COLUMNS FROM subcategories') as $r): ?>
<tr><td><?php echo $r['Field']; ?></td><td><?php echo $r['Type']; ?></td></tr>
<?php endforeach; ?></table>

<p><a href="/admin/productos">→ Productos</a></p>
</body></html>
