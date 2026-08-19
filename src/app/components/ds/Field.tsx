import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const LABEL = "block text-[10px] uppercase text-white/40 group-focus-within:text-[#C9A84C] transition-colors duration-300 mb-2";
const INPUT = "w-full bg-transparent border-0 border-b text-white text-sm py-3 outline-none transition-colors duration-300 placeholder:text-white/20 border-white/25 focus:border-[#C9A84C]";

export function Field({
  label, suffix, className = "", ...props
}: { label: string; suffix?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="group">
      <label className={LABEL}>{label}</label>
      <div className="relative">
        <input {...props} className={`${INPUT} ${suffix ? "pr-10" : ""} ${className}`} />
        {suffix && <div className="absolute right-0 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
    </div>
  );
}

export function FieldArea({
  label, className = "", ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="group">
      <label className={LABEL}>{label}</label>
      <textarea {...props} className={`${INPUT} resize-none ${className}`} />
    </div>
  );
}
