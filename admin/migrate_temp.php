<?php
define('CURRENT_PAGE', 'index');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

$results = [];

// Fix 1: Alter status ENUM to include active/inactive
try {
    db()->exec("ALTER TABLE products MODIFY COLUMN status ENUM('active','inactive','draft','published','archived','out_of_stock') DEFAULT 'active'");
    $results[] = ['ok', 'ENUM alterado correctamente'];
} catch (Exception $e) {
    $results[] = ['error', 'ENUM: ' . $e->getMessage()];
}

// Fix 2: Update products with NULL or empty status
try {
    $affected = db()->exec("UPDATE products SET status = 'active' WHERE status IS NULL OR status = ''");
    $results[] = ['ok', "Productos actualizados a 'active': $affected"];
} catch (Exception $e) {
    $results[] = ['error', 'Update NULL: ' . $e->getMessage()];
}

// Fix 3: Check column existence and add missing ones
$cols = [];
$colStmt = db()->query("SHOW COLUMNS FROM products");
foreach ($colStmt->fetchAll() as $col) {
    $cols[] = $col['Field'];
}

if (!in_array('reference', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN reference VARCHAR(100) DEFAULT NULL AFTER sku");
        $results[] = ['ok', 'Columna reference agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add reference: ' . $e->getMessage()];
    }
}
if (!in_array('barcode', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN barcode VARCHAR(100) DEFAULT NULL AFTER image");
        $results[] = ['ok', 'Columna barcode agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add barcode: ' . $e->getMessage()];
    }
}
if (!in_array('specs', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN specs JSON DEFAULT NULL AFTER barcode");
        $results[] = ['ok', 'Columna specs agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add specs: ' . $e->getMessage()];
    }
}
if (!in_array('price_mxn', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN price_mxn DECIMAL(10,2) DEFAULT NULL AFTER margin");
        $results[] = ['ok', 'Columna price_mxn agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add price_mxn: ' . $e->getMessage()];
    }
}
if (!in_array('compare_price_mxn', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN compare_price_mxn DECIMAL(10,2) DEFAULT NULL AFTER price_mxn");
        $results[] = ['ok', 'Columna compare_price_mxn agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add compare_price_mxn: ' . $e->getMessage()];
    }
}
if (!in_array('short_description', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN short_description VARCHAR(500) DEFAULT NULL AFTER description");
        $results[] = ['ok', 'Columna short_description agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add short_description: ' . $e->getMessage()];
    }
}
if (!in_array('base_cost_usd', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN base_cost_usd DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER short_description");
        $results[] = ['ok', 'Columna base_cost_usd agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add base_cost_usd: ' . $e->getMessage()];
    }
}
if (!in_array('weight_kg', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN weight_kg DECIMAL(8,3) NOT NULL DEFAULT 0 AFTER base_cost_usd");
        $results[] = ['ok', 'Columna weight_kg agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add weight_kg: ' . $e->getMessage()];
    }
}
if (!in_array('margin', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN margin DECIMAL(5,2) NOT NULL DEFAULT 2.00 AFTER weight_kg");
        $results[] = ['ok', 'Columna margin agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add margin: ' . $e->getMessage()];
    }
}
if (!in_array('stock', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN stock INT DEFAULT 0 AFTER category_id");
        $results[] = ['ok', 'Columna stock agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add stock: ' . $e->getMessage()];
    }
}
if (!in_array('is_featured', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN is_featured TINYINT(1) DEFAULT 0 AFTER stock");
        $results[] = ['ok', 'Columna is_featured agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add is_featured: ' . $e->getMessage()];
    }
}
if (!in_array('is_new', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN is_new TINYINT(1) DEFAULT 0 AFTER is_featured");
        $results[] = ['ok', 'Columna is_new agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add is_new: ' . $e->getMessage()];
    }
}
if (!in_array('seo_title', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN seo_title VARCHAR(255) DEFAULT NULL AFTER is_new");
        $results[] = ['ok', 'Columna seo_title agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add seo_title: ' . $e->getMessage()];
    }
}
if (!in_array('seo_description', $cols)) {
    try {
        db()->exec("ALTER TABLE products ADD COLUMN seo_description TEXT DEFAULT NULL AFTER seo_title");
        $results[] = ['ok', 'Columna seo_description agregada'];
    } catch (Exception $e) {
        $results[] = ['error', 'Add seo_description: ' . $e->getMessage()];
    }
}

// Fix 4: Create subcategories table if missing
try {
    db()->exec("CREATE TABLE IF NOT EXISTS subcategories (
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
    $results[] = ['ok', 'Tabla subcategories verificada/creada'];
} catch (Exception $e) {
    $results[] = ['error', 'Subcategories table: ' . $e->getMessage()];
}

// Fix 5: Add parent_id to categories if missing
try {
    $catCols = [];
    $colStmt2 = db()->query("SHOW COLUMNS FROM categories");
    foreach ($colStmt2->fetchAll() as $col) { $catCols[] = $col['Field']; }
    if (!in_array('parent_id', $catCols)) {
        db()->exec("ALTER TABLE categories ADD COLUMN parent_id INT DEFAULT NULL AFTER image");
        $results[] = ['ok', 'Columna parent_id agregada a categories'];
    }
} catch (Exception $e) {
    $results[] = ['error', 'Categories parent_id: ' . $e->getMessage()];
}

// Fix 6: Populate subcategories from import_clean data if empty
try {
    $subCnt = db()->query('SELECT COUNT(*) FROM subcategories')->fetchColumn();
    if ($subCnt == 0) {
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
        $ins = db()->prepare('INSERT IGNORE INTO subcategories (id, category_id, name, slug) VALUES (?, ?, ?, ?)');
        foreach ($subs as $s) { $ins->execute($s); }
        $results[] = ['ok', count($subs) . ' subcategorias insertadas'];
    }
} catch (Exception $e) {
    $results[] = ['error', 'Insert subcategories: ' . $e->getMessage()];
}

// Show results
echo '<!DOCTYPE html><html><head><title>Migration 004</title><style>body{font-family:monospace;padding:20px;background:#1a1a2e;color:#e0e0e0}h1{color:#60a5fa}.ok{color:#4ade80}.error{color:#f87171}pre{background:#0f1629;padding:12px;border-radius:8px;overflow-x:auto}</style></head><body>';
echo '<h1>Migration 004: Fix products.status ENUM</h1>';
foreach ($results as [$type, $msg]) {
    echo '<p class="' . $type . '">[' . strtoupper($type) . '] ' . htmlspecialchars($msg) . '</p>';
}

// Verify
try {
    $row = db()->query("SHOW COLUMNS FROM products LIKE 'status'")->fetch();
    echo '<h2>Verificacion:</h2>';
    echo '<pre>' . htmlspecialchars($row['Type'] ?? 'NOT FOUND') . '</pre>';
    $cnt = db()->query("SELECT status, COUNT(*) as cnt FROM products GROUP BY status")->fetchAll();
    echo '<pre>';
    foreach ($cnt as $r) {
        echo htmlspecialchars($r['status'] . ': ' . $r['cnt']) . "\n";
    }
    echo '</pre>';
} catch (Exception $e) {
    echo '<p class="error">Verificacion fallida: ' . htmlspecialchars($e->getMessage()) . '</p>';
}

echo '<p><a href="/admin/productos" style="color:#60a5fa">Ir a Productos</a></p>';
echo '</body></html>';
