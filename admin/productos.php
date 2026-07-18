<?php
define('CURRENT_PAGE', 'productos');
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/security.php';
require_login();
security_headers();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'save') {
        $id = sanitize_int($_POST['id'] ?? 0);
        $data = [
            'name' => trim($_POST['name'] ?? ''),
            'sku' => trim($_POST['sku'] ?? ''),
            'reference' => trim($_POST['reference'] ?? ''),
            'description' => trim($_POST['description'] ?? ''),
            'short_description' => trim($_POST['short_description'] ?? ''),
            'barcode' => trim($_POST['barcode'] ?? ''),
            'specs' => trim($_POST['specs'] ?? ''),
            'base_cost_usd' => sanitize_float($_POST['base_cost_usd'] ?? 0),
            'weight_kg' => sanitize_float($_POST['weight_kg'] ?? 0),
            'margin' => sanitize_float($_POST['margin'] ?? 0),
            'price_mxn' => sanitize_float($_POST['price_mxn'] ?? 0),
            'compare_price_mxn' => sanitize_float($_POST['compare_price_mxn'] ?? 0),
            'category_id' => sanitize_int($_POST['category_id'] ?? 0),
            'subcategory_id' => sanitize_int($_POST['subcategory_id'] ?? 0),
            'stock' => sanitize_int($_POST['stock'] ?? 0),
            'status' => in_array($_POST['status'] ?? '', ['active','inactive']) ? $_POST['status'] : 'active',
            'is_featured' => isset($_POST['is_featured']) ? 1 : 0,
            'is_new' => isset($_POST['is_new']) ? 1 : 0,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
            'seo_title' => trim($_POST['seo_title'] ?? ''),
            'seo_description' => trim($_POST['seo_description'] ?? ''),
        ];

        if ($data['name'] === '') {
            header('Location: /admin/productos?error=name_required');
            exit;
        }

        if ($data['slug'] === '') {
            $data['slug'] = preg_replace('/[^a-z0-9]+/', '-', strtolower($data['name']));
            $data['slug'] = trim($data['slug'], '-');
        }

        if ($id > 0) {
            $fields = [];
            $vals = [];
            foreach ($data as $k => $v) {
                $fields[] = "$k = ?";
                $vals[] = $v;
            }
            $vals[] = $id;
            $stmt = db()->prepare('UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?');
            $stmt->execute($vals);
        } else {
            $data['slug'] = $data['slug'] ?: preg_replace('/[^a-z0-9]+/', '-', strtolower($data['name']));
            $data['slug'] = trim($data['slug'], '-');
            $cols = array_keys($data);
            $placeholders = array_fill(0, count($cols), '?');
            $stmt = db()->prepare('INSERT INTO products (' . implode(',', $cols) . ') VALUES (' . implode(',', $placeholders) . ')');
            $stmt->execute(array_values($data));
        }
        header('Location: /admin/productos');
        exit;
    }

    if ($action === 'delete') {
        $delId = sanitize_int($_POST['id'] ?? 0);
        if ($delId > 0) {
            db()->prepare('DELETE FROM products WHERE id = ?')->execute([$delId]);
        }
        header('Location: /admin/productos');
        exit;
    }

    if ($action === 'toggle_status') {
        $setId = sanitize_int($_POST['id'] ?? 0);
        $newStatus = $_POST['new_status'] ?? '';
        if ($setId > 0 && in_array($newStatus, ['active','inactive'])) {
            db()->prepare('UPDATE products SET status = ? WHERE id = ?')->execute([$newStatus, $setId]);
        }
        header('Location: /admin/productos');
        exit;
    }
}

$editId = isset($_GET['edit']) ? intval($_GET['edit']) : 0;
$isNew = isset($_GET['new']);
$product = null;
$categories = db()->query('SELECT id, name FROM categories WHERE is_active = 1 ORDER BY name')->fetchAll();

if ($editId > 0) {
    $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$editId]);
    $product = $stmt->fetch();
    if (!$product) {
        header('Location: /admin/productos');
        exit;
    }
}

