-- ============================================
-- Atlantic Optical - Full Import Script for MySQL 8.0
-- Creates schema, inserts categories with explicit IDs,
-- products with explicit category_id values (NO subqueries),
-- and initial seed data.
-- ============================================

-- ============================================
-- SCHEMA
-- ============================================

CREATE DATABASE IF NOT EXISTS atlantic_optical CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE atlantic_optical;

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP TABLE IF EXISTS import_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS shipping_rates;
DROP TABLE IF EXISTS exchange_rates;
DROP TABLE IF EXISTS page_sections;
DROP TABLE IF EXISTS site_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- USERS & AUTH
-- ============================================
CREATE TABLE users (
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
CREATE TABLE categories (
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
CREATE TABLE products (
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
CREATE TABLE product_images (
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
CREATE TABLE product_variants (
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
CREATE TABLE shipping_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method VARCHAR(100) NOT NULL,
    method_label VARCHAR(255) NOT NULL,
    price_per_kg_usd DECIMAL(10,2) NOT NULL,
    min_days INT NOT NULL,
    max_days INT NOT NULL,
    origin_country VARCHAR(100) DEFAULT 'China',
    destination_country VARCHAR(100) DEFAULT 'México',
    is_active TINYINT(1) DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- EXCHANGE RATES
-- ============================================
CREATE TABLE exchange_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usd_to_mxn DECIMAL(10,4) NOT NULL,
    source VARCHAR(100) DEFAULT 'manual',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
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
CREATE TABLE order_items (
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
-- PAGE SECTIONS
-- ============================================
CREATE TABLE page_sections (
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
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT DEFAULT NULL,
    setting_type ENUM('text', 'json', 'image', 'boolean') DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- IMPORT LOGS
-- ============================================
CREATE TABLE import_logs (
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

-- ============================================
-- INITIAL DATA
-- ============================================

-- Default admin user (password: admin123 - change in production!)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@atlanticoptical.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Default shipping rates
INSERT INTO shipping_rates (method, method_label, price_per_kg_usd, min_days, max_days) VALUES
('maritimo', 'Envío Marítimo', 4.50, 20, 40),
('aereo', 'Envío Aéreo', 12.00, 5, 10),
('express', 'Envío Express (DHL/FedEx)', 20.00, 3, 7);

-- Default exchange rate
INSERT INTO exchange_rates (usd_to_mxn, source) VALUES (17.50, 'manual');

-- Default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('site_name', 'Atlantic Optical', 'text'),
('site_tagline', 'Equipamiento Óptico Profesional', 'text'),
('site_description', 'Tu proveedor de confianza en equipo oftálmico y optométrico', 'text'),
('contact_email', 'info@atlanticoptical.com', 'text'),
('contact_phone', '+52 (55) 1234-5678', 'text'),
('contact_address', 'Ciudad de México, México', 'text'),
('whatsapp_number', '5215512345678', 'text'),
('currency', 'MXN', 'text'),
('tax_rate', '0.16', 'text'),
('primary_color', '#006535', 'text'),
('secondary_color', '#1a1a1a', 'text'),
('accent_color', '#FFA110', 'text'),
('footer_bg_color', '#f8f5f0', 'text');

-- Default page sections
INSERT INTO page_sections (page, type, title, subtitle, content, sort_order) VALUES
('home', 'hero', 'Equipamiento Óptico de Calidad', 'Soluciones profesionales para tu clínica y consultorio', '{"bg_image": "/images/hero-bg.jpg", "cta_text": "Ver Catálogo", "cta_link": "/productos"}', 1),
('home', 'categories', 'Nuestras Categorías', 'Explora nuestro catálogo completo', '{"show_all_link": true}', 2),
('home', 'featured', 'Productos Destacados', 'Los más elegidos por nuestros clientes', '{"limit": 8}', 3),
('home', 'banner', 'Envío Directo desde China', 'Costos competitivos con seguimiento en tiempo real', '{"bg_image": "/images/shipping-banner.jpg"}', 4),
('home', 'reviews', 'Lo Que Dicen Nuestros Clientes', 'Más de 500 clínicas confían en nosotros', '{"limit": 6}', 5);

-- ============================================
-- CATEGORIES (with explicit IDs - NO subqueries)
-- ============================================

-- Main categories (IDs 1-4)
INSERT INTO categories (id, name, slug, parent_id, sort_order, is_active) VALUES
(1, 'Equipos de Laboratorio', 'equipos-laboratorio', NULL, 1, 1),
(2, 'Equipos de Oftalmología y Óptica', 'equipos-oftalmologia-optica', NULL, 2, 1),
(3, 'Mobiliario', 'mobiliario', NULL, 3, 1),
(4, 'Monitores y Optotipos', 'monitores-optotipos', NULL, 4, 1);

-- Subcategories for Equipos de Laboratorio (IDs 5-21, parent_id = 1)
INSERT INTO categories (id, name, slug, parent_id, sort_order, is_active) VALUES
(5, 'Biseladoras Automáticas', 'biseladoras-automaticas', 1, 1, 1),
(6, 'Biseladoras Manuales', 'biseladoras-manuales', 1, 2, 1),
(7, 'Biseladoras Semiautomáticas', 'biseladoras-semiautomaticas', 1, 3, 1),
(8, 'Calentadores', 'calentadores', 1, 4, 1),
(9, 'Centradoras', 'centradoras', 1, 5, 1),
(10, 'Esferómetros', 'esferometros', 1, 6, 1),
(11, 'Limpiadores Ultrasónicos', 'limpiadores-ultrasonicos', 1, 7, 1),
(12, 'Medidores de Espesor', 'medidores-de-espesor', 1, 8, 1),
(13, 'Perforadoras al Aire', 'perforadoras-al-aire', 1, 9, 1),
(14, 'Perforadoras para Plantilla', 'perforadoras-para-plantilla', 1, 10, 1),
(15, 'Probadores de Fotocromático', 'probadores-de-fotocromatico', 1, 11, 1),
(16, 'Pulidoras Manuales', 'pulidoras-manuales', 1, 12, 1),
(17, 'Pulidoras Semiautomáticas', 'pulidoras-semiautomaticas', 1, 13, 1),
(18, 'Ranuradoras Manuales', 'ranuradoras-manuales', 1, 14, 1),
(19, 'Repuestos', 'repuestos', 1, 15, 1),
(20, 'Tinturadoras', 'tinturadoras', 1, 16, 1),
(21, 'Uveómetros', 'uveometros', 1, 17, 1);

-- Subcategories for Equipos de Oftalmología y Óptica (IDs 22-46, parent_id = 2)
INSERT INTO categories (id, name, slug, parent_id, sort_order, is_active) VALUES
(22, 'Análisis de Gafas', 'analisis-de-gafas', 2, 18, 1),
(23, 'Auto Refractómetros', 'auto-refractometros', 2, 19, 1),
(24, 'Auto Refractómetros con Keratometro', 'auto-refractometros-con-keratometro', 2, 20, 1),
(25, 'Cajas de Prisma', 'cajas-de-prisma', 2, 21, 1),
(26, 'Cajas de Prueba', 'cajas-de-prueba', 2, 22, 1),
(27, 'Cámara de Fondo', 'camara-de-fondo', 2, 23, 1),
(28, 'Campo Visual', 'campo-visual', 2, 24, 1),
(29, 'Equipos de Fisioterapia', 'equipos-de-fisioterapia', 2, 25, 1),
(30, 'Facoemulsificador', 'facoemulsificador', 2, 26, 1),
(31, 'Forópteros Digitales', 'foropteros-digitales', 2, 27, 1),
(32, 'Forópteros Manuales', 'foropteros-manuales', 2, 28, 1),
(33, 'Kit Instrumental', 'kit-instrumental', 2, 29, 1),
(34, 'Lámparas de Hendidura', 'lamparas-de-hendidura', 2, 30, 1),
(35, 'Lámparas Portátiles', 'lamparas-portatiles', 2, 31, 1),
(36, 'Lente de 3 Espejos', 'lente-de-3-espejos', 2, 32, 1),
(37, 'Lente de Aumento', 'lente-de-aumento', 2, 33, 1),
(38, 'Micropsio Quirúrgico', 'micropsio-quirurgico', 2, 34, 1),
(39, 'Monturas de Prueba', 'monturas-de-prueba', 2, 35, 1),
(40, 'OCT', 'oct', 2, 36, 1),
(41, 'Oftalmoscopios', 'oftalmoscopios', 2, 37, 1),
(42, 'Probetas Desechables', 'probetas-desechables', 2, 38, 1),
(43, 'Pupilómetros', 'pupilometros', 2, 39, 1),
(44, 'Retinoscopios', 'retinoscopios', 2, 40, 1),
(45, 'Tonómetros de Contacto', 'tonometros-de-contacto', 2, 41, 1),
(46, 'Tonómetros de Rebote', 'tonometros-de-rebote', 2, 42, 1);

-- Subcategories for Mobiliario (IDs 47-56, parent_id = 3)
INSERT INTO categories (id, name, slug, parent_id, sort_order, is_active) VALUES
(47, 'Automáticas', 'automaticas', 3, 43, 1),
(48, 'Brazos de Pared', 'brazos-de-pared', 3, 44, 1),
(49, 'Con Silla Elevación', 'con-silla-elevacion', 3, 45, 1),
(50, 'Con Silla Reclinable', 'con-silla-reclinable', 3, 46, 1),
(51, 'Mesas de Elevación', 'mesas-de-elevacion', 3, 47, 1),
(52, 'Mesas Dobles', 'mesas-dobles', 3, 48, 1),
(53, 'Mesas Multifuncional', 'mesas-multifuncional', 3, 49, 1),
(54, 'Para Movilidad Reducida', 'para-movilidad-reducida', 3, 50, 1),
(55, 'Sillas con Pedal', 'sillas-con-pedal', 3, 51, 1),
(56, 'Sillas para Óptica', 'sillas-para-optica', 3, 52, 1);

-- Subcategories for Monitores y Optotipos (IDs 57-64, parent_id = 4)
INSERT INTO categories (id, name, slug, parent_id, sort_order, is_active) VALUES
(57, 'Cartillas', 'cartillas', 4, 53, 1),
(58, 'Controles', 'controles', 4, 54, 1),
(59, 'Monitores Estándar', 'monitores-estandar', 4, 55, 1),
(60, 'Monitores Verticales', 'monitores-verticales', 4, 56, 1),
(61, 'Optotipos con Soporte', 'optotipos-con-soporte', 4, 57, 1),
(62, 'Optotipos Eléctricos', 'optotipos-electricos', 4, 58, 1),
(63, 'Proyectores Gráficos', 'proyectores-graficos', 4, 59, 1),
(64, 'Tablet LCD', 'tablet-lcd', 4, 60, 1);

-- ============================================
-- PRODUCTS (with explicit category_id - NO subqueries)
-- ============================================
-- Category ID mapping:
--   5  = biseladoras-automaticas
--   6  = biseladoras-manuales
--   7  = biseladoras-semiautomaticas
--   8  = calentadores
--   9  = centradoras
--   10 = esferometros
--   11 = limpiadores-ultrasonicos
--   12 = medidores-de-espesor
--   13 = perforadoras-al-aire
--   14 = perforadoras-para-plantilla
--   15 = probadores-de-fotocromatico
--   16 = pulidoras-manuales
--   17 = pulidoras-semiautomaticas
--   18 = ranuradoras-manuales
--   19 = repuestos
--   20 = tinturadoras
--   21 = uveometros
--   22 = analisis-de-gafas
--   23 = auto-refractometros
--   24 = auto-refractometros-con-keratometro
--   25 = cajas-de-prisma
--   26 = cajas-de-prueba
--   27 = camara-de-fondo
--   28 = campo-visual
--   29 = equipos-de-fisioterapia
--   30 = facoemulsificador
--   31 = foropteros-digitales
--   32 = foropteros-manuales
--   33 = kit-instrumental
--   34 = lamparas-de-hendidura
--   35 = lamparas-portatiles
--   36 = lente-de-3-espejos
--   37 = lente-de-aumento
--   38 = micropsio-quirurgico
--   39 = monturas-de-prueba
--   40 = oct
--   41 = oftalmoscopios
--   42 = probetas-desechables
--   43 = pupilometros
--   44 = retinoscopios
--   45 = tonometros-de-contacto
--   46 = tonometros-de-rebote
--   47 = automaticas
--   48 = brazos-de-pared
--   49 = con-silla-elevacion
--   50 = con-silla-reclinable
--   51 = mesas-de-elevacion
--   52 = mesas-dobles
--   53 = mesas-multifuncional
--   54 = para-movilidad-reducida
--   55 = sillas-con-pedal
--   56 = sillas-para-optica
--   57 = cartillas
--   58 = controles
--   59 = monitores-estandar
--   60 = monitores-verticales
--   61 = optotipos-con-soporte
--   62 = optotipos-electricos
--   63 = proyectores-graficos
--   64 = tablet-lcd

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
('BISELADORA AUTOMATICA', 'biseladora-automatica', 'AO-ALE1600G', 'BISELADORA AUTOMATICA', 'BISELADORA AUTOMATICA', 0, 5, 'published', 0, 0),
('BISELADORA AUTOMATICA', 'biseladora-automatica-ale1700g', 'AO-ALE1700G', 'BISELADORA AUTOMATICA', 'BISELADORA AUTOMATICA', 0, 5, 'published', 0, 0),
('BISELADORA AUTOMATICA CON ESCANER', 'biseladora-automatica-con-escaner', 'AO-ALE1000', 'BISELADORA AUTOMATICA CON ESCANER', 'BISELADORA AUTOMATICA CON ESCANER', 60, 5, 'published', 0, 0),
('BISELADORA MANUAL DE TRES PIEDRAS', 'biseladora-manual-de-tres-piedras', 'AO-6ACP', 'BISELADORA MANUAL DE TRES PIEDRAS', 'BISELADORA MANUAL DE TRES PIEDRAS', 6.7, 6, 'published', 0, 0),
('BISELADORA MANUAL DE UNA PIEDRA', 'biseladora-manual-de-una-piedra', 'AO-CP11A35WV', 'BISELADORA MANUAL DE UNA PIEDRA', 'BISELADORA MANUAL DE UNA PIEDRA', 6.7, 6, 'published', 0, 0),
('BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 'biseladora-manual-de-una-piedra-con-disco-de-corte', 'AO-TC10A', 'BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 'BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 0, 6, 'published', 0, 0),
('NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 'nh-136-biseladora-manual-de-tres-piedras', 'AO-CP6A1', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 0, 6, 'published', 0, 0),
('+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', 'ly-2a-cp-10c-biseladora-semiautomatica', 'AO-LE420', '+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', '+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', 13.2, 7, 'published', 0, 0),
('BISELADORA SEMIAUTOMÁTICA', 'biseladora-semiautomatica', 'AO-SJG7100', 'BISELADORA SEMIAUTOMÁTICA', 'BISELADORA SEMIAUTOMÁTICA', 0, 7, 'published', 0, 0),
('CALENTADOR DE MONTURA', 'calentador-de-montura', 'AO-LY6C', 'CALENTADOR DE MONTURA', 'CALENTADOR DE MONTURA', 0, 8, 'published', 0, 0),
('CALENTADOR DE MONTURA', 'calentador-de-montura-ly6bt', 'AO-LY6BT', 'CALENTADOR DE MONTURA', 'CALENTADOR DE MONTURA', 2, 8, 'published', 0, 0),
('CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 'centradora-con-brazo-para-pegatina-y-marcador', 'AO-LY2A', 'CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 'CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 3, 9, 'published', 0, 0),
('ESFEROMETRO METALICO', 'esferometro-metalico', 'AO-TM001', 'ESFEROMETRO METALICO', 'ESFEROMETRO METALICO', 0, 10, 'published', 0, 0),
('LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico', 'AO-WZJP120', 'LIMPIADOR DE LENTES ULTRASONICO', 'LIMPIADOR DE LENTES ULTRASONICO', 2.5, 11, 'published', 0, 0),
('LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico-cp008', 'AO-CP008', 'LIMPIADOR DE LENTES ULTRASONICO', 'LIMPIADOR DE LENTES ULTRASONICO', 2.5, 11, 'published', 0, 0),
('WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 'wz-jp121-limpiador-ultrasonico-moderno', 'AO-GB800', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 1, 11, 'published', 0, 0),
('MEDIDOR DE ESPESOR', 'medidor-de-espesor', 'AO-WZJP15A', 'MEDIDOR DE ESPESOR', 'MEDIDOR DE ESPESOR', 0, 12, 'published', 0, 0),
('MEDIDOR DE ESPESOR', 'medidor-de-espesor-wzjp15b', 'AO-WZJP15B', 'MEDIDOR DE ESPESOR', 'MEDIDOR DE ESPESOR', 0, 12, 'published', 0, 0),
('PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 'perforadora-automatica-para-lentes-al-aire', 'AO-NH3GS', 'PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 'PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 7.5, 13, 'published', 0, 0),
('PERFORADORA PARA LENTES AL AIRE', 'perforadora-para-lentes-al-aire', 'AO-LY988C', 'PERFORADORA PARA LENTES AL AIRE', 'PERFORADORA PARA LENTES AL AIRE', 3.5, 13, 'published', 0, 0),
('PERFORADORA PARA PLANTILLA', 'perforadora-para-plantilla', 'AO-CP10C', 'PERFORADORA PARA PLANTILLA', 'PERFORADORA PARA PLANTILLA', 2, 14, 'published', 0, 0),
('PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico', 'AO-LY8384', 'PROBADOR DE LENTES PHOTOCROMATICO', 'PROBADOR DE LENTES PHOTOCROMATICO', 0.5, 15, 'published', 0, 0),
('PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico-wzjp17b', 'AO-WZJP17B', 'PROBADOR DE LENTES PHOTOCROMATICO', 'PROBADOR DE LENTES PHOTOCROMATICO', 0.5, 15, 'published', 0, 0),
('PULIDORA MANUAL', 'pulidora-manual', 'AO-CP8A', 'Pulido de la lente', 'Pulido de la lente', 0, 16, 'published', 0, 0),
('PULIDORA SEMIAUTOMATICA', 'pulidora-semiautomatica', 'AO-LY900', 'Pulido de la lente', 'Pulido de la lente', 7.1, 17, 'published', 0, 0),
('RANURADORA MANUAL', 'ranuradora-manual', 'AO-WZJP800C', 'RANURADORA MANUAL', 'RANURADORA MANUAL', 2.2, 18, 'published', 0, 0),
('RANURADORA MANUAL', 'ranuradora-manual-ly12a', 'AO-LY12A', 'RANURADORA MANUAL', 'RANURADORA MANUAL', 0, 18, 'published', 0, 0),
('BOMBA PARA ALE1000 Y LE-420', 'bomba-para-ale1000-y-le-420', 'AO-WATERPUMP', 'BOMBA PARA ALE1000 Y LE-420', 'BOMBA PARA ALE1000 Y LE-420', 0, 19, 'published', 0, 0),
('REPUESTO DE BISELADORA DE 3 PIEDRAS', 'repuesto-de-biseladora-de-3-piedras', 'AO-RNH316', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', 1, 19, 'published', 0, 0),
('REPUESTO DE BROCA PARA CORTADORA', 'repuesto-de-broca-para-cortadora', 'AO-BROC1', 'REPUESTO DE BROCA PARA CORTADORA', 'REPUESTO DE BROCA PARA CORTADORA', 0, 19, 'published', 0, 0),
('PINZA PARA TINTURADO DE LUNAS OPTICAS', 'pinza-para-tinturado-de-lunas-opticas', 'AO-RM3', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', 0, 20, 'published', 0, 0),
('TINTURADORA', 'tinturadora', 'AO-TR6', 'TINTURADORA', 'TINTURADORA', 7.5, 20, 'published', 0, 0),
('UVEOMETRO', 'uveometro', 'AO-CP18C', 'UVEOMETRO', 'UVEOMETRO', 0.65, 21, 'published', 0, 0),
('AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 'at-9000-sistema-de-analisis-de-datos-de-gafas-con-inteligencia-artificial', 'AO-AT9000', 'AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 'AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 0, 22, 'published', 0, 0),
('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital', 'AO-LM260', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 11, 22, 'published', 0, 0),
('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm900', 'AO-LM900', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 0, 22, 'published', 0, 0),
('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-jd26000d', 'AO-JD26000D', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 11, 22, 'published', 0, 0),
('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm300', 'AO-LM300', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 6, 22, 'published', 0, 0),
('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm800', 'AO-LM800', 'AUTOLENSOMETRO DIGITAL', 'AUTOLENSOMETRO DIGITAL', 0, 22, 'published', 0, 0),
('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-d910', 'AO-D910', 'AUTOLENSOMETRO DIGITAL', 'AUTOLENSOMETRO DIGITAL', 12, 22, 'published', 0, 0),
('LENSOMETRO DIGITAL', 'lensometro-digital', 'AO-D900', 'Mejor rendimiento y elección económica, Fácil manejo con cuatro botones Sin PD, medición UV y más estable', 'Mejor rendimiento y elección económica, Fácil manejo con cuatro botones Sin PD, medición UV y más estable', 2.9, 22, 'published', 0, 0),
('LENSOMETRO MANUAL', 'lensometro-manual', 'AO-NJC6', 'LENSOMETRO MANUAL', 'LENSOMETRO MANUAL', 0, 22, 'published', 0, 0),
('LENSOMETRO PORTATIL', 'lensometro-portatil', 'AO-CP1B', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 1, 22, 'published', 0, 0),
('SET DE OPTOMETRIA', 'set-de-optometria', 'AO-FA100KAP800CP60', 'SET DE OPTOMETRIA', 'SET DE OPTOMETRIA', 0, 22, 'published', 0, 0),
('SISTEMA DE REFRACCION AUTOMATICO CON MESA', 'sistema-de-refraccion-automatico-con-mesa', 'AO-CM100AP800C330A', 'SISTEMA DE REFRACCION AUTOMATICO CON MESA', 'SISTEMA DE REFRACCION AUTOMATICO CON MESA', 0, 22, 'published', 0, 0),
('AUTOREFRACTOMETRO', 'autorefractometro', 'AO-FA6000A', 'AUTOREFRACTOMETRO', 'AUTOREFRACTOMETRO', 28.8, 23, 'published', 0, 0),
('AUTOREFRACTOMETRO PORTATIL', 'autorefractometro-portatil', 'AO-IREF', 'AUTOREFRACTOMETRO PORTATIL', 'AUTOREFRACTOMETRO PORTATIL', 0.195, 23, 'published', 0, 0),
('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro', 'AO-FA6100CK', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, 24, 'published', 0, 0),
('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-ark7710', 'AO-ARK7710', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 0, 24, 'published', 0, 0),
('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa6500k', 'AO-FA6500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, 24, 'published', 0, 0),
('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa8500k', 'AO-FA8500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, 24, 'published', 0, 0),
('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa100', 'AO-FA100', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20, 24, 'published', 0, 0),
('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa300k', 'AO-FA300K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 0, 24, 'published', 0, 0),
('AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 'autorefractometro-con-keratometro-y-biometria', 'AO-AL700PLUS', 'AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 'AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 0, 24, 'published', 0, 0),
('CAJA DE PRISMAS', 'caja-de-prismas', 'AO-PS22', 'CAJA DE PRISMAS', 'CAJA DE PRISMAS', 0, 25, 'published', 0, 0),
('CAJA DE PRISMAS', 'caja-de-prismas-vb15hb16', 'AO-VB15HB16', 'CAJA DE PRISMAS', 'CAJA DE PRISMAS', 0, 25, 'published', 0, 0),
('CAJA DE PRUEBA DE 104 LENTILLAS', 'caja-de-prueba-de-104-lentillas', 'AO-104', 'CAJA DE PRUEBA DE 104 LENTILLAS', 'CAJA DE PRUEBA DE 104 LENTILLAS', 3, 26, 'published', 0, 0),
('CAJA DE PRUEBA DE 158 LENTILLAS', 'caja-de-prueba-de-158-lentillas', 'AO-JS158', 'CAJA DE PRUEBA DE 158 LENTILLAS', 'CAJA DE PRUEBA DE 158 LENTILLAS', 3, 26, 'published', 0, 0),
('CAJA DE PRUEBA PROGRESIVA', 'caja-de-prueba-progresiva', 'AO-JS22P', 'CAJA DE PRUEBA PROGRESIVA', 'CAJA DE PRUEBA PROGRESIVA', 0, 26, 'published', 0, 0),
('GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 'gris-caja-de-prueba-de-266-lentillas', 'AO-266JS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 6, 26, 'published', 0, 0),
('CAMARA DE FONDO DE OJO AUTOMATICA', 'camara-de-fondo-de-ojo-automatica', 'AO-RC3100', 'CAMARA DE FONDO DE OJO AUTOMATICA', 'CAMARA DE FONDO DE OJO AUTOMATICA', 10, 27, 'published', 0, 0),
('CAMARA DE FONDO DE OJO AUTOMATICA', 'camara-de-fondo-de-ojo-automatica-sk680a', 'AO-SK680A', 'CAMARA DE FONDO DE OJO AUTOMATICA', 'CAMARA DE FONDO DE OJO AUTOMATICA', 0, 27, 'published', 0, 0),
('CAMARA DE FONDO DE OJO PORTATIL', 'camara-de-fondo-de-ojo-portatil', 'AO-WZ1300', 'CAMARA DE FONDO DE OJO PORTATIL', 'CAMARA DE FONDO DE OJO PORTATIL', 0, 27, 'published', 0, 0),
('ESCANER ULTRASONICO A-B', 'escaner-ultrasonico-a-b', 'AO-RETIWAVE1000', 'ESCANER ULTRASONICO A-B', 'ESCANER ULTRASONICO A-B', 0, 27, 'published', 0, 0),
('EQUIPO DE PRUEBA DE CAMPO VISUAL', 'equipo-de-prueba-de-campo-visual', 'AO-BIO1100', 'EQUIPO DE PRUEBA DE CAMPO VISUAL', 'EQUIPO DE PRUEBA DE CAMPO VISUAL', 17, 28, 'published', 0, 0),
('EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual', 'AO-KJRDA2', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 0, 29, 'published', 0, 0),
('EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual-kjrda3', 'AO-KJRDA3', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 0, 29, 'published', 0, 0),
('PHACOEMULSIFICADOR', 'phacoemulsificador', 'AO-MD480', 'PHACOEMULSIFICADOR', 'PHACOEMULSIFICADOR', 0, 30, 'published', 0, 0),
('FOROPTERO DIGITAL', 'foroptero-digital', 'AO-DPS700', 'FOROPTERO DIGITAL', 'FOROPTERO DIGITAL', 2, 31, 'published', 0, 0),
('FOROPTERO DIGITAL', 'foroptero-digital-ap800cp60', 'AO-AP800CP60', 'FOROPTERO DIGITAL', 'FOROPTERO DIGITAL', 2, 31, 'published', 0, 0),
('BLANCO FOROPTERO', 'blanco-foroptero', 'AO-ML400-B', 'BLANCO FOROPTERO', 'BLANCO FOROPTERO', 4.5, 32, 'published', 0, 0),
('NEGRO FOROPTERO', 'negro-foroptero', 'AO-ML400', 'NEGRO FOROPTERO', 'NEGRO FOROPTERO', 4.5, 32, 'published', 0, 0),
('KIT 21 KIT INSTRUMENTAL 21 PCS', 'kit-21-kit-instrumental-21-pcs', 'AO-CSE', 'KIT 21 KIT INSTRUMENTAL 21 PCS', 'KIT 21 KIT INSTRUMENTAL 21 PCS', 0, 33, 'published', 0, 0),
('LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 'lampara-de-hendidura-con-sistema-de-analisis', 'AO-WZ5S', 'LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 'LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 0, 34, 'published', 0, 0),
('LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 'lampara-de-henedidura-para-examen-de-ojo-seco', 'AO-SM800', 'LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 'LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 17, 34, 'published', 0, 0),
('YZ-30RR LAMPARA DE HENDIDURA 2 MAGNIFICACIONES CON MESA Y TONOMETRO METALICO', 'yz-30rr-lampara-de-hendidura-2-magnificaciones-con-mesa-y-tonometro-metalico', 'AO-BL66B', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 22.4, 34, 'published', 0, 0),
('YZ-30RR LAMPARA DE HENDIDURA 3 MAGNIFICACIONES CON MESA Y TONOMETRO METALICO', 'yz-30rr-lampara-de-hendidura-3-magnificaciones-con-mesa-y-tonometro-metalico', 'AO-BL88T', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 16.8, 34, 'published', 0, 0),
('YZ-30RR LAMPARA DE HENDIDURA 5 MAGNIFICACIONES CON MESA TONOMETRO METALICO', 'yz-30rr-lampara-de-hendidura-5-magnificaciones-con-mesa-tonometro-metalico', 'AO-SJ350', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 0, 34, 'published', 0, 0),
('LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil', 'AO-ST150', 'LAMPARA DE HENDIDURA PORTATIL', 'LAMPARA DE HENDIDURA PORTATIL', 0.12, 35, 'published', 0, 0),
('LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-s150', 'AO-S150', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 0.15, 35, 'published', 0, 0),
('LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-ml5s1', 'AO-ML5S1', 'LAMPARA DE HENDIDURA PORTATIL', 'LAMPARA DE HENDIDURA PORTATIL', 0.835, 35, 'published', 0, 0),
('LAMPARA FRONTAL MEDICA', 'lampara-frontal-medica', 'AO-HL004', 'LAMPARA FRONTAL MEDICA', 'LAMPARA FRONTAL MEDICA', 0, 35, 'published', 0, 0),
('LENTE DE 3 ESPEJOS', 'lente-de-3-espejos', 'AO-YZ13', 'LENTE DE 3 ESPEJOS', 'LENTE DE 3 ESPEJOS', 0, 36, 'published', 0, 0),
('LENTE DE AUMENTO', 'lente-de-aumento', 'AO-20D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, 37, 'published', 0, 0),
('LENTE DE AUMENTO', 'lente-de-aumento-78d', 'AO-78D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, 37, 'published', 0, 0),
('LENTE DE AUMENTO', 'lente-de-aumento-90d', 'AO-90D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, 37, 'published', 0, 0),
('LUPA BINOCULAR', 'lupa-binocular', 'AO-SJ989', 'LUPA BINOCULAR', 'LUPA BINOCULAR', 0, 37, 'published', 0, 0),
('MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 'microscopio-quirurjico-para-ofatlmologia', 'AO-YZ20T4', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 0, 38, 'published', 0, 0),
('MONTURA DE PRUEBA', 'montura-de-prueba', 'AO-GD1104', 'MONTURA DE PRUEBA', 'MONTURA DE PRUEBA', 0, 39, 'published', 0, 0),
('MONTURA DE PRUEBA ALUMINIO', 'montura-de-prueba-aluminio', 'AO-TTF08', 'MONTURA DE PRUEBA ALUMINIO', 'MONTURA DE PRUEBA ALUMINIO', 0.05, 39, 'published', 0, 0),
('MONTURA DE PRUEBA PARA NIÑOS', 'montura-de-prueba-para-ninos', 'AO-TFC', 'MONTURA DE PRUEBA PARA NIÑOS', 'MONTURA DE PRUEBA PARA NIÑOS', 0, 39, 'published', 0, 0),
('MONTURA DE PRUEBA PREMIUM', 'montura-de-prueba-premium', 'AO-TF488A', 'MONTURA DE PRUEBA PREMIUM', 'MONTURA DE PRUEBA PREMIUM', 0.2, 39, 'published', 0, 0),
('MONTURA DE PRUEBA TITANIUM', 'montura-de-prueba-titanium', 'AO-TF5470', 'MONTURA DE PRUEBA TITANIUM', 'MONTURA DE PRUEBA TITANIUM', 0.05, 39, 'published', 0, 0),
('TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 'tomografo-de-coherencia-optica-oct', 'AO-OCT500', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 0, 40, 'published', 0, 0),
('OFTALMOSCOPIO INDIRECTO', 'oftalmoscopio-indirecto', 'AO-YZ25C', 'OFTALMOSCOPIO INDIRECTO', 'OFTALMOSCOPIO INDIRECTO', 0, 41, 'published', 0, 0),
('OFTALMOSCOPIO PORTATIL', 'oftalmoscopio-portatil', 'AO-YZ11', 'OFTALMOSCOPIO PORTATIL', 'OFTALMOSCOPIO PORTATIL', 0, 41, 'published', 0, 0),
('RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio', 'AO-YZ24BYZ11D', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'RETINOSCOPIO CON OFTALMOSCOPIO', 0, 41, 'published', 0, 0),
('RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio-468e4310', 'AO-468E4310', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'RETINOSCOPIO CON OFTALMOSCOPIO', 3, 41, 'published', 0, 0),
('PROBE PROBETA DESECHABLE', 'probe-probeta-desechable', 'AO-SW500', 'Puntas de repuesto de un solo uso diseñadas para el tonómetro de rebote portátil', 'Puntas de repuesto de un solo uso diseñadas para el tonómetro de rebote portátil', 0, 42, 'published', 0, 0),
('PUPILOMETRO DIGITAL', 'pupilometro-digital', 'AO-LY9C', 'PUPILOMETRO DIGITAL', 'PUPILOMETRO DIGITAL', 0.7, 43, 'published', 0, 0),
('PUPILOMETRO MANUAL', 'pupilometro-manual', 'AO-CP30', 'PUPILOMETRO MANUAL', 'PUPILOMETRO MANUAL', 0, 43, 'published', 0, 0),
('RETINOSCOPIO', 'retinoscopio', 'AO-YZ24', 'RETINOSCOPIO', 'RETINOSCOPIO', 1.8, 44, 'published', 0, 0),
('TONOMETRO', 'tonometro', 'AO-SK5500A', 'TONOMETRO', 'TONOMETRO', 0, 45, 'published', 0, 0),
('TONOMETRO METALICO', 'tonometro-metalico', 'AO-YZ30R', 'TONOMETRO METALICO', 'TONOMETRO METALICO', 0, 45, 'published', 0, 0),
('TONOMETRO DE REBOTE PORTATIL', 'tonometro-de-rebote-portatil', 'AO-SW500-B', 'Es un examen para medir la presión dentro de los ojos. Este examen se utiliza para buscar glaucoma. También se utiliza para medir qué tan bien está...', 'Es un examen para medir la presión dentro de los ojos. Este examen se utiliza para buscar glaucoma. También se utiliza para medir qué tan bien está...', 0, 46, 'published', 0, 0),
('UNIDAD OFTALMICA AUTOMÁTICA CON SILLA', 'unidad-oftalmica-automatica-con-silla', 'AO-CT1000', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foroptero y el autorefractometro y los equipos de diagnóstico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foroptero y el autorefractometro y los equipos de diagnóstico', 0, 47, 'published', 0, 0),
('BRAZO PARA FOROPTERO DE PARED', 'brazo-para-foroptero-de-pared', 'AO-WZZN', 'BRAZO PARA FOROPTERO DE PARED', 'BRAZO PARA FOROPTERO DE PARED', 14, 48, 'published', 0, 0),
('BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 'brazo-para-foroptero-y-proyector-de-pared', 'AO-CT1504', 'BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 'BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 14, 48, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion', 'AO-CS700AT', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 122.6, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-cs700b', 'AO-CS700B', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 122.6, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-cs700b2', 'AO-CS700B2', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 122.6, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-ly800a', 'AO-LY800A', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 46.8, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-pk158', 'AO-PK158', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 46.8, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-pk160', 'AO-PK160', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 0, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-c180a', 'AO-C180A', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 54.4, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA ELEVACION', 'unidad-oftalmica-con-silla-elevacion', 'AO-CS518', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 0, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA ELEVACION', 'unidad-oftalmica-con-silla-elevacion-cs188', 'AO-CS188', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 240, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 'unidad-oftalmica-con-silla-elevacion-y-pedal', 'AO-C180AB', 'UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 'UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 54.4, 49, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable', 'AO-S900B', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, 50, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable-s900c', 'AO-S900C', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, 50, 'published', 0, 0),
('UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable-s900at', 'AO-S900AT', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, 50, 'published', 0, 0),
('MESA DE ELEVACION', 'mesa-de-elevacion', 'AO-WZ3A', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 17, 51, 'published', 0, 0),
('MESA DE ELEVACION', 'mesa-de-elevacion-wb3an', 'AO-WB3AN', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 17, 51, 'published', 0, 0),
('TRIAL MESA DE ELEVACION CON BANDEJA', 'trial-mesa-de-elevacion-con-bandeja', 'AO-WZ3AT', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 25, 51, 'published', 0, 0),
('MESA DOBLE DE ELEVACIÓN', 'mesa-doble-de-elevacion', 'AO-C330A', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 70, 52, 'published', 0, 0),
('MESA MULTIFUNCIONAL', 'mesa-multifuncional', 'AO-C288AT-B', 'MESA MULTIFUNCIONAL', 'MESA MULTIFUNCIONAL', 0, 53, 'published', 0, 0),
('+ WZ-A UNIDAD OFTALMICA PARA PERSONAS CON MOVILIDAD REDUCIDA', 'wz-a-unidad-oftalmica-para-personas-con-movilidad-reducida', 'AO-C288AT', 'La columna de elevación con forma de eclipse ofrece espacio y potencia suficientes para levantar 3 instrumentos al mismo tiempo. Y ruedas que...', 'La columna de elevación con forma de eclipse ofrece espacio y potencia suficientes para levantar 3 instrumentos al mismo tiempo. Y ruedas que...', 122.6, 54, 'published', 0, 0),
('SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion', 'AO-WZA', 'SILLA CON PEDAL DE ELEVACION', 'SILLA CON PEDAL DE ELEVACION', 0, 55, 'published', 0, 0),
('SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion-ct1955', 'AO-CT1955', 'SILLA CON PEDAL DE ELEVACION', 'SILLA CON PEDAL DE ELEVACION', 0, 55, 'published', 0, 0),
('SILLA CON PEDAL DE ELEVACION Y RECLINACION', 'silla-con-pedal-de-elevacion-y-reclinacion', 'AO-WZDT1A', 'SILLA CON PEDAL DE ELEVACION Y RECLINACION', 'SILLA CON PEDAL DE ELEVACION Y RECLINACION', 0, 55, 'published', 0, 0),
('SILLA PARA OPTICA', 'silla-para-optica', 'AO-WZY5B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 56, 'published', 0, 0),
('SILLA PARA OPTICA', 'silla-para-optica-wzy5b-b', 'AO-WZY5B-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 56, 'published', 0, 0),
('SILLA PARA OPTICA', 'silla-para-optica-wz5at', 'AO-WZ5AT', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 56, 'published', 0, 0),
('SILLA PARA OPTICA', 'silla-para-optica-wzy5a', 'AO-WZY5A', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 56, 'published', 0, 0),
('SILLA PARA OPTICA', 'silla-para-optica-wzy5a-b', 'AO-WZY5A-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 56, 'published', 0, 0),
('SILLA PARA OPTICA', 'silla-para-optica-wzy5c', 'AO-WZY5C', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 56, 'published', 0, 0),
('SILLA PARA OPTICA', 'silla-para-optica-wzy5c-b', 'AO-WZY5C-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 56, 'published', 0, 0),
('CARTILLA DE EXAMEN VISUAL GRANDE', 'cartilla-de-examen-visual-grande', 'AO-WZ08', 'CARTILLA DE EXAMEN VISUAL GRANDE', 'CARTILLA DE EXAMEN VISUAL GRANDE', 0.0005, 57, 'published', 0, 0),
('CARTILLA DE LECTURA MANUAL PEQUEÑA', 'cartilla-de-lectura-manual-pequena', 'AO-WZ01', 'CARTILLA DE LECTURA MANUAL PEQUEÑA', 'CARTILLA DE LECTURA MANUAL PEQUEÑA', 0.0005, 57, 'published', 0, 0),
('LETRAS CARTILLA VISUAL DIRECCIONAL', 'letras-cartilla-visual-direccional', 'AO-LETRARO', 'LETRAS CARTILLA VISUAL DIRECCIONAL', 'LETRAS CARTILLA VISUAL DIRECCIONAL', 0.0005, 57, 'published', 0, 0),
('CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 'control-r-control-para-monitor-y-proyector', 'AO-VC1-B', 'CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 'CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 0, 58, 'published', 0, 0),
('MONITOR LCD', 'monitor-lcd', 'AO-VC1', 'MONITOR LCD', 'MONITOR LCD', 5.8, 59, 'published', 0, 0),
('MONITOR LCD 21.5', 'monitor-lcd-21-5', 'AO-K215F', 'MONITOR LCD 21.5', 'MONITOR LCD 21.5', 0, 59, 'published', 0, 0),
('MONITOR LCD 23', 'monitor-lcd-23', 'AO-215D', 'MONITOR LCD 23', 'MONITOR LCD 23', 0, 59, 'published', 0, 0),
('MONITOR LCD 23', 'monitor-lcd-23-230a', 'AO-230A', 'MONITOR LCD 23', 'MONITOR LCD 23', 0, 59, 'published', 0, 0),
('MONITOR LCD 23.8', 'monitor-lcd-23-8', 'AO-SC800', 'MONITOR LCD 23.8', 'MONITOR LCD 23.8', 0, 59, 'published', 0, 0),
('MONITOR LCD VISUAL 44 TEST 23.5', 'monitor-lcd-visual-44-test-23-5', 'AO-ACP300', 'MONITOR LCD VISUAL 44 TEST 23.5', 'MONITOR LCD VISUAL 44 TEST 23.5', 5.2, 59, 'published', 0, 0),
('MONITOR LCD VERTICAL', 'monitor-lcd-vertical', 'AO-CTS215', 'MONITOR LCD VERTICAL', 'MONITOR LCD VERTICAL', 5.2, 60, 'published', 0, 0),
('OPTOTIPO CON SOPORTE', 'optotipo-con-soporte', 'AO-WZSLB12', 'OPTOTIPO CON SOPORTE', 'OPTOTIPO CON SOPORTE', 0.0005, 61, 'published', 0, 0),
('OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico', 'AO-CB028', 'OPTOTIPO ELECTRICO LUMINICO', 'OPTOTIPO ELECTRICO LUMINICO', 0.05, 62, 'published', 0, 0),
('OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico-wzslb8', 'AO-WZSLB8', 'OPTOTIPO ELECTRICO LUMINICO', 'OPTOTIPO ELECTRICO LUMINICO', 0.05, 62, 'published', 0, 0),
('PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras', 'AO-WB1117A', 'PROYECTOR GRAFICO DE MASCARAS', 'PROYECTOR GRAFICO DE MASCARAS', 0, 63, 'published', 0, 0),
('PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras-wz3000b', 'AO-WZ3000B', 'PROYECTOR GRAFICO DE MASCARAS', 'PROYECTOR GRAFICO DE MASCARAS', 6.5, 63, 'published', 0, 0),
('OPTOTIPO TABLET LCD', 'optotipo-tablet-lcd', 'AO-WB1112H', 'OPTOTIPO TABLET LCD', 'OPTOTIPO TABLET LCD', 6, 64, 'published', 0, 0);

-- Set AUTO_INCREMENT counters to avoid future ID conflicts
ALTER TABLE categories AUTO_INCREMENT = 65;
ALTER TABLE products AUTO_INCREMENT = 155;

-- ============================================
-- DONE: 4 main categories, 60 subcategories,
--       154 products, admin user, shipping rates,
--       exchange rate, site settings, page sections
-- ============================================
