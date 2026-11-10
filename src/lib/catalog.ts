import { createClient } from '@supabase/supabase-js';
import snapshot from '@/data/catalog.snapshot.json';

export type CatalogProduct = {
  position: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  priceFrom: boolean;
  badge: { label: string; type: string } | null;
  categorySlug: string;
  images: { url: string; alt: string }[];
};

// Clave "heredada" que usan los filtros y los mensajes de WhatsApp (data-cat / data-filter).
const LEGACY_CATEGORY_KEY: Record<string, string> = {
  'arreglos-de-flores': 'arreglos',
  vinos: 'vinos',
  munecas: 'munecas',
  'detalles-sorpresa': 'sorpresa',
  'flores-con-chocolate': 'chocolate',
};
export const legacyCategoryKey = (slug: string) => LEGACY_CATEGORY_KEY[slug] ?? slug;

type Row = {
  slug: string;
  name: string;
  description: string | null;
  price: number | string;
  price_from: boolean;
  badge: string | null;
  badge_type: string | null;
  position: number;
  categories: { slug: string } | { slug: string }[] | null;
  product_images: { url: string; alt: string | null; position: number }[] | null;
};

function toProduct(r: Row): CatalogProduct | null {
  const cat = Array.isArray(r.categories) ? r.categories[0] : r.categories;
  const images = [...(r.product_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((i) => ({ url: i.url, alt: i.alt ?? '' }));
  if (!cat || images.length === 0) return null; // producto incompleto: no se muestra
  return {
    position: r.position,
    slug: r.slug,
    name: r.name,
    description: r.description ?? '',
    price: Number(r.price),
    priceFrom: r.price_from,
    badge: r.badge ? { label: r.badge, type: r.badge_type ?? '' } : null,
    categorySlug: cat.slug,
    images,
  };
}

/**
 * Catálogo desde Supabase (productos activos, vía RLS con la clave pública).
 * Si Supabase no responde o devuelve 0 productos, se usa el respaldo (snapshot del sitio original)
 * para que la tienda nunca quede vacía. El origen queda registrado en los logs del build.
 */
export async function getCatalog(): Promise<{ products: CatalogProduct[]; source: 'supabase' | 'snapshot' }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    try {
      const sb = createClient(url, key, { auth: { persistSession: false } });
      const { data, error } = await sb
        .from('products')
        .select('slug,name,description,price,price_from,badge,badge_type,position,categories(slug),product_images(url,alt,position)')
        .order('position', { ascending: true });
      if (error) throw error;
      const products = ((data ?? []) as unknown as Row[]).map(toProduct).filter((p): p is CatalogProduct => p !== null);
      if (products.length > 0) {
        console.log(`[catalog] ${products.length} productos desde Supabase`);
        return { products, source: 'supabase' };
      }
      console.warn('[catalog] Supabase devolvió 0 productos; usando respaldo');
    } catch (e) {
      console.warn('[catalog] Supabase no disponible; usando respaldo:', e instanceof Error ? e.message : e);
    }
  } else {
    console.warn('[catalog] Faltan variables NEXT_PUBLIC_SUPABASE_*; usando respaldo');
  }
  return { products: snapshot.products as CatalogProduct[], source: 'snapshot' };
}
