
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initMetaPixel } from "./app/lib/metaPixel";

  // Vite dispara este evento cuando falla el import() de un chunk de ruta —
  // típicamente porque la pestaña quedó abierta desde antes del último
  // deploy y ese chunk (con el hash del build viejo) ya no existe. Sin esto,
  // la navegación se queda en blanco y solo un F5 manual la arregla.
  window.addEventListener("vite:preloadError", () => {
    window.location.reload();
  });

  // Va aquí y no dentro de App: así el PageView de la carga inicial sale lo
  // antes posible, sin esperar al primer render de React. Si
  // VITE_META_PIXEL_ID no está definido, la función no hace nada.
  initMetaPixel();

  createRoot(document.getElementById("root")!).render(<App />);
