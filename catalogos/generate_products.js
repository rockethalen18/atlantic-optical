const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed_products.json'), 'utf8'));

function slugify(text) {
  return text
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function cleanRef(ref) {
  return ref.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractModel(ref) {
  const cleaned = cleanRef(ref);
  const parts = cleaned.split(/\s+/);
  const first = parts[0];

  // Handle multi-word English model names like "WATER PUMP"
  if (!/[0-9]/.test(first) && parts.length > 1) {
    const knownMultiWord = ['WATER PUMP'];
    for (const mw of knownMultiWord) {
      if (cleaned.toUpperCase().startsWith(mw)) {
        return mw;
      }
    }
  }

  // Handle cases like "AT 9000" where the number is part of the model
  if (/^[A-Za-z]+$/.test(first) && parts.length > 1 && /^[0-9]+$/.test(parts[1])) {
    return first + '-' + parts[1];
  }

  return first;
}

function extractName(ref) {
  const cleaned = cleanRef(ref);
  const model = extractModel(cleaned);
  // Remove the model from the start to get the description
  let description = cleaned;
  if (cleaned.toUpperCase().startsWith(model.toUpperCase())) {
    description = cleaned.substring(model.length).trim();
  }
  return description || model;
}

function makeSKU(model) {
  return 'AO-' + model.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function extractWeight(specs) {
  if (!specs || !specs.peso) return 0;
  const peso = specs.peso.toLowerCase();
  const kgMatch = peso.match(/([\d.,]+)\s*kg/);
  if (kgMatch) {
    return parseFloat(kgMatch[1].replace(',', '.'));
  }
  const gMatch = peso.match(/([\d.,]+)\s*g\b/);
  if (gMatch) {
    return parseFloat(gMatch[1].replace(',', '.')) / 1000;
  }
  return 0;
}

function truncate(str, maxLen = 150) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

// Category mapping: catalog -> product name pattern -> [category, category_slug, subcategory, subcategory_slug]
const catalog1Map = (name, ref) => {
  const upper = name.toUpperCase() + ' ' + ref.toUpperCase();

  // Lámparas de Hendidura (check before Tonómetros to catch combo products)
  if (upper.includes('LUPA') || (upper.includes('BINOCULAR') && upper.includes('AUMENTO'))) {
    return ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'Lente de Aumento', 'lente-de-aumento'];
  }
  if (upper.includes('LENT') && upper.includes('AUMENTO')) {
    return ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'Lente de Aumento', 'lente-de-aumento'];
  }
  if (upper.includes('3 ESPEJOS') || upper.includes('TRES ESPEJOS')) {
    return ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'Lente de 3 Espejos', 'lente-de-3-espejos'];
  }
  if (upper.includes('LAMPARA') && upper.includes('FRONTAL')) {
    return ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'Lámparas Portátiles', 'lamparas-portatiles'];
  }
  if (upper.includes('LAMPARA') && upper.includes('PORTATIL')) {
    return ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'Lámparas Portátiles', 'lamparas-portatiles'];
  }
  if (upper.includes('LAMPARA') && upper.includes('HENDIDURA')) {
    return ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'Lámparas de Hendidura', 'lamparas-de-hendidura'];
  }
  if (upper.includes('HENDIDURA') || upper.includes('HENEDIDURA')) {
    return ['Lámparas de Hendidura', 'lamparas-de-hendidura', 'Lámparas de Hendidura', 'lamparas-de-hendidura'];
  }

  // Auto Refractómetros
  if (upper.includes('AUTOREFRACTOMETRO') && upper.includes('KERATOMETRO')) {
    return ['Auto Refractómetros', 'auto-refractometros', 'Auto Refractómetros con Keratometro', 'auto-refractometros-con-keratometro'];
  }
  if (upper.includes('AUTOREFRACTOMETRO') || upper.includes('AUTO REFRACTOMETRO')) {
    return ['Auto Refractómetros', 'auto-refractometros', 'Auto Refractómetros', 'auto-refractometros'];
  }

  // Tonómetros
  if (upper.includes('PROBETA') || upper.includes('PROBE')) {
    return ['Tonómetros', 'tonometros', 'Probetas Desechables', 'probetas-desechables'];
  }
  if (upper.includes('TONOMETRO') && upper.includes('REBOTE')) {
    return ['Tonómetros', 'tonometros', 'Tonómetros de Rebote', 'tonometros-de-rebote'];
  }
  if (upper.includes('TONOMETRO')) {
    return ['Tonómetros', 'tonometros', 'Tonómetros de Contacto', 'tonometros-de-contacto'];
  }

  // Forópteros
  if (upper.includes('FOROPTERO') && upper.includes('DIGITAL')) {
    return ['Forópteros', 'foropteros', 'Forópteros Digitales', 'foropteros-digitales'];
  }
  if (upper.includes('FOROPTERO')) {
    return ['Forópteros', 'foropteros', 'Forópteros Manuales', 'foropteros-manuales'];
  }

  // Lentes de Prueba
  if (upper.includes('CAJA DE PRUEBA') || upper.includes('CAJA DE PRUEBA PROGRESIVA')) {
    return ['Lentes de Prueba', 'lentes-de-prueba', 'Cajas de Prueba', 'cajas-de-prueba'];
  }
  if (upper.includes('MONTURA DE PRUEBA')) {
    return ['Lentes de Prueba', 'lentes-de-prueba', 'Monturas de Prueba', 'monturas-de-prueba'];
  }

  // Equipos de Diagnóstico
  if (upper.includes('OFTALMOSCOPIO')) {
    return ['Equipos de Diagnóstico', 'equipos-de-diagnostico', 'Oftalmoscopios', 'oftalmoscopios'];
  }
  if (upper.includes('RETINOSCOPIO')) {
    return ['Equipos de Diagnóstico', 'equipos-de-diagnostico', 'Retinoscopios', 'retinoscopios'];
  }
  if (upper.includes('PUPILOMETRO')) {
    return ['Equipos de Diagnóstico', 'equipos-de-diagnostico', 'Pupilómetros', 'pupilometros'];
  }
  if (upper.includes('FISIOTERAPIA') || upper.includes('TERAPIA OCULAR')) {
    return ['Equipos de Diagnóstico', 'equipos-de-diagnostico', 'Equipos de Fisioterapia', 'equipos-de-fisioterapia'];
  }

  // Equipos Especiales
  if (upper.includes('PHACOEMULSIFICADOR') || upper.includes('FACOEMULSIFICADOR')) {
    return ['Equipos Especiales', 'equipos-especiales', 'Facoemulsificador', 'facoemulsificador'];
  }
  if (upper.includes('OCT') || upper.includes('TOMOGRAFO')) {
    return ['Equipos Especiales', 'equipos-especiales', 'OCT', 'oct'];
  }
  if (upper.includes('CAMPO VISUAL') || upper.includes('PRUEBA DE CAMPO')) {
    return ['Equipos Especiales', 'equipos-especiales', 'Campo Visual', 'campo-visual'];
  }
  if (upper.includes('CAMARA DE FONDO')) {
    return ['Equipos Especiales', 'equipos-especiales', 'Cámara de Fondo', 'camara-de-fondo'];
  }
  if (upper.includes('ESCANER') || upper.includes('ULTRASONICO') || upper.includes('ULTRASONIDO')) {
    return ['Equipos Especiales', 'equipos-especiales', 'Cámara de Fondo', 'camara-de-fondo'];
  }
  if (upper.includes('MICROSCOPIO') || upper.includes('QUIRURJICO')) {
    return ['Equipos Especiales', 'equipos-especiales', 'Micropsio Quirúrgico', 'micropsio-quirurgico'];
  }
  if (upper.includes('ANALISIS DE GAFAS') || upper.includes('ANÁLISIS DE GAFAS') || upper.includes('DATOS DE GAFAS')) {
    return ['Equipos Especiales', 'equipos-especiales', 'Análisis de Gafas', 'analisis-de-gafas'];
  }
  if (upper.includes('KIT INSTRUMENTAL') || upper.includes('KIT ')) {
    return ['Equipos Especiales', 'equipos-especiales', 'Kit Instrumental', 'kit-instrumental'];
  }

  // Accesorios Ópticos
  if (upper.includes('PRISMA') || upper.includes('CAJA DE PRISMA')) {
    return ['Accesorios Ópticos', 'accesorios-opticos', 'Cajas de Prisma', 'cajas-de-prisma'];
  }

  // Lentes de Prueba (trial sets - boxes of lenses)
  if (upper.includes('LENTILLAS') || upper.includes('CAJA DE ')) {
    return ['Lentes de Prueba', 'lentes-de-prueba', 'Cajas de Prueba', 'cajas-de-prueba'];
  }

  // Default fallback for catalog 1
  return ['Equipos Especiales', 'equipos-especiales', 'Análisis de Gafas', 'analisis-de-gafas'];
};

