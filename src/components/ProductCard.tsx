import type { CatalogProduct } from '@/lib/catalog';
import { legacyCategoryKey } from '@/lib/catalog';

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

// Mismo marcado y clases que la tarjeta del index.html original.
// Las interacciones (galería, "Pedir ahora", "+ Consultar") las maneja SiteBehavior por delegación (data-click).
export default function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  // Heredado: en el HTML original solo las primeras 30 tarjetas tenían la animación "reveal".
  const reveal = product.position <= 30 ? ' reveal' : '';
  return (
    <div className={`product-card${reveal}`} data-cat={legacyCategoryKey(product.categorySlug)}>
      <div className="product-img-wrap">
        {product.badge && (
          <span className={`product-badge badge-${product.badge.type}`}>{product.badge.label}</span>
        )}
        <div className="gallery" data-index="0">
          {product.images.map((img, i) => (
            <img
              key={img.url}
              loading={index === 0 && i === 0 ? undefined : 'lazy'}
              src={img.url}
              alt={img.alt}
              className={`gallery-img${i === 0 ? ' active' : ''}`}
            />
          ))}
          <button className="gal-prev" data-click="slideGallery" data-args={'["$el", -1]'}>‹</button>
          <button className="gal-next" data-click="slideGallery" data-args={'["$el", 1]'}>›</button>
          <div className="gal-dots"></div>
        </div>
        <button className="product-quick" data-click="orderProduct" data-args={'["$el"]'}>Pedir ahora</button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{product.priceFrom ? `Desde $${fmt(product.price)}` : `$${fmt(product.price)}`}</span>
          <button className="add-cart" data-click="addToCart" data-args={'["$el", 0]'}>+ Consultar</button>
        </div>
      </div>
    </div>
  );
}
