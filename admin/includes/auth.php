<?php
$sessionDir = __DIR__ . '/sessions';
if (!is_dir($sessionDir)) {
    mkdir($sessionDir, 0733, true);
}
ini_set('session.save_path', $sessionDir);
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.gc_maxlifetime', 1800);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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
