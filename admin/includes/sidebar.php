<?php
if (!defined('CURRENT_PAGE')) {
    define('CURRENT_PAGE', '');
}
if (!function_exists('get_exchange_rates')) {
    require_once __DIR__ . '/exchange.php';
}

function sidebar_item($page, $icon, $label) {
    $active = (CURRENT_PAGE === $page) ? ' class="active"' : '';
    return '<a href="/admin/' . $page . '"' . $active . '>' . crm_icon($icon) . '<span>' . $label . '</span></a>';
}
echo '<aside class="sidebar">';
echo '<div class="sidebar-header">';
echo '<div class="sidebar-logo">';
echo crm_icon('eye');
echo '<div><strong>Atlantic Optical</strong><small>Admin Panel</small></div>';
echo '</div></div>';
echo '<nav class="sidebar-nav">';
echo sidebar_item('index', 'dashboard', 'Dashboard');
echo sidebar_item('productos', 'box', 'Productos');
echo sidebar_item('categorias', 'tag', 'Categorias');
echo sidebar_item('pedidos', 'shopping-cart', 'Pedidos');
echo sidebar_item('costos', 'dollar-sign', 'Costos');
echo sidebar_item('divisas', 'globe', 'Divisas');
echo sidebar_item('usuarios', 'users', 'Usuarios');
echo '</nav>';
echo '<div class="sidebar-footer">';
echo '<a href="https://equipos.atlanticopticalgroup.com" target="_blank">' . crm_icon('globe') . '<span>Ver Sitio</span></a>';
echo '<a href="/admin/logout">' . crm_icon('log-out') . '<span>Cerrar Sesion</span></a>';
echo '</div></aside>';
echo render_exchange_bar();