$search = trim($_GET['q'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($page - 1) * $perPage;

if ($search !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM products WHERE name LIKE ? OR sku LIKE ?');
    $countStmt->execute(["%$search%", "%$search%"]);
    $total = $countStmt->fetchColumn();
    $stmt = db()->prepare('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.name LIKE ? OR p.sku LIKE ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute(["%$search%", "%$search%", $perPage, $offset]);
} else {
    $total = db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $stmt = db()->prepare('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute([$perPage, $offset]);
}
$products = $stmt->fetchAll();
$totalPages = max(1, ceil($total / $perPage));
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo ($editId > 0 || $isNew) ? 'Editar Producto' : 'Productos'; ?> - Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
    <div class="crm-layout">
        <?php require_once __DIR__ . '/includes/sidebar.php'; ?>
        <main class="crm-main">
            <header class="crm-header">
                <h1><?php echo ($editId > 0 || $isNew) ? ($product ? 'Editar: ' . htmlspecialchars($product['name']) : 'Nuevo Producto') : 'Productos'; ?></h1>
                <div class="crm-header-actions">
                    <?php if ($editId > 0 || $isNew): ?>
                    <a href="/admin/productos" class="btn-secondary"><?php echo crm_icon('refresh'); ?> Cancelar</a>
                    <?php else: ?>
                    <a href="/admin/productos?new=1" class="btn-primary"><?php echo crm_icon('plus'); ?> Nuevo Producto</a>
                    <form method="GET" class="search-form">
                        <?php echo crm_icon('search'); ?>
                        <input type="text" name="q" placeholder="Buscar por nombre o SKU..." value="<?php echo htmlspecialchars($search); ?>">
                        <?php if ($search): ?>
                        <a href="/admin/productos" class="btn-clear"><?php echo crm_icon('x'); ?></a>
                        <?php endif; ?>
                    </form>
                    <?php endif; ?>
                </div>
            </header>
            <div class="crm-content">
                <?php if ($editId > 0 || $isNew): ?>
                <div class="crm-card">
                    <div class="crm-card-body">
                        <form method="POST">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="action" value="save">
                            <?php if ($product): ?>
                            <input type="hidden" name="id" value="<?php echo intval($product['id']); ?>">
                            <?php endif; ?>

                            <div class="form-grid">
                                <div class="form-group"><label>Nombre *</label><input type="text" name="name" value="<?php echo htmlspecialchars($product['name'] ?? ''); ?>" required></div>
                                <div class="form-group"><label>SKU</label><input type="text" name="sku" value="<?php echo htmlspecialchars($product['sku'] ?? ''); ?>"></div>
                                <div class="form-group"><label>Referencia</label><input type="text" name="reference" value="<?php echo htmlspecialchars($product['reference'] ?? ''); ?>"></div>
                                <div class="form-group"><label>Codigo de Barras</label><input type="text" name="barcode" value="<?php echo htmlspecialchars($product['barcode'] ?? ''); ?>"></div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group"><label>Descripcion Corta</label><input type="text" name="short_description" value="<?php echo htmlspecialchars($product['short_description'] ?? ''); ?>"></div>
                                <div class="form-group"><label>Categoria</label>
                                    <select name="category_id">
                                        <option value="0">-- Sin categoria --</option>
                                        <?php foreach ($categories as $cat): ?>
                                        <option value="<?php echo intval($cat['id']); ?>" <?php if (intval($product['category_id'] ?? 0) === intval($cat['id'])) echo 'selected'; ?>><?php echo htmlspecialchars($cat['name']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group"><label>Descripcion</label><textarea name="description" rows="4"><?php echo htmlspecialchars($product['description'] ?? ''); ?></textarea></div>
                            <div class="form-group"><label>Especificaciones</label><textarea name="specs" rows="3"><?php echo htmlspecialchars($product['specs'] ?? ''); ?></textarea></div>

                            <h3 class="form-section-title">Costos y Precios</h3>
                            <div class="form-grid form-grid-4">
                                <div class="form-group"><label>Costo Base (USD)</label><input type="number" name="base_cost_usd" step="0.01" min="0" value="<?php echo htmlspecialchars($product['base_cost_usd'] ?? '0.00'); ?>"></div>
                                <div class="form-group"><label>Margen (%)</label><input type="number" name="margin" step="0.01" min="0" value="<?php echo htmlspecialchars($product['margin'] ?? '0'); ?>"></div>
                                <div class="form-group"><label>Precio (MXN)</label><input type="number" name="price_mxn" step="0.01" min="0" value="<?php echo htmlspecialchars($product['price_mxn'] ?? '0.00'); ?>"></div>
                                <div class="form-group"><label>Precio Comparar (MXN)</label><input type="number" name="compare_price_mxn" step="0.01" min="0" value="<?php echo htmlspecialchars($product['compare_price_mxn'] ?? '0.00'); ?>"></div>
                            </div>

                            <h3 class="form-section-title">Inventario</h3>
                            <div class="form-grid form-grid-3">
                                <div class="form-group"><label>Stock</label><input type="number" name="stock" min="0" value="<?php echo intval($product['stock'] ?? 0); ?>"></div>
                                <div class="form-group"><label>Peso (kg)</label><input type="number" name="weight_kg" step="0.01" min="0" value="<?php echo htmlspecialchars($product['weight_kg'] ?? '0'); ?>"></div>
                                <div class="form-group"><label>Estado</label>
                                    <select name="status">
                                        <option value="active" <?php if (($product['status'] ?? 'active') === 'active') echo 'selected'; ?>>Activo</option>
                                        <option value="inactive" <?php if (($product['status'] ?? '') === 'inactive') echo 'selected'; ?>>Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <h3 class="form-section-title">Opciones</h3>
                            <div class="form-row" style="gap:24px">
                                <label class="checkbox-label"><input type="checkbox" name="is_featured" value="1" <?php if (!empty($product['is_featured'])) echo 'checked'; ?>> Destacado</label>
                                <label class="checkbox-label"><input type="checkbox" name="is_new" value="1" <?php if (!empty($product['is_new'])) echo 'checked'; ?>> Nuevo</label>
                                <label class="checkbox-label"><input type="checkbox" name="is_active" value="1" <?php if (isset($product['is_active']) ? $product['is_active'] : true) echo 'checked'; ?>> Activo en tienda</label>
                            </div>

                            <h3 class="form-section-title">SEO</h3>
                            <div class="form-group"><label>Titulo SEO</label><input type="text" name="seo_title" value="<?php echo htmlspecialchars($product['seo_title'] ?? ''); ?>"></div>
                            <div class="form-group"><label>Descripcion SEO</label><textarea name="seo_description" rows="2"><?php echo htmlspecialchars($product['seo_description'] ?? ''); ?></textarea></div>

                            <div class="form-actions">
                                <button type="submit" class="btn-primary"><?php echo crm_icon('check'); ?> <?php echo $product ? 'Guardar Cambios' : 'Crear Producto'; ?></button>
                                <a href="/admin/productos" class="btn-secondary">Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
                <?php else: ?>
                <div class="crm-card">
                    <div class="crm-card-header"><h2><?php echo $total; ?> producto(s)</h2></div>
                    <div class="crm-table-wrap">
                        <table class="crm-table">
                            <thead><tr><th>SKU</th><th>Nombre</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead>
                            <tbody>
                                <?php if (empty($products)): ?>
                                <tr><td colspan="7" class="text-center text-muted">No se encontraron productos</td></tr>
                                <?php else: ?>
                                <?php foreach ($products as $p): ?>
                                <tr>
                                    <td><code><?php echo htmlspecialchars($p['sku']); ?></code></td>
                                    <td><?php echo htmlspecialchars($p['name']); ?></td>
                                    <td><?php echo htmlspecialchars($p['category_name'] ?? '-'); ?></td>
                                    <td>$<?php echo number_format($p['price_mxn'], 2); ?></td>
                                    <td><?php echo intval($p['stock']); ?></td>
                                    <td>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="toggle_status">
                                            <input type="hidden" name="id" value="<?php echo intval($p['id']); ?>">
                                            <input type="hidden" name="new_status" value="<?php echo $p['status'] === 'active' ? 'inactive' : 'active'; ?>">
                                            <button type="submit" class="status-badge <?php echo $p['status'] === 'active' ? 'status-active' : 'status-inactive'; ?>" style="border:none;cursor:pointer;">
                                                <?php echo $p['status'] === 'active' ? 'Activo' : 'Inactivo'; ?>
                                            </button>
                                        </form>
                                    </td>
                                    <td class="actions-cell">
                                        <a href="/admin/productos?edit=<?php echo intval($p['id']); ?>" class="btn-sm" title="Editar"><?php echo crm_icon('edit'); ?></a>
                                        <form method="POST" style="display:inline">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo intval($p['id']); ?>">
                                            <button type="submit" class="btn-sm btn-danger" onclick="return confirm('Eliminar este producto?')"><?php echo crm_icon('trash'); ?></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php if ($totalPages > 1): ?>
                    <div class="pagination">
                        <?php if ($page > 1): ?>
                        <a href="/admin/productos?page=<?php echo $page - 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&laquo;</a>
                        <?php endif; ?>
                        <?php for ($i = max(1, $page - 3); $i <= min($totalPages, $page + 3); $i++): ?>
                        <a href="/admin/productos?page=<?php echo $i; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page <?php if ($i === $page) echo 'active'; ?>"><?php echo $i; ?></a>
                        <?php endfor; ?>
                        <?php if ($page < $totalPages): ?>
                        <a href="/admin/productos?page=<?php echo $page + 1; ?><?php if ($search) echo '&q=' . urlencode($search); ?>" class="btn-page">&raquo;</a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>
