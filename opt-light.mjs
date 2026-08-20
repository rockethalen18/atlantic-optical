import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, extname } from 'path';

const MAX = 1600;
const Q = 85;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(f));
    else if (/\.(jpg|jpeg|png)$/i.test(e.name)) out.push(f);
  }
  return out;
}

async function opt(f) {
  const b = (await stat(f)).size;
  const ext = extname(f).toLowerCase();
  try {
    const meta = await sharp(f).metadata();
    let s = sharp(f);
    if (meta.width > MAX) s = s.resize({ width: MAX, withoutEnlargement: true });
    const tmp = f + '.opt';
    if (ext === '.png') await s.png({ compressionLevel: 6 }).toFile(tmp);
    else await s.jpeg({ quality: Q, mozjpeg: true }).toFile(tmp);
    const a = (await stat(tmp)).size;
    if (a < b * 0.95) { await unlink(f); await rename(tmp, f); return b - a; }
    await unlink(tmp);
  } catch(_) { try { await unlink(f + '.opt') } catch(_) {} }
  return null;
}

const files = await walk('public/images/extracted_images');
let saved = 0, done = 0;
for (const f of files) {
  const s = await opt(f);
  if (s) { saved += s; done++; }
  if (done % 50 === 0 && done > 0) console.log(`  ${done}/${files.length}`);
}
console.log(`Optimized ${done}/${files.length} files, saved ${(saved/1024/1024).toFixed(1)}MB`);
const total = (await stat('public/images/extracted_images')).size || 0;
