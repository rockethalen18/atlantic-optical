<?php
/**
 * Atlantic Optical - CORS & Helpers
 */

// Start session once
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// CORS headers — restricted to known origins
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper: Send JSON response
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Helper: Send error response
function jsonError($message, $statusCode = 400) {
    jsonResponse(['success' => false, 'error' => $message], $statusCode);
}

// Helper: Send success response
function jsonSuccess($data = null, $message = 'Success') {
    $response = ['success' => true, 'message' => $message];
    if ($data !== null) {
        $response['data'] = $data;
    }
    jsonResponse($response);
}

// Helper: Get JSON body from request
function getJsonBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

// Helper: Sanitize string
function sanitize($string) {
    return htmlspecialchars(strip_tags(trim($string)), ENT_QUOTES, 'UTF-8');
}

// Helper: Sanitize CSV value (prevent CSV injection)
function sanitizeCsvValue($value) {
    $value = (string) $value;
    if (preg_match('/^[=+\-@\t\r]/', $value)) {
        $value = "'" . $value;
    }
    return $value;
}

// Helper: Generate slug
function generateSlug($string) {
    $slug = strtolower(trim($string));
    $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    return trim($slug, '-');
}

// Helper: Generate order number
function generateOrderNumber() {
    return 'AO-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
}

// Helper: Calculate product price in MXN
function calculatePriceMXN($baseCostUSD, $margin, $shippingPerKg, $weightKg, $exchangeRate, $taxRate = 0.16) {
    $costWithMargin = $baseCostUSD * $margin;
    $shippingCost = $shippingPerKg * $weightKg;
    $subtotalUSD = $costWithMargin + $shippingCost;
    $subtotalMXN = $subtotalUSD * $exchangeRate;
    $tax = $subtotalMXN * $taxRate;
    return round($subtotalMXN + $tax, 2);
}

// Auth middleware — check for valid session
function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        jsonError('Unauthorized', 401);
    }
    return $_SESSION['user_id'];
}

function requireAdmin() {
    $userId = requireAuth();
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
        jsonError('Forbidden - Admin access required', 403);
    }
    return $userId;
}
