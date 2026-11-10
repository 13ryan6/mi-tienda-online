// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.
export default function ProductsSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="productos" className="products-section">
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">
            Nuestros productos
          </p>
          <h2>
            Catálogo
          </h2>
        </div>
        <div className="filters reveal">
          <button className="filter-btn active" data-filter="all">
            Todos
          </button>
          {" "}
          <button className="filter-btn" data-filter="arreglos">
            🌸 Arreglos de Flores
          </button>
          {" "}
          <button className="filter-btn" data-filter="vinos">
            🍷 Vinos
          </button>
          {" "}
          <button className="filter-btn" data-filter="munecas">
            🎀 Muñecas
          </button>
          {" "}
          <button className="filter-btn" data-filter="sorpresa">
            🎁 Detalles Sorpresa
          </button>
          {" "}
          <button className="filter-btn" data-filter="chocolate">
            🍫 Flores con Chocolate
          </button>
        </div>
        <div className="product-grid" id="productGrid">
          {children}
        </div>
      </div>
    </section>
  );
}
