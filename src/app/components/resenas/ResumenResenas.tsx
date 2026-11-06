import { etiquetaCantidad, type ResumenResenas as Resumen } from "../../lib/resenas";
import { Estrellas } from "./Estrellas";

/** Promedio grande + barras de distribución por estrellas. */
export function ResumenResenas({ resumen }: { resumen: Resumen }) {
  return (
    <div>
      <div className="flex items-end gap-5 mb-8">
        <p
          className="text-white leading-none"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 72 }}
        >
          {resumen.promedio.toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </p>
        <div className="pb-2">
          <Estrellas valor={resumen.promedio} size={16} />
          <p className="mt-2 text-[10px] uppercase text-white/40" style={{ letterSpacing: "0.2em" }}>
            {etiquetaCantidad(resumen.total)}
          </p>
        </div>
      </div>

      <ul className="space-y-2.5" aria-label="Distribución de calificaciones">
        {resumen.distribucion.map(({ estrellas, cantidad }) => {
          const pct = resumen.total ? (cantidad / resumen.total) * 100 : 0;
          return (
            <li key={estrellas} className="flex items-center gap-4 text-[11px] text-white/50">
              <span className="w-3 text-right">{estrellas}</span>
              <span className="relative flex-1 h-px bg-white/12" aria-hidden="true">
                <span
                  className="absolute left-0 -top-px h-[3px] bg-[#C9A84C] transition-[width] duration-700"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="w-6 text-right tabular-nums">{cantidad}</span>
              <span className="sr-only">{`${cantidad} con ${estrellas} estrellas`}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
