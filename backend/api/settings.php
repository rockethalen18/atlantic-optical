<?php
/**
 * Atlantic Optical - Settings API
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = (new Database())->connect();

switch ($method) {
    case 'GET':
        $key = $_GET['key'] ?? null;

        if ($key) {
            $stmt = $db->prepare("SELECT * FROM site_settings WHERE setting_key = ?");
            $stmt->execute([$key]);
            $setting = $stmt->fetch();
            if (!$setting) jsonError('Setting not found', 404);
            jsonSuccess($setting);
        }

        // Get all settings
        $stmt = $db->query("SELECT * FROM site_settings ORDER BY id");
        $settings = $stmt->fetchAll();
        
        $mapped = [];
        foreach ($settings as $s) {
            $mapped[$s['setting_key']] = [
                'value' => $s['setting_value'],
                'type' => $s['setting_type']
            ];
        }

        jsonSuccess($mapped);
        break;

    case 'PUT':
        $userId = requireAdmin();
        $data = getJsonBody();

        if (!$data) jsonError('No data provided');

        $stmt = $db->prepare("
            INSERT INTO site_settings (setting_key, setting_value, setting_type)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_type = VALUES(setting_type)
        ");

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $val = $value['value'] ?? json_encode($value);
                $type = $value['type'] ?? 'text';
            } else {
                $val = $value;
                $type = 'text';
            }
            $stmt->execute([$key, $val, $type]);
        }

        jsonSuccess(null, 'Settings updated');
        break;
}
