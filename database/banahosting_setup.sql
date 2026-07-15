-- ============================================
-- Atlantic Optical - SQL para Banahosting
-- ============================================
-- IMPORTANTE: 
-- 1. Crea la base de datos en cPanel > MySQL Databases
-- 2. Crea un usuario MySQL y asígalo a la BD con todos los privilegios
-- 3. IMPORTA este archivo en phpMyAdmin > tu_base_de_datos > Importar
-- 4. NO necesitas crear la BD ni hacer USE, ya existen
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- USERS & AUTH
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'customer') DEFAULT 'customer',
    avatar VARCHAR(500) DEFAULT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    image VARCHAR(500) DEFAULT NULL,
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    short_description VARCHAR(500) DEFAULT NULL,
    base_cost_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
    weight_kg DECIMAL(8,3) NOT NULL DEFAULT 0,
    margin DECIMAL(5,2) NOT NULL DEFAULT 2.00,
    price_mxn DECIMAL(10,2) DEFAULT NULL,
    compare_price_mxn DECIMAL(10,2) DEFAULT NULL,
    category_id INT DEFAULT NULL,
    stock INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived', 'out_of_stock') DEFAULT 'draft',
    is_featured TINYINT(1) DEFAULT 0,
    is_new TINYINT(1) DEFAULT 0,
    seo_title VARCHAR(255) DEFAULT NULL,
    seo_description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_slug (slug)
);

-- ============================================
-- PRODUCT IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_primary TINYINT(1) DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- PRODUCT VARIANTS
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0,
    stock INT DEFAULT 0,
    attributes JSON DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- SHIPPING RATES
-- ============================================
CREATE TABLE IF NOT EXISTS shipping_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method VARCHAR(100) NOT NULL,
    method_label VARCHAR(255) NOT NULL,
    price_per_kg_usd DECIMAL(10,2) NOT NULL,
    min_days INT NOT NULL,
    max_days INT NOT NULL,
    origin_country VARCHAR(100) DEFAULT 'China',
    destination_country VARCHAR(100) DEFAULT 'Mexico',
    is_active TINYINT(1) DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- EXCHANGE RATES
-- ============================================
CREATE TABLE IF NOT EXISTS exchange_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usd_to_mxn DECIMAL(10,4) NOT NULL,
    source VARCHAR(100) DEFAULT 'manual',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',
    shipping_method VARCHAR(100) DEFAULT NULL,
    shipping_address JSON DEFAULT NULL,
    billing_address JSON DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT DEFAULT NULL,
    variant_id INT DEFAULT NULL,
    product_name VARCHAR(500) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================
-- PAGE SECTIONS (CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS page_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page VARCHAR(100) DEFAULT 'home',
    type VARCHAR(50) NOT NULL,
    title VARCHAR(500) DEFAULT NULL,
    subtitle VARCHAR(500) DEFAULT NULL,
    content JSON DEFAULT NULL,
    styles JSON DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- SITE SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT DEFAULT NULL,
    setting_type ENUM('text', 'json', 'image', 'boolean') DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- IMPORT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS import_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(500) NOT NULL,
    total_rows INT DEFAULT 0,
    successful_rows INT DEFAULT 0,
    failed_rows INT DEFAULT 0,
    errors JSON DEFAULT NULL,
    imported_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (imported_by) REFERENCES users(id) ON DELETE SET NULL
);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- DATOS INICIALES
-- NOTA: El hash del admin se genera con generar_hash.php
-- Sube generar_hash.php, ábrelo en el navegador, y reemplaza el hash de abajo
-- LUEGO ELIMINA generar_hash.php
-- ============================================

-- Default admin user (password: admin123 - CAMBIA EN PRODUCCION!)
-- El hash de abajo es un placeholder. GENERA uno nuevo con generar_hash.php
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@atlanticoptical.com', '$2y$10$8K1p/a0dL1LXMIgoEDFrOOemGp4hSxlZjKfJiVROJFH2rVf4z7Kze', 'admin');

-- Default shipping rates
INSERT INTO shipping_rates (method, method_label, price_per_kg_usd, min_days, max_days) VALUES
('maritimo', 'Envio Maritimo', 4.50, 20, 40),
('aereo', 'Envio Aereo', 12.00, 5, 10),
('express', 'Envio Express (DHL/FedEx)', 20.00, 3, 7);

-- Default exchange rate
INSERT INTO exchange_rates (usd_to_mxn, source) VALUES (17.50, 'manual');

-- Default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('site_name', 'Atlantic Optical', 'text'),
('site_tagline', 'Equipamiento Optico Profesional', 'text'),
('site_description', 'Tu proveedor de confianza en equipo oftalmico y optometrico', 'text'),
('contact_email', 'info@atlanticoptical.com', 'text'),
('contact_phone', '+52 (55) 1234-5678', 'text'),
('contact_address', 'Ciudad de Mexico, Mexico', 'text'),
('whatsapp_number', '5215512345678', 'text'),
('currency', 'MXN', 'text'),
('tax_rate', '0.16', 'text'),
('primary_color', '#006535', 'text'),
('secondary_color', '#1a1a1a', 'text'),
('accent_color', '#FFA110', 'text'),
('footer_bg_color', '#f8f5f0', 'text');

-- Default page sections
INSERT INTO page_sections (page, type, title, subtitle, content, sort_order) VALUES
('home', 'hero', 'Equipamiento Optico de Calidad', 'Soluciones profesionales para tu clinica y consultorio', '{"bg_image": "/images/hero-1.jpg", "cta_text": "Ver Catalogo", "cta_link": "/productos"}', 1),
('home', 'categories', 'Nuestras Categorias', 'Explora nuestro catalogo completo', '{"show_all_link": true}', 2),
('home', 'featured', 'Productos Destacados', 'Los mas elegidos por nuestros clientes', '{"limit": 8}', 3),
('home', 'banner', 'Envio Directo desde China', 'Costos competitivos con seguimiento en tiempo real', '{"bg_image": "/images/hero-2.jpg"}', 4),
('home', 'reviews', 'Lo Que Dicen Nuestros Clientes', 'Mas de 500 clinicas confian en nosotros', '{"limit": 6}', 5);
