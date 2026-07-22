<?php
/**
 * Atlantic Optical - Database Migration & Diagnostic
 * Auto-runs on visit. Safe to re-run.
 */
define('CURRENT_PAGE', 'index');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();

$results = [];
$db = db();

// 1. Fix ENUM
try {
    $db->exec("ALTER TABLE products MODIFY COLUMN status ENUM('active','inactive','draft','published','archived','out_of_stock') DEFAULT 'active'");
    $results[] = ['ok', 'ENUM status corregido'];
} catch (Exception $e) {
    $results[] = ['warn', 'ENUM: ' . $e->getMessage()];
}

// 2. Fix NULL/empty status
try {
    $n = $db->exec("UPDATE products SET status = 'active' WHERE status IS NULL OR status = '' OR status NOT IN ('active','inactive','draft','published','archived','out_of_stock')");
    $results[] = ['ok', "Productos sin status corregidos: $n"];
} catch (Exception $e) {
    $results[] = ['warn', 'Status update: ' . $e->getMessage()];
}

// 3. Check products columns
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
        catch (Exception $e) { $results[] = ['warn', "Columna $col: " . $e->getMessage()]; }
    }
}

// 4. Check if name/sku exist (critical for search)
if (!in_array('name', $cols)) {
    $results[] = ['error', 'CRITICO: Columna "name" no existe en products!'];
}
if (!in_array('sku', $cols)) {
    $results[] = ['error', 'CRITICO: Columna "sku" no existe en products!'];
}

// 5. Create subcategories table
try {
    $db->exec("CREATE TABLE IF NOT EXISTS subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image VARCHAR(500),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");
    $results[] = ['ok', 'Tabla subcategories verificada'];
} catch (Exception $e) {
    $results[] = ['error', 'Subcategories: ' . $e->getMessage()];
}

// 6. Populate subcategories
try {
    $cnt = $db->query('SELECT COUNT(*) FROM subcategories')->fetchColumn();
    if ($cnt == 0) {
        $subs = [
            [1,1,'Biseladoras Automaticas','biseladoras-automaticas'],
            [2,1,'Biseladoras Manuales','biseladoras-manuales'],
            [3,1,'Biseladoras Semiautomaticas','biseladoras-semiautomaticas'],
            [4,1,'Calentadores','calentadores'],
            [5,1,'Centradoras','centradoras'],
            [6,1,'Esferometros','esferometros'],
            [7,1,'Limpiadores Ultrasonicos','limpiadores-ultrasonicos'],
            [8,1,'Medidores de Espesor','medidores-de-espesor'],
            [9,1,'Otros Laboratorio','otros-laboratorio'],
            [10,1,'Perforadoras al Aire','perforadoras-al-aire'],
            [11,1,'Perforadoras para Plantilla','perforadoras-para-plantilla'],
            [12,1,'Probadores de Fotocromatico','probadores-de-fotocromatico'],
            [13,1,'Pulidoras Manuales','pulidoras-manuales'],
            [14,1,'Ranuradoras Manuales','ranuradoras-manuales'],
            [15,1,'Repuestos','repuestos'],
            [16,1,'Tinturadoras','tinturadoras'],
            [17,1,'Uveometros','uveometros'],
            [18,2,'Analisis de Gafas','analisis-de-gafas'],
            [19,2,'Auto Refractometros','auto-refractometros'],
            [20,2,'Auto Refractometros con Keratometro','auto-refractometros-con-keratometro'],
            [21,2,'Cajas de Prisma','cajas-de-prisma'],
            [22,2,'Cajas de Prueba','cajas-de-prueba'],
            [23,2,'Camara de Fondo','camara-de-fondo'],
            [24,2,'Equipos de Fisioterapia','equipos-de-fisioterapia'],
            [25,2,'Facoemulsificador','facoemulsificador'],
            [26,2,'Foropteros Manuales','foropteros-manuales'],
            [27,2,'Lamparas de Hendidura','lamparas-de-hendidura'],
            [28,2,'Lamparas Portatiles','lamparas-portatiles'],
            [29,2,'Lente de 3 Espejos','lente-de-3-espejos'],
            [30,2,'Lente de Aumento','lente-de-aumento'],
            [31,2,'Microscopio Quirurgico','microscopio-quirurgico'],
            [32,2,'Monturas de Prueba','monturas-de-prueba'],
            [33,2,'OCT','oct'],
            [34,2,'Oftalmoscopios','oftalmoscopios'],
            [35,2,'Probetas Desechables','probetas-desechables'],
            [36,2,'Pupilometros','pupilometros'],
            [37,2,'Retinoscopios','retinoscopios'],
            [38,2,'Tonometros de Contacto','tonometros-de-contacto'],
            [39,2,'Tonometros Metalicos','tonometros-metalicos'],
            [40,3,'Mesas de Elevacion','mesas-de-elevacion'],
            [41,3,'Mesas Dobles','mesas-dobles'],
            [42,3,'Mesas Multifuncional','mesas-multifuncional'],
            [43,3,'Sillas con Pedal','sillas-con-pedal'],
            [44,3,'Sillas para Optica','sillas-para-optica'],
            [45,4,'Cartillas','cartillas'],
            [46,4,'Monitores Estandar','monitores-estandar'],
            [47,4,'Monitores Verticales','monitores-verticales'],
            [48,4,'Optotipos con Soporte','optotipos-con-soporte'],
            [49,4,'Optotipos Electricos','optotipos-electricos'],
            [50,4,'Proyectores Graficos','proyectores-graficos'],
            [51,4,'Tablet LCD','tablet-lcd'],
        ];
        $ins = $db->prepare('INSERT IGNORE INTO subcategories (id, category_id, name, slug) VALUES (?, ?, ?, ?)');
        foreach ($subs as $s) $ins->execute($s);
        $results[] = ['ok', count($subs) . ' subcategorias insertadas'];
    } else {
        $results[] = ['ok', "$cnt subcategorias ya existen"];
    }
} catch (Exception $e) {
    $results[] = ['error', 'Insert subs: ' . $e->getMessage()];
}