const catalog2Map = (name, ref) => {
  const upper = name.toUpperCase() + ' ' + ref.toUpperCase();

  if (upper.includes('REPUESTO') || upper.includes('BOMBA') || upper.includes('BROC')) {
    return ['Repuestos', 'repuestos', 'Repuestos', 'repuestos'];
  }
  if (upper.includes('BISELADORA') && (upper.includes('SEMIAUTOMÁTICA') || upper.includes('SEMIAUTOMATICA'))) {
    return ['Biseladoras', 'biseladoras', 'Biseladoras Semiautomáticas', 'biseladoras-semiautomaticas'];
  }
  if (upper.includes('BISELADORA') && (upper.includes('AUTOMATICA') || upper.includes('AUTOMÁTICA'))) {
    return ['Biseladoras', 'biseladoras', 'Biseladoras Automáticas', 'biseladoras-automaticas'];
  }
  if (upper.includes('BISELADORA') && upper.includes('MANUAL')) {
    return ['Biseladoras', 'biseladoras', 'Biseladoras Manuales', 'biseladoras-manuales'];
  }
  if (upper.includes('BISELADORA')) {
    return ['Biseladoras', 'biseladoras', 'Biseladoras Manuales', 'biseladoras-manuales'];
  }
  if (upper.includes('PULIDORA') && (upper.includes('SEMIAUTOMATICA') || upper.includes('SEMIAUTOMÁTICA'))) {
    return ['Pulidoras', 'pulidoras', 'Pulidoras Semiautomáticas', 'pulidoras-semiautomaticas'];
  }
  if (upper.includes('PULIDORA') && (upper.includes('MANUAL') || upper.includes('MANUAL'))) {
    return ['Pulidoras', 'pulidoras', 'Pulidoras Manuales', 'pulidoras-manuales'];
  }
  if (upper.includes('PULIDORA')) {
    return ['Pulidoras', 'pulidoras', 'Pulidoras Manuales', 'pulidoras-manuales'];
  }
  if (upper.includes('RANURADORA')) {
    return ['Ranuradoras', 'ranuradoras', 'Ranuradoras Manuales', 'ranuradoras-manuales'];
  }
  if (upper.includes('PERFORADORA') && upper.includes('PLANTILLA')) {
    return ['Perforadoras', 'perforadoras', 'Perforadoras para Plantilla', 'perforadoras-para-plantilla'];
  }
  if (upper.includes('PERFORADORA')) {
    return ['Perforadoras', 'perforadoras', 'Perforadoras al Aire', 'perforadoras-al-aire'];
  }
  if (upper.includes('CENTRADORA')) {
    return ['Centradoras', 'centradoras', 'Centradoras', 'centradoras'];
  }
  if (upper.includes('CALENTADOR')) {
    return ['Calentadores', 'calentadores', 'Calentadores', 'calentadores'];
  }
  if (upper.includes('TINTURADORA') || upper.includes('TINTURADO') || upper.includes('PINZA')) {
    return ['Tinturadoras', 'tinturadoras', 'Tinturadoras', 'tinturadoras'];
  }
  if (upper.includes('LIMPIADOR') && upper.includes('ULTRASONICO')) {
    return ['Limpiadores', 'limpiadores', 'Limpiadores Ultrasónicos', 'limpiadores-ultrasonicos'];
  }
  if (upper.includes('LIMPIADOR')) {
    return ['Limpiadores', 'limpiadores', 'Limpiadores Ultrasónicos', 'limpiadores-ultrasonicos'];
  }
  if (upper.includes('UVEOMETRO')) {
    return ['Medición', 'medicion', 'Uveómetros', 'uveometros'];
  }
  if (upper.includes('ESFEROMETRO')) {
    return ['Medición', 'medicion', 'Esferómetros', 'esferometros'];
  }
  if (upper.includes('MEDIDOR DE ESPESOR')) {
    return ['Medición', 'medicion', 'Medidores de Espesor', 'medidores-de-espesor'];
  }
  if (upper.includes('PROBADOR') && (upper.includes('PHOTOCROMATICO') || upper.includes('FOTOCROMATICO'))) {
    return ['Probadores', 'probadores', 'Probadores de Fotocromático', 'probadores-de-fotocromatico'];
  }

  return ['Repuestos', 'repuestos', 'Repuestos', 'repuestos'];
};

