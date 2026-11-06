<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

/**
 * Load and cache catalogos/products.json indexed by SKU.
 * The catalog is the source of truth for the static frontend gallery.
 */
function loadCatalogIndex(): array {
    static $catalogCache = null;
    if ($catalogCache !== null) return $catalogCache;

    $catalogCache = [];
    $docRoot = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
    $candidates = [
        $docRoot . '/catalogos/products.json',
        dirname(dirname(__DIR__)) . '/catalogos/products.json',
        dirname(dirname(dirname(__DIR__))) . '/catalogos/products.json',
    ];
    foreach ($candidates as $cf) {
        if (!is_file($cf)) continue;
        $raw = @file_get_contents($cf);
        if ($raw === false) continue;
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) continue;
        foreach ($decoded as $cp) {
            if (!empty($cp['sku'])) $catalogCache[strtoupper(trim((string)$cp['sku']))] = $cp;
        }
        break;
    }
    return $catalogCache;
}

/**
 * Build the product gallery (array of image URLs).
 *
 * Priority:
 *  1. Admin-managed rows in `product_images` (uploads + manual additions).
 *  2. Catalog gallery from `catalogos/products.json` (the `images[]` array),
 *     which is exactly what the static frontend renders.
 *  3. The single `image` column as last resort.
 *
 * Both sources are merged so the admin panel and the public site always agree.
 */
function fetchProductImages(PDO $db, array $product): array {
    $images = [];
    $hidden = [];

    // 1) Admin-managed gallery rows
    try {
        $stmt = $db->prepare('SELECT url, hidden FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC');
        $stmt->execute([$product['id']]);
        foreach ($stmt->fetchAll() as $r) {
            $url = trim((string)$r['url']);
            if ($url === '') continue;
            if ((int)($r['hidden'] ?? 0) === 1) { $hidden[$url] = true; continue; }
            $images[] = $url;
        }
    } catch (Throwable $e) {
        try {
            $stmt = $db->prepare('SELECT url FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC');
            $stmt->execute([$product['id']]);
            foreach ($stmt->fetchAll(PDO::FETCH_COLUMN) as $url) {
                $url = trim((string)$url);
                if ($url !== '') $images[] = $url;
            }
        } catch (Throwable $e2) {
            // table missing - fall through to catalog
        }
    }

    // 2) Catalog gallery (source of truth for the static frontend)
    $catalog = loadCatalogIndex();
    $sku = strtoupper(trim((string)($product['sku'] ?? '')));
    if ($sku !== '' && isset($catalog[$sku])) {
        $catImgs = $catalog[$sku]['images'] ?? [];
        if (is_array($catImgs)) {
            foreach ($catImgs as $img) {
                $img = trim((string)$img);
                if ($img === '' || isset($hidden[$img])) continue;
                $images[] = $img;
            }
        }
    }

    // 3) Fallback: single image column
    if (empty($images) && !empty($product['image'])) {
        $images[] = $product['image'];
    }

    // Deduplicate, preserve order
    $seen = [];
    $out = [];
    foreach ($images as $img) {
        if (!isset($seen[$img])) {
            $seen[$img] = true;
            $out[] = $img;
        }
    }
    return $out;
}

/**
 * Build the gallery for many products using a SINGLE database query.
 * Used by the list endpoint so a page of products stays fast.
 */
