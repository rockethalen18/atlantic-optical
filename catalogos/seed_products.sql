-- ============================================
-- Atlantic Optical - Product Seed Data
-- Generated from catalog data
-- ============================================

USE atlantic_optical;

-- ============================================
-- CATEGORIES
-- ============================================

-- Main categories
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
  ('Equipos de Laboratorio', 'equipos-laboratorio', NULL, 1, 1),
  ('Equipos de Oftalmología y Óptica', 'equipos-oftalmologia-optica', NULL, 2, 1),
  ('Mobiliario', 'mobiliario', NULL, 3, 1),
  ('Monitores y Optotipos', 'monitores-optotipos', NULL, 4, 1);

-- Subcategories
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
  ('Biseladoras Automáticas', 'biseladoras-automaticas', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 1, 1),
  ('Biseladoras Manuales', 'biseladoras-manuales', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 2, 1),
  ('Biseladoras Semiautomáticas', 'biseladoras-semiautomaticas', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 3, 1),
  ('Calentadores', 'calentadores', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 4, 1),
  ('Centradoras', 'centradoras', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 5, 1),
  ('Esferómetros', 'esferometros', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 6, 1),
  ('Limpiadores Ultrasónicos', 'limpiadores-ultrasonicos', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 7, 1),
  ('Medidores de Espesor', 'medidores-de-espesor', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 8, 1),
  ('Perforadoras al Aire', 'perforadoras-al-aire', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 9, 1),
  ('Perforadoras para Plantilla', 'perforadoras-para-plantilla', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 10, 1),
  ('Probadores de Fotocromático', 'probadores-de-fotocromatico', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 11, 1),
  ('Pulidoras Manuales', 'pulidoras-manuales', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 12, 1),
  ('Pulidoras Semiautomáticas', 'pulidoras-semiautomaticas', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 13, 1),
  ('Ranuradoras Manuales', 'ranuradoras-manuales', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 14, 1),
  ('Repuestos', 'repuestos', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 15, 1),
  ('Tinturadoras', 'tinturadoras', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 16, 1),
  ('Uveómetros', 'uveometros', (SELECT id FROM categories WHERE slug = 'equipos-laboratorio' AND parent_id IS NULL), 17, 1),
  ('Análisis de Gafas', 'analisis-de-gafas', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 18, 1),
  ('Auto Refractómetros', 'auto-refractometros', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 19, 1),
  ('Auto Refractómetros con Keratometro', 'auto-refractometros-con-keratometro', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 20, 1),
  ('Cajas de Prisma', 'cajas-de-prisma', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 21, 1),
  ('Cajas de Prueba', 'cajas-de-prueba', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 22, 1),
  ('Cámara de Fondo', 'camara-de-fondo', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 23, 1),
  ('Campo Visual', 'campo-visual', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 24, 1),
  ('Equipos de Fisioterapia', 'equipos-de-fisioterapia', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 25, 1),
  ('Facoemulsificador', 'facoemulsificador', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 26, 1),
  ('Forópteros Digitales', 'foropteros-digitales', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 27, 1),
  ('Forópteros Manuales', 'foropteros-manuales', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 28, 1),
  ('Kit Instrumental', 'kit-instrumental', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 29, 1),
  ('Lámparas de Hendidura', 'lamparas-de-hendidura', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 30, 1),
  ('Lámparas Portátiles', 'lamparas-portatiles', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 31, 1),
  ('Lente de 3 Espejos', 'lente-de-3-espejos', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 32, 1),
  ('Lente de Aumento', 'lente-de-aumento', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 33, 1),
  ('Micropsio Quirúrgico', 'micropsio-quirurgico', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 34, 1),
  ('Monturas de Prueba', 'monturas-de-prueba', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 35, 1),
  ('OCT', 'oct', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 36, 1),
  ('Oftalmoscopios', 'oftalmoscopios', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 37, 1),
  ('Probetas Desechables', 'probetas-desechables', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 38, 1),
  ('Pupilómetros', 'pupilometros', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 39, 1),
  ('Retinoscopios', 'retinoscopios', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 40, 1),
  ('Tonómetros de Contacto', 'tonometros-de-contacto', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 41, 1),
  ('Tonómetros de Rebote', 'tonometros-de-rebote', (SELECT id FROM categories WHERE slug = 'equipos-oftalmologia-optica' AND parent_id IS NULL), 42, 1),
  ('Automáticas', 'automaticas', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 43, 1),
  ('Brazos de Pared', 'brazos-de-pared', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 44, 1),
  ('Con Silla Elevación', 'con-silla-elevacion', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 45, 1),
  ('Con Silla Reclinable', 'con-silla-reclinable', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 46, 1),
  ('Mesas de Elevación', 'mesas-de-elevacion', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 47, 1),
  ('Mesas Dobles', 'mesas-dobles', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 48, 1),
  ('Mesas Multifuncional', 'mesas-multifuncional', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 49, 1),
  ('Para Movilidad Reducida', 'para-movilidad-reducida', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 50, 1),
  ('Sillas con Pedal', 'sillas-con-pedal', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 51, 1),
  ('Sillas para Óptica', 'sillas-para-optica', (SELECT id FROM categories WHERE slug = 'mobiliario' AND parent_id IS NULL), 52, 1),
  ('Cartillas', 'cartillas', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 53, 1),
  ('Controles', 'controles', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 54, 1),
  ('Monitores Estándar', 'monitores-estandar', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 55, 1),
  ('Monitores Verticales', 'monitores-verticales', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 56, 1),
  ('Optotipos con Soporte', 'optotipos-con-soporte', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 57, 1),
  ('Optotipos Eléctricos', 'optotipos-electricos', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 58, 1),
  ('Proyectores Gráficos', 'proyectores-graficos', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 59, 1),
  ('Tablet LCD', 'tablet-lcd', (SELECT id FROM categories WHERE slug = 'monitores-optotipos' AND parent_id IS NULL), 60, 1);

