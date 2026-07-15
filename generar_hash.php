<?php
/**
 * Atlantic Optical - Generar Hash de Contraseña
 * 
 * INSTRUCCIONES:
 * 1. Sube este archivo a public_html/ en tu hosting
 * 2. Abre en el navegador: https://equipos.atlanticopticalgroup.com/generar_hash.php
 * 3. Copia el hash generado
 * 4. ELIMINA este archivo inmediatamente después de usarlo
 */

echo "<h2>Generador de Hash bcrypt</h2>";

// Generate hash for 'admin123'
$password = 'admin123';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "<p><strong>Contraseña:</strong> $password</p>";
echo "<p><strong>Hash:</strong> <code>$hash</code></p>";
echo "<p><strong>SQL para insertar admin:</strong></p>";
echo "<pre>INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin', 'admin@atlanticoptical.com', '$hash', 'admin');</pre>";

// Verify the hash
if (password_verify($password, $hash)) {
    echo "<p style='color:green'>✅ Hash verificado correctamente</p>";
} else {
    echo "<p style='color:red'>❌ Error en verificación</p>";
}
?>
