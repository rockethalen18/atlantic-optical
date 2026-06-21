<?php
/**
 * Atlantic Optical - Dashboard API
 * Stats for admin panel
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$userId = requireAdmin();

try {
    $db = (new Database())->connect();

    // Product stats
    $stmt = $db->query("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published, SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts FROM products");
    $productStats = $stmt->fetch();

    // Order stats
    $stmt = $db->query("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending, COALESCE(SUM(total), 0) as revenue FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    $orderStats = $stmt->fetch();

    // Category count
    $stmt = $db->query("SELECT COUNT(*) as total FROM categories WHERE is_active = 1");
    $catStats = $stmt->fetch();

    // Recent orders
    $stmt = $db->query("
        SELECT o.*, u.name as customer_name 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC 
        LIMIT 5
    ");
    $recentOrders = $stmt->fetchAll();

    // Import logs
    $stmt = $db->query("SELECT * FROM import_logs ORDER BY created_at DESC LIMIT 5");
    $importLogs = $stmt->fetchAll();

    jsonSuccess([
        'products' => $productStats,
        'orders' => $orderStats,
        'categories' => $catStats,
        'recent_orders' => $recentOrders,
        'import_logs' => $importLogs
    ]);
} catch (Exception $e) {
    jsonError('Dashboard query failed: ' . $e->getMessage(), 500);
}
