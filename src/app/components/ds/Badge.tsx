export function Badge({ status }: { status: "available" | "soldout" }) {
  if (status === "soldout") {
    return (
      <span className="inline-block bg-black/80 text-white text-xs uppercase tracking-widest px-3 py-1">
        Agotado
      </span>
    );
  }
  return (
    <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs uppercase tracking-widest px-3 py-1">
      Disponible
    </span>
  );
}
