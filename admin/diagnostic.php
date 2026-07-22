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
<h2>1. Categories with parent_id (<?php echo $db->query('SELECT COUNT(*) FROM categories')->fetchColumn(); ?>)</h2>
<table><tr><th>ID</th><th>Name</th><th>parent_id</th><th>sort_order</th><th>is_active</th></tr>
<?php foreach ($db->query('SELECT id, name, parent_id, sort_order, is_active FROM categories ORDER BY parent_id ASC, sort_order ASC, id ASC') as $r): ?>
<tr><td><?php echo $r['id']; ?></td><td><?php echo $r['name']; ?></td><td><?php echo $r['parent_id']; ?></td><td><?php echo $r['sort_order']; ?></td><td><?php echo $r['is_active']; ?></td></tr>
<?php endforeach; ?></table>

<h2>2. Hierarchy View</h2>
<?php
$all = $db->query('SELECT id, name, parent_id FROM categories ORDER BY parent_id ASC, sort_order ASC, name ASC')->fetchAll();
$parents = [];
$children = [];
foreach ($all as $c) {
    if ($c['parent_id'] == 0) $parents[] = $c;
    else $children[$c['parent_id']][] = $c;
}
foreach ($parents as $p):
    $kids = $children[$p['id']] ?? [];
?>
<p><b><?php echo $p['id']; ?>. <?php echo $p['name']; ?></b> (<?php echo count($kids); ?> subcategorias)</p>
<?php foreach ($kids as $k): ?>
<p style="margin-left:20px"><?php echo $k['id']; ?>. <?php echo $k['name']; ?></p>
<?php endforeach;
endforeach; ?>

<h2>3. Products by category (<?php echo $db->query('SELECT COUNT(*) FROM products')->fetchColumn(); ?> products)</h2>
<table><tr><th>category_id</th><th>Category Name</th><th>Product Count</th></tr>
<?php foreach ($db->query('SELECT p.category_id, c.name, COUNT(*) as cnt FROM products p LEFT JOIN categories c ON p.category_id = c.id GROUP BY p.category_id ORDER BY cnt DESC') as $r): ?>
<tr><td><?php echo $r['category_id']; ?></td><td><?php echo $r['name']; ?></td><td><?php echo $r['cnt']; ?></td></tr>
<?php endforeach; ?></table>

<h2>4. Products table columns:</h2>
<table><tr><th>Field</th><th>Type</th></tr>
<?php foreach ($db->query('SHOW COLUMNS FROM products') as $r): ?>
<tr><td><?php echo $r['Field']; ?></td><td><?php echo $r['Type']; ?></td></tr>
<?php endforeach; ?></table>

<p><a href="/admin/productos">→ Productos</a> | <a href="/admin/migrate_temp">→ Migration</a></p>
</body></html>
