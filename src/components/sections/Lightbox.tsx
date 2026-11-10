// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.
export default function Lightbox() {
  return (
    <div id="lightbox">
      <button id="lightbox-close" data-click="lbClose">
        ✕
      </button>
      {" "}
      <button id="lightbox-prev" data-click="lbNav" data-args={"[-1]"}>
        ‹
      </button>
      {" "}
      <img loading="lazy" id="lightbox-img" alt="Foto producto" />
      {" "}
      <button id="lightbox-next" data-click="lbNav" data-args={"[1]"}>
        ›
      </button>
      <div id="lightbox-counter"></div>
    </div>
  );
}
