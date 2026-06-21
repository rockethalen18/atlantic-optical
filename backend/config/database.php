<?php
/**
 * Atlantic Optical - Database Configuration
 * Adapted for Banahosting (MySQL)
 */

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Configuracion para Banahosting
        // IMPORTANTE: Reemplaza estos valores con tus credenciales reales de hosting
        $this->host = 'localhost';
        $this->db_name = 'atlantic_optical';
        $this->username = 'YOUR_USERNAME'; // Reemplazar con tu usuario de MySQL de cPanel
        $this->password = 'YOUR_PASSWORD'; // Reemplazar con tu contraseña de MySQL de cPanel
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
        } catch (PDOException $exception) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $exception->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}
