<?php
define('CURRENT_PAGE', 'index');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();

$results = [];
$db = db();

// ─── 1. PRODUCTS TABLE: ENUM + columns ───
try {
    $db->exec("ALTER TABLE products MODIFY COLUMN status ENUM('active','inactive','draft','published','archived','out_of_stock') DEFAULT 'active'");
    $results[] = ['ok', 'ENUM status corregido'];
} catch (Exception $e) { $results[] = ['warn', 'ENUM: ' . $e->getMessage()]; }

try {
    $n = $db->exec("UPDATE products SET status = 'active' WHERE status IS NULL OR status = '' OR status NOT IN ('active','inactive','draft','published','archived','out_of_stock')");
    if ($n > 0) $results[] = ['ok', "$n productos sin status corregidos"];
} catch (Exception $e) { $results[] = ['warn', 'Status: ' . $e->getMessage()]; }

$cols = [];
foreach ($db->query("SHOW COLUMNS FROM products")->fetchAll() as $c) $cols[] = $c['Field'];

$missing = [
    'reference' => "ALTER TABLE products ADD COLUMN reference VARCHAR(100) DEFAULT NULL AFTER sku",
    'barcode' => "ALTER TABLE products ADD COLUMN barcode VARCHAR(100) DEFAULT NULL AFTER image",
    'specs' => "ALTER TABLE products ADD COLUMN specs JSON DEFAULT NULL AFTER barcode",
    'short_description' => "ALTER TABLE products ADD COLUMN short_description VARCHAR(500) DEFAULT NULL AFTER description",
    'base_cost_usd' => "ALTER TABLE products ADD COLUMN base_cost_usd DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER short_description",
    'weight_kg' => "ALTER TABLE products ADD COLUMN weight_kg DECIMAL(8,3) NOT NULL DEFAULT 0 AFTER base_cost_usd",
    'margin' => "ALTER TABLE products ADD COLUMN margin DECIMAL(5,2) NOT NULL DEFAULT 2.00 AFTER weight_kg",
    'price_mxn' => "ALTER TABLE products ADD COLUMN price_mxn DECIMAL(10,2) DEFAULT NULL AFTER margin",
    'compare_price_mxn' => "ALTER TABLE products ADD COLUMN compare_price_mxn DECIMAL(10,2) DEFAULT NULL AFTER price_mxn",
    'stock' => "ALTER TABLE products ADD COLUMN stock INT DEFAULT 0 AFTER category_id",
    'is_featured' => "ALTER TABLE products ADD COLUMN is_featured TINYINT(1) DEFAULT 0 AFTER stock",
    'is_new' => "ALTER TABLE products ADD COLUMN is_new TINYINT(1) DEFAULT 0 AFTER is_featured",
    'seo_title' => "ALTER TABLE products ADD COLUMN seo_title VARCHAR(255) DEFAULT NULL AFTER is_new",
    'seo_description' => "ALTER TABLE products ADD COLUMN seo_description TEXT DEFAULT NULL AFTER seo_title",
];
foreach ($missing as $col => $sql) {
    if (!in_array($col, $cols)) {
        try { $db->exec($sql); $results[] = ['ok', "Columna $col agregada"]; }
        catch (Exception $e) { $results[] = ['warn', "$col: " . $e->getMessage()]; }
    }
}

// ─── 2. PRODUCTS: fix category_id (ensure valid) ───
try {
    $n = $db->exec("UPDATE products SET category_id = 1 WHERE category_id IS NULL OR category_id = 0");
    if ($n > 0) $results[] = ['ok', "$n productos sin category_id asignados a Lab"];
} catch (Exception $e) { $results[] = ['warn', 'Fix cat: ' . $e->getMessage()]; }

// ─── 3. CATEGORIES: add parent_id + sort_order ───
try {
    $catCols = [];
    foreach ($db->query("SHOW COLUMNS FROM categories")->fetchAll() as $c) $catCols[] = $c['Field'];
    if (!in_array('parent_id', $catCols)) {
        $db->exec("ALTER TABLE categories ADD COLUMN parent_id INT DEFAULT 0 AFTER name");
        $results[] = ['ok', 'parent_id agregado a categories'];
    }
    if (!in_array('sort_order', $catCols)) {
        $db->exec("ALTER TABLE categories ADD COLUMN sort_order INT DEFAULT 0 AFTER is_active");
        $results[] = ['ok', 'sort_order agregado a categories'];
    }
    if (!in_array('slug', $catCols)) {
        $db->exec("ALTER TABLE categories ADD COLUMN slug VARCHAR(150) DEFAULT NULL AFTER name");
        $results[] = ['ok', 'slug agregado a categories'];
    }
} catch (Exception $e) { $results[] = ['warn', 'categories cols: ' . $e->getMessage()]; }

