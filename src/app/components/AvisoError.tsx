import { AlertTriangle } from "lucide-react";

export function AvisoError({
  titulo = "No pudimos cargar el catálogo",
  detalle = "Puede ser un problema temporal de conexión — inténtalo de nuevo en un momento.",
  onRetry,
}: {
  titulo?: string;
  detalle?: string;
  onRetry: () => void;
}) {
  return (
    <div className="text-center py-20">
      <AlertTriangle size={28} className="mx-auto mb-4" style={{ color: "#C9A84C" }} aria-hidden="true" />
      <p className="text-white/70 mb-2">{titulo}</p>
      <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">{detalle}</p>
      <button
        onClick={onRetry}
        className="text-sm uppercase tracking-widest underline underline-offset-4 text-white/60 hover:text-white transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
