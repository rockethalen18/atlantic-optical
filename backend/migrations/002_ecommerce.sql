-- Atlantic Optical E-commerce Migration
-- Adds: order_items, discount_codes, bundles, bundle_items, banners, popups, payments

-- ============================================================
-- ORDER ITEMS (line items per order)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit_price_mxn DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price_mxn DECIMAL(10,2) NOT NULL DEFAULT 0,
    weight_kg DECIMAL(8,3) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_items_order (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ENHANCE ORDERS TABLE (add missing columns)
-- ============================================================
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS order_number VARCHAR(30) NULL AFTER id,
    ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(30) NULL AFTER customer_name,
    ADD COLUMN IF NOT EXISTS shipping_address TEXT NULL AFTER customer_phone,
    ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(30) DEFAULT 'maritimo' AFTER shipping_address,
    ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0 AFTER shipping_method,
    ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0 AFTER total,
    ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0 AFTER subtotal,
    ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50) NULL AFTER discount_amount,
    ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0 AFTER discount_code,
    ADD COLUMN IF NOT EXISTS total_usd DECIMAL(10,2) DEFAULT 0 AFTER tax,
    ADD COLUMN IF NOT EXISTS currency VARCHAR(5) DEFAULT 'MXN' AFTER total_usd,
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30) NULL AFTER currency,
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending' AFTER payment_method,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
    ADD INDEX IF NOT EXISTS idx_orders_number (order_number),
    ADD INDEX IF NOT EXISTS idx_orders_payment_status (payment_status);

-- ============================================================
-- DISCOUNT CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS discount_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL DEFAULT 'percentage' COMMENT 'percentage or fixed',
    value DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'percentage off or fixed amount USD',
    min_order_usd DECIMAL(10,2) DEFAULT 0 COMMENT 'minimum order amount',
    max_uses INT DEFAULT 0 COMMENT '0 = unlimited',
    used_count INT DEFAULT 0,
    applies_to VARCHAR(20) DEFAULT 'all' COMMENT 'all, category, product',
    applies_to_id INT NULL COMMENT 'category_id or product_id',
    starts_at DATETIME NULL,
    expires_at DATETIME NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_discount_code (code),
    INDEX idx_discount_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- BUNDLES (product groups)
-- ============================================================
CREATE TABLE IF NOT EXISTS bundles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    bundle_price_usd DECIMAL(10,2) NOT NULL COMMENT 'fixed bundle price in USD',
    image VARCHAR(500) NULL,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bundle_slug (slug),
    INDEX idx_bundle_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- BUNDLE ITEMS (products in a bundle)
-- ============================================================
CREATE TABLE IF NOT EXISTS bundle_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bundle_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bundle_items_bundle (bundle_id),
    FOREIGN KEY (bundle_id) REFERENCES bundles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- BANNERS (admin-managed animated banners)
-- ============================================================
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    image VARCHAR(500) NULL,
    link VARCHAR(500) NULL,
    link_text VARCHAR(100) NULL,
    bg_color VARCHAR(20) DEFAULT '#0a1628',
    text_color VARCHAR(20) DEFAULT '#ffffff',
    position VARCHAR(30) DEFAULT 'home' COMMENT 'home, category, all',
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    starts_at DATETIME NULL,
    expires_at DATETIME NULL,
    animation VARCHAR(30) DEFAULT 'fade' COMMENT 'fade, slide, zoom, none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_banner_position (position),
    INDEX idx_banner_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- POPUPS (admin-managed informational popups)
-- ============================================================
CREATE TABLE IF NOT EXISTS popups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(500) NULL,
    bg_color VARCHAR(20) DEFAULT '#ffffff',
    text_color VARCHAR(20) DEFAULT '#1a1a1a',
    button_text VARCHAR(100) NULL,
    button_color VARCHAR(20) DEFAULT '#2563eb',
    button_link VARCHAR(500) NULL,
    position VARCHAR(30) DEFAULT 'center' COMMENT 'center, bottom-right, bottom-left',
    trigger_type VARCHAR(30) DEFAULT 'delay' COMMENT 'delay, scroll, exit-intent',
    trigger_value INT DEFAULT 3000 COMMENT 'delay ms or scroll %',
    frequency VARCHAR(20) DEFAULT 'once' COMMENT 'once, daily, always',
    is_active TINYINT(1) DEFAULT 1,
    starts_at DATETIME NULL,
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_popup_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PAYMENTS (payment tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    method VARCHAR(30) NOT NULL COMMENT 'card, paypal, transfer, oxxo',
    status VARCHAR(20) DEFAULT 'pending' COMMENT 'pending, completed, failed, refunded',
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'MXN',
    transaction_id VARCHAR(255) NULL,
    gateway_response TEXT NULL,
    card_last_four VARCHAR(4) NULL,
    card_brand VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_status (status),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
