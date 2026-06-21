<?php
/**
 * Atlantic Optical - API Router
 * Point all API requests here via .htaccess
 * 
 * Usage: /api/products, /api/categories, /api/shipping, etc.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api';

// Remove query string and base path
$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('#^' . preg_quote($basePath) . '#', '', $path);
$path = '/' . trim($path, '/');

$method = $_SERVER['REQUEST_METHOD'];

// Route matching
$routes = [
    'GET /products'        => ['file' => 'api/products.php'],
    'GET /products/'       => ['file' => 'api/products.php'],
    'POST /products'       => ['file' => 'api/products.php'],
    'PUT /products'        => ['file' => 'api/products.php'],
    'DELETE /products'     => ['file' => 'api/products.php'],
    
    'GET /categories'      => ['file' => 'api/categories.php'],
    'POST /categories'     => ['file' => 'api/categories.php'],
    'PUT /categories'      => ['file' => 'api/categories.php'],
    'DELETE /categories'   => ['file' => 'api/categories.php'],
    
    'GET /shipping'              => ['file' => 'api/shipping.php'],
    'POST /shipping'             => ['file' => 'api/shipping.php'],
    'PUT /shipping'              => ['file' => 'api/shipping.php'],
    'PUT /shipping/exchange-rate' => ['file' => 'api/shipping.php', 'action' => 'exchange-rate'],
    
    'GET /orders'          => ['file' => 'api/orders.php'],
    'POST /orders'         => ['file' => 'api/orders.php'],
    'PUT /orders'          => ['file' => 'api/orders.php'],
    
    'POST /auth/login'     => ['file' => 'api/auth.php', 'action' => 'login'],
    'POST /auth/logout'    => ['file' => 'api/auth.php', 'action' => 'logout'],
    'GET /auth/me'         => ['file' => 'api/auth.php', 'action' => 'me'],
    
    'POST /import'         => ['file' => 'api/import.php'],
    'GET /export'          => ['file' => 'api/export.php'],
    
    'GET /settings'        => ['file' => 'api/settings.php'],
    'PUT /settings'        => ['file' => 'api/settings.php'],
    
    'GET /sections'        => ['file' => 'api/sections.php'],
    'PUT /sections'        => ['file' => 'api/sections.php'],
    
    'GET /dashboard'       => ['file' => 'api/dashboard.php'],
    'GET /pricing'         => ['file' => 'api/pricing.php'],
];

// Find matching route
$found = false;

foreach ($routes as $pattern => $route) {
    $patternParts = explode(' ', $pattern);
    $patternMethod = $patternParts[0];
    $patternPath = $patternParts[1];
    
    if ($method === $patternMethod && ($path === $patternPath || $path === $patternPath . '/')) {
        if (isset($route['action'])) {
            $_GET['action'] = $route['action'];
        }
        $filePath = __DIR__ . '/../' . $route['file'];
        if (file_exists($filePath)) {
            require $filePath;
            $found = true;
            break;
        }
    }
}

if (!$found) {
    // Try exact match with variable segments (e.g., /products/123)
    $segments = explode('/', trim($path, '/'));
    
    if (count($segments) >= 2) {
        $resource = $segments[0];
        $id = $segments[1] ?? null;
        
        $fileMap = [
            'products' => 'api/products.php',
            'categories' => 'api/categories.php',
            'shipping' => 'api/shipping.php',
            'orders' => 'api/orders.php',
        ];
        
        if (isset($fileMap[$resource])) {
            $_GET['id'] = $id;
            $filePath = __DIR__ . '/../' . $fileMap[$resource];
            if (file_exists($filePath)) {
                require $filePath;
                $found = true;
            }
        }
    }
}

if (!$found) {
    jsonError('Endpoint not found: ' . $method . ' ' . $path, 404);
}
