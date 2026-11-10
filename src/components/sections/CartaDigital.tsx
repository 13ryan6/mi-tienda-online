// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.
export default function CartaDigital() {
  return (
    <section id="carta-digital" className="carta-section">
      <div className="container">
        <div className="carta-grid">
          <div className="carta-text reveal">
            <p className="eyebrow" style={{ color: "#d4a843" }}>
              Exclusivo · Solo en Detalles Creativos
            </p>
            <h2>
              Carta Digital
              <br />
              Personalizada 💌
            </h2>
            <p className="carta-desc">
              El detalle que ninguna otra florería ofrece. Una carta animada con el nombre y mensaje de tu elección, que se comparte por WhatsApp como un link.
            </p>
            <div className="carta-planes">
              <div className="carta-plan selectable active" data-tipo="basico" data-click="seleccionarTipo" data-args={"[\"$el\"]"}>
                <div className="plan-icon">
                  🌸
                </div>
                <div className="plan-info">
                  <strong>
                    Básico
                  </strong>
                  <span>
                    Nombre + mensaje prediseñado
                  </span>
                </div>
              </div>
              <div className="carta-plan selectable featured" data-tipo="personalizado" data-click="seleccionarTipo" data-args={"[\"$el\"]"}>
                <div className="plan-icon">
                  💌
                </div>
                <div className="plan-info">
                  <strong>
                    Personalizado ⭐
                  </strong>
                  <span>
                    Nombre + tu mensaje propio
                  </span>
                </div>
              </div>
              <div className="carta-plan selectable" data-tipo="premium" data-click="seleccionarTipo" data-args={"[\"$el\"]"}>
                <div className="plan-icon">
                  ✨
                </div>
                <div className="plan-info">
                  <strong>
                    Premium
                  </strong>
                  <span>
                    Nombre + mensaje + foto
                  </span>
                </div>
              </div>
            </div>
            <div className="carta-inputs" id="cartaInputs">
              <div className="input-grupo" id="inputGrupoBasico">
                <input type="text" id="cartaNombreBasico" className="carta-input" placeholder="Nombre del destinatario 🌸" maxLength={40} />
              </div>
              <div className="input-grupo hidden" id="inputGrupoPersonalizado">
                <input type="text" id="cartaNombrePersonalizado" className="carta-input" placeholder="Nombre del destinatario 🌸" maxLength={40} />
                {" "}
                <textarea id="cartaMensajePersonalizado" className="carta-input carta-textarea" placeholder="Escribe tu mensaje aquí... 💌" maxLength={200} rows={3}></textarea>
              </div>
              <div className="input-grupo hidden" id="inputGrupoPremium">
                <input type="text" id="cartaNombrePremium" className="carta-input" placeholder="Nombre del destinatario 🌸" maxLength={40} />
                {" "}
                <textarea id="cartaMensajePremium" className="carta-input carta-textarea" placeholder="Escribe tu mensaje especial... ✨" maxLength={200} rows={3}></textarea>
                {" "}
                <label className="carta-file-label" htmlFor="cartaFotoPremium">
                  <span id="cartaFotoLabel">
                    📷 Subir foto del arreglo (opcional)
                  </span>
                  {" "}
                  <input type="file" id="cartaFotoPremium" accept="image/*" data-change="actualizarLabelFoto" data-args={"[\"$el\"]"} />
                </label>
              </div>
              <button className="btn-demo-preview" data-click="playDemo">
                Ver previsualización 💌
              </button>
            </div>
            <a href="https://wa.me/593984140488?text=Hola!%20Quiero%20una%20carta%20digital%20personalizada%20💌" className="btn-primary" target="_blank">
              Quiero una carta digital
            </a>
          </div>
          <div className="carta-demo reveal">
            <div className="demo-phone">
              <div className="demo-screen">
                <div className="demo-envelope" id="demoEnv" data-click="playDemo">
                  <div className="demo-env-body">
                    <div className="demo-env-flap" id="demoFlap"></div>
                    <div className="demo-env-card" id="demoCard">
                      <div className="demo-card-peek"></div>
                    </div>
                    <div className="demo-env-seal" id="demoSeal">
                      💌
                    </div>
                  </div>
                  <p className="demo-label">
                    Toca para ver la magia ✨
                  </p>
                </div>
                <div className="demo-message hidden" id="demoMsg">
                  <div className="demo-msg-inner">
                    <p className="demo-msg-eyebrow">
                      Con todo mi amor
                    </p>
                    <h4 className="demo-msg-title">
                      Para ti, amor mío 🌸
                    </h4>
                    <div className="demo-msg-foto hidden" id="demoMsgFoto">
                      <img loading="lazy" id="demoMsgFotoImg" alt="Foto del arreglo" />
                    </div>
                    <p className="demo-msg-body">
                      Porque cada día contigo
                      <br />
                      es el más bonito de mi vida.
                      <br />
                      <em>
                        Te amo infinito.
                      </em>
                    </p>
                    <p className="demo-msg-sign">
                      Tu persona favorita 💕
                    </p>
                  </div>
                  <button className="demo-replay" data-click="resetDemo">
                    ↩ Ver de nuevo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
