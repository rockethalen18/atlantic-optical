<?php
/**
 * Atlantic Optical - Database Configuration
 * Adapted for Banahosting (MySQL)
 *
 * INSTRUCCIONES BANAHOSTING:
 * 1. Ve a cPanel > MySQL Databases
 * 2. Crea una base de datos (ej: aznjnpitoj_atlantic)
 * 3. Crea un usuario MySQL con contraseña fuerte
 * 4. Asigna el usuario a la base de datos con todos los privilegios
 * 5. Reemplaza los valores de abajo con tus credenciales reales
 * 6. Importa el schema SQL en phpMyAdmin o MySQL Databases
 */

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // ==========================================
        // CONFIGURACION BANAHOSTING
        // Reemplaza estas credenciales con las tuyas
        // ==========================================
        $this->host = 'localhost';
        $this->db_name = 'aznjnpitoj_atlantic';   // <-- Tu base de datos
        $this->username = 'aznjnpitoj_usuario';    // <-- Tu usuario MySQL
        $this->password = 'TU_CONTRASENA_AQUI';    // <-- Tu contraseña MySQL
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