// ─── 4. CATEGORIES: build hierarchy using NAME matching ───
// The DB has 65 flat categories. We know the parents by name.
// Match every child to its parent using the parent name.
$parentNames = [
    'Equipos de Laboratorio',
    'Equipos de Oftalmología y Óptica',
    'Mobiliario',
    'Monitores y Optotipos',
];
try {
    $allCats = $db->query('SELECT id, name, parent_id FROM categories ORDER BY id')->fetchAll();
    $parentIds = [];
    foreach ($allCats as $c) {
        if (in_array($c['name'], $parentNames)) {
            $parentIds[$c['name']] = $c['id'];
            if ($c['parent_id'] != 0) {
                $db->prepare('UPDATE categories SET parent_id = 0 WHERE id = ?')->execute([$c['id']]);
            }
        }
    }
    $results[] = ['ok', 'Padres encontrados: ' . implode(', ', array_map(fn($n,$id) => "$n($id)", array_keys($parentIds), $parentIds))];
} catch (Exception $e) { $results[] = ['warn', 'Find parents: ' . $e->getMessage()]; }

// Now assign parent_id to ALL non-parent categories by name matching
$labKeywords = ['biseladora','calentador','centradora','esferómetro','esferometro','limpiador','medidor de espesor','perforadora','probador','pulidora','ranuradora','repuesto','tinturadora','uveómetro','uveometro','otro'];
$oftalKeywords = ['análisis','analisis','refractómetro','refractometro','caja de prisma','caja de prueba','cámara','camara','campo visual','fisioterapia','facoemulsificador','foróptero','foroptero','instrumental','lámpara','lampara','lente','lupa','microscopio','montura','oct','oftalmoscopio','probeta','pupilómetro','pupilometro','retinoscopio','tonómetro','tonometro'];
$mobiliarioKeywords = ['mesa','silla','automática','automatica','brazo de pared','movilidad reducida','elevación','elevacion','reclinable'];
$monitorKeywords = ['cartilla','control','monitor','optotipo','proyector','tablet'];

try {
    $updated = 0;
    $upd = $db->prepare('UPDATE categories SET parent_id = ?, sort_order = ? WHERE id = ?');
    
    foreach ($allCats as $c) {
        if (in_array($c['name'], $parentNames)) continue;
        
        $nameLower = mb_strtolower($c['name']);
        $parentId = 0;
        
        // Match by name keywords
        foreach ($labKeywords as $kw) {
            if (mb_strpos($nameLower, $kw) !== false) { $parentId = $parentIds['Equipos de Laboratorio'] ?? 1; break; }
        }
        if (!$parentId) {
            foreach ($oftalKeywords as $kw) {
                if (mb_strpos($nameLower, $kw) !== false) { $parentId = $parentIds['Equipos de Oftalmología y Óptica'] ?? 2; break; }
            }
        }
        if (!$parentId) {
            foreach ($mobiliarioKeywords as $kw) {
                if (mb_strpos($nameLower, $kw) !== false) { $parentId = $parentIds['Mobiliario'] ?? 3; break; }
            }
        }
        if (!$parentId) {
            foreach ($monitorKeywords as $kw) {
                if (mb_strpos($nameLower, $kw) !== false) { $parentId = $parentIds['Monitores y Optotipos'] ?? 4; break; }
            }
        }
        
        // Fallback: IDs 5-21=Lab, 22-47=Oftal, 48-57=Mobiliario, 58-65=Monitor
        if (!$parentId) {
            $id = intval($c['id']);
            if ($id >= 5 && $id <= 21) $parentId = 1;
            elseif ($id >= 22 && $id <= 47) $parentId = 2;
            elseif ($id >= 48 && $id <= 57) $parentId = 3;
            elseif ($id >= 58 && $id <= 65) $parentId = 4;
        }
        
        if ($parentId > 0) {
            $upd->execute([$parentId, $updated + 1, $c['id']]);
            $updated++;
        }
    }
    $results[] = ['ok', "$updated subcategorias asignadas a padres"];
} catch (Exception $e) { $results[] = ['warn', 'Assign parents: ' . $e->getMessage()]; }

