// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.
export default function Navbar() {
  return (
    <nav id="navbar">
      <div className="nav-inner">
        <a href="#inicio" className="nav-logo">
          Detalles
          {" "}
          <span>
            Creativos
          </span>
        </a>
        {" "}
        <button className="hamburger" id="hamburger" aria-label="Menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className="nav-links" id="navLinks">
          <li>
            <a href="#inicio" className="nav-link">
              Inicio
            </a>
          </li>
          <li>
            <a href="#como-funciona" className="nav-link">
              ¿Cómo funciona?
            </a>
          </li>
          <li>
            <a href="#productos" className="nav-link">
              Productos
            </a>
          </li>
          <li>
            <a href="#carta-digital" className="nav-link">
              Carta Digital ✨
            </a>
          </li>
          <li>
            <a href="#testimonios" className="nav-link">
              Reseñas
            </a>
          </li>
          <li>
            <a href="#contacto" className="nav-link nav-cta">
              Hacer pedido
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
