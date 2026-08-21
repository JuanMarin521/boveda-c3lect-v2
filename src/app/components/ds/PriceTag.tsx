const SIZES = {
  md: "text-2xl md:text-3xl",
  lg: "text-4xl md:text-5xl",
};

export function PriceTag({
  value,
  size = "md",
  note,
  apagado,
  originalValue,
  descuentoPorcentaje,
}: {
  value: string;
  size?: "md" | "lg";
  note?: string;
  /** Precio del último lote de un producto agotado — blanco apagado en vez de dorado */
  apagado?: boolean;
  /** Precio antes del descuento — se muestra tachado cuando hay promoción vigente */
  originalValue?: string;
  /** % de descuento aplicado — muestra el badge "-X%" junto al precio */
  descuentoPorcentaje?: number;
}) {
  return (
    <div>
      {originalValue && (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm md:text-base text-white/35 line-through">{originalValue}</span>
          {descuentoPorcentaje != null && (
            <span
              className="text-[10px] uppercase tracking-widest px-1.5 py-0.5"
              style={{ backgroundColor: "#C9A84C", color: "#000" }}
            >
              -{descuentoPorcentaje}%
            </span>
          )}
        </div>
      )}
      <p
        className={`${SIZES[size]} ${apagado ? "text-white/45" : "text-[#C9A84C]"}`}
        style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
      >
        {value}
      </p>
      {note && (
        <p className={`text-[11px] uppercase tracking-[0.22em] mt-1 ${apagado ? "text-white/40" : "text-white/35"}`}>{note}</p>
      )}
    </div>
  );
}
