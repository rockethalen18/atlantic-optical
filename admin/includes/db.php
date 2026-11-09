<?php
require_once __DIR__ . '/secrets.php';

define('DB_HOST', ao_secret('DB_HOST', 'localhost'));
define('DB_NAME', ao_secret('DB_NAME'));
define('DB_USER', ao_secret('DB_USER'));
define('DB_PASS', ao_secret('DB_PASS'));

function db() {
    static $pdo = null;
    if ($pdo === null) {
        if (DB_PASS === '') {
            http_response_code(500);
            die(json_encode(['error' => 'Database credentials are not configured']));
        }
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed']));
        }
    }
    return $pdo;
}
