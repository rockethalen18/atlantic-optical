<?php
session_start();

function require_login() {
    if (!isset($_SESSION['admin_id'])) {
        header('Location: login.php');
        exit;
    }
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
