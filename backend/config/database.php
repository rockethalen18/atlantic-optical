<?php
/**
 * Atlantic Optical - Database Configuration
 * Adapted for Banahosting (MySQL)
 *
 * INSTRUCCIONES:
 * 1. Crear base de datos en cPanel > MySQL Databases
 * 2. Crear usuario MySQL y asignarlo a la base de datos
 * 3. Reemplaza los valores de abajo con tus credenciales reales
 */

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // ==========================================
        // CONFIGURACION - Docker environment or manual
        // ==========================================
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_NAME') ?: 'atlantic_optical';
        $this->username = getenv('DB_USER') ?: 'atlantic_user';
        $this->password = getenv('DB_PASS') ?: 'atlantic_pass';
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
