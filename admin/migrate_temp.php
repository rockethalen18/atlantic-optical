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
