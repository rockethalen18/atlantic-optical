DROP DATABASE IF EXISTS atlantic_optical;
CREATE DATABASE atlantic_optical CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE atlantic_optical;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  reference VARCHAR(100),
  description TEXT,
  image VARCHAR(500),
  barcode VARCHAR(100),
  specs JSON,
  category_id INT NOT NULL,
  subcategory_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
) ENGINE=InnoDB;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','user') DEFAULT 'user',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  customer_phone VARCHAR(20),
  status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  total DECIMAL(10,2) DEFAULT 0,
  shipping_method VARCHAR(50),
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE shipping_rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method VARCHAR(50) NOT NULL,
  cost_per_kg DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  estimated_days VARCHAR(50),
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE exchange_rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usd_mxn DECIMAL(10,4) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'text'
) ENGINE=InnoDB;

CREATE TABLE page_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  image VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories
INSERT INTO categories (id, name, slug, description, is_active) VALUES (1, 'Equipos de Laboratorio', 'equipos-laboratorio', 'Equipos y maquinaria para laboratorio optico', 1);
INSERT INTO categories (id, name, slug, description, is_active) VALUES (2, 'Equipos de Oftalmologia y Optica', 'equipos-oftalmologia-optica', 'Equipos de diagnostico y tratamiento oftalmologico', 1);
INSERT INTO categories (id, name, slug, description, is_active) VALUES (3, 'Mobiliario', 'mobiliario', 'Muebles y accesorios para consultorios y opticas', 1);
INSERT INTO categories (id, name, slug, description, is_active) VALUES (4, 'Monitores y Optotipos', 'monitores-optotipos', 'Sistemas de vision y optotipos para examenes visuales', 1);

