
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Vite dispara este evento cuando falla el import() de un chunk de ruta —
  // típicamente porque la pestaña quedó abierta desde antes del último
  // deploy y ese chunk (con el hash del build viejo) ya no existe. Sin esto,
  // la navegación se queda en blanco y solo un F5 manual la arregla.
  window.addEventListener("vite:preloadError", () => {
    window.location.reload();
  });

  createRoot(document.getElementById("root")!).render(<App />);
