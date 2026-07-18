<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/includes/db.php';

echo "=== Atlantic Optical Product Importer ===\n\n";

$existingProducts = db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
$existingCategories = db()->query('SELECT COUNT(*) FROM categories')->fetchColumn();
echo "Existing categories: $existingCategories\n";
echo "Existing products: $existingProducts\n\n";

if ($existingProducts > 0) {
    echo "Products already exist. Skipping import.\n";
    exit;
}

// Step 1: Import main categories
echo "Importing main categories...\n";
$mainCats = [
    ['Equipos de Laboratorio', 'equipos-laboratorio', 1],
    ['Equipos de Oftalmología y Óptica', 'equipos-oftalmologia-optica', 2],
    ['Mobiliario', 'mobiliario', 3],
    ['Monitores y Optotipos', 'monitores-optotipos', 4],
];

foreach ($mainCats as $cat) {
    db()->prepare('INSERT IGNORE INTO categories (name, slug, sort_order, is_active) VALUES (?, ?, ?, 1)')
        ->execute([$cat[0], $cat[1], $cat[2]]);
}

// Step 2: Import subcategories
echo "Importing subcategories...\n";
$subcats = [
    // Equipos de Laboratorio subs
    ['Biseladoras Automáticas', 'biseladoras-automaticas', 'equipos-laboratorio', 1],
    ['Biseladoras Manuales', 'biseladoras-manuales', 'equipos-laboratorio', 2],
    ['Biseladoras Semiautomáticas', 'biseladoras-semiautomaticas', 'equipos-laboratorio', 3],
    ['Calentadores', 'calentadores', 'equipos-laboratorio', 4],
    ['Centradoras', 'centradoras', 'equipos-laboratorio', 5],
    ['Esferómetros', 'esferometros', 'equipos-laboratorio', 6],
    ['Limpiadores Ultrasónicos', 'limpiadores-ultrasonicos', 'equipos-laboratorio', 7],
    ['Medidores de Espesor', 'medidores-de-espesor', 'equipos-laboratorio', 8],
    ['Perforadoras al Aire', 'perforadoras-al-aire', 'equipos-laboratorio', 9],
    ['Perforadoras para Plantilla', 'perforadoras-para-plantilla', 'equipos-laboratorio', 10],
    ['Probadores de Fotocromático', 'probadores-de-fotocromatico', 'equipos-laboratorio', 11],
    ['Pulidoras Manuales', 'pulidoras-manuales', 'equipos-laboratorio', 12],
    ['Pulidoras Semiautomáticas', 'pulidoras-semiautomaticas', 'equipos-laboratorio', 13],
    ['Ranuradoras Manuales', 'ranuradoras-manuales', 'equipos-laboratorio', 14],
    ['Repuestos', 'repuestos', 'equipos-laboratorio', 15],
    ['Tinturadoras', 'tinturadoras', 'equipos-laboratorio', 16],
    ['Uveómetros', 'uveometros', 'equipos-laboratorio', 17],
    // Equipos de Oftalmología subs
    ['Análisis de Gafas', 'analisis-de-gafas', 'equipos-oftalmologia-optica', 18],
    ['Auto Refractómetros', 'auto-refractometros', 'equipos-oftalmologia-optica', 19],
    ['Auto Refractómetros con Keratometro', 'auto-refractometros-con-keratometro', 'equipos-oftalmologia-optica', 20],
    ['Cajas de Prisma', 'cajas-de-prisma', 'equipos-oftalmologia-optica', 21],
    ['Cajas de Prueba', 'cajas-de-prueba', 'equipos-oftalmologia-optica', 22],
    ['Cámara de Fondo', 'camara-de-fondo', 'equipos-oftalmologia-optica', 23],
    ['Campo Visual', 'campo-visual', 'equipos-oftalmologia-optica', 24],
    ['Equipos de Fisioterapia', 'equipos-de-fisioterapia', 'equipos-oftalmologia-optica', 25],
    ['Facoemulsificador', 'facoemulsificador', 'equipos-oftalmologia-optica', 26],
    ['Forópteros Digitales', 'foropteros-digitales', 'equipos-oftalmologia-optica', 27],
    ['Forópteros Manuales', 'foropteros-manuales', 'equipos-oftalmologia-optica', 28],
    ['Kit Instrumental', 'kit-instrumental', 'equipos-oftalmologia-optica', 29],
    ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'equipos-oftalmologia-optica', 30],
    ['Lámparas Portátiles', 'lamparas-portatiles', 'equipos-oftalmologia-optica', 31],
    ['Lente de 3 Espejos', 'lente-de-3-espejos', 'equipos-oftalmologia-optica', 32],
    ['Lente de Aumento', 'lente-de-aumento', 'equipos-oftalmologia-optica', 33],
    ['Lupa Binocular', 'lupa-binocular', 'equipos-oftalmologia-optica', 34],
    ['Microscopio Quirúrgico', 'micropsio-quirurgico', 'equipos-oftalmologia-optica', 35],
    ['Monturas de Prueba', 'monturas-de-prueba', 'equipos-oftalmologia-optica', 36],
    ['OCT', 'oct', 'equipos-oftalmologia-optica', 37],
    ['Oftalmoscopios', 'oftalmoscopios', 'equipos-oftalmologia-optica', 38],
    ['Probetas Desechables', 'probetas-desechables', 'equipos-oftalmologia-optica', 39],
    ['Pupilómetros', 'pupilometros', 'equipos-oftalmologia-optica', 40],
    ['Retinoscopios', 'retinoscopios', 'equipos-oftalmologia-optica', 41],
    ['Tonómetros de Contacto', 'tonometros-de-contacto', 'equipos-oftalmologia-optica', 42],
    ['Tonómetros de Rebote', 'tonometros-de-rebote', 'equipos-oftalmologia-optica', 43],
    // Mobiliario subs
    ['Automáticas', 'automaticas', 'mobiliario', 44],
    ['Brazos de Pared', 'brazos-de-pared', 'mobiliario', 45],
    ['Con Silla Elevación', 'con-silla-elevacion', 'mobiliario', 46],
    ['Con Silla Reclinable', 'con-silla-reclinable', 'mobiliario', 47],
    ['Mesas de Elevación', 'mesas-de-elevacion', 'mobiliario', 48],
    ['Mesas Dobles', 'mesas-dobles', 'mobiliario', 49],
    ['Mesas Multifuncional', 'mesas-multifuncional', 'mobiliario', 50],
    ['Para Movilidad Reducida', 'para-movilidad-reducida', 'mobiliario', 51],
    ['Sillas con Pedal', 'sillas-con-pedal', 'mobiliario', 52],
    ['Sillas para Óptica', 'sillas-para-optica', 'mobiliario', 53],
    // Monitores y Optotipos subs
    ['Cartillas', 'cartillas', 'monitores-optotipos', 54],
    ['Controles', 'controles', 'monitores-optotipos', 55],
    ['Monitores Estándar', 'monitores-estandar', 'monitores-optotipos', 56],
    ['Monitores Verticales', 'monitores-verticales', 'monitores-optotipos', 57],
    ['Optotipos con Soporte', 'optotipos-con-soporte', 'monitores-optotipos', 58],
    ['Optotipos Eléctricos', 'optotipos-electricos', 'monitores-optotipos', 59],
    ['Proyectores Gráficos', 'proyectores-graficos', 'monitores-optotipos', 60],
    ['Tablet LCD', 'tablet-lcd', 'monitores-optotipos', 61],
];

