<?php
function get_exchange_rates() {
    $rates = [];
    try {
        $stmt = db()->query('SELECT currency_to, rate FROM exchange_rates WHERE currency_from = "USD" AND rate > 0 ORDER BY currency_to');
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $rates[$row['currency_to']] = floatval($row['rate']);
        }
    } catch (Exception $e) {}
    return $rates;
}

function format_rate($rate, $currency) {
    if ($currency === 'COP') return number_format($rate, 0, ',', '.');
    if ($currency === 'MXN') return number_format($rate, 2);
    if ($currency === 'CNY') return number_format($rate, 2);
    return number_format($rate, 4);
}

function currency_symbol($currency) {
    $symbols = ['MXN' => '$', 'COP' => '$', 'CNY' => '¥', 'EUR' => '€', 'USD' => '$'];
    return $symbols[$currency] ?? $currency;
}

function render_exchange_bar() {
    $rates = get_exchange_rates();
    if (empty($rates)) return '';
    
    $updated = '';
    try {
        $last = db()->query('SELECT MAX(updated_at) as last FROM exchange_rates')->fetchColumn();
        if ($last) {
            $diff = time() - strtotime($last);
            if ($diff < 60) $updated = 'hace ' . $diff . 's';
            elseif ($diff < 3600) $updated = 'hace ' . floor($diff / 60) . 'm';
            elseif ($diff < 86400) $updated = 'hace ' . floor($diff / 3600) . 'h';
            else $updated = 'hace ' . floor($diff / 86400) . 'd';
        }
    } catch (Exception $e) {}
    
    $order = ['MXN', 'COP', 'CNY', 'EUR'];
    $html = '<div class="exchange-bar">';
    $html .= '<span style="font-weight:600;color:#fff">USD</span>';
    foreach ($order as $cur) {
        if (isset($rates[$cur])) {
            $html .= '<span>' . currency_symbol($cur) . ' <span class="rate">' . format_rate($rates[$cur], $cur) . '</span> ' . $cur . '</span>';
        }
    }
    if ($updated) {
        $html .= '<span class="updated">Actualizado: ' . $updated . '</span>';
    }
    $html .= '<a href="/admin/divisas" style="color:#60a5fa;text-decoration:none;font-size:11px" title="Gestionar divisas">Configurar</a>';
    $html .= '</div>';
    return $html;
}