// 7. Diagnostic: test search query
try {
    $cnt = $db->query("SELECT COUNT(*) FROM products WHERE name LIKE '%biseladora%'")->fetchColumn();
    $results[] = ['ok', "Busqueda 'biseladora': $cnt resultados"];
} catch (Exception $e) {
    $results[] = ['error', 'Search test: ' . $e->getMessage()];
}

// Show products table structure
$finalCols = [];
foreach ($db->query("SHOW COLUMNS FROM products")->fetchAll() as $c) $finalCols[] = $c['Field'];

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Migration - Atlantic Optical</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #0f172a; color: #e2e8f0; }
        h1 { color: #60a5fa; font-size: 20px; }
        h2 { color: #94a3b8; font-size: 14px; margin-top: 24px; }
        .ok { color: #4ade80; }
        .warn { color: #fbbf24; }
        .error { color: #f87171; font-weight: bold; }
        .box { background: #1e293b; padding: 16px; border-radius: 8px; margin: 8px 0; border: 1px solid #334155; }
        .cols { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .col { background: #334155; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .col.missing { background: #7f1d1d; color: #fca5a5; }
        a { color: #60a5fa; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>🔧 Atlantic Optical - Database Migration</h1>
    <div class="box">
    <?php foreach ($results as [$type, $msg]): ?>
        <p class="<?php echo $type; ?>">[<?php echo strtoupper($type); ?>] <?php echo htmlspecialchars($msg); ?></p>
    <?php endforeach; ?>
    </div>

    <h2>Columnas en products:</h2>
    <div class="cols">
    <?php
    $allExpected = ['id','name','slug','sku','reference','description','short_description','barcode','specs','base_cost_usd','weight_kg','margin','price_mxn','compare_price_mxn','category_id','stock','status','is_featured','is_new','seo_title','seo_description','created_at','updated_at'];
    foreach ($allExpected as $c): ?>
        <span class="col <?php if (!in_array($c, $finalCols)) echo 'missing'; ?>"><?php echo $c; ?></span>
    <?php endforeach; ?>
    </div>

    <h2>Productos: <?php echo $db->query('SELECT COUNT(*) FROM products')->fetchColumn(); ?></h2>
    <h2>Subcategorias: <?php echo $db->query('SELECT COUNT(*) FROM subcategories')->fetchColumn(); ?></h2>
    <h2>Categorias: <?php echo $db->query('SELECT COUNT(*) FROM categories')->fetchColumn(); ?></h2>

    <div class="box" style="margin-top: 24px;">
        <p><a href="/admin/productos">→ Ir a Productos</a> | <a href="/admin/">→ Dashboard</a></p>
    </div>
</body>
</html>
