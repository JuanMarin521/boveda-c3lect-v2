export function FormError({ children }: { children: string }) {
  return (
    <p
      className="text-[11px] uppercase text-[#C9A84C] border-y border-[#C9A84C]/30 py-3"
      style={{ letterSpacing: "0.08em" }}
      role="alert"
    >
      {children}
    </p>
  );
}
