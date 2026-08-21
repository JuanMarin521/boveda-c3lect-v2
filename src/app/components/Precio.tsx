import { usePrecioEfectivo } from "../context/PromocionesContext";
import { formatPrecio } from "../lib/format";
import { PriceTag } from "./ds/PriceTag";
import type { Producto } from "../data/types";

// Precio de tarjeta de catálogo (Catalog, SearchResults, Home) — precio
// tachado + precio final + badge "-X%" cuando el producto tiene una
// promoción vigente, o solo el precio normal si no.
export function Precio({ producto, className }: { producto: Producto; className?: string }) {
  const { precioOriginal, precioFinal, descuentoPorcentaje, enPromocion } = usePrecioEfectivo(producto);

  if (!enPromocion) {
    return (
      <p className={className} style={{ fontFamily: "var(--font-serif)", color: "#C9A84C" }}>
        {formatPrecio(precioFinal)}
      </p>
    );
  }

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-xs md:text-sm text-white/35 line-through shrink-0">
        {formatPrecio(precioOriginal)}
      </span>
      <p className={className} style={{ fontFamily: "var(--font-serif)", color: "#C9A84C" }}>
        {formatPrecio(precioFinal)}
      </p>
      <span
        className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 shrink-0"
        style={{ backgroundColor: "#C9A84C", color: "#000" }}
      >
        -{descuentoPorcentaje}%
      </span>
    </div>
  );
}

// Precio de ficha de producto (ProductDetail) — wrapper de PriceTag que
// agrega tachado + badge cuando aplica una promoción.
export function PrecioTag({
  producto,
  size = "lg",
  note,
}: {
  producto: Producto;
  size?: "md" | "lg";
  note?: string;
}) {
  const { precioOriginal, precioFinal, descuentoPorcentaje, enPromocion } = usePrecioEfectivo(producto);
  return (
    <PriceTag
      value={formatPrecio(precioFinal)}
      size={size}
      note={note}
      apagado={!producto.disponible}
      originalValue={enPromocion ? formatPrecio(precioOriginal) : undefined}
      descuentoPorcentaje={enPromocion ? descuentoPorcentaje : undefined}
    />
  );
}
