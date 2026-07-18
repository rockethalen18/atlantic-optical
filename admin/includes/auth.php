<?php
session_start();
require_once __DIR__ . '/db.php';

$current_user = null;

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = :id');
    $stmt->execute([':id' => $_SESSION['user_id']]);
    $current_user = $stmt->fetch();
} catch (PDOException $e) {
    $current_user = null;
}

if (!$current_user) {
    session_destroy();
    header('Location: login.php');
    exit;
}
