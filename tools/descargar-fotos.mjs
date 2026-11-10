// Descarga TODAS las fotos del catálogo desde ImgBB a tu computador, para subirlas a Supabase Storage.
// Uso (en la carpeta del repo):   node tools/descargar-fotos.mjs
// - Guarda cada foto como  fotos-originales/<slug-del-producto>-<n>.jpg  (nombres únicos).
// - Reintenta con espera cuando ImgBB responde 503; las ya descargadas se omiten, así que puedes
//   volver a ejecutarlo más tarde hasta completar las 51.
// - No usa ninguna clave ni contraseña.
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const SNAPSHOT = process.argv[2] ?? 'src/data/catalog.snapshot.json';
const OUT = process.argv[3] ?? 'fotos-originales';
const MAX_TRIES = 6;
const ESPERA = Number(process.env.ESPERA_MS ?? 2000); // espera base entre reintentos
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (f) => access(f).then(() => true, () => false);

const { products } = JSON.parse(await readFile(SNAPSHOT, 'utf8'));
await mkdir(OUT, { recursive: true });

let ok = 0, skipped = 0;
const failed = [];
const total = products.reduce((n, p) => n + p.images.length, 0);

for (const p of products) {
  for (let i = 0; i < p.images.length; i++) {
    const file = `${p.slug}-${i + 1}.jpg`;
    const dest = path.join(OUT, file);
    if (await exists(dest)) { skipped++; continue; }
    let done = false, lastErr = '';
    for (let t = 1; t <= MAX_TRIES && !done; t++) {
      try {
        const res = await fetch(p.images[i].url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const type = res.headers.get('content-type') || '';
        if (!type.startsWith('image/')) throw new Error(`no es una imagen (${type})`);
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
        ok++; done = true;
        console.log(`✔ ${file}`);
      } catch (e) {
        lastErr = e.message;
        if (t < MAX_TRIES) await sleep(ESPERA * t);
      }
    }
    if (!done) { failed.push(`${file}  (${lastErr})  ${p.images[i].url}`); console.log(`✘ ${file}  (${lastErr})`); }
    await sleep(Math.min(500, ESPERA)); // pausa corta para no saturar el servicio
  }
}

console.log(`\nTotal: ${total} | descargadas ahora: ${ok} | ya existentes: ${skipped} | pendientes: ${failed.length}`);
if (failed.length) {
  console.log('\nPendientes (vuelve a ejecutar el comando más tarde):');
  failed.forEach((f) => console.log(' - ' + f));
  process.exitCode = 1;
} else {
  console.log(`\nListo. Sube la carpeta "${OUT}" a Supabase > Storage > products.`);
}