const catalog3Map = (name, ref) => {
  const upper = name.toUpperCase() + ' ' + ref.toUpperCase();

  if (upper.includes('UNIDAD OFTALMICA') && upper.includes('MOVILIDAD REDUCIDA')) {
    return ['Unidades Oftálmicas', 'unidades-oftalmicas', 'Para Movilidad Reducida', 'para-movilidad-reducida'];
  }
  if (upper.includes('UNIDAD OFTALMICA') && upper.includes('AUTOMÁTICA')) {
    return ['Unidades Oftálmicas', 'unidades-oftalmicas', 'Automáticas', 'automaticas'];
  }
  if (upper.includes('UNIDAD OFTALMICA') && upper.includes('RECLINABLE')) {
    return ['Unidades Oftálmicas', 'unidades-oftalmicas', 'Con Silla Reclinable', 'con-silla-reclinable'];
  }
  if (upper.includes('UNIDAD OFTALMICA') && upper.includes('ELEVACION')) {
    return ['Unidades Oftálmicas', 'unidades-oftalmicas', 'Con Silla Elevación', 'con-silla-elevacion'];
  }
  if (upper.includes('UNIDAD OFTALMICA') || upper.includes('UNIDAD OFTALMICA')) {
    return ['Unidades Oftálmicas', 'unidades-oftalmicas', 'Con Silla Elevación', 'con-silla-elevacion'];
  }
  if (upper.includes('SILLA') && upper.includes('PEDAL')) {
    return ['Sillas', 'sillas', 'Sillas con Pedal', 'sillas-con-pedal'];
  }
  if (upper.includes('SILLA') && upper.includes('OPTICA')) {
    return ['Sillas', 'sillas', 'Sillas para Óptica', 'sillas-para-optica'];
  }
  if (upper.includes('SILLA')) {
    return ['Sillas', 'sillas', 'Sillas para Óptica', 'sillas-para-optica'];
  }
  if (upper.includes('MESA') && upper.includes('DOBLE')) {
    return ['Mesas', 'mesas', 'Mesas Dobles', 'mesas-dobles'];
  }
  if (upper.includes('MESA') && upper.includes('MULTIFUNCIONAL')) {
    return ['Mesas', 'mesas', 'Mesas Multifuncional', 'mesas-multifuncional'];
  }
  if (upper.includes('MESA') && upper.includes('ELEVACION')) {
    return ['Mesas', 'mesas', 'Mesas de Elevación', 'mesas-de-elevacion'];
  }
  if (upper.includes('MESA')) {
    return ['Mesas', 'mesas', 'Mesas de Elevación', 'mesas-de-elevacion'];
  }
  if (upper.includes('BRAZO')) {
    return ['Brazos', 'brazos', 'Brazos de Pared', 'brazos-de-pared'];
  }

  return ['Unidades Oftálmicas', 'unidades-oftalmicas', 'Con Silla Elevación', 'con-silla-elevacion'];
};

