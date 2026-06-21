<?php
/**
 * Atlantic Optical - Excel Import API
 * Import products from Excel files
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

// Note: On Banahosting, you need to install PhpSpreadsheet via composer
// or use a simpler CSV approach. This uses CSV as fallback.

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

if ($method !== 'POST') {
    jsonError('POST method required');
}

$userId = requireAdmin();

// Check for file upload
if (!isset($_FILES['file'])) {
    jsonError('No file uploaded');
}

$file = $_FILES['file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, ['csv', 'xlsx', 'xls'])) {
    jsonError('Invalid file type. Use CSV, XLSX, or XLS');
}

// Check file size (max 5MB)
if ($file['size'] > 5 * 1024 * 1024) {
    jsonError('File too large. Maximum size is 5MB');
}

$importMode = $_POST['mode'] ?? 'create'; // create, update, upsert

// Process CSV (most compatible with shared hosting)
if ($ext === 'csv') {
    $handle = fopen($file['tmp_name'], 'r');
    if (!$handle) jsonError('Cannot read file');

    $headers = fgetcsv($handle, 0, ',');
    if (!$headers) jsonError('Empty or invalid file');

    // Map headers to database fields
    $headerMap = [];
    $requiredFields = ['name', 'sku', 'base_cost_usd', 'weight_kg'];
    
    foreach ($headers as $i => $h) {
        $h = strtolower(trim(str_replace([' ', '-'], ['_', '_'], $h)));
        $headerMap[$i] = $h;
    }

    $results = [
        'total' => 0,
        'successful' => 0,
        'failed' => 0,
        'errors' => []
    ];

    // Get exchange rate and shipping for price calculation
    $stmtRate = $db->prepare("SELECT usd_to_mxn FROM exchange_rates ORDER BY id DESC LIMIT 1");
    $stmtRate->execute();
    $rate = $stmtRate->fetch();
    $exchangeRate = $rate ? $rate['usd_to_mxn'] : 17.50;

    $stmtShip = $db->prepare("SELECT price_per_kg_usd FROM shipping_rates WHERE method = 'maritimo' AND is_active = 1 LIMIT 1");
    $stmtShip->execute();
    $ship = $stmtShip->fetch();
    $shippingPerKg = $ship ? $ship['price_per_kg_usd'] : 4.50;

    $insertStmt = $db->prepare("
        INSERT INTO products (name, slug, sku, description, short_description, base_cost_usd, weight_kg, margin, price_mxn, category_id, stock, status, is_featured, is_new)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $updateStmt = $db->prepare("
        UPDATE products SET name = ?, description = ?, short_description = ?, base_cost_usd = ?, weight_kg = ?, margin = ?, price_mxn = ?, category_id = ?, stock = ?, status = ? WHERE sku = ?
    ");

    $catCache = [];

    while (($row = fgetcsv($handle, 0, ',')) !== false) {
        $results['total']++;
        
        try {
            $rowData = [];
            foreach ($headerMap as $i => $field) {
                if (isset($row[$i])) {
                    $rowData[$field] = trim($row[$i]);
                }
            }

            // Validate required fields
            foreach ($requiredFields as $rf) {
                if (empty($rowData[$rf])) {
                    throw new Exception("Missing required field: $rf");
                }
            }

            $name = $rowData['name'];
            $sku = $rowData['sku'];
            $baseCost = floatval($rowData['base_cost_usd']);
            $weight = floatval($rowData['weight_kg']);
            $margin = floatval($rowData['margin'] ?? 2.0);
            $description = $rowData['description'] ?? null;
            $shortDesc = $rowData['short_description'] ?? $rowData['short_desc'] ?? null;
            $stock = intval($rowData['stock'] ?? 0);
            $status = $rowData['status'] ?? 'published';
            $isFeatured = intval($rowData['is_featured'] ?? $rowData['featured'] ?? 0);
            $isNew = intval($rowData['is_new'] ?? $rowData['new'] ?? 0);

            // Resolve category
            $categoryId = null;
            $catName = $rowData['category'] ?? $rowData['category_name'] ?? null;
            if ($catName) {
                if (!isset($catCache[$catName])) {
                    $stmtCat = $db->prepare("SELECT id FROM categories WHERE name = ? OR slug = ?");
                    $slug = generateSlug($catName);
                    $stmtCat->execute([$catName, $slug]);
                    $cat = $stmtCat->fetch();
                    $catCache[$catName] = $cat ? $cat['id'] : null;
                }
                $categoryId = $catCache[$catName];
            }

            // Calculate price
            $priceMXN = calculatePriceMXN($baseCost, $margin, $shippingPerKg, $weight, $exchangeRate);

            // Check if product exists by SKU
            $stmtCheck = $db->prepare("SELECT id FROM products WHERE sku = ?");
            $stmtCheck->execute([$sku]);
            $existing = $stmtCheck->fetch();

            if ($existing) {
                if ($importMode === 'update' || $importMode === 'upsert') {
                    $updateStmt->execute([
                        $name, $description, $shortDesc, $baseCost, $weight, $margin, $priceMXN, $categoryId, $stock, $status, $sku
                    ]);
                    $results['successful']++;
                } else {
                    $results['errors'][] = ['row' => $results['total'], 'sku' => $sku, 'error' => 'SKU already exists'];
                    $results['failed']++;
                }
            } else {
                $slug = generateSlug($name);
                // Ensure unique slug
                $stmtSlug = $db->prepare("SELECT id FROM products WHERE slug = ?");
                $stmtSlug->execute([$slug]);
                if ($stmtSlug->fetch()) $slug .= '-' . time();

                $insertStmt->execute([
                    $name, $slug, $sku, $description, $shortDesc, $baseCost, $weight, $margin, $priceMXN, $categoryId, $stock, $status, $isFeatured, $isNew
                ]);
                $results['successful']++;
            }
        } catch (Exception $e) {
            $results['errors'][] = ['row' => $results['total'], 'error' => $e->getMessage()];
            $results['failed']++;
        }
    }

    fclose($handle);

    // Log import
    $stmtLog = $db->prepare("
        INSERT INTO import_logs (filename, total_rows, successful_rows, failed_rows, errors, imported_by)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmtLog->execute([
        $file['name'],
        $results['total'],
        $results['successful'],
        $results['failed'],
        json_encode($results['errors']),
        $userId
    ]);

    jsonSuccess($results, 'Import completed');
} else {
    jsonError('For XLSX files, please convert to CSV first or install PhpSpreadsheet on the server');
}
