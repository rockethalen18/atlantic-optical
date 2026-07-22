<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM popups WHERE id = ?");
            $stmt->execute([$id]);
            $popup = $stmt->fetch();
            if (!$popup) jsonError('Popup not found', 404);
            jsonSuccess($popup);
        } else {
            $popups = $db->query("SELECT * FROM popups ORDER BY created_at DESC")->fetchAll();
            jsonSuccess($popups);
        }
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['title']) || empty($data['content'])) jsonError('title and content are required');
        $stmt = $db->prepare("INSERT INTO popups (title, content, image, bg_color, text_color, button_text, button_color, button_link, position, trigger, trigger_value, frequency, is_active, starts_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['content'],
            $data['image'] ?? null,
            $data['bg_color'] ?? '#ffffff',
            $data['text_color'] ?? '#1a1a1a',
            $data['button_text'] ?? null,
            $data['button_color'] ?? '#2563eb',
            $data['button_link'] ?? null,
            $data['position'] ?? 'center',
            $data['trigger'] ?? 'delay',
            $data['trigger_value'] ?? 3000,
            $data['frequency'] ?? 'once',
            $data['is_active'] ?? 1,
            $data['starts_at'] ?? null,
            $data['expires_at'] ?? null
        ]);
        jsonSuccess(['id' => $db->lastInsertId()], 'Popup created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['title', 'content', 'image', 'bg_color', 'text_color', 'button_text', 'button_color', 'button_link', 'position', 'trigger', 'trigger_value', 'frequency', 'is_active', 'starts_at', 'expires_at'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;
        $db->prepare("UPDATE popups SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Popup updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $db->prepare("DELETE FROM popups WHERE id = ?")->execute([$id]);
        jsonSuccess(null, 'Popup deleted');
        break;
}