const catalog4Map = (name, ref) => {
  const upper = name.toUpperCase() + ' ' + ref.toUpperCase();

  if (upper.includes('CONTROL')) {
    return ['Controles', 'controles', 'Controles', 'controles'];
  }
  if (upper.includes('PROYECTOR')) {
    return ['Proyectores', 'proyectores', 'Proyectores Gráficos', 'proyectores-graficos'];
  }
  if (upper.includes('TABLET LCD') || upper.includes('TABLET')) {
    return ['Optotipos', 'optotipos', 'Tablet LCD', 'tablet-lcd'];
  }
  if (upper.includes('OPTOTIPO') && upper.includes('SOPORTE')) {
    return ['Optotipos', 'optotipos', 'Optotipos con Soporte', 'optotipos-con-soporte'];
  }
  if (upper.includes('OPTOTIPO') && upper.includes('ELECTRICO')) {
    return ['Optotipos', 'optotipos', 'Optotipos Eléctricos', 'optotipos-electricos'];
  }
  if (upper.includes('OPTOTIPO')) {
    return ['Optotipos', 'optotipos', 'Optotipos Eléctricos', 'optotipos-electricos'];
  }
  if (upper.includes('CARTILLA')) {
    return ['Optotipos', 'optotipos', 'Cartillas', 'cartillas'];
  }
  if (upper.includes('MONITOR') && upper.includes('VERTICAL')) {
    return ['Monitores LCD', 'monitores-lcd', 'Monitores Verticales', 'monitores-verticales'];
  }
  if (upper.includes('MONITOR') && upper.includes('LCD')) {
    return ['Monitores LCD', 'monitores-lcd', 'Monitores Estándar', 'monitores-estandar'];
  }
  if (upper.includes('MONITOR')) {
    return ['Monitores LCD', 'monitores-lcd', 'Monitores Estándar', 'monitores-estandar'];
  }

  return ['Optotipos', 'optotipos', 'Cartillas', 'cartillas'];
};

