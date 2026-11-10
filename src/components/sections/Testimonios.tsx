// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.
export default function Testimonios() {
  return (
    <section id="testimonios" className="testimonios-section">
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">
            Lo que dicen nuestros clientes
          </p>
          <h2>
            Reseñas
          </h2>
        </div>
        <div className="testimonios-grid" id="testimoniosGrid">
          <div className="review-card static-review">
            <div className="review-stars">
              ★★★★★
            </div>
            <p className="review-text">
              "Pedí un arreglo para el cumpleaños de mi mamá y quedó hermoso. Lo entregaron súper rápido y ella lloró de la emoción. 100% recomendado."
            </p>
            <p className="review-author">
              — María G., Sangolquí
            </p>
          </div>
          <div className="review-card static-review">
            <div className="review-stars">
              ★★★★★
            </div>
            <p className="review-text">
              "La carta digital fue lo que más le gustó a mi novia. Nunca había visto algo así. Definitivamente vuelvo a comprar para San Valentín."
            </p>
            <p className="review-author">
              — Andrés P., Quito
            </p>
          </div>
          <div className="review-card static-review">
            <div className="review-stars">
              ★★★★★
            </div>
            <p className="review-text">
              "Flores eternas de verdad — ya van 6 meses y siguen perfectas. El empaque llegó impecable y el precio es muy justo para la calidad."
            </p>
            <p className="review-author">
              — Valeria T., Sangolquí
            </p>
          </div>
          <div className="no-reviews">
            Cargando reseñas... 🌸
          </div>
        </div>
        <div className="review-form-wrap reveal">
          <div className="review-form">
            <h3>
              ¿Ya compraste con nosotros? 🌸
            </h3>
            <p>
              Cuéntanos tu experiencia y ayuda a otros clientes
            </p>
            <div className="review-fields">
              <input type="text" id="reviewName" placeholder="Tu nombre" maxLength={40} />
              <div className="star-selector">
                <span>
                  Tu calificación:
                </span>
                <div className="stars-input">
                  <button className="star-btn" data-stars="1">
                    ★
                  </button>
                  {" "}
                  <button className="star-btn" data-stars="2">
                    ★
                  </button>
                  {" "}
                  <button className="star-btn" data-stars="3">
                    ★
                  </button>
                  {" "}
                  <button className="star-btn" data-stars="4">
                    ★
                  </button>
                  {" "}
                  <button className="star-btn" data-stars="5">
                    ★
                  </button>
                </div>
              </div>
              <textarea id="reviewMessage" placeholder="¿Cómo fue tu experiencia? ¿Qué compraste?" rows={3} maxLength={300}></textarea>
              <div id="reviewError" className="review-error" style={{ display: "none" }}></div>
              <button className="btn-primary" id="submitReview" data-click="submitReview">
                Publicar reseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
