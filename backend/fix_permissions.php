<?php
/**
 * FIX PERMISSIONS - Ejecutar una sola vez desde el navegador
 * https://equipos.atlanticopticalgroup.com/backend/fix_permissions.php
 * 
 * DESPUES DE EJECUTAR, BORRA ESTE ARCHIVO
 */

echo "<h2>Arreglando permisos...</h2>";

$base = dirname(__DIR__);
$dirs = [
    $base . '/backend',
    $base . '/backend/api',
    $base . '/backend/config',
    $base . '/backend/uploads',
];

foreach ($dirs as $dir) {
    if (is_dir($dir)) {
        chmod($dir, 0755);
        echo "<p>chmod 755: $dir</p>";
    }
}

$files = glob($base . '/backend/*.php');
$files = array_merge($files, glob($base . '/backend/*.htaccess'));
$files = array_merge($files, glob($base . '/backend/api/*.php'));
$files = array_merge($files, glob($base . '/backend/config/*.php'));

foreach ($files as $file) {
    chmod($file, 0644);
    echo "<p>chmod 644: $file</p>";
}

// Now write the correct database.php
$dbConfig = '<?php
class Database {
    private $host = "localhost";
    private $db_name = "aznjnpitoj_atlantic";
    private $username = "aznjnpitoj_user";
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
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}
';

$dbFile = $base . '/backend/config/database.php';
if (file_put_contents($dbFile, $dbConfig)) {
    echo "<p style='color:green;font-weight:bold'>database.php actualizado con credenciales correctas</p>";
} else {
    echo "<p style='color:red'>Error al escribir database.php</p>";
}

echo "<h3>Verificar API:</h3>";
echo "<p><a href='../backend/api/products'>Probar API Products</a></p>";
echo "<br><p style='color:red;font-weight:bold'>IMPORTANTE: Borra este archivo despues de usarlo</p>";
?>
