# Etapa 1 — Base de Next.js (Detalles Creativos)

Rama de trabajo: `nextjs-migration`. La versión original queda en el tag `v1-estatica`.

## Qué incluye
- Next.js 16 (App Router) + React 19, dentro del mismo repositorio.
- `src/app/globals.css` = tu `styles.css` **sin modificar** (copia byte a byte).
- Cada sección del `index.html` convertida a componente (`src/components/sections/*`) con el **mismo marcado y clases**.
  Las generó `tools/html2jsx.py` a partir de tu HTML (se puede volver a ejecutar).
- Catálogo leído de Supabase (`src/lib/catalog.ts`), con respaldo (`src/data/catalog.snapshot.json`) si Supabase no responde.
- Comportamiento original (animaciones, filtros, carrito, galerías, lightbox, carta digital) en `src/lib/site-behavior.ts`.
- Reseñas migradas de Firebase a Supabase. Firebase ya no se carga.
- Metadatos SEO conservados (título, descripción, Open Graph, Twitter, verificación de Google, robots).

## Cómo aplicarlo (PowerShell, un comando a la vez)
1. Descomprime este ZIP **encima** de la carpeta del repo (`mi-tienda-online-repo`), aceptando que combine archivos.
2. En la carpeta del repo:
```
git checkout nextjs-migration
mkdir legacy
git mv index.html legacy/index.html
git mv css legacy/css
git mv js legacy/js
git rm sitemap.xml
npm install
npm run build
```
(`sitemap.xml` ahora vive en `public/sitemap.xml`, así que se sigue sirviendo en `/sitemap.xml`.)
3. Para ver el sitio en tu computador: copia `.env.example` a `.env.local`, pon tu URL y tu clave publicable de Supabase, y ejecuta `npm run dev` (abre http://localhost:3000).
4. Sube los cambios:
```
git add -A
git commit -m "Etapa 1: base Next.js con catalogo desde Supabase"
git push
```

## Antes de subir: Vercel
- **Settings > Environment Variables** (Production **y** Preview):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://qnzlevcohuiizqkcizzz.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = tu clave `sb_publishable_...`
  Sin estas variables el sitio igual funciona, pero con el catálogo de respaldo y sin reseñas.
- **Settings > Build and Deployment**: *Framework Preset* = **Next.js**. Deja vacíos *Build Command*, *Output Directory* e *Install Command* (si tienen valores personalizados, bórralos).
- El push a `nextjs-migration` crea una URL de vista previa; la de producción (rama `main`) no cambia.
- No pongas nunca la secret key ni la contraseña de la base de datos en estas variables.

## Cómo comprobar el catálogo
En el registro de despliegue (Build Logs) debe aparecer `[catalog] 34 productos desde Supabase`.
Si dice `usando respaldo`, revisa las variables de entorno.