function getCategoryParentId($parentSlug) {
    $stmt = db()->prepare('SELECT id FROM categories WHERE slug = ? AND parent_id IS NULL');
    $stmt->execute([$parentSlug]);
    $row = $stmt->fetch();
    return $row ? $row['id'] : 0;
}

foreach ($subcats as $sub) {
    $parentId = getCategoryParentId($sub[2]);
    if ($parentId > 0) {
        db()->prepare('INSERT IGNORE INTO categories (name, slug, parent_id, sort_order, is_active) VALUES (?, ?, ?, ?, 1)')
            ->execute([$sub[0], $sub[1], $parentId, $sub[3]]);
    }
}

// Build slug -> category_id map
$catMap = [];
$cats = db()->query('SELECT id, slug FROM categories')->fetchAll(PDO::FETCH_ASSOC);
foreach ($cats as $c) {
    $catMap[$c['slug']] = $c['id'];
}
echo "Categories mapped: " . count($catMap) . "\n\n";

// Step 3: Import products
echo "Importing products...\n";
$products = [
    ['BISELADORA AUTOMATICA', 'biseladora-automatica', 'AO-ALE1600G', 'BISELADORA AUTOMATICA', 'BISELADORA AUTOMATICA', 0, 'biseladoras-automaticas'],
    ['BISELADORA AUTOMATICA', 'biseladora-automatica-ale1700g', 'AO-ALE1700G', 'BISELADORA AUTOMATICA', 'BISELADORA AUTOMATICA', 0, 'biseladoras-automaticas'],
    ['BISELADORA AUTOMATICA CON ESCANER', 'biseladora-automatica-con-escaner', 'AO-ALE1000', 'BISELADORA AUTOMATICA CON ESCANER', 'BISELADORA AUTOMATICA CON ESCANER', 60, 'biseladoras-automaticas'],
    ['BISELADORA MANUAL DE TRES PIEDRAS', 'biseladora-manual-de-tres-piedras', 'AO-6ACP', 'BISELADORA MANUAL DE TRES PIEDRAS', 'BISELADORA MANUAL DE TRES PIEDRAS', 6.7, 'biseladoras-manuales'],
    ['BISELADORA MANUAL DE UNA PIEDRA', 'biseladora-manual-de-una-piedra', 'AO-CP11A35WV', 'BISELADORA MANUAL DE UNA PIEDRA', 'BISELADORA MANUAL DE UNA PIEDRA', 6.7, 'biseladoras-manuales'],
    ['BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 'biseladora-manual-de-una-piedra-con-disco-de-corte', 'AO-TC10A', 'BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 'BISELADORA MANUAL DE UNA PIEDRA CON DISCO DE CORTE', 0, 'biseladoras-manuales'],
    ['NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 'nh-136-biseladora-manual-de-tres-piedras', 'AO-CP6A1', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 'NH-136 BISELADORA MANUAL DE TRES PIEDRAS', 0, 'biseladoras-manuales'],
    ['+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', 'ly-2a-cp-10c-biseladora-semiautomatica', 'AO-LE420', '+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', '+ LY-2A* + CP-10C- BISELADORA SEMIAUTOMÁTICA', 13.2, 'biseladoras-semiautomaticas'],
    ['BISELADORA SEMIAUTOMÁTICA', 'biseladora-semiautomatica', 'AO-SJG7100', 'BISELADORA SEMIAUTOMÁTICA', 'BISELADORA SEMIAUTOMÁTICA', 0, 'biseladoras-semiautomaticas'],
    ['CALENTADOR DE MONTURA', 'calentador-de-montura', 'AO-LY6C', 'CALENTADOR DE MONTURA', 'CALENTADOR DE MONTURA', 0, 'calentadores'],
    ['CALENTADOR DE MONTURA', 'calentador-de-montura-ly6bt', 'AO-LY6BT', 'CALENTADOR DE MONTURA', 'CALENTADOR DE MONTURA', 2, 'calentadores'],
    ['CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 'centradora-con-brazo-para-pegatina-y-marcador', 'AO-LY2A', 'CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 'CENTRADORA CON BRAZO PARA PEGATINA Y MARCADOR', 3, 'centradoras'],
    ['ESFEROMETRO METALICO', 'esferometro-metalico', 'AO-TM001', 'ESFEROMETRO METALICO', 'ESFEROMETRO METALICO', 0, 'esferometros'],
    ['LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico', 'AO-WZJP120', 'LIMPIADOR DE LENTES ULTRASONICO', 'LIMPIADOR DE LENTES ULTRASONICO', 2.5, 'limpiadores-ultrasonicos'],
    ['LIMPIADOR DE LENTES ULTRASONICO', 'limpiador-de-lentes-ultrasonico-cp008', 'AO-CP008', 'LIMPIADOR DE LENTES ULTRASONICO', 'LIMPIADOR DE LENTES ULTRASONICO', 2.5, 'limpiadores-ultrasonicos'],
    ['WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 'wz-jp121-limpiador-ultrasonico-moderno', 'AO-GB800', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 'WZ-JP121 LIMPIADOR ULTRASONICO MODERNO', 1, 'limpiadores-ultrasonicos'],
    ['MEDIDOR DE ESPESOR', 'medidor-de-espesor', 'AO-WZJP15A', 'MEDIDOR DE ESPESOR', 'MEDIDOR DE ESPESOR', 0, 'medidores-de-espesor'],
    ['MEDIDOR DE ESPESOR', 'medidor-de-espesor-wzjp15b', 'AO-WZJP15B', 'MEDIDOR DE ESPESOR', 'MEDIDOR DE ESPESOR', 0, 'medidores-de-espesor'],
    ['PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 'perforadora-automatica-para-lentes-al-aire', 'AO-NH3GS', 'PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 'PERFORADORA AUTOMÁTICA PARA LENTES AL AIRE', 7.5, 'perforadoras-al-aire'],
    ['PERFORADORA PARA LENTES AL AIRE', 'perforadora-para-lentes-al-aire', 'AO-LY988C', 'PERFORADORA PARA LENTES AL AIRE', 'PERFORADORA PARA LENTES AL AIRE', 3.5, 'perforadoras-al-aire'],
    ['PERFORADORA PARA PLANTILLA', 'perforadora-para-plantilla', 'AO-CP10C', 'PERFORADORA PARA PLANTILLA', 'PERFORADORA PARA PLANTILLA', 2, 'perforadoras-para-plantilla'],
    ['PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico', 'AO-LY8384', 'PROBADOR DE LENTES PHOTOCROMATICO', 'PROBADOR DE LENTES PHOTOCROMATICO', 0.5, 'probadores-de-fotocromatico'],
    ['PROBADOR DE LENTES PHOTOCROMATICO', 'probador-de-lentes-photocromatico-wzjp17b', 'AO-WZJP17B', 'PROBADOR DE LENTES PHOTOCROMATICO', 'PROBADOR DE LENTES PHOTOCROMATICO', 0.5, 'probadores-de-fotocromatico'],
    ['PULIDORA MANUAL', 'pulidora-manual', 'AO-CP8A', 'Pulido de la lente', 'Pulido de la lente', 0, 'pulidoras-manuales'],
    ['PULIDORA SEMIAUTOMATICA', 'pulidora-semiautomatica', 'AO-LY900', 'Pulido de la lente', 'Pulido de la lente', 7.1, 'pulidoras-semiautomaticas'],
    ['RANURADORA MANUAL', 'ranuradora-manual', 'AO-WZJP800C', 'RANURADORA MANUAL', 'RANURADORA MANUAL', 2.2, 'ranuradoras-manuales'],
    ['RANURADORA MANUAL', 'ranuradora-manual-ly12a', 'AO-LY12A', 'RANURADORA MANUAL', 'RANURADORA MANUAL', 0, 'ranuradoras-manuales'],
    ['BOMBA PARA ALE1000 Y LE-420', 'bomba-para-ale1000-y-le-420', 'AO-WATERPUMP', 'BOMBA PARA ALE1000 Y LE-420', 'BOMBA PARA ALE1000 Y LE-420', 0, 'repuestos'],
    ['REPUESTO DE BISELADORA DE 3 PIEDRAS', 'repuesto-de-biseladora-de-3-piedras', 'AO-RNH316', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', 'REPUESTO DE BISELADORA DE 3 PIEDRAS', 1, 'repuestos'],
    ['REPUESTO DE BROCA PARA CORTADORA', 'repuesto-de-broca-para-cortadora', 'AO-BROC1', 'REPUESTO DE BROCA PARA CORTADORA', 'REPUESTO DE BROCA PARA CORTADORA', 0, 'repuestos'],
    ['PINZA PARA TINTURADO DE LUNAS OPTICAS', 'pinza-para-tinturado-de-lunas-opticas', 'AO-RM3', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', 'PINZA PARA TINTURADO DE LUNAS OPTICAS', 0, 'tinturadoras'],
    ['TINTURADORA', 'tinturadora', 'AO-TR6', 'TINTURADORA', 'TINTURADORA', 7.5, 'tinturadoras'],
    ['UVEOMETRO', 'uveometro', 'AO-CP18C', 'UVEOMETRO', 'UVEOMETRO', 0.65, 'uveometros'],
    ['AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 'at-9000-sistema-de-analisis-de-datos-de-gafas-con-inteligencia-artificial', 'AO-AT9000', 'AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 'AT 9000 SISTEMA DE ANALISIS DE DATOS DE GAFAS CON INTELIGENCIA ARTIFICIAL', 0, 'analisis-de-gafas'],
    ['AUTOLENSOMETRO DIGITAL', 'autolensometro-digital', 'AO-LM260', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia de una lente oftálmica', 11, 'analisis-de-gafas'],
    ['AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm900', 'AO-LM900', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia de una lente oftálmica', 0, 'analisis-de-gafas'],
    ['AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-jd26000d', 'AO-JD26000D', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia de una lente oftálmica', 11, 'analisis-de-gafas'],
    ['AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm300', 'AO-LM300', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia (dióptria) de una lente oftálmica', 'Instrumento óptico para la determinación del centro óptico y medición de la potencia de una lente oftálmica', 6, 'analisis-de-gafas'],
    ['AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-lm800', 'AO-LM800', 'AUTOLENSOMETRO DIGITAL', 'AUTOLENSOMETRO DIGITAL', 0, 'analisis-de-gafas'],
    ['AUTOLENSOMETRO DIGITAL', 'autolensometro-digital-d910', 'AO-D910', 'AUTOLENSOMETRO DIGITAL', 'AUTOLENSOMETRO DIGITAL', 12, 'analisis-de-gafas'],
    ['LENSOMETRO DIGITAL', 'lensometro-digital', 'AO-D900', 'Mejor rendimiento y elección económica, Fácil manejo con cuatro botones', 'Mejor rendimiento y elección económica', 2.9, 'analisis-de-gafas'],
    ['LENSOMETRO MANUAL', 'lensometro-manual', 'AO-NJC6', 'LENSOMETRO MANUAL', 'LENSOMETRO MANUAL', 0, 'analisis-de-gafas'],
    ['LENSOMETRO PORTATIL', 'lensometro-portatil', 'AO-CP1B', 'Instrumento óptico para la determinación del centro óptico', 'Instrumento óptico portátil', 1, 'analisis-de-gafas'],
    ['SET DE OPTOMETRIA', 'set-de-optometria', 'AO-FA100KAP800CP60', 'SET DE OPTOMETRIA', 'SET DE OPTOMETRIA', 0, 'analisis-de-gafas'],
    ['SISTEMA DE REFRACCION AUTOMATICO CON MESA', 'sistema-de-refraccion-automatico-con-mesa', 'AO-CM100AP800C330A', 'SISTEMA DE REFRACCION AUTOMATICO CON MESA', 'SISTEMA DE REFRACCION AUTOMATICO CON MESA', 0, 'analisis-de-gafas'],
    ['AUTOREFRACTOMETRO', 'autorefractometro', 'AO-FA6000A', 'AUTOREFRACTOMETRO', 'AUTOREFRACTOMETRO', 28.8, 'auto-refractometros'],
    ['AUTOREFRACTOMETRO PORTATIL', 'autorefractometro-portatil', 'AO-IREF', 'AUTOREFRACTOMETRO PORTATIL', 'AUTOREFRACTOMETRO PORTATIL', 0.195, 'auto-refractometros'],
    ['AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro', 'AO-FA6100CK', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, 'auto-refractometros-con-keratometro'],
    ['AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-ark7710', 'AO-ARK7710', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 0, 'auto-refractometros-con-keratometro'],
    ['AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa6500k', 'AO-FA6500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, 'auto-refractometros-con-keratometro'],
    ['AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa8500k', 'AO-FA8500K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20.6, 'auto-refractometros-con-keratometro'],
    ['AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa100', 'AO-FA100', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 20, 'auto-refractometros-con-keratometro'],
    ['AUTOREFRACTOMETRO CON KERATOMETRO', 'autorefractometro-con-keratometro-fa300k', 'AO-FA300K', 'AUTOREFRACTOMETRO CON KERATOMETRO', 'AUTOREFRACTOMETRO CON KERATOMETRO', 0, 'auto-refractometros-con-keratometro'],
    ['AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 'autorefractometro-con-keratometro-y-biometria', 'AO-AL700PLUS', 'AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 'AUTOREFRACTOMETRO CON KERATOMETRO Y BIOMETRIA', 0, 'auto-refractometros-con-keratometro'],
    ['CAJA DE PRISMAS', 'caja-de-prismas', 'AO-PS22', 'CAJA DE PRISMAS', 'CAJA DE PRISMAS', 0, 'cajas-de-prisma'],
    ['CAJA DE PRISMAS', 'caja-de-prismas-vb15hb16', 'AO-VB15HB16', 'CAJA DE PRISMAS', 'CAJA DE PRISMAS', 0, 'cajas-de-prisma'],
    ['CAJA DE PRUEBA DE 104 LENTILLAS', 'caja-de-prueba-de-104-lentillas', 'AO-104', 'CAJA DE PRUEBA DE 104 LENTILLAS', 'CAJA DE PRUEBA DE 104 LENTILLAS', 3, 'cajas-de-prueba'],
    ['CAJA DE PRUEBA DE 158 LENTILLAS', 'caja-de-prueba-de-158-lentillas', 'AO-JS158', 'CAJA DE PRUEBA DE 158 LENTILLAS', 'CAJA DE PRUEBA DE 158 LENTILLAS', 3, 'cajas-de-prueba'],
    ['CAJA DE PRUEBA PROGRESIVA', 'caja-de-prueba-progresiva', 'AO-JS22P', 'CAJA DE PRUEBA PROGRESIVA', 'CAJA DE PRUEBA PROGRESIVA', 0, 'cajas-de-prueba'],
    ['GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 'gris-caja-de-prueba-de-266-lentillas', 'AO-266JS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 'GRIS CAJA DE PRUEBA DE 266 LENTILLAS', 6, 'cajas-de-prueba'],
    ['CAMARA DE FONDO DE OJO AUTOMATICA', 'camara-de-fondo-de-ojo-automatica', 'AO-RC3100', 'CAMARA DE FONDO DE OJO AUTOMATICA', 'CAMARA DE FONDO DE OJO AUTOMATICA', 10, 'camara-de-fondo'],
    ['CAMARA DE FONDO DE OJO AUTOMATICA', 'camara-de-fondo-de-ojo-automatica-sk680a', 'AO-SK680A', 'CAMARA DE FONDO DE OJO AUTOMATICA', 'CAMARA DE FONDO DE OJO AUTOMATICA', 0, 'camara-de-fondo'],
    ['CAMARA DE FONDO DE OJO PORTATIL', 'camara-de-fondo-de-ojo-portatil', 'AO-WZ1300', 'CAMARA DE FONDO DE OJO PORTATIL', 'CAMARA DE FONDO DE OJO PORTATIL', 0, 'camara-de-fondo'],
    ['ESCANER ULTRASONICO A-B', 'escaner-ultrasonico-a-b', 'AO-RETIWAVE1000', 'ESCANER ULTRASONICO A-B', 'ESCANER ULTRASONICO A-B', 0, 'camara-de-fondo'],
    ['EQUIPO DE PRUEBA DE CAMPO VISUAL', 'equipo-de-prueba-de-campo-visual', 'AO-BIO1100', 'EQUIPO DE PRUEBA DE CAMPO VISUAL', 'EQUIPO DE PRUEBA DE CAMPO VISUAL', 17, 'campo-visual'],
    ['EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual', 'AO-KJRDA2', 'Dispositivo portátil de fisioterapia visual / terapia ocular', 'Dispositivo portátil de fisioterapia visual', 0, 'equipos-de-fisioterapia'],
    ['EQUIPO DE FISIOTERAPIA VISUAL', 'equipo-de-fisioterapia-visual-kjrda3', 'AO-KJRDA3', 'Dispositivo portátil de fisioterapia visual / terapia ocular', 'Dispositivo portátil de fisioterapia visual', 0, 'equipos-de-fisioterapia'],
    ['PHACOEMULSIFICADOR', 'phacoemulsificador', 'AO-MD480', 'PHACOEMULSIFICADOR', 'PHACOEMULSIFICADOR', 0, 'facoemulsificador'],
    ['FOROPTERO DIGITAL', 'foroptero-digital', 'AO-DPS700', 'FOROPTERO DIGITAL', 'FOROPTERO DIGITAL', 2, 'foropteros-digitales'],
    ['FOROPTERO DIGITAL', 'foroptero-digital-ap800cp60', 'AO-AP800CP60', 'FOROPTERO DIGITAL', 'FOROPTERO DIGITAL', 2, 'foropteros-digitales'],
    ['BLANCO FOROPTERO', 'blanco-foroptero', 'AO-ML400-B', 'BLANCO FOROPTERO', 'BLANCO FOROPTERO', 4.5, 'foropteros-manuales'],
    ['NEGRO FOROPTERO', 'negro-foroptero', 'AO-ML400', 'NEGRO FOROPTERO', 'NEGRO FOROPTERO', 4.5, 'foropteros-manuales'],
    ['KIT 21 KIT INSTRUMENTAL 21 PCS', 'kit-21-kit-instrumental-21-pcs', 'AO-CSE', 'KIT 21 KIT INSTRUMENTAL 21 PCS', 'KIT 21 KIT INSTRUMENTAL 21 PCS', 0, 'kit-instrumental'],
    ['LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 'lampara-de-hendidura-con-sistema-de-analisis', 'AO-WZ5S', 'LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 'LAMPARA DE HENDIDURA CON SISTEMA DE ANÁLISIS', 0, 'lamparas-de-hendidura'],
    ['LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 'lampara-de-henedidura-para-examen-de-ojo-seco', 'AO-SM800', 'LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 'LAMPARA DE HENEDIDURA PARA EXAMEN DE OJO SECO', 17, 'lamparas-de-hendidura'],
    ['YZ-30RR LAMPARA DE HENDIDURA 2 MAGNIFICACIONES', 'yz-30rr-lampara-de-hendidura-2-magnificaciones', 'AO-BL66B', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad', 'Lámpara de hendidura 2 magnificaciones', 22.4, 'lamparas-de-hendidura'],
    ['YZ-30RR LAMPARA DE HENDIDURA 3 MAGNIFICACIONES', 'yz-30rr-lampara-de-hendidura-3-magnificaciones', 'AO-BL88T', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad', 'Lámpara de hendidura 3 magnificaciones', 16.8, 'lamparas-de-hendidura'],
    ['YZ-30RR LAMPARA DE HENDIDURA 5 MAGNIFICACIONES', 'yz-30rr-lampara-de-hendidura-5-magnificaciones', 'AO-SJ350', 'La lámpara de hendidura es un microscopio de bajo poder combinado con una fuente de luz de alta intensidad', 'Lámpara de hendidura 5 magnificaciones', 0, 'lamparas-de-hendidura'],
    ['LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil', 'AO-ST150', 'LAMPARA DE HENDIDURA PORTATIL', 'LAMPARA DE HENDIDURA PORTATIL', 0.12, 'lamparas-portatiles'],
    ['LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-s150', 'AO-S150', 'La lámpara de hendidura es un microscopio de bajo poder', 'Lámpara de hendidura portátil', 0.15, 'lamparas-portatiles'],
    ['LAMPARA DE HENDIDURA PORTATIL', 'lampara-de-hendidura-portatil-ml5s1', 'AO-ML5S1', 'LAMPARA DE HENDIDURA PORTATIL', 'LAMPARA DE HENDIDURA PORTATIL', 0.835, 'lamparas-portatiles'],
    ['LAMPARA FRONTAL MEDICA', 'lampara-frontal-medica', 'AO-HL004', 'LAMPARA FRONTAL MEDICA', 'LAMPARA FRONTAL MEDICA', 0, 'lamparas-portatiles'],
    ['LENTE DE 3 ESPEJOS', 'lente-de-3-espejos', 'AO-YZ13', 'LENTE DE 3 ESPEJOS', 'LENTE DE 3 ESPEJOS', 0, 'lente-de-3-espejos'],
    ['LENTE DE AUMENTO', 'lente-de-aumento', 'AO-20D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, 'lente-de-aumento'],
    ['LENTE DE AUMENTO', 'lente-de-aumento-78d', 'AO-78D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, 'lente-de-aumento'],
    ['LENTE DE AUMENTO', 'lente-de-aumento-90d', 'AO-90D', 'LENTE DE AUMENTO', 'LENTE DE AUMENTO', 0, 'lente-de-aumento'],
    ['LUPA BINOCULAR', 'lupa-binocular', 'AO-SJ989', 'LUPA BINOCULAR', 'LUPA BINOCULAR', 0, 'lupa-binocular'],
    ['MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 'microscopio-quirurjico-para-ofatlmologia', 'AO-YZ20T4', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 'MICROSCOPIO QUIRURJICO PARA OFATLMOLOGIA', 0, 'micropsio-quirurgico'],
    ['MONTURA DE PRUEBA', 'montura-de-prueba', 'AO-GD1104', 'MONTURA DE PRUEBA', 'MONTURA DE PRUEBA', 0, 'monturas-de-prueba'],
    ['MONTURA DE PRUEBA ALUMINIO', 'montura-de-prueba-aluminio', 'AO-TTF08', 'MONTURA DE PRUEBA ALUMINIO', 'MONTURA DE PRUEBA ALUMINIO', 0.05, 'monturas-de-prueba'],
    ['MONTURA DE PRUEBA PARA NIÑOS', 'montura-de-prueba-para-ninos', 'AO-TFC', 'MONTURA DE PRUEBA PARA NIÑOS', 'MONTURA DE PRUEBA PARA NIÑOS', 0, 'monturas-de-prueba'],
    ['MONTURA DE PRUEBA PREMIUM', 'montura-de-prueba-premium', 'AO-TF488A', 'MONTURA DE PRUEBA PREMIUM', 'MONTURA DE PRUEBA PREMIUM', 0.2, 'monturas-de-prueba'],
    ['MONTURA DE PRUEBA TITANIUM', 'montura-de-prueba-titanium', 'AO-TF5470', 'MONTURA DE PRUEBA TITANIUM', 'MONTURA DE PRUEBA TITANIUM', 0.05, 'monturas-de-prueba'],
    ['TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 'tomografo-de-coherencia-optica-oct', 'AO-OCT500', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 'TOMOGRAFO DE COHERENCIA OPTICA (OCT)', 0, 'oct'],
    ['OFTALMOSCOPIO INDIRECTO', 'oftalmoscopio-indirecto', 'AO-YZ25C', 'OFTALMOSCOPIO INDIRECTO', 'OFTALMOSCOPIO INDIRECTO', 0, 'oftalmoscopios'],
    ['OFTALMOSCOPIO PORTATIL', 'oftalmoscopio-portatil', 'AO-YZ11', 'OFTALMOSCOPIO PORTATIL', 'OFTALMOSCOPIO PORTATIL', 0, 'oftalmoscopios'],
    ['RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio', 'AO-YZ24BYZ11D', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'RETINOSCOPIO CON OFTALMOSCOPIO', 0, 'oftalmoscopios'],
    ['RETINOSCOPIO CON OFTALMOSCOPIO', 'retinoscopio-con-oftalmoscopio-468e4310', 'AO-468E4310', 'RETINOSCOPIO CON OFTALMOSCOPIO', 'RETINOSCOPIO CON OFTALMOSCOPIO', 3, 'oftalmoscopios'],
    ['PROBE PROBETA DESECHABLE', 'probe-probeta-desechable', 'AO-SW500', 'Puntas de repuesto de un solo uso diseñadas para el tonómetro de rebote portátil', 'Puntas de repuesto para tonómetro', 0, 'probetas-desechables'],
    ['PUPILOMETRO DIGITAL', 'pupilometro-digital', 'AO-LY9C', 'PUPILOMETRO DIGITAL', 'PUPILOMETRO DIGITAL', 0.7, 'pupilometros'],
    ['PUPILOMETRO MANUAL', 'pupilometro-manual', 'AO-CP30', 'PUPILOMETRO MANUAL', 'PUPILOMETRO MANUAL', 0, 'pupilometros'],
    ['RETINOSCOPIO', 'retinoscopio', 'AO-YZ24', 'RETINOSCOPIO', 'RETINOSCOPIO', 1.8, 'retinoscopios'],
    ['TONOMETRO', 'tonometro', 'AO-SK5500A', 'TONOMETRO', 'TONOMETRO', 0, 'tonometros-de-contacto'],
    ['TONOMETRO METALICO', 'tonometro-metalico', 'AO-YZ30R', 'TONOMETRO METALICO', 'TONOMETRO METALICO', 0, 'tonometros-de-contacto'],
    ['TONOMETRO DE REBOTE PORTATIL', 'tonometro-de-rebote-portatil', 'AO-SW500-B', 'Es un examen para medir la presión dentro de los ojos', 'Tonómetro de rebote portátil', 0, 'tonometros-de-rebote'],
    ['UNIDAD OFTALMICA AUTOMÁTICA CON SILLA', 'unidad-oftalmica-automatica-con-silla', 'AO-CT1000', 'Mesa que se abre en 90°, silla que sube y baja con elevador', 'Unidad oftálmica automática con silla', 0, 'automaticas'],
    ['BRAZO PARA FOROPTERO DE PARED', 'brazo-para-foroptero-de-pared', 'AO-WZZN', 'BRAZO PARA FOROPTERO DE PARED', 'BRAZO PARA FOROPTERO DE PARED', 14, 'brazos-de-pared'],
    ['BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 'brazo-para-foroptero-y-proyector-de-pared', 'AO-CT1504', 'BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 'BRAZO PARA FOROPTERO Y PROYECTOR DE PARED', 14, 'brazos-de-pared'],
    ['UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion', 'AO-CS700AT', 'Mesa que se abre en 90°, silla que sube y baja con elevador', 'Unidad oftálmica con silla de elevación', 122.6, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-cs700b', 'AO-CS700B', 'Mesa que se abre en 90°, silla que sube y baja con elevador', 'Unidad oftálmica con silla de elevación', 122.6, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-cs700b2', 'AO-CS700B2', 'Mesa que se abre en 90°, silla que sube y baja con elevador', 'Unidad oftálmica con silla de elevación', 122.6, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-ly800a', 'AO-LY800A', 'Mesa que se abre en 90°, silla que sube y baja con elevador', 'Unidad oftálmica con silla de elevación', 46.8, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-pk158', 'AO-PK158', 'Mesa que se abre en 90°, silla que sube y baja con elevador', 'Unidad oftálmica con silla de elevación', 46.8, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-pk160', 'AO-PK160', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 0, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'unidad-oftalmica-con-silla-de-elevacion-c180a', 'AO-C180A', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 'UNIDAD OFTALMICA CON SILLA DE ELEVACION', 54.4, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA ELEVACION', 'unidad-oftalmica-con-silla-elevacion', 'AO-CS518', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 0, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA ELEVACION', 'unidad-oftalmica-con-silla-elevacion-cs188', 'AO-CS188', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 'UNIDAD OFTALMICA CON SILLA ELEVACION', 240, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 'unidad-oftalmica-con-silla-elevacion-y-pedal', 'AO-C180AB', 'UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 'UNIDAD OFTALMICA CON SILLA ELEVACION Y PEDAL', 54.4, 'con-silla-elevacion'],
    ['UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable', 'AO-S900B', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, 'con-silla-reclinable'],
    ['UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable-s900c', 'AO-S900C', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, 'con-silla-reclinable'],
    ['UNIDAD OFTALMICA CON SILLA RECLINABLE', 'unidad-oftalmica-con-silla-reclinable-s900at', 'AO-S900AT', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 'UNIDAD OFTALMICA CON SILLA RECLINABLE', 0, 'con-silla-reclinable'],
    ['MESA DE ELEVACION', 'mesa-de-elevacion', 'AO-WZ3A', 'Para subir o bajar a la altura necesaria', 'Mesa de elevación', 17, 'mesas-de-elevacion'],
    ['MESA DE ELEVACION', 'mesa-de-elevacion-wb3an', 'AO-WB3AN', 'Para subir o bajar a la altura necesaria', 'Mesa de elevación', 17, 'mesas-de-elevacion'],
    ['TRIAL MESA DE ELEVACION CON BANDEJA', 'trial-mesa-de-elevacion-con-bandeja', 'AO-WZ3AT', 'Para subir o bajar a la altura necesaria', 'Mesa de elevación con bandeja', 25, 'mesas-de-elevacion'],
    ['MESA DOBLE DE ELEVACIÓN', 'mesa-doble-de-elevacion', 'AO-C330A', 'Para subir o bajar a la altura necesaria', 'Mesa doble de elevación', 70, 'mesas-dobles'],
    ['MESA MULTIFUNCIONAL', 'mesa-multifuncional', 'AO-C288AT-B', 'MESA MULTIFUNCIONAL', 'MESA MULTIFUNCIONAL', 0, 'mesas-multifuncional'],
    ['UNIDAD OFTALMICA PARA PERSONAS CON MOVILIDAD REDUCIDA', 'wz-a-unidad-oftalmica-para-personas-con-movilidad-reducida', 'AO-C288AT', 'La columna de elevación con forma de eclipse ofrece espacio y potencia', 'Unidad oftálmica para movilidad reducida', 122.6, 'para-movilidad-reducida'],
    ['SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion', 'AO-WZA', 'SILLA CON PEDAL DE ELEVACION', 'SILLA CON PEDAL DE ELEVACION', 0, 'sillas-con-pedal'],
    ['SILLA CON PEDAL DE ELEVACION', 'silla-con-pedal-de-elevacion-ct1955', 'AO-CT1955', 'SILLA CON PEDAL DE ELEVACION', 'SILLA CON PEDAL DE ELEVACION', 0, 'sillas-con-pedal'],
    ['SILLA CON PEDAL DE ELEVACION Y RECLINACION', 'silla-con-pedal-de-elevacion-y-reclinacion', 'AO-WZDT1A', 'SILLA CON PEDAL DE ELEVACION Y RECLINACION', 'SILLA CON PEDAL DE ELEVACION Y RECLINACION', 0, 'sillas-con-pedal'],
    ['SILLA PARA OPTICA', 'silla-para-optica', 'AO-WZY5B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 'sillas-para-optica'],
    ['SILLA PARA OPTICA', 'silla-para-optica-wzy5b-b', 'AO-WZY5B-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 'sillas-para-optica'],
    ['SILLA PARA OPTICA', 'silla-para-optica-wz5at', 'AO-WZ5AT', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 'sillas-para-optica'],
    ['SILLA PARA OPTICA', 'silla-para-optica-wzy5a', 'AO-WZY5A', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 'sillas-para-optica'],
    ['SILLA PARA OPTICA', 'silla-para-optica-wzy5a-b', 'AO-WZY5A-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 'sillas-para-optica'],
    ['SILLA PARA OPTICA', 'silla-para-optica-wzy5c', 'AO-WZY5C', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 'sillas-para-optica'],
    ['SILLA PARA OPTICA', 'silla-para-optica-wzy5c-b', 'AO-WZY5C-B', 'SILLA PARA OPTICA', 'SILLA PARA OPTICA', 0, 'sillas-para-optica'],
    ['CARTILLA DE EXAMEN VISUAL GRANDE', 'cartilla-de-examen-visual-grande', 'AO-WZ08', 'CARTILLA DE EXAMEN VISUAL GRANDE', 'CARTILLA DE EXAMEN VISUAL GRANDE', 0.0005, 'cartillas'],
    ['CARTILLA DE LECTURA MANUAL PEQUEÑA', 'cartilla-de-lectura-manual-pequena', 'AO-WZ01', 'CARTILLA DE LECTURA MANUAL PEQUEÑA', 'CARTILLA DE LECTURA MANUAL PEQUEÑA', 0.0005, 'cartillas'],
    ['LETRAS CARTILLA VISUAL DIRECCIONAL', 'letras-cartilla-visual-direccional', 'AO-LETRARO', 'LETRAS CARTILLA VISUAL DIRECCIONAL', 'LETRAS CARTILLA VISUAL DIRECCIONAL', 0.0005, 'cartillas'],
    ['CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 'control-r-control-para-monitor-y-proyector', 'AO-VC1-B', 'CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 'CONTROL R CONTROL PARA MONITOR Y PROYECTOR', 0, 'controles'],
    ['MONITOR LCD', 'monitor-lcd', 'AO-VC1', 'MONITOR LCD', 'MONITOR LCD', 5.8, 'monitores-estandar'],
    ['MONITOR LCD 21.5', 'monitor-lcd-21-5', 'AO-K215F', 'MONITOR LCD 21.5', 'MONITOR LCD 21.5', 0, 'monitores-estandar'],
    ['MONITOR LCD 23', 'monitor-lcd-23', 'AO-215D', 'MONITOR LCD 23', 'MONITOR LCD 23', 0, 'monitores-estandar'],
    ['MONITOR LCD 23', 'monitor-lcd-23-230a', 'AO-230A', 'MONITOR LCD 23', 'MONITOR LCD 23', 0, 'monitores-estandar'],
    ['MONITOR LCD 23.8', 'monitor-lcd-23-8', 'AO-SC800', 'MONITOR LCD 23.8', 'MONITOR LCD 23.8', 0, 'monitores-estandar'],
    ['MONITOR LCD VISUAL 44 TEST 23.5', 'monitor-lcd-visual-44-test-23-5', 'AO-ACP300', 'MONITOR LCD VISUAL 44 TEST 23.5', 'MONITOR LCD VISUAL 44 TEST 23.5', 5.2, 'monitores-estandar'],
    ['MONITOR LCD VERTICAL', 'monitor-lcd-vertical', 'AO-CTS215', 'MONITOR LCD VERTICAL', 'MONITOR LCD VERTICAL', 5.2, 'monitores-verticales'],
    ['OPTOTIPO CON SOPORTE', 'optotipo-con-soporte', 'AO-WZSLB12', 'OPTOTIPO CON SOPORTE', 'OPTOTIPO CON SOPORTE', 0.0005, 'optotipos-con-soporte'],
    ['OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico', 'AO-CB028', 'OPTOTIPO ELECTRICO LUMINICO', 'OPTOTIPO ELECTRICO LUMINICO', 0.05, 'optotipos-electricos'],
    ['OPTOTIPO ELECTRICO LUMINICO', 'optotipo-electrico-luminico-wzslb8', 'AO-WZSLB8', 'OPTOTIPO ELECTRICO LUMINICO', 'OPTOTIPO ELECTRICO LUMINICO', 0.05, 'optotipos-electricos'],
    ['PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras', 'AO-WB1117A', 'PROYECTOR GRAFICO DE MASCARAS', 'PROYECTOR GRAFICO DE MASCARAS', 0, 'proyectores-graficos'],
    ['PROYECTOR GRAFICO DE MASCARAS', 'proyector-grafico-de-mascaras-wz3000b', 'AO-WZ3000B', 'PROYECTOR GRAFICO DE MASCARAS', 'PROYECTOR GRAFICO DE MASCARAS', 6.5, 'proyectores-graficos'],
    ['OPTOTIPO TABLET LCD', 'optotipo-tablet-lcd', 'AO-WB1112H', 'OPTOTIPO TABLET LCD', 'OPTOTIPO TABLET LCD', 6, 'tablet-lcd'],
];

$count = 0;
$stmt = db()->prepare('INSERT IGNORE INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');

foreach ($products as $p) {
    $catId = $catMap[$p[6]] ?? 0;
    if ($catId > 0) {
        $stmt->execute([$p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $catId, 'active']);
        $count++;
    } else {
        echo "WARNING: Category not found for slug '{$p[6]}' (product: {$p[2]})\n";
    }
}

echo "\n=== Import Complete ===\n";
echo "Products imported: $count\n";
$total = db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
echo "Total products in DB: $total\n";