function fetchProductImagesBulk(PDO $db, array $products): array {
    $result = [];
    if (empty($products)) return $result;

    // One query for every gallery row of every product in this page
    $byProduct = [];
    try {
        $ids = array_map(fn($p) => (int)$p['id'], $products);
        $ph = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $db->prepare("SELECT product_id, url, hidden FROM product_images WHERE product_id IN ($ph) ORDER BY is_primary DESC, sort_order ASC, id ASC");
        $stmt->execute($ids);
        foreach ($stmt->fetchAll() as $r) {
            $byProduct[(int)$r['product_id']][] = $r;
        }
    } catch (Throwable $e) {
        $byProduct = [];
    }

    $catalog = loadCatalogIndex();

    foreach ($products as $p) {
        $pid = (int)$p['id'];
        $images = [];
        $hidden = [];

        foreach (($byProduct[$pid] ?? []) as $r) {
            $url = trim((string)$r['url']);
            if ($url === '') continue;
            if ((int)($r['hidden'] ?? 0) === 1) { $hidden[$url] = true; continue; }
            $images[] = $url;
        }

        $sku = strtoupper(trim((string)($p['sku'] ?? '')));
        if ($sku !== '' && isset($catalog[$sku])) {
            $catImgs = $catalog[$sku]['images'] ?? [];
            if (is_array($catImgs)) {
                foreach ($catImgs as $img) {
                    $img = trim((string)$img);
                    if ($img === '' || isset($hidden[$img])) continue;
                    $images[] = $img;
                }
            }
        }

        if (empty($images) && !empty($p['image'])) {
            $images[] = $p['image'];
        }

        $seen = [];
        $out = [];
        foreach ($images as $img) {
            if (!isset($seen[$img])) {
                $seen[$img] = true;
                $out[] = $img;
            }
        }
        $result[$pid] = $out;
    }

    return $result;
}

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $slug = $_GET['slug'] ?? null;
        $sku = $_GET['sku'] ?? null;
        $category = $_GET['category'] ?? null;
        $subcategory = $_GET['subcategory'] ?? null;
        $search = $_GET['search'] ?? null;
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        // Ensure the gallery table exists (safe for shared hosting)
        try {
            $db->exec("CREATE TABLE IF NOT EXISTS product_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                url VARCHAR(500) NOT NULL,
                alt_text VARCHAR(255) DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_primary TINYINT(1) DEFAULT 0,
                hidden TINYINT(1) NOT NULL DEFAULT 0,
                INDEX idx_pi_product (product_id)
            )");
            $cols = $db->query("SHOW COLUMNS FROM product_images LIKE 'hidden'")->fetchAll();
            if (empty($cols)) {
                $db->exec("ALTER TABLE product_images ADD COLUMN hidden TINYINT(1) NOT NULL DEFAULT 0 AFTER is_primary");
            }
        } catch (Throwable $e) {
            // Keep going: the helpers fall back to the catalog gallery
        }

        if ($id || $slug || $sku) {
            $col = $slug ? 'p.slug' : ($sku ? 'p.sku' : 'p.id');
            $val = $slug ?: ($sku ?: $id);
            $stmt = $db->prepare("
                SELECT p.*, c.name as category_name, c.slug as category_slug,
                       s.name as subcategory_name, s.slug as subcategory_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN subcategories s ON p.subcategory_id = s.id
                WHERE $col = ?
            ");
            $stmt->execute([$val]);
            $product = $stmt->fetch();
            if (!$product) jsonError('Product not found', 404);
            $product['images'] = fetchProductImages($db, $product);
            jsonSuccess($product);
        }

        $where = ["p.is_active = 1"];
        $params = [];

        if ($category) {
            $where[] = "c.slug = ?";
            $params[] = $category;
        }
        if ($subcategory) {
            $where[] = "s.slug = ?";
            $params[] = $subcategory;
        }
        if ($search) {
            $where[] = "(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ? OR p.reference LIKE ?)";
            $term = "%$search%";
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $whereClause = implode(' AND ', $where);

        $countStmt = $db->prepare("SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN subcategories s ON p.subcategory_id = s.id WHERE $whereClause");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        $stmt = $db->prepare("
            SELECT p.*, c.name as category_name, c.slug as category_slug,
                   s.name as subcategory_name, s.slug as subcategory_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            WHERE $whereClause
            ORDER BY p.name ASC
            LIMIT $limit OFFSET $offset
        ");
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        // Attach the gallery to every product in the list (single query)
        $galleryMap = fetchProductImagesBulk($db, $products);
        foreach ($products as &$p) {
            $pid = (int)$p['id'];
            $p['images'] = $galleryMap[$pid] ?? [];
            if (empty($p['image']) && !empty($p['images'])) {
                $p['image'] = $p['images'][0];
            }
        }
        unset($p);

        jsonSuccess([
            'products' => $products,
            'pagination' => [
                'total' => intval($total),
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ]);
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['name']) || empty($data['sku'])) {
            jsonError('Name and SKU are required');
        }

        $slug = generateSlug($data['name']);
        $stmt = $db->prepare("SELECT id FROM products WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) $slug .= '-' . time();

        $stmt = $db->prepare("
            INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['sku'], $data['name'], $slug,
            $data['reference'] ?? '', $data['description'] ?? '',
            $data['image'] ?? '', $data['barcode'] ?? '',
            json_encode($data['specs'] ?? []),
            $data['category_id'] ?? 1, $data['subcategory_id'] ?? 1,
            $data['is_active'] ?? 1
        ]);
        jsonSuccess(['id' => $db->lastInsertId(), 'slug' => $slug], 'Product created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Product ID required');
        $data = getJsonBody();
        if (!$data) jsonError('No data provided');

        $fields = [];
        $params = [];
        $allowed = ['sku', 'name', 'slug', 'reference', 'description', 'image', 'barcode', 'specs', 'category_id', 'subcategory_id', 'is_active'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $val = $field === 'specs' ? json_encode($data[$field]) : $data[$field];
                $fields[] = "$field = ?";
                $params[] = $val;
            }
        }
        if (empty($fields)) jsonError('No valid fields');
        $params[] = $id;
        $db->prepare("UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Product updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('Product ID required');
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) jsonError('Product not found', 404);
        jsonSuccess(null, 'Product deleted');
        break;
}
