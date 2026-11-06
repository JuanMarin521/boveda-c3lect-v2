import { useState } from "react";
import { Star } from "lucide-react";

const DORADO = "#C9A84C";
const VACIA = "rgba(255,255,255,0.18)";

/**
 * Calificación de solo lectura. Acepta decimales (promedios): las estrellas
 * doradas se recortan sobre las vacías según el porcentaje exacto.
 */
export function Estrellas({ valor, size = 14 }: { valor: number; size?: number }) {
  const porcentaje = Math.max(0, Math.min(100, (valor / 5) * 100));
  const fila = (color: string, relleno: boolean) => (
    <span className="flex" style={{ gap: size * 0.2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.25}
          color={color}
          fill={relleno ? color : "none"}
          aria-hidden="true"
        />
      ))}
    </span>
  );

  return (
    <span
      className="relative inline-flex shrink-0"
      role="img"
      aria-label={`${valor.toLocaleString("es-CO")} de 5 estrellas`}
    >
      {fila(VACIA, false)}
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${porcentaje}%` }}>
        {fila(DORADO, true)}
      </span>
    </span>
  );
}

const ETIQUETAS = ["Decepcionante", "Regular", "Buena", "Muy buena", "Excepcional"];

/** Selector de 1 a 5 estrellas. Son radios nativos: teclado y lector de pantalla incluidos. */
export function SelectorEstrellas({
  valor,
  onChange,
}: {
  valor: number;
  onChange: (valor: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const mostrado = hover || valor;

  return (
    <fieldset>
      <legend className="block text-[10px] uppercase text-white/40 mb-3" style={{ letterSpacing: "0.2em" }}>
        Tu calificación
      </legend>
      <div className="flex items-center gap-5">
        <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer p-0.5 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-[#C9A84C]"
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name="calificacion"
                value={n}
                checked={valor === n}
                onChange={() => onChange(n)}
                className="sr-only"
                required
              />
              <span className="sr-only">{`${n} de 5 — ${ETIQUETAS[n - 1]}`}</span>
              <Star
                size={26}
                strokeWidth={1.25}
                color={n <= mostrado ? DORADO : VACIA}
                fill={n <= mostrado ? DORADO : "none"}
                className="transition-colors duration-200"
                aria-hidden="true"
              />
            </label>
          ))}
        </div>
        <span
          className="text-[11px] uppercase text-[#C9A84C] min-w-[8rem]"
          style={{ letterSpacing: "0.2em" }}
          aria-hidden="true"
        >
          {mostrado ? ETIQUETAS[mostrado - 1] : ""}
        </span>
      </div>
    </fieldset>
  );
}