const catalogMaps = {
  'EQUIPOS DE OFTALMOLOGIA Y OPTICA': catalog1Map,
  'EQUIPOS DE LABORATORIO': catalog2Map,
  'MOBILIARIO': catalog3Map,
  'MONITORES Y OPTOTIPOS': catalog4Map,
};

const catalogCategories = {
  'EQUIPOS DE OFTALMOLOGIA Y OPTICA': { name: 'Equipos de Oftalmología y Óptica', slug: 'equipos-oftalmologia-optica' },
  'EQUIPOS DE LABORATORIO': { name: 'Equipos de Laboratorio', slug: 'equipos-laboratorio' },
  'MOBILIARIO': { name: 'Mobiliario', slug: 'mobiliario' },
  'MONITORES Y OPTOTIPOS': { name: 'Monitores y Optotipos', slug: 'monitores-optotipos' },
};

// Process products
const products = [];
const usedSKUs = new Set();
const usedSlugs = new Set();

for (const [catalogKey, catalogProducts] of Object.entries(raw)) {
  const catalogMap = catalogMaps[catalogKey];
  if (!catalogMap) continue;

  for (const [rawRef, product] of Object.entries(catalogProducts)) {
    const cleanedRef = cleanRef(rawRef);
    const model = extractModel(cleanedRef);
    const fullName = extractName(cleanedRef);
    let sku = makeSKU(model);

    // Handle duplicate SKUs
    let skuBase = sku;
    let counter = 2;
    while (usedSKUs.has(sku)) {
      sku = skuBase + '-' + String.fromCharCode(64 + counter); // A, B, C...
      counter++;
    }
    usedSKUs.add(sku);

    const [category, category_slug, subcategory, subcategory_slug] = catalogMap(fullName, cleanedRef);
    const catInfo = catalogCategories[catalogKey];

    // Build description
    let description = product.desc || '';
    if (description) {
      description = description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      description = truncate(description);
    } else {
      // Generate a basic description from the product name
      description = fullName;
    }

    // Build slug from name
    let slug = slugify(fullName);
    if (usedSlugs.has(slug)) {
      slug = slug + '-' + sku.replace('AO-', '').toLowerCase();
    }
    usedSlugs.add(slug);

    // Build specs object
    const specs = {};
    if (product.specs) {
      if (product.specs.peso) specs.peso = product.specs.peso;
      if (product.specs.potencia) specs.potencia = product.specs.potencia;
      if (product.specs.material) specs.material = product.specs.material;
    }

    const weight = extractWeight(product.specs);

    products.push({
      sku,
      name: fullName.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      slug,
      category: catInfo.name,
      category_slug: catInfo.slug,
      subcategory,
      subcategory_slug,
      description,
      specs,
      barcode: product.barcode || '',
      reference: model,
      weight_kg: weight,
    });
  }
}

// Sort products by category, then subcategory, then name
products.sort((a, b) => {
  if (a.category_slug < b.category_slug) return -1;
  if (a.category_slug > b.category_slug) return 1;
  if (a.subcategory_slug < b.subcategory_slug) return -1;
  if (a.subcategory_slug > b.subcategory_slug) return 1;
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
});

// ============ GENERATE products.json ============
const jsonOutput = products.map(p => ({
  sku: p.sku,
  name: p.name,
  slug: p.slug,
  category: p.category,
  category_slug: p.category_slug,
  subcategory: p.subcategory,
  subcategory_slug: p.subcategory_slug,
  description: p.description,
  specs: p.specs,
  barcode: p.barcode,
  reference: p.reference,
}));

fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(jsonOutput, null, 2), 'utf8');
console.log(`products.json written with ${products.length} products`);

// ============ GENERATE seed_products.sql ============
function sqlEscape(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ') + "'";
}

function sqlEscapeJson(obj) {
  if (!obj || Object.keys(obj).length === 0) return 'NULL';
  return sqlEscape(JSON.stringify(obj));
}

let sql = `-- ============================================\n`;
sql += `-- Atlantic Optical - Product Seed Data\n`;
sql += `-- Generated from catalog data\n`;
sql += `-- ============================================\n\n`;
sql += `USE atlantic_optical;\n\n`;
sql += `-- ============================================\n`;
sql += `-- CATEGORIES\n`;
sql += `-- ============================================\n\n`;

