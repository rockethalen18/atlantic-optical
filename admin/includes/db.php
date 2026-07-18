<?php
class Database {
    private $host = "localhost";
    private $db_name = "azjnptoj_atlantic";
    private $username = "azjnptoj_user";
    private $password = "nyvfuc-cizwe4-watfoK";
    private $conn;

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
            error_log('DB Connection Error: ' . $e->getMessage());
            die('Error de conexión a la base de datos.');
        }
        return $this->conn;
    }
}
