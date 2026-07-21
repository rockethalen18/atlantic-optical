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

function render_exchange_widget() {
    $rates = get_exchange_rates();
    if (empty($rates)) return '';
    $updated = '';
    try {
        $last = db()->query('SELECT MAX(updated_at) as last FROM exchange_rates')->fetchColumn();
        if ($last) {
            $diff = time() - strtotime($last);
            if ($diff < 60) $updated = $diff . 's';
            elseif ($diff < 3600) $updated = floor($diff / 60) . 'm';
            elseif ($diff < 86400) $updated = floor($diff / 3600) . 'h';
            else $updated = floor($diff / 86400) . 'd';
        }
    } catch (Exception $e) {}
    $html = '<div class="sidebar-exchange">';
    $html .= '<div class="sidebar-exchange-title">' . crm_icon('globe') . ' USD</div>';
    foreach (['MXN', 'COP', 'CNY', 'EUR'] as $cur) {
        if (isset($rates[$cur])) {
            $html .= '<div class="sidebar-exchange-rate"><span>' . $cur . '</span><span class="rate">' . currency_symbol($cur) . format_rate($rates[$cur], $cur) . '</span></div>';
        }
    }
    if ($updated) $html .= '<div class="sidebar-exchange-time">' . $updated . '</div>';
    $html .= '</div>';
    return $html;
}

echo '<aside class="sidebar">';
echo '<div class="sidebar-header">';
echo '<div class="sidebar-logo" style="justify-content:center">';
echo '<img src="/images/logo-atlantic.png" alt="Atlantic Optical International Limited" class="sidebar-logo-img" style="height:40px;width:auto;max-width:100%">';
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
echo render_exchange_widget();
echo '<div class="sidebar-footer">';
echo '<button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">' . crm_icon('sun') . '<span id="themeLabel">Modo Claro</span></button>';
echo '<a href="https://equipos.atlanticopticalgroup.com" target="_blank">' . crm_icon('globe') . '<span>Ver Sitio</span></a>';
echo '<a href="/admin/logout">' . crm_icon('log-out') . '<span>Cerrar Sesion</span></a>';
echo '</div></aside>';
echo '<script src="/admin/assets/js/theme.js"></script>';