-- Subcategories
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (1, 1, 'Biseladoras Automaticas', 'biseladoras-automaticas', 'Biseladoras Automaticas', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (2, 1, 'Biseladoras Manuales', 'biseladoras-manuales', 'Biseladoras Manuales', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (3, 1, 'Biseladoras Semiautomaticas', 'biseladoras-semiautomaticas', 'Biseladoras Semiautomaticas', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (4, 1, 'Calentadores', 'calentadores', 'Calentadores', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (5, 1, 'Centradoras', 'centradoras', 'Centradoras', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (6, 1, 'Esferometros', 'esferometros', 'Esferometros', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (7, 1, 'Limpiadores Ultrasonicos', 'limpiadores-ultrasonicos', 'Limpiadores Ultrasonicos', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (8, 1, 'Medidores de Espesor', 'medidores-de-espesor', 'Medidores de Espesor', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (9, 1, 'Otros Laboratorio', 'otros-laboratorio', 'Otros Laboratorio', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (10, 1, 'Perforadoras al Aire', 'perforadoras-al-aire', 'Perforadoras al Aire', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (11, 1, 'Perforadoras para Plantilla', 'perforadoras-para-plantilla', 'Perforadoras para Plantilla', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (12, 1, 'Probadores de Fotocromatico', 'probadores-de-fotocromatico', 'Probadores de Fotocromatico', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (13, 1, 'Pulidoras Manuales', 'pulidoras-manuales', 'Pulidoras Manuales', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (14, 1, 'Ranuradoras Manuales', 'ranuradoras-manuales', 'Ranuradoras Manuales', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (15, 1, 'Repuestos', 'repuestos', 'Repuestos', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (16, 1, 'Tinturadoras', 'tinturadoras', 'Tinturadoras', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (17, 1, 'Uveometros', 'uveometros', 'Uveometros', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (18, 2, 'Analisis de Gafas', 'analisis-de-gafas', 'Analisis de Gafas', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (19, 2, 'Auto Refractometros', 'auto-refractometros', 'Auto Refractometros', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (20, 2, 'Auto Refractometros con Keratometro', 'auto-refractometros-con-keratometro', 'Auto Refractometros con Keratometro', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (21, 2, 'Cajas de Prisma', 'cajas-de-prisma', 'Cajas de Prisma', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (22, 2, 'Cajas de Prueba', 'cajas-de-prueba', 'Cajas de Prueba', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (23, 2, 'Camara de Fondo', 'camara-de-fondo', 'Camara de Fondo', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (24, 2, 'Equipos de Fisioterapia', 'equipos-de-fisioterapia', 'Equipos de Fisioterapia', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (25, 2, 'Facoemulsificador', 'facoemulsificador', 'Facoemulsificador', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (26, 2, 'Foropteros Manuales', 'foropteros-manuales', 'Foropteros Manuales', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (27, 2, 'Lamparas de Hendidura', 'lamparas-de-hendidura', 'Lamparas de Hendidura', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (28, 2, 'Lamparas Portatiles', 'lamparas-portatiles', 'Lamparas Portatiles', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (29, 2, 'Lente de 3 Espejos', 'lente-de-3-espejos', 'Lente de 3 Espejos', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (30, 2, 'Lente de Aumento', 'lente-de-aumento', 'Lente de Aumento', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (31, 2, 'Microscopio Quirurgico', 'microscopio-quirurgico', 'Microscopio Quirurgico', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (32, 2, 'Monturas de Prueba', 'monturas-de-prueba', 'Monturas de Prueba', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (33, 2, 'OCT', 'oct', 'OCT', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (34, 2, 'Oftalmoscopios', 'oftalmoscopios', 'Oftalmoscopios', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (35, 2, 'Probetas Desechables', 'probetas-desechables', 'Probetas Desechables', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (36, 2, 'Pupilometros', 'pupilometros', 'Pupilometros', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (37, 2, 'Retinoscopios', 'retinoscopios', 'Retinoscopios', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (38, 2, 'Tonometros de Contacto', 'tonometros-de-contacto', 'Tonometros de Contacto', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (39, 2, 'Tonometros Metalicos', 'tonometros-metalicos', 'Tonometros Metalicos', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (40, 3, 'Mesas de Elevacion', 'mesas-de-elevacion', 'Mesas de Elevacion', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (41, 3, 'Mesas Dobles', 'mesas-dobles', 'Mesas Dobles', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (42, 3, 'Mesas Multifuncional', 'mesas-multifuncional', 'Mesas Multifuncional', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (43, 3, 'Sillas con Pedal', 'sillas-con-pedal', 'Sillas con Pedal', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (44, 3, 'Sillas para Optica', 'sillas-para-optica', 'Sillas para Optica', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (45, 4, 'Cartillas', 'cartillas', 'Cartillas', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (46, 4, 'Monitores Estandar', 'monitores-estandar', 'Monitores Estandar', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (47, 4, 'Monitores Verticales', 'monitores-verticales', 'Monitores Verticales', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (48, 4, 'Optotipos con Soporte', 'optotipos-con-soporte', 'Optotipos con Soporte', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (49, 4, 'Optotipos Electricos', 'optotipos-electricos', 'Optotipos Electricos', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (50, 4, 'Proyectores Graficos', 'proyectores-graficos', 'Proyectores Graficos', 1);
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES (51, 4, 'Tablet LCD', 'tablet-lcd', 'Tablet LCD', 1);

-- Products
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-104', 'CAJA DE PRUEBA DE 104 LENTILLAS', 'caja-de-prueba-de-104-lentillas', '104', 'CAJA DE PRUEBA DE 104 LENTILLAS', '/images/products/AO-104.jpg', '', '{}', 2, 22, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-20D', 'LENTE DE AUMENTO', 'lente-de-aumento', '20D', 'LENTE DE AUMENTO', '/images/products/AO-20D.jpg', '', '{}', 2, 30, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-215D', 'MONITOR LCD 23', 'monitor-lcd-23', '215D', 'MONITOR LCD 23', '/images/products/AO-215D.jpg', '', '{}', 4, 46, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-230A', 'MONITOR LCD 23', 'monitor-lcd-23-230a', '230A', 'MONITOR LCD 23', '/images/products/AO-230A.jpg', '', '{}', 4, 46, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-266JS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 'gris-caja-de-prueba-de-266-lentillas', '266JS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', '/images/products/AO-266JS.jpg', '', '{}', 2, 22, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-468E4310', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio', '468E4310', 'RETINOSCOPIO CON OFTALMOSCOPIO', '/images/products/AO-468E4310.jpg', '', '{}', 2, 34, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-6ACP', 'BISELADORA MANUAL DE TRES PIEDRAS', 'biseladora-manual-de-tres-piedras', '6A-CP', 'BISELADORA MANUAL DE TRES PIEDRAS', '/images/products/AO-6ACP.jpg', '', '{}', 1, 2, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-78D', 'LENTE DE AUMENTO', 'lente-de-aumento-78d', '78D', 'LENTE DE AUMENTO', '/images/products/AO-78D.jpg', '', '{}', 2, 30, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ACP300', 'MONITOR LCD VISUAL 44 TEST 23.5', 'monitor-lcd-visual-44-test-235', 'ACP-300', 'MONITOR LCD VISUAL 44 TEST 23.5', '/images/products/AO-ACP300.jpg', '', '{}', 4, 46, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ALE1000', 'BISELADORA AUTOMATICA CON ESCANER', 'biseladora-automatica-con-escaner', 'ALE-1000', 'BISELADORA AUTOMATICA CON ESCANER', '/images/products/AO-ALE1000.jpg', '', '{}', 1, 1, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ALE1600G', 'BISELADORA AUTOMATICA', 'biseladora-automatica', 'ALE-1600G', 'BISELADORA AUTOMATICA', '/images/products/AO-ALE1600G.jpg', '', '{}', 1, 1, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ALE1700G', 'BISELADORA AUTOMATICA', 'biseladora-automatica-ale1700g', 'ALE-1700G', 'BISELADORA AUTOMATICA', '/images/products/AO-ALE1700G.jpg', '', '{}', 1, 1, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ARK7710', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro', 'ARK-7710', 'AUTOREFRACTOMETRO CON KERATOMETRO', '/images/products/AO-ARK7710.jpg', '', '{}', 2, 20, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-BROC1', 'REPUESTO DE BROCA PARA CORTADORA', 'repuesto-de-broca-para-cortadora', 'BROC-1', 'REPUESTO DE BROCA PARA CORTADORA', '/images/products/AO-BROC1.jpg', '', '{}', 1, 15, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-C288AT', 'MESA MULTIFUNCIONAL', 'mesa-multifuncional', 'C-288AT', 'MESA MULTIFUNCIONAL', '/images/products/AO-C288AT.jpg', '', '{}', 3, 42, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-C330A', 'MESA DOBLE DE ELEVACIN', 'mesa-doble-de-elevacin', 'C-330A', 'MESA DOBLE DE ELEVACIN', '/images/products/AO-C330A.jpg', '', '{}', 3, 41, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CB028', 'OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico', 'CB-028', 'OPTOTIPO ELECTRICO LUMINICO', '/images/products/AO-CB028.jpg', '', '{}', 4, 49, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP008', 'LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico', 'CP-008', 'LIMPIADOR DE LENTES ULTRASONICO', '/images/products/AO-CP008.jpg', '', '{}', 1, 7, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP10C', 'PERFORADORA PARA PLANTILLA', 'perforadora-para-plantilla', 'CP-10C-', 'PERFORADORA PARA PLANTILLA', '/images/products/AO-CP10C.jpg', '', '{}', 1, 11, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP11A35WV', 'BISELADORA MANUAL DE UNA PIEDRA', 'biseladora-manual-de-una-piedra', 'CP-11A-35WV', 'BISELADORA MANUAL DE UNA PIEDRA', '/images/products/AO-CP11A35WV.jpg', '', '{}', 1, 2, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP18C', 'UVEOMETRO', 'uveometro', 'CP-18C+', 'UVEOMETRO', '/images/products/AO-CP18C.jpg', '', '{}', 1, 17, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP1B', 'LENSOMETRO PORTATIL', 'lensometro-portatil', 'CP-1B-', 'LENSOMETRO PORTATIL', '/images/products/AO-CP1B.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP30', 'PUPILOMETRO MANUAL', 'pupilometro-manual', 'CP-30', 'PUPILOMETRO MANUAL', '/images/products/AO-CP30.jpg', '', '{}', 2, 36, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP6A1', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 'nh-136-biseladora-manual-de-tres-piedras', 'CP-6A-1', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', '/images/products/AO-CP6A1.jpg', '', '{}', 1, 2, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CP8A', 'PULIDORA MANUAL', 'pulidora-manual', 'CP-8A', 'PULIDORA MANUAL', '/images/products/AO-CP8A.jpg', '', '{}', 1, 13, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CT1504', 'BRAZO PARA FOROPTERO Y PROYECTOR DE', 'brazo-para-foroptero-y-proyector-de', 'CT-1504', 'BRAZO PARA FOROPTERO Y PROYECTOR DE', '/images/products/AO-CT1504.jpg', '', '{}', 2, 26, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CT1955', 'SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion', 'CT1955', 'SILLA CON PEDAL DE ELEVACION', '/images/products/AO-CT1955.jpg', '', '{}', 3, 43, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-CTS215', 'MONITOR LCD VERTICAL', 'monitor-lcd-vertical', 'CTS-215', 'MONITOR LCD VERTICAL', '/images/products/AO-CTS215.jpg', '', '{}', 4, 47, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-D900', 'LENSOMETRO DIGITAL', 'lensometro-digital', 'D-900', 'LENSOMETRO DIGITAL', '/images/products/AO-D900.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-D910', 'AUTOLENSOMETRO DIGITAL', 'autolensometro-digital', 'D-910', 'AUTOLENSOMETRO DIGITAL', '/images/products/AO-D910.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-FA100', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa100', 'FA-100', 'AUTOREFRACTOMETRO CON KERATOMETRO', '/images/products/AO-FA100.jpg', '', '{}', 2, 20, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-FA6000A', 'AUTOREFRACTOMETRO', 'autorefractometro', 'FA-6000A', 'AUTOREFRACTOMETRO', '/images/products/AO-FA6000A.jpg', '', '{}', 2, 19, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-FA6100CK', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa6100ck', 'FA-6100CK', 'AUTOREFRACTOMETRO CON KERATOMETRO', '/images/products/AO-FA6100CK.jpg', '', '{}', 2, 20, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-FA6500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa6500k', 'FA-6500K-', 'AUTOREFRACTOMETRO CON KERATOMETRO', '/images/products/AO-FA6500K.jpg', '', '{}', 2, 20, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-FA8500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa8500k', 'FA-8500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', '/images/products/AO-FA8500K.jpg', '', '{}', 2, 20, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-GB800', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 'wz-jp121-limpiador-ultrasonico-moderno', 'GB-800', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', '/images/products/AO-GB800.jpg', '', '{}', 1, 7, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-GD1104', 'MONTURA DE PRUEBA', 'montura-de-prueba', 'GD-1104', 'MONTURA DE PRUEBA', '/images/products/AO-GD1104.jpg', '', '{}', 2, 32, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-HL004', 'LAMPARA FRONTAL MEDICA', 'lampara-frontal-medica', 'HL-004', 'LAMPARA FRONTAL MEDICA', '/images/products/AO-HL004.jpg', '', '{}', 2, 28, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-IREF', 'AUTOREFRACTOMETRO PORTATIL', 'autorefractometro-portatil', 'IREF', 'AUTOREFRACTOMETRO PORTATIL', '/images/products/AO-IREF.jpg', '', '{}', 2, 19, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-JD26000D', 'AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-jd26000d', 'JD-26000D', 'AUTOLENSOMETRO DIGITAL', '/images/products/AO-JD26000D.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-JS158', 'CAJA DE PRUEBA DE 158 LENTILLAS', 'caja-de-prueba-de-158-lentillas', 'JS-158', 'CAJA DE PRUEBA DE 158 LENTILLAS', '/images/products/AO-JS158.jpg', '', '{}', 2, 22, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-JS22P', 'CAJA DE PRUEBA PROGRESIVA', 'caja-de-prueba-progresiva', 'JS-22P', 'CAJA DE PRUEBA PROGRESIVA', '/images/products/AO-JS22P.jpg', '', '{}', 2, 22, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-K215F', 'MONITOR LCD 21.5', 'monitor-lcd-215', 'K215F', 'MONITOR LCD 21.5', '/images/products/AO-K215F.jpg', '', '{}', 4, 46, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-KJRDA2', 'EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual', 'KJR-D-A2', 'EQUIPO DE FISIOTERAPIA VISUAL', '/images/products/AO-KJRDA2.jpg', '', '{}', 2, 24, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-KJRDA3', 'EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual-kjrda3', 'KJR-D-A3', 'EQUIPO DE FISIOTERAPIA VISUAL', '/images/products/AO-KJRDA3.jpg', '', '{}', 2, 24, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LE420', '+ LY-2A + CP-10C- BISELADORA', 'ly-2a-cp-10c-biseladora', 'LE-420', '+ LY-2A + CP-10C- BISELADORA', '/images/products/AO-LE420.jpg', '', '{}', 1, 9, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LETRARO', 'LETRAS CARTILLA VISUAL DIRECCIONAL', 'letras-cartilla-visual-direccional', 'LETRARO', 'LETRAS CARTILLA VISUAL DIRECCIONAL', '/images/products/AO-LETRARO.jpg', '', '{}', 4, 45, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LM260', 'AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm260', 'LM-260', 'AUTOLENSOMETRO DIGITAL', '/images/products/AO-LM260.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LM300', 'AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm300', 'LM-300', 'AUTOLENSOMETRO DIGITAL', '/images/products/AO-LM300.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LM800', 'AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm800', 'LM-800', 'AUTOLENSOMETRO DIGITAL', '/images/products/AO-LM800.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LM900', 'AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm900', 'LM-900', 'AUTOLENSOMETRO DIGITAL', '/images/products/AO-LM900.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY12A', 'RANURADORA MANUAL', 'ranuradora-manual', 'LY-12A', 'RANURADORA MANUAL', '/images/products/AO-LY12A.jpg', '', '{}', 1, 14, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY2A', 'CENTRADORA CON BRAZO PARA PEGATINA Y', 'centradora-con-brazo-para-pegatina-y', 'LY-2A', 'CENTRADORA CON BRAZO PARA PEGATINA Y', '/images/products/AO-LY2A.jpg', '', '{}', 1, 5, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY6BT', 'CALENTADOR DE MONTURA', 'calentador-de-montura', 'LY-6BT', 'CALENTADOR DE MONTURA', '/images/products/AO-LY6BT.jpg', '', '{}', 1, 4, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY6C', 'CALENTADOR DE MONTURA', 'calentador-de-montura-ly6c', 'LY-6C', 'CALENTADOR DE MONTURA', '/images/products/AO-LY6C.jpg', '', '{}', 1, 4, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY8384', 'PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico', 'LY-838-4', 'PROBADOR DE LENTES PHOTOCROMATICO', '/images/products/AO-LY8384.jpg', '', '{}', 1, 12, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY900', 'PULIDORA SEMIAUTOMATICA', 'pulidora-semiautomatica', 'LY-900', 'PULIDORA SEMIAUTOMATICA', '/images/products/AO-LY900.jpg', '', '{}', 1, 3, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY9C', 'PUPILOMETRO DIGITAL', 'pupilometro-digital', 'LY-9C', 'PUPILOMETRO DIGITAL', '/images/products/AO-LY9C.jpg', '', '{}', 2, 36, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-LY988C', 'PERFORADORA PARA LENTES AL AIRE', 'perforadora-para-lentes-al-aire', 'LY988C', 'PERFORADORA PARA LENTES AL AIRE', '/images/products/AO-LY988C.jpg', '', '{}', 1, 10, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-MD480', 'PHACOEMULSIFICADOR', 'phacoemulsificador', 'MD-480', 'PHACOEMULSIFICADOR', '/images/products/AO-MD480.jpg', '', '{}', 2, 25, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ML400', 'BLANCO FOROPTERO', 'blanco-foroptero', 'ML-400', 'BLANCO FOROPTERO', '/images/products/AO-ML400.jpg', '', '{}', 2, 26, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ML5S1', 'LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil', 'ML-5S1', 'LAMPARA DE HENDIDURA PORTATIL', '/images/products/AO-ML5S1.jpg', '', '{}', 2, 28, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-NH3GS', 'PERFORADORA AUTOMTICA PARA LENTES AL', 'perforadora-automtica-para-lentes-al', 'NH-3GS', 'PERFORADORA AUTOMTICA PARA LENTES AL', '/images/products/AO-NH3GS.jpg', '', '{}', 1, 9, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-NJC6', 'LENSOMETRO MANUAL', 'lensometro-manual', 'NJC-6', 'LENSOMETRO MANUAL', '/images/products/AO-NJC6.jpg', '', '{}', 2, 18, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-OCT500', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 'tomografo-de-coherencia-optica-oct', 'OCT-500', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', '/images/products/AO-OCT500.jpg', '', '{}', 2, 33, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-PS22', 'CAJA DE PRISMAS', 'caja-de-prismas', 'PS-22', 'CAJA DE PRISMAS', '/images/products/AO-PS22.jpg', '', '{}', 2, 21, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-RNH316', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', 'repuesto-de-biseladora-de-3-piedras', 'R-NH316', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', '/images/products/AO-RNH316.jpg', '', '{}', 1, 15, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-RETIWAVE1000', 'ESCANER ULTRASONICO A-B', 'escaner-ultrasonico-a-b', 'RETIWAVE-1000', 'ESCANER ULTRASONICO A-B', '/images/products/AO-RETIWAVE1000.jpg', '', '{}', 1, 7, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-RM3', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', 'pinza-para-tinturado-de-lunas-opticas', 'RM-3', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', '/images/products/AO-RM3.jpg', '', '{}', 1, 15, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-S150', 'LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-s150', 'S-150', 'LAMPARA DE HENDIDURA PORTATIL', '/images/products/AO-S150.jpg', '', '{}', 2, 28, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-SJ350', 'YZ-30RR LAMPARA DE HENDIDURA 5', 'yz-30rr-lampara-de-hendidura-5', 'S-J350', 'YZ-30RR LAMPARA DE HENDIDURA 5', '/images/products/AO-SJ350.jpg', '', '{}', 2, 27, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-SC800', 'MONITOR LCD 23.8', 'monitor-lcd-238', 'SC-800', 'MONITOR LCD 23.8', '/images/products/AO-SC800.jpg', '', '{}', 4, 46, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-SJ989', 'LUPA BINOCULAR', 'lupa-binocular', 'SJ-989', 'LUPA BINOCULAR', '/images/products/AO-SJ989.jpg', '', '{}', 2, 30, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-SJG7100', 'BISELADORA SEMIAUTOMTICA', 'biseladora-semiautomtica', 'SJG-7100', 'BISELADORA SEMIAUTOMTICA', '/images/products/AO-SJG7100.jpg', '', '{}', 1, 9, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-SK5500A', 'TONOMETRO', 'tonometro', 'SK-5500A', 'TONOMETRO', '/images/products/AO-SK5500A.jpg', '', '{}', 2, 38, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-ST150', 'LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-st150', 'ST-150', 'LAMPARA DE HENDIDURA PORTATIL', '/images/products/AO-ST150.jpg', '', '{}', 2, 28, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-SW500', 'PROBE PROBETA DESECHABLE', 'probe-probeta-desechable', 'SW-500', 'PROBE PROBETA DESECHABLE', '/images/products/AO-SW500.jpg', '', '{}', 2, 35, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-TC10A', 'BISELADORA MANUAL DE UNA PIEDRA CON', 'biseladora-manual-de-una-piedra-con', 'TC-10A', 'BISELADORA MANUAL DE UNA PIEDRA CON', '/images/products/AO-TC10A.jpg', '', '{}', 1, 2, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-TF488A', 'MONTURA DE PRUEBA PREMIUM', 'montura-de-prueba-premium', 'TF-488A', 'MONTURA DE PRUEBA PREMIUM', '/images/products/AO-TF488A.jpg', '', '{}', 2, 32, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-TFC', 'MONTURA DE PRUEBA PARA NIOS', 'montura-de-prueba-para-nios', 'TF-C', 'MONTURA DE PRUEBA PARA NIOS', '/images/products/AO-TFC.jpg', '', '{}', 2, 32, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-TF5470', 'MONTURA DE PRUEBA TITANIUM', 'montura-de-prueba-titanium', 'TF5470', 'MONTURA DE PRUEBA TITANIUM', '/images/products/AO-TF5470.jpg', '', '{}', 2, 32, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-TM001', 'ESFEROMETRO METALICO', 'esferometro-metalico', 'TM-001', 'ESFEROMETRO METALICO', '/images/products/AO-TM001.jpg', '', '{}', 1, 6, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-TR6', 'TINTURADORA', 'tinturadora', 'TR-6', 'TINTURADORA', '/images/products/AO-TR6.jpg', '', '{}', 1, 16, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-TTF08', 'MONTURA DE PRUEBA ALUMINIO', 'montura-de-prueba-aluminio', 'TTF-08', 'MONTURA DE PRUEBA ALUMINIO', '/images/products/AO-TTF08.jpg', '', '{}', 2, 32, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-VB15HB16', 'CAJA DE PRISMAS', 'caja-de-prismas-vb15hb16', 'VB-15+HB-16', 'CAJA DE PRISMAS', '/images/products/AO-VB15HB16.jpg', '', '{}', 2, 21, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WATERPUMP', 'BOMBA PARA ALE1000 Y LE-420', 'bomba-para-ale1000-y-le-420', 'WATER PUMP', 'BOMBA PARA ALE1000 Y LE-420', '/images/products/AO-WATERPUMP.jpg', '', '{}', 1, 15, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WB1112H', 'OPTOTIPO TABLET LCD', 'optotipo-tablet-lcd', 'WB-1112H', 'OPTOTIPO TABLET LCD', '/images/products/AO-WB1112H.jpg', '', '{}', 4, 51, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WB1117A', 'PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras', 'WB-1117A', 'PROYECTOR GRAFICO DE MASCARAS', '/images/products/AO-WB1117A.jpg', '', '{}', 4, 50, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WB3AN', 'MESA DE ELEVACION', 'mesa-de-elevacion', 'WB-3AN', 'MESA DE ELEVACION', '/images/products/AO-WB3AN.jpg', '', '{}', 3, 40, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZ01', 'CARTILLA DE LECTURA MANUAL PEQUEA', 'cartilla-de-lectura-manual-pequea', 'WZ-01', 'CARTILLA DE LECTURA MANUAL PEQUEA', '/images/products/AO-WZ01.jpg', '', '{}', 4, 45, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZ08', 'CARTILLA DE EXAMEN VISUAL GRANDE', 'cartilla-de-examen-visual-grande', 'WZ-08', 'CARTILLA DE EXAMEN VISUAL GRANDE', '/images/products/AO-WZ08.jpg', '', '{}', 4, 45, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZ1300', 'CAMARA DE FONDO DE OJO PORTATIL', 'camara-de-fondo-de-ojo-portatil', 'WZ-1300', 'CAMARA DE FONDO DE OJO PORTATIL', '/images/products/AO-WZ1300.jpg', '', '{}', 2, 23, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZ3000B', 'PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras-wz3000b', 'WZ-3000B', 'PROYECTOR GRAFICO DE MASCARAS', '/images/products/AO-WZ3000B.jpg', '', '{}', 4, 50, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZ3A', 'MESA DE ELEVACION', 'mesa-de-elevacion-wz3a', 'WZ-3A', 'MESA DE ELEVACION', '/images/products/AO-WZ3A.jpg', '', '{}', 3, 40, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZ3AT', 'TRIAL MESA DE ELEVACION CON BANDEJA', 'trial-mesa-de-elevacion-con-bandeja', 'WZ-3AT', 'TRIAL MESA DE ELEVACION CON BANDEJA', '/images/products/AO-WZ3AT.jpg', '', '{}', 3, 40, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZ5AT', 'SILLA PARA OPTICA', 'silla-para-optica', 'WZ-5AT', 'SILLA PARA OPTICA', '/images/products/AO-WZ5AT.jpg', '', '{}', 3, 44, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZA', 'SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion-wza', 'WZ-A', 'SILLA CON PEDAL DE ELEVACION', '/images/products/AO-WZA.jpg', '', '{}', 3, 43, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZDT1A', 'SILLA CON PEDAL DE ELEVACION Y', 'silla-con-pedal-de-elevacion-y', 'WZ-DT-1A', 'SILLA CON PEDAL DE ELEVACION Y', '/images/products/AO-WZDT1A.jpg', '', '{}', 3, 43, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZJP120', 'LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico-wzjp120', 'WZ-JP120', 'LIMPIADOR DE LENTES ULTRASONICO', '/images/products/AO-WZJP120.jpg', '', '{}', 1, 7, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZJP15A', 'MEDIDOR DE ESPESOR', 'medidor-de-espesor', 'WZ-JP15A', 'MEDIDOR DE ESPESOR', '/images/products/AO-WZJP15A.jpg', '', '{}', 1, 8, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZJP15B', 'MEDIDOR DE ESPESOR', 'medidor-de-espesor-wzjp15b', 'WZ-JP15B', 'MEDIDOR DE ESPESOR', '/images/products/AO-WZJP15B.jpg', '', '{}', 1, 8, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZJP17B', 'PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico-wzjp17b', 'WZ-JP17B', 'PROBADOR DE LENTES PHOTOCROMATICO', '/images/products/AO-WZJP17B.jpg', '', '{}', 1, 12, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZJP800C', 'RANURADORA MANUAL', 'ranuradora-manual-wzjp800c', 'WZ-JP800C', 'RANURADORA MANUAL', '/images/products/AO-WZJP800C.jpg', '', '{}', 1, 14, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZSLB12', 'OPTOTIPO CON SOPORTE', 'optotipo-con-soporte', 'WZ-SLB-12', 'OPTOTIPO CON SOPORTE', '/images/products/AO-WZSLB12.jpg', '', '{}', 4, 48, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZSLB8', 'OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico-wzslb8', 'WZ-SLB-8', 'OPTOTIPO ELECTRICO LUMINICO', '/images/products/AO-WZSLB8.jpg', '', '{}', 4, 49, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZY5A', 'SILLA PARA OPTICA', 'silla-para-optica-wzy5a', 'WZ-Y5A', 'SILLA PARA OPTICA', '/images/products/AO-WZY5A.jpg', '', '{}', 3, 44, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZY5B', 'SILLA PARA OPTICA', 'silla-para-optica-wzy5b', 'WZ-Y5B', 'SILLA PARA OPTICA', '/images/products/AO-WZY5B.jpg', '', '{}', 3, 44, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZY5C', 'SILLA PARA OPTICA', 'silla-para-optica-wzy5c', 'WZ-Y5C', 'SILLA PARA OPTICA', '/images/products/AO-WZY5C.jpg', '', '{}', 3, 44, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-WZZN', 'BRAZO PARA FOROPTERO DE PARED', 'brazo-para-foroptero-de-pared', 'WZ-ZN', 'BRAZO PARA FOROPTERO DE PARED', '/images/products/AO-WZZN.jpg', '', '{}', 2, 26, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-YZ11', 'OFTALMOSCOPIO PORTATIL', 'oftalmoscopio-portatil', 'YZ-11', 'OFTALMOSCOPIO PORTATIL', '/images/products/AO-YZ11.jpg', '', '{}', 2, 34, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-YZ13', 'LENTE DE 3 ESPEJOS', 'lente-de-3-espejos', 'YZ-13', 'LENTE DE 3 ESPEJOS', '/images/products/AO-YZ13.jpg', '', '{}', 2, 29, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-YZ20T4', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 'microscopio-quirurjico-para-ofatlmologia', 'YZ-20T4', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', '/images/products/AO-YZ20T4.jpg', '', '{}', 2, 31, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-YZ24', 'RETINOSCOPIO', 'retinoscopio', 'YZ-24', 'RETINOSCOPIO', '/images/products/AO-YZ24.jpg', '', '{}', 2, 37, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-YZ24BYZ11D', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio-yz24byz11d', 'YZ-24B+YZ-11D', 'RETINOSCOPIO CON OFTALMOSCOPIO', '/images/products/AO-YZ24BYZ11D.jpg', '', '{}', 2, 34, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-YZ25C', 'OFTALMOSCOPIO INDIRECTO', 'oftalmoscopio-indirecto', 'YZ-25C', 'OFTALMOSCOPIO INDIRECTO', '/images/products/AO-YZ25C.jpg', '', '{}', 2, 34, 1);
INSERT INTO products (sku, name, slug, reference, description, image, barcode, specs, category_id, subcategory_id, is_active) VALUES ('AO-YZ30R', 'TONOMETRO METALICO', 'tonometro-metalico', 'YZ-30R', 'TONOMETRO METALICO', '/images/products/AO-YZ30R.jpg', '', '{}', 2, 39, 1);

-- Admin user (password: admin123)
INSERT INTO users (id, name, email, password, role, is_active) VALUES (1, 'Administrador', 'admin@atlanticoptical.com', '\\\.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1);

-- Shipping rates
INSERT INTO shipping_rates (method, cost_per_kg, description, estimated_days) VALUES
('maritimo', 4.50, 'Envio maritimo internacional', '20-30 dias'),
('aereo', 12.00, 'Envio aereo internacional', '7-15 dias'),
('express', 20.00, 'Envio express internacional', '3-7 dias');

-- Exchange rate
INSERT INTO exchange_rates (usd_mxn) VALUES (17.50);

-- Site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('site_name', 'Atlantic Optical', 'text'),
('site_email', 'ventas@atlanticoptical.com', 'text'),
('site_phone', '+52 (614) 123-4567', 'text'),
('site_address', 'Chihuahua, Mexico', 'text'),
('facebook_url', 'https://facebook.com/atlanticoptical', 'text'),
('instagram_url', 'https://instagram.com/atlanticoptical', 'text'),
('meta_title', 'Atlantic Optical - Equipos Opticos y Oftalmologicos', 'text'),
('meta_description', 'Venta de equipos opticos, oftalmologicos y de laboratorio en Mexico', 'text'),
('iva_rate', '0.16', 'text'),
('default_margin', '1.5', 'text');

-- Set auto increments
ALTER TABLE categories AUTO_INCREMENT = 5;
ALTER TABLE subcategories AUTO_INCREMENT = 52;
ALTER TABLE products AUTO_INCREMENT = 117;
ALTER TABLE users AUTO_INCREMENT = 2;
ALTER TABLE orders AUTO_INCREMENT = 1;
