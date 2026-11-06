<?php
/**
 * Shared gallery resolver for the admin panel.
 *
 * Guarantees the admin panel shows exactly the same photos as the public
 * frontend:
 *   1. Rows in `product_images` (admin uploads + synced catalog photos)
 *   2. The `images[]` array from catalogos/products.json
 *   3. The single `image` column as fallback
 */

/** Locate and decode catalogos/products.json (cached per request). */
function admin_catalog_index() {
    static $index = null;
    if ($index !== null) return $index;

    $index = [];
    $docRoot = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
    $candidates = [
        $docRoot . '/catalogos/products.json',
        dirname(__DIR__, 2) . '/catalogos/products.json',
        dirname(__DIR__, 3) . '/catalogos/products.json',
    ];
    foreach ($candidates as $file) {
        if (!is_file($file)) continue;
        $raw = @file_get_contents($file);
        if ($raw === false) continue;
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) continue;
        foreach ($decoded as $cp) {
            if (!empty($cp['sku'])) $index[strtoupper(trim($cp['sku']))] = $cp;
        }
        break;
    }
    return $index;
}

/**
 * Return the gallery for a product as an array of rows:
 * ['url' => ..., 'alt_text' => ..., 'is_primary' => bool, 'id' => int|null, 'source' => 'db'|'catalog']
 */
function admin_product_gallery(PDO $db, array $product) {
    $rows = [];

    // 1) Admin-managed / synced rows
    $dbRows = [];
    try {
        $stmt = $db->prepare('SELECT id, url, alt_text, sort_order, is_primary, hidden FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC');
        $stmt->execute([$product['id']]);
        $dbRows = $stmt->fetchAll();
    } catch (Throwable $e) {
        // hidden column may not exist yet - retry without it
        try {
            $stmt = $db->prepare('SELECT id, url, alt_text, sort_order, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC');
            $stmt->execute([$product['id']]);
            $dbRows = $stmt->fetchAll();
        } catch (Throwable $e2) {
            $dbRows = [];
        }
    }

    $seen = [];
    $hidden = [];
    foreach ($dbRows as $r) {
        $url = trim((string)$r['url']);
        if ($url === '') continue;
        if ((int)($r['hidden'] ?? 0) === 1) {
            $hidden[$url] = true;   // explicitly removed in the admin panel
            continue;
        }
        if (isset($seen[$url])) continue;
        $seen[$url] = true;
        $rows[] = [
            'id' => intval($r['id']),
            'url' => $url,
            'alt_text' => (string)($r['alt_text'] ?? ''),
            'is_primary' => (int)($r['is_primary'] ?? 0) === 1,
            'source' => 'db',
        ];
    }

    // 2) Catalog gallery
    $index = admin_catalog_index();
    $sku = strtoupper(trim((string)($product['sku'] ?? '')));
    if ($sku !== '' && isset($index[$sku])) {
        foreach (($index[$sku]['images'] ?? []) as $img) {
            $img = trim((string)$img);
            if ($img === '' || isset($seen[$img]) || isset($hidden[$img])) continue;
            $seen[$img] = true;
            $rows[] = [
                'id' => null,
                'url' => $img,
                'alt_text' => '',
                'is_primary' => false,
                'source' => 'catalog',
            ];
        }
    }

    // 3) Fallback
    if (empty($rows) && !empty($product['image'])) {
        $rows[] = [
            'id' => null,
            'url' => $product['image'],
            'alt_text' => '',
            'is_primary' => true,
            'source' => 'column',
        ];
    }

    // Ensure exactly one primary
    $hasPrimary = false;
    foreach ($rows as $i => $r) {
        if ($r['is_primary']) {
            if ($hasPrimary) $rows[$i]['is_primary'] = false;
            else $hasPrimary = true;
        }
    }
    if (!$hasPrimary && !empty($rows)) $rows[0]['is_primary'] = true;

    return $rows;
}

/**
 * Gallery for many products at once (indexed by product id).
 */
function admin_gallery_map(PDO $db, array $products) {
    $map = [];
    if (empty($products)) return $map;

    $ids = array_map(fn($p) => intval($p['id']), $products);
    $ph = implode(',', array_fill(0, count($ids), '?'));
    $rows = [];
    try {
        $stmt = $db->prepare("SELECT id, product_id, url, alt_text, sort_order, is_primary, hidden FROM product_images WHERE product_id IN ($ph) ORDER BY is_primary DESC, sort_order ASC, id ASC");
        $stmt->execute($ids);
        $rows = $stmt->fetchAll();
    } catch (Throwable $e) {
        try {
            $stmt = $db->prepare("SELECT id, product_id, url, alt_text, sort_order, is_primary FROM product_images WHERE product_id IN ($ph) ORDER BY is_primary DESC, sort_order ASC, id ASC");
            $stmt->execute($ids);
            $rows = $stmt->fetchAll();
        } catch (Throwable $e2) {
            $rows = [];
        }
    }

    $byProduct = [];
    foreach ($rows as $r) {
        $byProduct[(int)$r['product_id']][] = $r;
    }

    $index = admin_catalog_index();

    foreach ($products as $p) {
        $pid = intval($p['id']);
        $out = [];
        $seen = [];
        $hidden = [];

        foreach (($byProduct[$pid] ?? []) as $r) {
            $url = trim((string)$r['url']);
            if ($url === '') continue;
            if ((int)($r['hidden'] ?? 0) === 1) {
                $hidden[$url] = true;
                continue;
            }
            if (isset($seen[$url])) continue;
            $seen[$url] = true;
            $out[] = [
                'id' => intval($r['id']),
                'url' => $url,
                'alt_text' => (string)($r['alt_text'] ?? ''),
                'is_primary' => (int)($r['is_primary'] ?? 0) === 1,
                'source' => 'db',
            ];
        }

        $sku = strtoupper(trim((string)($p['sku'] ?? '')));
        if ($sku !== '' && isset($index[$sku])) {
            foreach (($index[$sku]['images'] ?? []) as $img) {
                $img = trim((string)$img);
                if ($img === '' || isset($seen[$img]) || isset($hidden[$img])) continue;
                $seen[$img] = true;
                $out[] = ['id' => null, 'url' => $img, 'alt_text' => '', 'is_primary' => false, 'source' => 'catalog'];
            }
        }

        if (empty($out) && !empty($p['image'])) {
            $out[] = ['id' => null, 'url' => $p['image'], 'alt_text' => '', 'is_primary' => true, 'source' => 'column'];
        }

        $hasPrimary = false;
        foreach ($out as $i => $r) {
            if ($r['is_primary']) {
                if ($hasPrimary) $out[$i]['is_primary'] = false;
                else $hasPrimary = true;
            }
        }
        if (!$hasPrimary && !empty($out)) $out[0]['is_primary'] = true;

        $map[$pid] = $out;
    }

    return $map;
}
