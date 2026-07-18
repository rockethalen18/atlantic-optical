<?php require_once 'includes/auth.php';
$activePage = 'productos';

$search = $_GET['search'] ?? '';
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 20;
$offset = ($page - 1) * $perPage;

$where = '';
$params = [];
if ($search) {
    $where = "WHERE name LIKE :search OR sku LIKE :search";
    $params[':search'] = "%$search%";
}

$total = $pdo->prepare("SELECT COUNT(*) FROM products $where");
$total->execute($params);
$totalProducts = $total->fetchColumn();

$stmt = $pdo->prepare("SELECT * FROM products $where ORDER BY id DESC LIMIT $perPage OFFSET $offset");
$stmt->execute($params);
$products = $stmt->fetchAll();

$totalPages = ceil($totalProducts / $perPage);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos — Atlantic Optical Admin</title>
    <link rel="stylesheet" href="assets/css/crm.css">
</head>
<body>
<?php include 'includes/sidebar.php'; ?>

<main class="main-content">
    <header class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
            <button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open');document.querySelector('.sidebar-overlay').classList.toggle('active')">&#9776;</button>
            <h1>Productos</h1>
        </div>
        <div class="header-actions">
            <span style="font-size:13px;color:var(--text-muted);"><?php echo $totalProducts; ?> productos</span>
        </div>
    </header>

    <div class="page-body">
        <div class="toolbar">
            <form method="GET" class="search-box" style="flex:1;">
                <input type="text" name="search" placeholder="Buscar por nombre o SKU..." value="<?php echo htmlspecialchars($search); ?>">
            </form>
        </div>

        <div class="card">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Peso (kg)</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($products as $p): ?>
                        <tr>
                            <td style="font-weight:500;"><?php echo htmlspecialchars($p['name']); ?></td>
                            <td style="font-family:monospace;font-size:12px;"><?php echo htmlspecialchars($p['sku']); ?></td>
                            <td><?php echo htmlspecialchars($p['category'] ?: '—'); ?></td>
                            <td><?php echo $p['weight_kg'] ?: '—'; ?></td>
                            <td><span class="badge badge-<?php echo $p['status']==='published'?'green':'gray'; ?>"><?php echo $p['status']; ?></span></td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if (empty($products)): ?>
                        <tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:40px;">No se encontraron productos</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <?php if ($totalPages > 1): ?>
        <div class="pagination">
            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
            <a href="?page=<?php echo $i; ?>&search=<?php echo urlencode($search); ?>" class="<?php echo $i === $page ? 'active' : ''; ?>"><?php echo $i; ?></a>
            <?php endfor; ?>
        </div>
        <?php endif; ?>
    </div>
</main>
</body>
</html>