// First, collect all unique categories and subcategories
const categoryMap = new Map(); // slug -> { name, slug, parent_slug, parent_name }
for (const p of products) {
  if (!categoryMap.has(p.category_slug)) {
    categoryMap.set(p.category_slug, { name: p.category, slug: p.category_slug, parent: null });
  }
  const subKey = `${p.category_slug}/${p.subcategory_slug}`;
  if (!categoryMap.has(subKey)) {
    categoryMap.set(subKey, { name: p.subcategory, slug: p.subcategory_slug, parent: p.category_slug });
  }
}

// Insert categories SQL
sql += `-- Main categories\n`;
sql += `INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES\n`;
const mainCats = [...categoryMap.values()].filter(c => !c.parent);
const subCats = [...categoryMap.values()].filter(c => c.parent);

const mainCatValues = mainCats.map((c, i) =>
  `  (${sqlEscape(c.name)}, ${sqlEscape(c.slug)}, NULL, ${i + 1}, 1)`
).join(',\n');
sql += mainCatValues + ';\n\n';

sql += `-- Subcategories\n`;
sql += `INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES\n`;
const subCatValues = subCats.map((c, i) =>
  `  (${sqlEscape(c.name)}, ${sqlEscape(c.slug)}, (SELECT id FROM categories WHERE slug = ${sqlEscape(c.parent)} AND parent_id IS NULL), ${i + 1}, 1)`
).join(',\n');
sql += subCatValues + ';\n\n';

// Products SQL
sql += `-- ============================================\n`;
sql += `-- PRODUCTS\n`;
sql += `-- ============================================\n\n`;

// Insert in batches of 10 for readability
const batchSize = 10;
for (let i = 0; i < products.length; i += batchSize) {
  const batch = products.slice(i, i + batchSize);
  sql += `INSERT INTO products (name, slug, sku, description, short_description, weight_kg, category_id, status, is_featured, is_new) VALUES\n`;

  const values = batch.map(p => {
    const catSubSlug = p.subcategory_slug;
    const shortDesc = truncate(p.description, 200);
    return `  (${sqlEscape(p.name)}, ${sqlEscape(p.slug)}, ${sqlEscape(p.sku)}, ${sqlEscape(p.description)}, ${sqlEscape(shortDesc)}, ${p.weight_kg || 0}, (SELECT id FROM categories WHERE slug = ${sqlEscape(catSubSlug)}), 'published', 0, 0)`;
  }).join(',\n');

  sql += values + ';\n\n';
}

// Barcode inserts (as product_images placeholder or separate)
sql += `-- ============================================\n`;
sql += `-- PRODUCT BARCODES (stored in product metadata)\n`;
sql += `-- ============================================\n\n`;
sql += `-- Barcodes can be retrieved from products via SKU reference\n`;
sql += `-- Each product's barcode from original catalog:\n\n`;

for (const p of products) {
  if (p.barcode) {
    sql += `-- ${p.sku}: barcode ${p.barcode}\n`;
  }
}

fs.writeFileSync(path.join(__dirname, 'seed_products.sql'), sql, 'utf8');
console.log(`seed_products.sql written`);

// Summary
console.log(`\n=== SUMMARY ===`);
console.log(`Total products: ${products.length}`);

const catCounts = {};
for (const p of products) {
  const key = p.category;
  catCounts[key] = (catCounts[key] || 0) + 1;
}
console.log(`\nBy category:`);
for (const [cat, count] of Object.entries(catCounts)) {
  console.log(`  ${cat}: ${count}`);
}

const subCounts = {};
for (const p of products) {
  const key = `${p.category} > ${p.subcategory}`;
  subCounts[key] = (subCounts[key] || 0) + 1;
}
console.log(`\nBy subcategory:`);
for (const [sub, count] of Object.entries(subCounts)) {
  console.log(`  ${sub}: ${count}`);
}

// Issues
const issues = [];
const noBarcode = products.filter(p => !p.barcode);
if (noBarcode.length) issues.push(`${noBarcode.length} products have no barcode`);
const noDesc = products.filter(p => !p.description || p.description.length < 10);
if (noDesc.length) issues.push(`${noDesc.length} products have no/short description`);
const noWeight = products.filter(p => !p.weight_kg);
if (noWeight.length) issues.push(`${noWeight.length} products have no weight extracted`);

if (issues.length) {
  console.log(`\nIssues:`);
  issues.forEach(i => console.log(`  - ${i}`));
}
