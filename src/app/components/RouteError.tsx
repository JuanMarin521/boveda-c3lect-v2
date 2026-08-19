import { useRouteError } from "react-router";

export function RouteError() {
  const error = useRouteError();
  console.error("Error de navegación no capturado:", error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <div className="text-center max-w-md">
        <p
          className="text-2xl mb-4 tracking-wide text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Algo salió mal
        </p>
        <p className="text-white/50 text-sm mb-8">
          Ocurrió un error inesperado cargando esta página. Intenta recargar — si el problema
          persiste, contáctanos.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 text-sm uppercase tracking-widest text-white transition-colors"
          style={{ backgroundColor: "#C9A84C" }}
        >
          Recargar página
        </button>
      </div>
    </div>
  );
}
