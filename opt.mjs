import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, extname } from 'path';

const MAX = 1200;
const Q = 72;

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
  if (b < 5000) return null;
  const ext = extname(f).toLowerCase();
  try {
    let s = sharp(f);
    const m = await s.metadata();
    if (m.width > MAX) s = s.resize({ width: MAX, withoutEnlargement: true });
    const tmp = f + '.opt';
    if (ext === '.png') await s.png({ compressionLevel: 9 }).toFile(tmp);
    else await s.jpeg({ quality: Q, mozjpeg: true }).toFile(tmp);
    const a = (await stat(tmp)).size;
    if (a < b) { await unlink(f); await rename(tmp, f); return b - a; }
    await unlink(tmp);
  } catch(_) { try { await unlink(f + '.opt') } catch(_) {} }
  return null;
}

const dirs = ['public/images/extracted_images', 'public/images/hero', 'public/images'];
let total = 0, saved = 0;
for (const d of dirs) {
  const files = await walk(d);
  for (const f of files) {
    const s = await opt(f);
    if (s) { saved += s; total++; }
  }
}
console.log(`Optimized ${total} files, saved ${(saved/1024/1024).toFixed(1)}MB`);
