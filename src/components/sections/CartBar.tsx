// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.
export default function CartBar() {
  return (
    <div id="cartBar" className="cart-bar hidden">
      <div className="cart-bar-inner">
        <span className="cart-icon">
          🛒
        </span>
        {" "}
        <span id="cartSummary">
          0 productos
        </span>
        {" "}
        <button className="cart-checkout" id="cartCheckout">
          Pedir por WhatsApp →
        </button>
        {" "}
        <button className="cart-clear" id="cartClear">
          ✕
        </button>
      </div>
    </div>
  );
}
