<?php
/**
 * Atlantic Optical - Auth API (Customers)
 * Handles: register, login, logout, me, update profile
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$action = $_GET['action'] ?? $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($action) {
    case 'register':
        $data = getJsonBody();
        if (!$data || empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            jsonError('Nombre, email y contraseña requeridos');
        }

        $name = sanitize($data['name']);
        $email = strtolower(trim($data['email']));
        $password = $data['password'];

        if (strlen($password) < 6) {
            jsonError('La contraseña debe tener al menos 6 caracteres');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonError('Email inválido');
        }

        $check = $db->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            jsonError('Este email ya está registrado');
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, 'customer', NOW())");
        $stmt->execute([$name, $email, $hash]);
        $userId = $db->lastInsertId();

        $_SESSION['user_id'] = $userId;
        $_SESSION['user_role'] = 'customer';
        $_SESSION['user_name'] = $name;

        jsonSuccess([
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'customer',
        ], 'Registro exitoso');
        break;

    case 'login':
        $data = getJsonBody();
        if (!$data || empty($data['email']) || empty($data['password'])) {
            jsonError('Email y contraseña requeridos');
        }

        $email = strtolower(trim($data['email']));
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            jsonError('Credenciales inválidas', 401);
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_name'] = $user['name'];

        jsonSuccess([
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ], 'Login exitoso');
        break;

    case 'logout':
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        jsonSuccess(null, 'Sesión cerrada');
        break;

    case 'me':
        if (!isset($_SESSION['user_id'])) {
            jsonError('No autenticado', 401);
        }

        $stmt = $db->prepare("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonError('Usuario no encontrado', 404);
        }

        jsonSuccess($user);
        break;

    case 'update':
        if (!isset($_SESSION['user_id'])) {
            jsonError('No autenticado', 401);
        }

        $data = getJsonBody();
        if (!$data) {
            jsonError('Datos requeridos');
        }

        $userId = $_SESSION['user_id'];
        $sets = [];
        $vals = [];

        if (!empty($data['name'])) {
            $sets[] = 'name = ?';
            $vals[] = sanitize($data['name']);
            $_SESSION['user_name'] = $data['name'];
        }
        if (!empty($data['phone'])) {
            $sets[] = 'phone = ?';
            $vals[] = sanitize($data['phone']);
        }
        if (!empty($data['email'])) {
            $email = strtolower(trim($data['email']));
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                jsonError('Email inválido');
            }
            $check = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $check->execute([$email, $userId]);
            if ($check->fetch()) {
                jsonError('Este email ya está en uso');
            }
            $sets[] = 'email = ?';
            $vals[] = $email;
        }
        if (!empty($data['password'])) {
            if (strlen($data['password']) < 6) {
                jsonError('La contraseña debe tener al menos 6 caracteres');
            }
            $sets[] = 'password_hash = ?';
            $vals[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (empty($sets)) {
            jsonError('Sin cambios para guardar');
        }

        $vals[] = $userId;
        $db->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);

        jsonSuccess(null, 'Perfil actualizado');
        break;

    default:
        jsonError('Acción inválida', 400);
}
