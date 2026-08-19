export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-white/10 last:border-0">
      <span className="text-xs uppercase tracking-wider text-white/50 w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-white/80 leading-relaxed">{value}</span>
    </div>
  );
}
