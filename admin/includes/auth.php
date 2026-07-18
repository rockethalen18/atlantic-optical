<?php
session_start();

function require_login() {
    if (!isset($_SESSION['admin_id'])) {
        header('Location: /admin/login');
        exit;
    }
    $inactivity = time() - ($_SESSION['last_activity'] ?? 0);
    if ($inactivity > 1800) {
        session_unset();
        session_destroy();
        header('Location: /admin/login?timeout=1');
        exit;
    }
    $_SESSION['last_activity'] = time();
}

function is_logged_in() {
    return isset($_SESSION['admin_id']);
}

function admin_name() {
    return $_SESSION['admin_name'] ?? 'Admin';
}

function admin_email() {
    return $_SESSION['admin_email'] ?? '';
}
