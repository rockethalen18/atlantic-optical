<?php
require_once __DIR__ . '/secrets.php';

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // The credentials live in the secrets file next to the site, never in
        // the repository (which is public).
        $this->host     = ao_secret('DB_HOST', 'localhost');
        $this->db_name  = ao_secret('DB_NAME');
        $this->username = ao_secret('DB_USER');
        $this->password = ao_secret('DB_PASS');
    }

    public function connect() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database connection failed"]);
            exit;
        }
        return $this->conn;
    }
}
