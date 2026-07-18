<?php
if (!defined('CURRENT_PAGE')) {
    define('CURRENT_PAGE', '');
}

function sidebar_item($page, $icon, $label) {
    $active = (CURRENT_PAGE === $page) ? ' class="active"' : '';
    return '<a href="' . $page . '.php"' . $active . '>' . crm_icon($icon) . '<span>' . $label . '</span></a>';
}
?>
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-logo">
            <?php echo crm_icon('eye'); ?>
            <div>
                <strong>Atlantic Optical</strong>
                <small>Admin Panel</small>
            </div>
        </div>
    </div>
    <nav class="sidebar-nav">
        <?php echo sidebar_item('index', 'dashboard', 'Dashboard'); ?>
        <?php echo sidebar_item('productos', 'box', 'Productos'); ?>
        <?php echo sidebar_item('categorias', 'tag', 'Categorias'); ?>
        <?php echo sidebar_item('pedidos', 'shopping-cart', 'Pedidos'); ?>
        <?php echo sidebar_item('costos', 'dollar-sign', 'Costos'); ?>
        <?php echo sidebar_item('usuarios', 'users', 'Usuarios'); ?>
    </nav>
    <div class="sidebar-footer">
        <a href="https://equipos.atlanticopticalgroup.com" target="_blank"><?php echo crm_icon('globe'); ?><span>Ver Sitio</span></a>
        <a href="logout.php"><?php echo crm_icon('log-out'); ?><span>Cerrar Sesion</span></a>
    </div>
</aside>
