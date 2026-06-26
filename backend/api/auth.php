<?php
/**
 * Atlantic Optical - Auth API
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$action = $_GET['action'] ?? $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($action) {
    case 'login':
    case 'POST':
        $data = getJsonBody();
        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            jsonError('Email and password required');
        }

        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            jsonError('Invalid credentials', 401);
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_name'] = $user['name'];

        jsonSuccess([
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ], 'Login successful');
        break;

    case 'logout':
    case 'DELETE':
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        jsonSuccess(null, 'Logged out');
        break;

    case 'me':
    case 'GET':
        if (!isset($_SESSION['user_id'])) {
            jsonError('Not authenticated', 401);
        }

        $stmt = $db->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonError('User not found', 404);
        }

        jsonSuccess($user);
        break;

    default:
        jsonError('Invalid action', 400);
}