-- ============================================
-- PRODUCTS
-- ============================================

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('BISELADORA AUTOMATICA', 'biseladora-automatica', 'AO-ALE1600G', 'BISELADORA AUTOMATICA', 'BISELADORA AUTOMATICA', 0, (SELECT id FROM categories WHERE slug = 'biseladoras-automaticas'), 'published', 0, 0),
  ('BISELADORA AUTOMATICA', 'biseladora-automatica-ale1700g', 'AO-ALE1700G', 'BISELADORA AUTOMATICA', 'BISELADORA AUTOMATICA', 0, (SELECT id FROM categories WHERE slug = 'biseladoras-automaticas'), 'published', 0, 0),
  ('BISELADORA AUTOMATICA CON ESCANER', 'biseladora-automatica-con-escaner', 'AO-ALE1000', 'BISELADORA AUTOMATICA CON ESCANER', 'BISELADORA AUTOMATICA CON ESCANER', 60, (SELECT id FROM categories WHERE slug = 'biseladoras-automaticas'), 'published', 0, 0),
  ('BISELADORA MANUAL DE TRES PIEDRAS', 'biseladora-manual-de-tres-piedras', 'AO-6ACP', 'BISELADORA MANUAL DE TRES PIEDRAS', 'BISELADORA MANUAL DE TRES PIEDRAS', 6.7, (SELECT id FROM categories WHERE slug = 'biseladoras-manuales'), 'published', 0, 0),
  ('BISELADORA MANUAL DE UNA PIEDRA', 'biseladora-manual-de-una-piedra', 'AO-CP11A35WV', 'BISELADORA MANUAL DE UNA PIEDRA', 'BISELADORA MANUAL DE UNA PIEDRA', 6.7, (SELECT id FROM categories WHERE slug = 'biseladoras-manuales'), 'published', 0, 0),
  ('BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 'biseladora-manual-de-una-piedra-con-disco-de-corte', 'AO-TC10A', 'BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 'BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 0, (SELECT id FROM categories WHERE slug = 'biseladoras-manuales'), 'published', 0, 0),
  ('NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 'nh-136-biseladora-manual-de-tres-piedras', 'AO-CP6A1', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 0, (SELECT id FROM categories WHERE slug = 'biseladoras-manuales'), 'published', 0, 0),
  ('+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', 'ly-2a-cp-10c-biseladora-semiautomatica', 'AO-LE420', '+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', '+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', 13.2, (SELECT id FROM categories WHERE slug = 'biseladoras-semiautomaticas'), 'published', 0, 0),
  ('BISELADORA SEMIAUTOMÁTICA', 'biseladora-semiautomatica', 'AO-SJG7100', 'BISELADORA SEMIAUTOMÁTICA', 'BISELADORA SEMIAUTOMÁTICA', 0, (SELECT id FROM categories WHERE slug = 'biseladoras-semiautomaticas'), 'published', 0, 0),
  ('CALENTADOR DE MONTURA', 'calentador-de-montura', 'AO-LY6C', 'CALENTADOR DE MONTURA', 'CALENTADOR DE MONTURA', 0, (SELECT id FROM categories WHERE slug = 'calentadores'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('CALENTADOR DE MONTURA', 'calentador-de-montura-ly6bt', 'AO-LY6BT', 'CALENTADOR DE MONTURA', 'CALENTADOR DE MONTURA', 2, (SELECT id FROM categories WHERE slug = 'calentadores'), 'published', 0, 0),
  ('CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 'centradora-con-brazo-para-pegatina-y-marcador', 'AO-LY2A', 'CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 'CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 3, (SELECT id FROM categories WHERE slug = 'centradoras'), 'published', 0, 0),
  ('ESFEROMETRO METALICO', 'esferometro-metalico', 'AO-TM001', 'ESFEROMETRO METALICO', 'ESFEROMETRO METALICO', 0, (SELECT id FROM categories WHERE slug = 'esferometros'), 'published', 0, 0),
  ('LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico', 'AO-WZJP120', 'LIMPIADOR DE LENTES ULTRASONICO', 'LIMPIADOR DE LENTES ULTRASONICO', 2.5, (SELECT id FROM categories WHERE slug = 'limpiadores-ultrasonicos'), 'published', 0, 0),
  ('LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico-cp008', 'AO-CP008', 'LIMPIADOR DE LENTES ULTRASONICO', 'LIMPIADOR DE LENTES ULTRASONICO', 2.5, (SELECT id FROM categories WHERE slug = 'limpiadores-ultrasonicos'), 'published', 0, 0),
  ('WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 'wz-jp121-limpiador-ultrasonico-moderno', 'AO-GB800', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 1, (SELECT id FROM categories WHERE slug = 'limpiadores-ultrasonicos'), 'published', 0, 0),
  ('MEDIDOR DE ESPESOR', 'medidor-de-espesor', 'AO-WZJP15A', 'MEDIDOR DE ESPESOR', 'MEDIDOR DE ESPESOR', 0, (SELECT id FROM categories WHERE slug = 'medidores-de-espesor'), 'published', 0, 0),
  ('MEDIDOR DE ESPESOR', 'medidor-de-espesor-wzjp15b', 'AO-WZJP15B', 'MEDIDOR DE ESPESOR', 'MEDIDOR DE ESPESOR', 0, (SELECT id FROM categories WHERE slug = 'medidores-de-espesor'), 'published', 0, 0),
  ('PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 'perforadora-automatica-para-lentes-al-aire', 'AO-NH3GS', 'PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 'PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 7.5, (SELECT id FROM categories WHERE slug = 'perforadoras-al-aire'), 'published', 0, 0),
  ('PERFORADORA PARA LENTES AL AIRE', 'perforadora-para-lentes-al-aire', 'AO-LY988C', 'PERFORADORA PARA LENTES AL AIRE', 'PERFORADORA PARA LENTES AL AIRE', 3.5, (SELECT id FROM categories WHERE slug = 'perforadoras-al-aire'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('PERFORADORA PARA PLANTILLA', 'perforadora-para-plantilla', 'AO-CP10C', 'PERFORADORA PARA PLANTILLA', 'PERFORADORA PARA PLANTILLA', 2, (SELECT id FROM categories WHERE slug = 'perforadoras-para-plantilla'), 'published', 0, 0),
  ('PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico', 'AO-LY8384', 'PROBADOR DE LENTES PHOTOCROMATICO', 'PROBADOR DE LENTES PHOTOCROMATICO', 0.5, (SELECT id FROM categories WHERE slug = 'probadores-de-fotocromatico'), 'published', 0, 0),
  ('PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico-wzjp17b', 'AO-WZJP17B', 'PROBADOR DE LENTES PHOTOCROMATICO', 'PROBADOR DE LENTES PHOTOCROMATICO', 0.5, (SELECT id FROM categories WHERE slug = 'probadores-de-fotocromatico'), 'published', 0, 0),
  ('PULIDORA MANUAL', 'pulidora-manual', 'AO-CP8A', 'Pulido de la lente', 'Pulido de la lente', 0, (SELECT id FROM categories WHERE slug = 'pulidoras-manuales'), 'published', 0, 0),
  ('PULIDORA SEMIAUTOMATICA', 'pulidora-semiautomatica', 'AO-LY900', 'Pulido de la lente', 'Pulido de la lente', 7.1, (SELECT id FROM categories WHERE slug = 'pulidoras-semiautomaticas'), 'published', 0, 0),
  ('RANURADORA MANUAL', 'ranuradora-manual', 'AO-WZJP800C', 'RANURADORA MANUAL', 'RANURADORA MANUAL', 2.2, (SELECT id FROM categories WHERE slug = 'ranuradoras-manuales'), 'published', 0, 0),
  ('RANURADORA MANUAL', 'ranuradora-manual-ly12a', 'AO-LY12A', 'RANURADORA MANUAL', 'RANURADORA MANUAL', 0, (SELECT id FROM categories WHERE slug = 'ranuradoras-manuales'), 'published', 0, 0),
  ('BOMBA PARA ALE1000 Y LE-420', 'bomba-para-ale1000-y-le-420', 'AO-WATERPUMP', 'BOMBA PARA ALE1000 Y LE-420', 'BOMBA PARA ALE1000 Y LE-420', 0, (SELECT id FROM categories WHERE slug = 'repuestos'), 'published', 0, 0),
  ('REPUESTO DE BISELADORA DE 3 PIEDRAS', 'repuesto-de-biseladora-de-3-piedras', 'AO-RNH316', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', 1, (SELECT id FROM categories WHERE slug = 'repuestos'), 'published', 0, 0),
  ('REPUESTO DE BROCA PARA CORTADORA', 'repuesto-de-broca-para-cortadora', 'AO-BROC1', 'REPUESTO DE BROCA PARA CORTADORA', 'REPUESTO DE BROCA PARA CORTADORA', 0, (SELECT id FROM categories WHERE slug = 'repuestos'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('PINZA PARA TINTURADO DE LUNAS OPTICAS', 'pinza-para-tinturado-de-lunas-opticas', 'AO-RM3', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', 0, (SELECT id FROM categories WHERE slug = 'tinturadoras'), 'published', 0, 0),
  ('TINTURADORA', 'tinturadora', 'AO-TR6', 'TINTURADORA', 'TINTURADORA', 7.5, (SELECT id FROM categories WHERE slug = 'tinturadoras'), 'published', 0, 0),
  ('UVEOMETRO', 'uveometro', 'AO-CP18C', 'UVEOMETRO', 'UVEOMETRO', 0.65, (SELECT id FROM categories WHERE slug = 'uveometros'), 'published', 0, 0),
  ('AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 'at-9000-sistema-de-analisis-de-datos-de-gafas-con-inteligencia-artificial', 'AO-AT9000', 'AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 'AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 0, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital', 'AO-LM260', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 11, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm900', 'AO-LM900', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 0, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-jd26000d', 'AO-JD26000D', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 11, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm300', 'AO-LM300', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 6, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm800', 'AO-LM800', 'AUTOLENSOMETRO DIGITAL', 'AUTOLENSOMETRO DIGITAL', 0, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-d910', 'AO-D910', 'AUTOLENSOMETRO DIGITAL', 'AUTOLENSOMETRO DIGITAL', 12, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('LENSOMETRO DIGITAL', 'lensometro-digital', 'AO-D900', 'Mejor rendimiento y elección económica, Fácil manejo con cuatro botones Sin PD, medición UV y más estable', 'Mejor rendimiento y elección económica, Fácil manejo con cuatro botones Sin PD, medición UV y más estable', 2.9, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('LENSOMETRO MANUAL', 'lensometro-manual', 'AO-NJC6', 'LENSOMETRO MANUAL', 'LENSOMETRO MANUAL', 0, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('LENSOMETRO PORTATIL', 'lensometro-portatil', 'AO-CP1B', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica, así como de la dirección del...', 1, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('SET DE OPTOMETRIA', 'set-de-optometria', 'AO-FA100KAP800CP60', 'SET DE OPTOMETRIA', 'SET DE OPTOMETRIA', 0, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('SISTEMA DE REFRACCION AUTOMATICO CON MESA', 'sistema-de-refraccion-automatico-con-mesa', 'AO-CM100AP800C330A', 'SISTEMA DE REFRACCION AUTOMATICO CON MESA', 'SISTEMA DE REFRACCION AUTOMATICO CON MESA', 0, (SELECT id FROM categories WHERE slug = 'analisis-de-gafas'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO', 'autorefractometro', 'AO-FA6000A', 'AUTOREFRACTOMETRO', 'AUTOREFRACTOMETRO', 28.8, (SELECT id FROM categories WHERE slug = 'auto-refractometros'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO PORTATIL', 'autorefractometro-portatil', 'AO-IREF', 'AUTOREFRACTOMETRO PORTATIL', 'AUTOREFRACTOMETRO PORTATIL', 0.195, (SELECT id FROM categories WHERE slug = 'auto-refractometros'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro', 'AO-FA6100CK', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, (SELECT id FROM categories WHERE slug = 'auto-refractometros-con-keratometro'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-ark7710', 'AO-ARK7710', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 0, (SELECT id FROM categories WHERE slug = 'auto-refractometros-con-keratometro'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa6500k', 'AO-FA6500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, (SELECT id FROM categories WHERE slug = 'auto-refractometros-con-keratometro'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa8500k', 'AO-FA8500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, (SELECT id FROM categories WHERE slug = 'auto-refractometros-con-keratometro'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa100', 'AO-FA100', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20, (SELECT id FROM categories WHERE slug = 'auto-refractometros-con-keratometro'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa300k', 'AO-FA300K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 0, (SELECT id FROM categories WHERE slug = 'auto-refractometros-con-keratometro'), 'published', 0, 0),
  ('AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 'autorefractometro-con-keratometro-y-biometria', 'AO-AL700PLUS', 'AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 'AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 0, (SELECT id FROM categories WHERE slug = 'auto-refractometros-con-keratometro'), 'published', 0, 0),
  ('CAJA DE PRISMAS', 'caja-de-prismas', 'AO-PS22', 'CAJA DE PRISMAS', 'CAJA DE PRISMAS', 0, (SELECT id FROM categories WHERE slug = 'cajas-de-prisma'), 'published', 0, 0),
  ('CAJA DE PRISMAS', 'caja-de-prismas-vb15hb16', 'AO-VB15HB16', 'CAJA DE PRISMAS', 'CAJA DE PRISMAS', 0, (SELECT id FROM categories WHERE slug = 'cajas-de-prisma'), 'published', 0, 0),
  ('CAJA DE PRUEBA DE 104 LENTILLAS', 'caja-de-prueba-de-104-lentillas', 'AO-104', 'CAJA DE PRUEBA DE 104 LENTILLAS', 'CAJA DE PRUEBA DE 104 LENTILLAS', 3, (SELECT id FROM categories WHERE slug = 'cajas-de-prueba'), 'published', 0, 0),
  ('CAJA DE PRUEBA DE 158 LENTILLAS', 'caja-de-prueba-de-158-lentillas', 'AO-JS158', 'CAJA DE PRUEBA DE 158 LENTILLAS', 'CAJA DE PRUEBA DE 158 LENTILLAS', 3, (SELECT id FROM categories WHERE slug = 'cajas-de-prueba'), 'published', 0, 0),
  ('CAJA DE PRUEBA PROGRESIVA', 'caja-de-prueba-progresiva', 'AO-JS22P', 'CAJA DE PRUEBA PROGRESIVA', 'CAJA DE PRUEBA PROGRESIVA', 0, (SELECT id FROM categories WHERE slug = 'cajas-de-prueba'), 'published', 0, 0),
  ('GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 'gris-caja-de-prueba-de-266-lentillas', 'AO-266JS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 6, (SELECT id FROM categories WHERE slug = 'cajas-de-prueba'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('CAMARA DE FONDO DE OJO AUTOMATICA', 'camara-de-fondo-de-ojo-automatica', 'AO-RC3100', 'CAMARA DE FONDO DE OJO AUTOMATICA', 'CAMARA DE FONDO DE OJO AUTOMATICA', 10, (SELECT id FROM categories WHERE slug = 'camara-de-fondo'), 'published', 0, 0),
  ('CAMARA DE FONDO DE OJO AUTOMATICA', 'camara-de-fondo-de-ojo-automatica-sk680a', 'AO-SK680A', 'CAMARA DE FONDO DE OJO AUTOMATICA', 'CAMARA DE FONDO DE OJO AUTOMATICA', 0, (SELECT id FROM categories WHERE slug = 'camara-de-fondo'), 'published', 0, 0),
  ('CAMARA DE FONDO DE OJO PORTATIL', 'camara-de-fondo-de-ojo-portatil', 'AO-WZ1300', 'CAMARA DE FONDO DE OJO PORTATIL', 'CAMARA DE FONDO DE OJO PORTATIL', 0, (SELECT id FROM categories WHERE slug = 'camara-de-fondo'), 'published', 0, 0),
  ('ESCANER ULTRASONICO A-B', 'escaner-ultrasonico-a-b', 'AO-RETIWAVE1000', 'ESCANER ULTRASONICO A-B', 'ESCANER ULTRASONICO A-B', 0, (SELECT id FROM categories WHERE slug = 'camara-de-fondo'), 'published', 0, 0),
  ('EQUIPO DE PRUEBA DE CAMPO VISUAL', 'equipo-de-prueba-de-campo-visual', 'AO-BIO1100', 'EQUIPO DE PRUEBA DE CAMPO VISUAL', 'EQUIPO DE PRUEBA DE CAMPO VISUAL', 17, (SELECT id FROM categories WHERE slug = 'campo-visual'), 'published', 0, 0),
  ('EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual', 'AO-KJRDA2', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 0, (SELECT id FROM categories WHERE slug = 'equipos-de-fisioterapia'), 'published', 0, 0),
  ('EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual-kjrda3', 'AO-KJRDA3', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 'Dispositivo portátil de fisioterapia visual / terapia ocular, diseñado para colocarse en la cabeza (tipo visor o banda), que utiliza electrodos y...', 0, (SELECT id FROM categories WHERE slug = 'equipos-de-fisioterapia'), 'published', 0, 0),
  ('PHACOEMULSIFICADOR', 'phacoemulsificador', 'AO-MD480', 'PHACOEMULSIFICADOR', 'PHACOEMULSIFICADOR', 0, (SELECT id FROM categories WHERE slug = 'facoemulsificador'), 'published', 0, 0),
  ('FOROPTERO DIGITAL', 'foroptero-digital', 'AO-DPS700', 'FOROPTERO DIGITAL', 'FOROPTERO DIGITAL', 2, (SELECT id FROM categories WHERE slug = 'foropteros-digitales'), 'published', 0, 0),
  ('FOROPTERO DIGITAL', 'foroptero-digital-ap800cp60', 'AO-AP800CP60', 'FOROPTERO DIGITAL', 'FOROPTERO DIGITAL', 2, (SELECT id FROM categories WHERE slug = 'foropteros-digitales'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('BLANCO FOROPTERO', 'blanco-foroptero', 'AO-ML400-B', 'BLANCO FOROPTERO', 'BLANCO FOROPTERO', 4.5, (SELECT id FROM categories WHERE slug = 'foropteros-manuales'), 'published', 0, 0),
  ('NEGRO FOROPTERO', 'negro-foroptero', 'AO-ML400', 'NEGRO FOROPTERO', 'NEGRO FOROPTERO', 4.5, (SELECT id FROM categories WHERE slug = 'foropteros-manuales'), 'published', 0, 0),
  ('KIT 21 KIT INSTRUMENTAL 21 PCS', 'kit-21-kit-instrumental-21-pcs', 'AO-CSE', 'KIT 21 KIT INSTRUMENTAL 21 PCS', 'KIT 21 KIT INSTRUMENTAL 21 PCS', 0, (SELECT id FROM categories WHERE slug = 'kit-instrumental'), 'published', 0, 0),
  ('LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 'lampara-de-hendidura-con-sistema-de-analisis', 'AO-WZ5S', 'LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 'LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 0, (SELECT id FROM categories WHERE slug = 'lamparas-de-hendidura'), 'published', 0, 0),
  ('LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 'lampara-de-henedidura-para-examen-de-ojo-seco', 'AO-SM800', 'LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 'LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 17, (SELECT id FROM categories WHERE slug = 'lamparas-de-hendidura'), 'published', 0, 0),
  ('YZ-30RR LAMPARA DE HENDIDURA 2 MAGNIFICACIONES CON MESA Y TONOMETRO METALICO', 'yz-30rr-lampara-de-hendidura-2-magnificaciones-con-mesa-y-tonometro-metalico', 'AO-BL66B', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 22.4, (SELECT id FROM categories WHERE slug = 'lamparas-de-hendidura'), 'published', 0, 0),
  ('YZ-30RR LAMPARA DE HENDIDURA 3 MAGNIFICACIONES CON MESA Y TONOMETRO METALICO', 'yz-30rr-lampara-de-hendidura-3-magnificaciones-con-mesa-y-tonometro-metalico', 'AO-BL88T', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 16.8, (SELECT id FROM categories WHERE slug = 'lamparas-de-hendidura'), 'published', 0, 0),
  ('YZ-30RR LAMPARA DE HENDIDURA 5 MAGNIFICACIONES CON MESA TONOMETRO METALICO', 'yz-30rr-lampara-de-hendidura-5-magnificaciones-con-mesa-tonometro-metalico', 'AO-SJ350', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 0, (SELECT id FROM categories WHERE slug = 'lamparas-de-hendidura'), 'published', 0, 0),
  ('LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil', 'AO-ST150', 'LAMPARA DE HENDIDURA PORTATIL', 'LAMPARA DE HENDIDURA PORTATIL', 0.12, (SELECT id FROM categories WHERE slug = 'lamparas-portatiles'), 'published', 0, 0),
  ('LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-s150', 'AO-S150', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad que puede enfocarse como un rayo delgado....', 0.15, (SELECT id FROM categories WHERE slug = 'lamparas-portatiles'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-ml5s1', 'AO-ML5S1', 'LAMPARA DE HENDIDURA PORTATIL', 'LAMPARA DE HENDIDURA PORTATIL', 0.835, (SELECT id FROM categories WHERE slug = 'lamparas-portatiles'), 'published', 0, 0),
  ('LAMPARA FRONTAL MEDICA', 'lampara-frontal-medica', 'AO-HL004', 'LAMPARA FRONTAL MEDICA', 'LAMPARA FRONTAL MEDICA', 0, (SELECT id FROM categories WHERE slug = 'lamparas-portatiles'), 'published', 0, 0),
  ('LENTE DE 3 ESPEJOS', 'lente-de-3-espejos', 'AO-YZ13', 'LENTE DE 3 ESPEJOS', 'LENTE DE 3 ESPEJOS', 0, (SELECT id FROM categories WHERE slug = 'lente-de-3-espejos'), 'published', 0, 0),
  ('LENTE DE AUMENTO', 'lente-de-aumento', 'AO-20D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, (SELECT id FROM categories WHERE slug = 'lente-de-aumento'), 'published', 0, 0),
  ('LENTE DE AUMENTO', 'lente-de-aumento-78d', 'AO-78D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, (SELECT id FROM categories WHERE slug = 'lente-de-aumento'), 'published', 0, 0),
  ('LENTE DE AUMENTO', 'lente-de-aumento-90d', 'AO-90D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, (SELECT id FROM categories WHERE slug = 'lente-de-aumento'), 'published', 0, 0),
  ('LUPA BINOCULAR', 'lupa-binocular', 'AO-SJ989', 'LUPA BINOCULAR', 'LUPA BINOCULAR', 0, (SELECT id FROM categories WHERE slug = 'lente-de-aumento'), 'published', 0, 0),
  ('MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 'microscopio-quirurjico-para-ofatlmologia', 'AO-YZ20T4', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 0, (SELECT id FROM categories WHERE slug = 'micropsio-quirurgico'), 'published', 0, 0),
  ('MONTURA DE PRUEBA', 'montura-de-prueba', 'AO-GD1104', 'MONTURA DE PRUEBA', 'MONTURA DE PRUEBA', 0, (SELECT id FROM categories WHERE slug = 'monturas-de-prueba'), 'published', 0, 0),
  ('MONTURA DE PRUEBA ALUMINIO', 'montura-de-prueba-aluminio', 'AO-TTF08', 'MONTURA DE PRUEBA ALUMINIO', 'MONTURA DE PRUEBA ALUMINIO', 0.05, (SELECT id FROM categories WHERE slug = 'monturas-de-prueba'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('MONTURA DE PRUEBA PARA NIÑOS', 'montura-de-prueba-para-ninos', 'AO-TFC', 'MONTURA DE PRUEBA PARA NIÑOS', 'MONTURA DE PRUEBA PARA NIÑOS', 0, (SELECT id FROM categories WHERE slug = 'monturas-de-prueba'), 'published', 0, 0),
  ('MONTURA DE PRUEBA PREMIUM', 'montura-de-prueba-premium', 'AO-TF488A', 'MONTURA DE PRUEBA PREMIUM', 'MONTURA DE PRUEBA PREMIUM', 0.2, (SELECT id FROM categories WHERE slug = 'monturas-de-prueba'), 'published', 0, 0),
  ('MONTURA DE PRUEBA TITANIUM', 'montura-de-prueba-titanium', 'AO-TF5470', 'MONTURA DE PRUEBA TITANIUM', 'MONTURA DE PRUEBA TITANIUM', 0.05, (SELECT id FROM categories WHERE slug = 'monturas-de-prueba'), 'published', 0, 0),
  ('TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 'tomografo-de-coherencia-optica-oct', 'AO-OCT500', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 0, (SELECT id FROM categories WHERE slug = 'oct'), 'published', 0, 0),
  ('OFTALMOSCOPIO INDIRECTO', 'oftalmoscopio-indirecto', 'AO-YZ25C', 'OFTALMOSCOPIO INDIRECTO', 'OFTALMOSCOPIO INDIRECTO', 0, (SELECT id FROM categories WHERE slug = 'oftalmoscopios'), 'published', 0, 0),
  ('OFTALMOSCOPIO PORTATIL', 'oftalmoscopio-portatil', 'AO-YZ11', 'OFTALMOSCOPIO PORTATIL', 'OFTALMOSCOPIO PORTATIL', 0, (SELECT id FROM categories WHERE slug = 'oftalmoscopios'), 'published', 0, 0),
  ('RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio', 'AO-YZ24BYZ11D', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'RETINOSCOPIO CON OFTALMOSCOPIO', 0, (SELECT id FROM categories WHERE slug = 'oftalmoscopios'), 'published', 0, 0),
  ('RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio-468e4310', 'AO-468E4310', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'RETINOSCOPIO CON OFTALMOSCOPIO', 3, (SELECT id FROM categories WHERE slug = 'oftalmoscopios'), 'published', 0, 0),
  ('PROBE PROBETA DESECHABLE', 'probe-probeta-desechable', 'AO-SW500', 'Puntas de repuesto de un solo uso diseñadas para el tonómetro de rebote portátil', 'Puntas de repuesto de un solo uso diseñadas para el tonómetro de rebote portátil', 0, (SELECT id FROM categories WHERE slug = 'probetas-desechables'), 'published', 0, 0),
  ('PUPILOMETRO DIGITAL', 'pupilometro-digital', 'AO-LY9C', 'PUPILOMETRO DIGITAL', 'PUPILOMETRO DIGITAL', 0.7, (SELECT id FROM categories WHERE slug = 'pupilometros'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('PUPILOMETRO MANUAL', 'pupilometro-manual', 'AO-CP30', 'PUPILOMETRO MANUAL', 'PUPILOMETRO MANUAL', 0, (SELECT id FROM categories WHERE slug = 'pupilometros'), 'published', 0, 0),
  ('RETINOSCOPIO', 'retinoscopio', 'AO-YZ24', 'RETINOSCOPIO', 'RETINOSCOPIO', 1.8, (SELECT id FROM categories WHERE slug = 'retinoscopios'), 'published', 0, 0),
  ('TONOMETRO', 'tonometro', 'AO-SK5500A', 'TONOMETRO', 'TONOMETRO', 0, (SELECT id FROM categories WHERE slug = 'tonometros-de-contacto'), 'published', 0, 0),
  ('TONOMETRO METALICO', 'tonometro-metalico', 'AO-YZ30R', 'TONOMETRO METALICO', 'TONOMETRO METALICO', 0, (SELECT id FROM categories WHERE slug = 'tonometros-de-contacto'), 'published', 0, 0),
  ('TONOMETRO DE REBOTE PORTATIL', 'tonometro-de-rebote-portatil', 'AO-SW500-B', 'Es un examen para medir la presión dentro de los ojos. Este examen se utiliza para buscar glaucoma. También se utiliza para medir qué tan bien está...', 'Es un examen para medir la presión dentro de los ojos. Este examen se utiliza para buscar glaucoma. También se utiliza para medir qué tan bien está...', 0, (SELECT id FROM categories WHERE slug = 'tonometros-de-rebote'), 'published', 0, 0),
  ('UNIDAD OFTALMICA AUTOMÁTICA CON SILLA', 'unidad-oftalmica-automatica-con-silla', 'AO-CT1000', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foroptero y el autorefractometro y los equipos de diagnóstico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foroptero y el autorefractometro y los equipos de diagnóstico', 0, (SELECT id FROM categories WHERE slug = 'automaticas'), 'published', 0, 0),
  ('BRAZO PARA FOROPTERO DE PARED', 'brazo-para-foroptero-de-pared', 'AO-WZZN', 'BRAZO PARA FOROPTERO DE PARED', 'BRAZO PARA FOROPTERO DE PARED', 14, (SELECT id FROM categories WHERE slug = 'brazos-de-pared'), 'published', 0, 0),
  ('BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 'brazo-para-foroptero-y-proyector-de-pared', 'AO-CT1504', 'BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 'BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 14, (SELECT id FROM categories WHERE slug = 'brazos-de-pared'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion', 'AO-CS700AT', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 122.6, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-cs700b', 'AO-CS700B', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 122.6, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-cs700b2', 'AO-CS700B2', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 122.6, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-ly800a', 'AO-LY800A', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 46.8, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-pk158', 'AO-PK158', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 'Mesa que se abre en 90°, silla que sube y baja con elevador, se usa para poner el foropter y el autorefracto y los equipos de diagnostico', 46.8, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-pk160', 'AO-PK160', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 0, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-c180a', 'AO-C180A', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 54.4, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA ELEVACION', 'unidad-oftalmica-con-silla-elevacion', 'AO-CS518', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 0, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA ELEVACION', 'unidad-oftalmica-con-silla-elevacion-cs188', 'AO-CS188', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 240, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 'unidad-oftalmica-con-silla-elevacion-y-pedal', 'AO-C180AB', 'UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 'UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 54.4, (SELECT id FROM categories WHERE slug = 'con-silla-elevacion'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable', 'AO-S900B', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, (SELECT id FROM categories WHERE slug = 'con-silla-reclinable'), 'published', 0, 0),
  ('UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable-s900c', 'AO-S900C', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, (SELECT id FROM categories WHERE slug = 'con-silla-reclinable'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable-s900at', 'AO-S900AT', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, (SELECT id FROM categories WHERE slug = 'con-silla-reclinable'), 'published', 0, 0),
  ('MESA DE ELEVACION', 'mesa-de-elevacion', 'AO-WZ3A', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 17, (SELECT id FROM categories WHERE slug = 'mesas-de-elevacion'), 'published', 0, 0),
  ('MESA DE ELEVACION', 'mesa-de-elevacion-wb3an', 'AO-WB3AN', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 17, (SELECT id FROM categories WHERE slug = 'mesas-de-elevacion'), 'published', 0, 0),
  ('TRIAL MESA DE ELEVACION CON BANDEJA', 'trial-mesa-de-elevacion-con-bandeja', 'AO-WZ3AT', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 25, (SELECT id FROM categories WHERE slug = 'mesas-de-elevacion'), 'published', 0, 0),
  ('MESA DOBLE DE ELEVACIÓN', 'mesa-doble-de-elevacion', 'AO-C330A', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 'Para subir o bajar a la altura necesaria manteniéndose a esa altura en el improbable caso de la falta del suministro eléctrico.', 70, (SELECT id FROM categories WHERE slug = 'mesas-dobles'), 'published', 0, 0),
  ('MESA MULTIFUNCIONAL', 'mesa-multifuncional', 'AO-C288AT-B', 'MESA MULTIFUNCIONAL', 'MESA MULTIFUNCIONAL', 0, (SELECT id FROM categories WHERE slug = 'mesas-multifuncional'), 'published', 0, 0),
  ('+ WZ-A UNIDAD OFTALMICA PARA PERSONAS CON MOVILIDAD REDUCIDA', 'wz-a-unidad-oftalmica-para-personas-con-movilidad-reducida', 'AO-C288AT', 'La columna de elevación con forma de eclipse ofrece espacio y potencia suficientes para levantar 3 instrumentos al mismo tiempo. Y ruedas que...', 'La columna de elevación con forma de eclipse ofrece espacio y potencia suficientes para levantar 3 instrumentos al mismo tiempo. Y ruedas que...', 122.6, (SELECT id FROM categories WHERE slug = 'para-movilidad-reducida'), 'published', 0, 0),
  ('SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion', 'AO-WZA', 'SILLA CON PEDAL DE ELEVACION', 'SILLA CON PEDAL DE ELEVACION', 0, (SELECT id FROM categories WHERE slug = 'sillas-con-pedal'), 'published', 0, 0),
  ('SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion-ct1955', 'AO-CT1955', 'SILLA CON PEDAL DE ELEVACION', 'SILLA CON PEDAL DE ELEVACION', 0, (SELECT id FROM categories WHERE slug = 'sillas-con-pedal'), 'published', 0, 0),
  ('SILLA CON PEDAL DE ELEVACION Y RECLINACION', 'silla-con-pedal-de-elevacion-y-reclinacion', 'AO-WZDT1A', 'SILLA CON PEDAL DE ELEVACION Y RECLINACION', 'SILLA CON PEDAL DE ELEVACION Y RECLINACION', 0, (SELECT id FROM categories WHERE slug = 'sillas-con-pedal'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('SILLA PARA OPTICA', 'silla-para-optica', 'AO-WZY5B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, (SELECT id FROM categories WHERE slug = 'sillas-para-optica'), 'published', 0, 0),
  ('SILLA PARA OPTICA', 'silla-para-optica-wzy5b-b', 'AO-WZY5B-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, (SELECT id FROM categories WHERE slug = 'sillas-para-optica'), 'published', 0, 0),
  ('SILLA PARA OPTICA', 'silla-para-optica-wz5at', 'AO-WZ5AT', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, (SELECT id FROM categories WHERE slug = 'sillas-para-optica'), 'published', 0, 0),
  ('SILLA PARA OPTICA', 'silla-para-optica-wzy5a', 'AO-WZY5A', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, (SELECT id FROM categories WHERE slug = 'sillas-para-optica'), 'published', 0, 0),
  ('SILLA PARA OPTICA', 'silla-para-optica-wzy5a-b', 'AO-WZY5A-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, (SELECT id FROM categories WHERE slug = 'sillas-para-optica'), 'published', 0, 0),
  ('SILLA PARA OPTICA', 'silla-para-optica-wzy5c', 'AO-WZY5C', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, (SELECT id FROM categories WHERE slug = 'sillas-para-optica'), 'published', 0, 0),
  ('SILLA PARA OPTICA', 'silla-para-optica-wzy5c-b', 'AO-WZY5C-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, (SELECT id FROM categories WHERE slug = 'sillas-para-optica'), 'published', 0, 0),
  ('CARTILLA DE EXAMEN VISUAL GRANDE', 'cartilla-de-examen-visual-grande', 'AO-WZ08', 'CARTILLA DE EXAMEN VISUAL GRANDE', 'CARTILLA DE EXAMEN VISUAL GRANDE', 0.0005, (SELECT id FROM categories WHERE slug = 'cartillas'), 'published', 0, 0),
  ('CARTILLA DE LECTURA MANUAL PEQUEÑA', 'cartilla-de-lectura-manual-pequena', 'AO-WZ01', 'CARTILLA DE LECTURA MANUAL PEQUEÑA', 'CARTILLA DE LECTURA MANUAL PEQUEÑA', 0.0005, (SELECT id FROM categories WHERE slug = 'cartillas'), 'published', 0, 0),
  ('LETRAS CARTILLA VISUAL DIRECCIONAL', 'letras-cartilla-visual-direccional', 'AO-LETRARO', 'LETRAS CARTILLA VISUAL DIRECCIONAL', 'LETRAS CARTILLA VISUAL DIRECCIONAL', 0.0005, (SELECT id FROM categories WHERE slug = 'cartillas'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 'control-r-control-para-monitor-y-proyector', 'AO-VC1-B', 'CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 'CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 0, (SELECT id FROM categories WHERE slug = 'controles'), 'published', 0, 0),
  ('MONITOR LCD', 'monitor-lcd', 'AO-VC1', 'MONITOR LCD', 'MONITOR LCD', 5.8, (SELECT id FROM categories WHERE slug = 'monitores-estandar'), 'published', 0, 0),
  ('MONITOR LCD 21.5', 'monitor-lcd-21-5', 'AO-K215F', 'MONITOR LCD 21.5', 'MONITOR LCD 21.5', 0, (SELECT id FROM categories WHERE slug = 'monitores-estandar'), 'published', 0, 0),
  ('MONITOR LCD 23', 'monitor-lcd-23', 'AO-215D', 'MONITOR LCD 23', 'MONITOR LCD 23', 0, (SELECT id FROM categories WHERE slug = 'monitores-estandar'), 'published', 0, 0),
  ('MONITOR LCD 23', 'monitor-lcd-23-230a', 'AO-230A', 'MONITOR LCD 23', 'MONITOR LCD 23', 0, (SELECT id FROM categories WHERE slug = 'monitores-estandar'), 'published', 0, 0),
  ('MONITOR LCD 23.8', 'monitor-lcd-23-8', 'AO-SC800', 'MONITOR LCD 23.8', 'MONITOR LCD 23.8', 0, (SELECT id FROM categories WHERE slug = 'monitores-estandar'), 'published', 0, 0),
  ('MONITOR LCD VISUAL 44 TEST 23.5', 'monitor-lcd-visual-44-test-23-5', 'AO-ACP300', 'MONITOR LCD VISUAL 44 TEST 23.5', 'MONITOR LCD VISUAL 44 TEST 23.5', 5.2, (SELECT id FROM categories WHERE slug = 'monitores-estandar'), 'published', 0, 0),
  ('MONITOR LCD VERTICAL', 'monitor-lcd-vertical', 'AO-CTS215', 'MONITOR LCD VERTICAL', 'MONITOR LCD VERTICAL', 5.2, (SELECT id FROM categories WHERE slug = 'monitores-verticales'), 'published', 0, 0),
  ('OPTOTIPO CON SOPORTE', 'optotipo-con-soporte', 'AO-WZSLB12', 'OPTOTIPO CON SOPORTE', 'OPTOTIPO CON SOPORTE', 0.0005, (SELECT id FROM categories WHERE slug = 'optotipos-con-soporte'), 'published', 0, 0),
  ('OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico', 'AO-CB028', 'OPTOTIPO ELECTRICO LUMINICO', 'OPTOTIPO ELECTRICO LUMINICO', 0.05, (SELECT id FROM categories WHERE slug = 'optotipos-electricos'), 'published', 0, 0);

INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES
  ('OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico-wzslb8', 'AO-WZSLB8', 'OPTOTIPO ELECTRICO LUMINICO', 'OPTOTIPO ELECTRICO LUMINICO', 0.05, (SELECT id FROM categories WHERE slug = 'optotipos-electricos'), 'published', 0, 0),
  ('PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras', 'AO-WB1117A', 'PROYECTOR GRAFICO DE MASCARAS', 'PROYECTOR GRAFICO DE MASCARAS', 0, (SELECT id FROM categories WHERE slug = 'proyectores-graficos'), 'published', 0, 0),
  ('PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras-wz3000b', 'AO-WZ3000B', 'PROYECTOR GRAFICO DE MASCARAS', 'PROYECTOR GRAFICO DE MASCARAS', 6.5, (SELECT id FROM categories WHERE slug = 'proyectores-graficos'), 'published', 0, 0),
  ('OPTOTIPO TABLET LCD', 'optotipo-tablet-lcd', 'AO-WB1112H', 'OPTOTIPO TABLET LCD', 'OPTOTIPO TABLET LCD', 6, (SELECT id FROM categories WHERE slug = 'tablet-lcd'), 'published', 0, 0);

-- ============================================
-- PRODUCT BARCODES (stored in product metadata)
-- ============================================

-- Barcodes can be retrieved from products via SKU reference
-- Each product's barcode from original catalog:

-- AO-ALE1600G: barcode 106801-11500-AT
-- AO-ALE1700G: barcode 101083-12500-AT
-- AO-ALE1000: barcode 108247-5400-AT
-- AO-6ACP: barcode 107580-260-AT
-- AO-CP11A35WV: barcode 107575/108259-145-AT
-- AO-TC10A: barcode 108420-150-AT
-- AO-LE420: barcode 101082/106800/108265-2700-AT
-- AO-LY6C: barcode 108422-40-AT
-- AO-LY6BT: barcode 101036-50-AT
-- AO-LY2A: barcode 106800-75-AT
-- AO-TM001: barcode 101013-35-AT
-- AO-WZJP120: barcode 101022-40-AT
-- AO-CP008: barcode 105764-45-AT
-- AO-GB800: barcode 106820/108261/17-38-AT
-- AO-WZJP15A: barcode 101024-52-AT
-- AO-WZJP15B: barcode 101025-25-AT
-- AO-NH3GS: barcode 102918-1600-AT
-- AO-LY988C: barcode 108398-90-AT
-- AO-CP10C: barcode 108265-68-AT
-- AO-LY8384: barcode 106822-22-AT
-- AO-WZJP17B: barcode 29-18-AT
-- AO-CP8A: barcode 101108-85-AT
-- AO-LY900: barcode 108257-140-AT
-- AO-WZJP800C: barcode 108258/101051-90-AT
-- AO-LY12A: barcode 101078-180-AT
-- AO-WATERPUMP: barcode 101086/101087-135-AT
-- AO-RNH316: barcode 102925-135-AT
-- AO-BROC1: barcode 103801-35-AT
-- AO-RM3: barcode 103800/13-3-AT
-- AO-TR6: barcode 108260-180-AT
-- AO-CP18C: barcode 105761-80-AT
-- AO-AT9000: barcode 101085-9000-AT
-- AO-LM260: barcode 101075-750-AT
-- AO-LM900: barcode 101076-755-AT
-- AO-JD26000D: barcode 101088-880-AT
-- AO-LM300: barcode 100000-850-AT
-- AO-LM800: barcode 101028-1250-AT
-- AO-D910: barcode 10000-1300-AT
-- AO-D900: barcode 108267-580-AT
-- AO-CP1B: barcode 105006/101074-140-AT
-- AO-CM100AP800C330A: barcode 101002/25-10600-AT
-- AO-FA6000A: barcode 2-2100-AT
-- AO-IREF: barcode 101052-290-AT
-- AO-FA6100CK: barcode 101004-2600-AT
-- AO-ARK7710: barcode 101081-2760-AT
-- AO-FA6500K: barcode 101080-2880-AT
-- AO-FA8500K: barcode 108424-2950-AT
-- AO-FA100: barcode 1-3900-AT
-- AO-FA300K: barcode 108397-5000-AT
-- AO-AL700PLUS: barcode 108423-7500-AT
-- AO-PS22: barcode 15-175-AT
-- AO-VB15HB16: barcode 101071-190-AT
-- AO-104: barcode 101046-125-AT
-- AO-JS158: barcode 101047-136-AT
-- AO-JS22P: barcode 108408-95-AT
-- AO-266JS: barcode 101048/108410-210-AT
-- AO-RC3100: barcode 106824-22650-AT
-- AO-SK680A: barcode 101089-12000-AT
-- AO-BIO1100: barcode 103802-12800-AT
-- AO-KJRDA2: barcode 108425-280-AT
-- AO-KJRDA3: barcode 108426-340-AT
-- AO-MD480: barcode 10000-18727-AT
-- AO-DPS700: barcode 108394-3570-AT
-- AO-AP800CP60: barcode 101018-3500-AT
-- AO-ML400-B: barcode 108416-920-AT
-- AO-ML400: barcode 101054-920-AT
-- AO-CSE: barcode 108419-450-AT
-- AO-SM800: barcode 101034-15500-AT
-- AO-BL66B: barcode 10-2250-AT
-- AO-BL88T: barcode 103799-3000-AT
-- AO-ST150: barcode 108251-350-AT
-- AO-S150: barcode 108395-950-AT
-- AO-ML5S1: barcode 108042-1350-AT
-- AO-HL004: barcode 108400-350-AT
-- AO-YZ13: barcode 101063-180-AT
-- AO-20D: barcode 101062-140-AT
-- AO-78D: barcode 101061-140-AT
-- AO-90D: barcode 101060-140-AT
-- AO-SJ989: barcode 108401-150-AT
-- AO-YZ20T4: barcode 10000-12421-AT
-- AO-GD1104: barcode 101032-9-AT x PIEZA
-- AO-TTF08: barcode 106817-34-AT
-- AO-TFC: barcode 102919-9-AT x PIEZA
-- AO-TF488A: barcode 108421-83-AT
-- AO-TF5470: barcode 102066-55-AT
-- AO-OCT500: barcode 100000-30870-AT
-- AO-YZ25C: barcode 101064/108406-1800-AT
-- AO-YZ11: barcode 98537-68-AT
-- AO-YZ24BYZ11D: barcode 101073-480-AT
-- AO-468E4310: barcode 12-680-AT
-- AO-SW500: barcode 111023-140-ATL
-- AO-LY9C: barcode 101030/101056-95-AT
-- AO-CP30: barcode 103104/107579-50-AT
-- AO-YZ24: barcode 11-160-AT
-- AO-SK5500A: barcode 101090-4500-AT
-- AO-SW500-B: barcode 108396-2600-AT
-- AO-CT1000: barcode 20-4500-AT
-- AO-WZZN: barcode 101021-380-AT
-- AO-CT1504: barcode 101012-300-AT
-- AO-CS700AT: barcode 101008-1500-AT
-- AO-CS700B: barcode 101043-1500-AT
-- AO-CS700B2: barcode 101044-1500-AT
-- AO-LY800A: barcode 101009-1450-AT
-- AO-PK158: barcode 101041-1200-AT
-- AO-C180A: barcode 101040/101010-750-AT
-- AO-CS518: barcode 108268-3100-AT
-- AO-CS188: barcode 21-2100-AT
-- AO-C180AB: barcode 108268 -700-AT
-- AO-S900B: barcode 101016-3300-AT
-- AO-S900C: barcode 101017-2890-AT
-- AO-WZ3A: barcode 101037/108256-140-AT
-- AO-WB3AN: barcode 101038-140-AT
-- AO-WZ3AT: barcode 108255-190-AT
-- AO-C330A: barcode 25-1120-AT
-- AO-C288AT-B: barcode 24-1900-AT
-- AO-C288AT: barcode 24/19-2000-AT
-- AO-WZA: barcode 19/108402-350-AT
-- AO-CT1955: barcode 101011-300-AT
-- AO-WZDT1A: barcode 101026-750-AT
-- AO-WZY5B: barcode 108403-150-AT
-- AO-WZY5B-B: barcode 108403-150-AT
-- AO-WZ5AT: barcode 10000-80-AT
-- AO-WZY5A: barcode 108414-90-AT
-- AO-WZY5A-B: barcode 108040/108404-80-AT
-- AO-WZY5C: barcode 108415-55-AT
-- AO-WZY5C-B: barcode 108405-50-AT
-- AO-WZ08: barcode 108951-6-AT
-- AO-WZ01: barcode 108950-3-AT
-- AO-LETRARO: barcode 103777-10.5-AT
-- AO-VC1-B: barcode 103482-15-AT
-- AO-VC1: barcode 101106-550-AT
-- AO-K215F: barcode 101105-350-AT
-- AO-215D: barcode 101069-450-AT
-- AO-230A: barcode 101068-490-AT
-- AO-SC800: barcode 101066-360-AT
-- AO-ACP300: barcode 101107-560-AT
-- AO-CTS215: barcode 101003-495-AT
-- AO-WZSLB12: barcode 101020-90-AT
-- AO-CB028: barcode 108263-55-AT
-- AO-WZSLB8: barcode 101055-30-AT
-- AO-WB1117A: barcode 101065-480-AT
-- AO-WZ3000B: barcode 106818-705-AT
-- AO-WB1112H: barcode 108264/23/101033-40-AT
