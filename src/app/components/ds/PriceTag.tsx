const SIZES = {
  md: "text-2xl md:text-3xl",
  lg: "text-4xl md:text-5xl",
};

export function PriceTag({
  value,
  size = "md",
  note,
  apagado,
}: {
  value: string;
  size?: "md" | "lg";
  note?: string;
  /** Precio del último lote de un producto agotado — blanco apagado en vez de dorado */
  apagado?: boolean;
}) {
  return (
    <div>
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
