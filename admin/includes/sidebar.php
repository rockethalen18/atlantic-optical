<?php
if (!isset($activePage)) $activePage = '';
?>
<div class="sidebar-overlay" onclick="document.querySelector('.sidebar').classList.remove('open');this.classList.remove('active')"></div>
<nav class="sidebar">
    <div class="sidebar-brand">
        <div class="brand-icon">AO</div>
        <div>
            <div class="brand-text">Atlantic Optical</div>
            <div class="brand-sub">Admin Panel</div>
        </div>
    </div>
    <div class="sidebar-nav">
        <div class="nav-section">Principal</div>
        <a href="index.php" <?php echo $activePage==='dashboard'?'class="active':''; ?>><span class="nav-icon">&#9632;</span> Dashboard</a>
        <a href="productos.php" <?php echo $activePage==='productos'?'class="active':''; ?>><span class="nav-icon">&#9733;</span> Productos</a>
        <a href="categorias.php" <?php echo $activePage==='categorias'?'class="active':''; ?>><span class="nav-icon">&#9654;</span> Categorías</a>
        <div class="nav-section">Ventas</div>
        <a href="pedidos.php" <?php echo $activePage==='pedidos'?'class="active':''; ?>><span class="nav-icon">&#9993;</span> Pedidos</a>
        <div class="nav-section">Configuración</div>
        <a href="costos.php" <?php echo $activePage==='costos'?'class="active':''; ?>><span class="nav-icon">&#36;</span> Costos y Envío</a>
        <a href="usuarios.php" <?php echo $activePage==='usuarios'?'class="active':''; ?>><span class="nav-icon">&#9787;</span> Usuarios</a>
    </div>
    <div class="sidebar-footer">
        <a href="/"><span class="nav-icon">&#8592;</span> Volver al Sitio</a>
        <a href="logout.php"><span class="nav-icon">&#10550;</span> Cerrar Sesión</a>
    </div>
</nav>