// ─── 5. VERIFY hierarchy ───
try {
    $parentsCnt = $db->query("SELECT COUNT(*) FROM categories WHERE parent_id = 0 OR parent_id IS NULL")->fetchColumn();
    $childrenCnt = $db->query("SELECT COUNT(*) FROM categories WHERE parent_id > 0")->fetchColumn();
    $orphans = $db->query("SELECT COUNT(*) FROM categories WHERE parent_id = 0 AND name NOT IN ('Equipos de Laboratorio','Equipos de Oftalmología y Óptica','Mobiliario','Monitores y Optotipos')")->fetchColumn();
    $results[] = ['ok', "Jerarquia: $parentsCnt padres, $childrenCnt hijos, $orphans huerfanos"];
} catch (Exception $e) { $results[] = ['warn', 'Verify: ' . $e->getMessage()]; }

// ─── 6. DIAGNOSTIC: products by category ───
try {
    $rows = $db->query('SELECT p.category_id, c.name, COUNT(*) as cnt FROM products p LEFT JOIN categories c ON p.category_id = c.id GROUP BY p.category_id ORDER BY cnt DESC')->fetchAll();
    foreach ($rows as $r) {
        $results[] = ['ok', "Cat {$r['category_id']} ({$r['name']}): {$r['cnt']} productos"];
    }
} catch (Exception $e) { $results[] = ['warn', 'Diag: ' . $e->getMessage()]; }

// ─── 7. CLEANUP: drop empty subcategories table ───
try {
    $cnt = $db->query('SELECT COUNT(*) FROM subcategories')->fetchColumn();
    if ($cnt == 0) {
        $db->exec("DROP TABLE IF EXISTS subcategories");
        $results[] = ['ok', 'Tabla subcategories vacia eliminada'];
    } else {
        $results[] = ['ok', "subcategories tiene $cnt registros (no eliminada)"];
    }
} catch (Exception $e) { $results[] = ['warn', 'Drop sub: ' . $e->getMessage()]; }

// Show structure
$finalCols = [];
foreach ($db->query("SHOW COLUMNS FROM products")->fetchAll() as $c) $finalCols[] = $c['Field'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Migration - Atlantic Optical</title>
    <style>
        body{font-family:monospace;padding:20px;background:#0f172a;color:#e2e8f0}
        h1{color:#60a5fa;font-size:20px}h2{color:#94a3b8;font-size:14px;margin-top:24px}
        .ok{color:#4ade80}.warn{color:#fbbf24}.error{color:#f87171;font-weight:bold}
        .box{background:#1e293b;padding:16px;border-radius:8px;margin:8px 0;border:1px solid #334155}
        .cols{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
        .col{background:#334155;padding:4px 8px;border-radius:4px;font-size:12px}
        .col.missing{background:#7f1d1d;color:#fca5a5}
        a{color:#60a5fa;text-decoration:none}a:hover{text-decoration:underline}
    </style>
</head>
<body>
    <h1>🔧 Migration - Atlantic Optical</h1>
    <div class="box">
    <?php foreach ($results as [$type, $msg]): ?>
        <p class="<?php echo $type; ?>">[<?php echo strtoupper($type); ?>] <?php echo htmlspecialchars($msg); ?></p>
    <?php endforeach; ?>
    </div>

    <h2>Columnas products:</h2>
    <div class="cols">
    <?php $allExpected = ['id','name','slug','sku','reference','description','short_description','barcode','specs','base_cost_usd','weight_kg','margin','price_mxn','compare_price_mxn','category_id','stock','status','is_featured','is_new','seo_title','seo_description','created_at','updated_at'];
    foreach ($allExpected as $c): ?>
        <span class="col <?php if (!in_array($c, $finalCols)) echo 'missing'; ?>"><?php echo $c; ?></span>
    <?php endforeach; ?>
    </div>

    <h2>Resumen:</h2>
    <p>Productos: <?php echo $db->query('SELECT COUNT(*) FROM products')->fetchColumn(); ?></p>
    <p>Categorias: <?php echo $db->query('SELECT COUNT(*) FROM categories')->fetchColumn(); ?></p>
    <p>Padres: <?php echo $db->query('SELECT COUNT(*) FROM categories WHERE parent_id = 0 OR parent_id IS NULL')->fetchColumn(); ?></p>
    <p>Hijos: <?php echo $db->query('SELECT COUNT(*) FROM categories WHERE parent_id > 0')->fetchColumn(); ?></p>

    <div class="box" style="margin-top:24px">
        <p><a href="/admin/productos">→ Productos</a> | <a href="/admin/categorias">→ Categorias</a> | <a href="/admin/">→ Dashboard</a></p>
    </div>
</body>
</html>
