// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.
export default function Contacto() {
  return (
    <section id="contacto" className="contact-section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-text reveal">
            <p className="eyebrow" style={{ color: "#d4a843" }}>
              Estamos aquí para ti
            </p>
            <h2>
              ¿Lista para
              <br />
              hacer tu pedido?
            </h2>
            <p>
              Escríbenos por WhatsApp y te ayudamos a elegir el arreglo perfecto. Respondemos en minutos.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                📍 Sangolquí, Ecuador
              </div>
              <div className="contact-item">
                ⏰ Lunes a Sábado · 9am – 7pm
              </div>
              <div className="contact-item">
                🚚 Envíos a Sangolquí y Quito
              </div>
            </div>
          </div>
          <div className="contact-form reveal">
            <h3>
              ¿Qué necesitas?
            </h3>
            <div className="order-options">
              <button className="order-opt" data-click="sendOrder" data-args={"[\"un arreglo de flores\"]"}>
                🌸 Arreglo de Flores
              </button>
              {" "}
              <button className="order-opt" data-click="sendOrder" data-args={"[\"un vino\"]"}>
                🍷 Vinos
              </button>
              {" "}
              <button className="order-opt" data-click="sendOrder" data-args={"[\"una muñeca decorada\"]"}>
                🎀 Muñecas
              </button>
              {" "}
              <button className="order-opt" data-click="sendOrder" data-args={"[\"un detalle sorpresa\"]"}>
                🎁 Detalles Sorpresa
              </button>
              {" "}
              <button className="order-opt" data-click="sendOrder" data-args={"[\"flores con chocolate\"]"}>
                🍫 Flores con Chocolate
              </button>
              {" "}
              <button className="order-opt" data-click="sendOrder" data-args={"[\"información de precios y disponibilidad\"]"}>
                💬 Solo consultar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
