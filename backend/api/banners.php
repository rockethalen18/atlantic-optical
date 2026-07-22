<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $position = $_GET['position'] ?? null;
        
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM banners WHERE id = ?");
            $stmt->execute([$id]);
            $banner = $stmt->fetch();
            if (!$banner) jsonError('Banner not found', 404);
            jsonSuccess($banner);
        } elseif ($position) {
            $stmt = $db->prepare("SELECT * FROM banners WHERE is_active = 1 AND position = ? AND (starts_at IS NULL OR starts_at <= NOW()) AND (expires_at IS NULL OR expires_at >= NOW()) ORDER BY sort_order ASC");
            $stmt->execute([$position]);
            jsonSuccess($stmt->fetchAll());
        } else {
            $banners = $db->query("SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC")->fetchAll();
            jsonSuccess($banners);
        }
        break;

    case 'POST':
        $userId = requireAdmin();
        $data = getJsonBody();
        if (!$data || empty($data['title'])) jsonError('title is required');
        $stmt = $db->prepare("INSERT INTO banners (title, subtitle, image, link, link_text, bg_color, text_color, position, sort_order, is_active, starts_at, expires_at, animation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['subtitle'] ?? null,
            $data['image'] ?? null,
            $data['link'] ?? null,
            $data['link_text'] ?? null,
            $data['bg_color'] ?? '#0a1628',
            $data['text_color'] ?? '#ffffff',
            $data['position'] ?? 'home',
            $data['sort_order'] ?? 0,
            $data['is_active'] ?? 1,
            $data['starts_at'] ?? null,
            $data['expires_at'] ?? null,
            $data['animation'] ?? 'fade'
        ]);
        jsonSuccess(['id' => $db->lastInsertId()], 'Banner created');
        break;

    case 'PUT':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $data = getJsonBody();
        $fields = [];
        $params = [];
        foreach (['title', 'subtitle', 'image', 'link', 'link_text', 'bg_color', 'text_color', 'position', 'sort_order', 'is_active', 'starts_at', 'expires_at', 'animation'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (empty($fields)) jsonError('No fields to update');
        $params[] = $id;
        $db->prepare("UPDATE banners SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonSuccess(null, 'Banner updated');
        break;

    case 'DELETE':
        $userId = requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) jsonError('ID required');
        $db->prepare("DELETE FROM banners WHERE id = ?")->execute([$id]);
        jsonSuccess(null, 'Banner deleted');
        break;
}
