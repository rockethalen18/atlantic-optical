<?php
/**
 * Atlantic Optical - Page Sections API (CMS)
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $page = $_GET['page'] ?? 'home';
        $id = $_GET['id'] ?? null;

        if ($id) {
            $stmt = $db->prepare("SELECT * FROM page_sections WHERE id = ?");
            $stmt->execute([$id]);
            $section = $stmt->fetch();
            if (!$section) jsonError('Section not found', 404);
            $section['content'] = json_decode($section['content'], true);
            $section['styles'] = json_decode($section['styles'], true);
            jsonSuccess($section);
        }

        $stmt = $db->prepare("
            SELECT * FROM page_sections WHERE page = ? ORDER BY sort_order ASC
        ");
        $stmt->execute([$page]);
        $sections = $stmt->fetchAll();

        foreach ($sections as &$s) {
            $s['content'] = json_decode($s['content'], true);
            $s['styles'] = json_decode($s['styles'], true);
        }

        jsonSuccess($sections);
        break;

    case 'PUT':
        $userId = requireAdmin();
        $data = getJsonBody();

        if (!$data) jsonError('No data provided');

        // If id provided, update single section
        if (isset($data['id'])) {
            $fields = [];
            $params = [];
            $allowed = ['title', 'subtitle', 'content', 'styles', 'sort_order', 'is_active'];

            foreach ($allowed as $field) {
                if (array_key_exists($field, $data)) {
                    $value = $data[$field];
                    if (in_array($field, ['content', 'styles']) && is_array($value)) {
                        $value = json_encode($value);
                    }
                    $fields[] = "$field = ?";
                    $params[] = $value;
                }
            }

            if (!empty($fields)) {
                $params[] = $data['id'];
                $stmt = $db->prepare("UPDATE page_sections SET " . implode(', ', $fields) . " WHERE id = ?");
                $stmt->execute($params);
            }
            
            jsonSuccess(null, 'Section updated');
        }

        // Bulk update: array of sections
        if (isset($data['sections']) && is_array($data['sections'])) {
            foreach ($data['sections'] as $section) {
                if (isset($section['id'])) {
                    $content = is_array($section['content']) ? json_encode($section['content']) : $section['content'];
                    $styles = is_array($section['styles']) ? json_encode($section['styles']) : ($section['styles'] ?? null);
                    
                    $stmt = $db->prepare("
                        UPDATE page_sections SET title = ?, subtitle = ?, content = ?, styles = ?, sort_order = ?, is_active = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        $section['title'] ?? null,
                        $section['subtitle'] ?? null,
                        $content,
                        $styles,
                        $section['sort_order'] ?? 0,
                        $section['is_active'] ?? 1,
                        $section['id']
                    ]);
                } elseif (isset($section['type'])) {
                    // Create new section
                    $content = is_array($section['content']) ? json_encode($section['content']) : ($section['content'] ?? null);
                    $styles = is_array($section['styles']) ? json_encode($section['styles']) : ($section['styles'] ?? null);
                    
                    $stmt = $db->prepare("
                        INSERT INTO page_sections (page, type, title, subtitle, content, styles, sort_order, is_active)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $section['page'] ?? 'home',
                        $section['type'],
                        $section['title'] ?? null,
                        $section['subtitle'] ?? null,
                        $content,
                        $styles,
                        $section['sort_order'] ?? 0,
                        $section['is_active'] ?? 1
                    ]);
                }
            }
            jsonSuccess(null, 'Sections updated');
        }

        jsonError('Invalid data format');
        break;
}
