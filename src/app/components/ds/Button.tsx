import type { ComponentPropsWithoutRef, ElementType } from "react";

type Variant = "solid" | "outline" | "block-dark" | "block-outline";

const BASE =
  "inline-flex items-center justify-center gap-3 text-sm uppercase tracking-[0.24em] whitespace-nowrap hover:tracking-[0.30em] transition-[color,border-color,letter-spacing,filter,background-size] duration-300";

// "outline" se rellena de dorado de abajo hacia arriba: el fondo es una capa
// de tamaño 100%x0% anclada abajo que crece a 100%x100% en hover (320ms).
// Los mismos estados se repiten en "active:" porque en pantallas táctiles no
// existe :hover — sin eso, el botón nunca mostraría su color de marca al tocar.
const VARIANTS: Record<Variant, string> = {
  solid: "px-10 py-4 bg-[#C9A84C] text-[#0A0A0A] hover:brightness-[0.92] active:brightness-[0.92]",
  outline:
    "px-10 py-4 border border-white/30 text-white bg-[linear-gradient(#C9A84C,#C9A84C)] bg-no-repeat bg-bottom [background-size:100%_0%] hover:[background-size:100%_100%] hover:border-[#C9A84C] hover:text-[#0A0A0A] active:[background-size:100%_100%] active:border-[#C9A84C] active:text-[#0A0A0A] duration-[320ms]",
  "block-dark": "w-full px-8 py-5 bg-black text-white hover:bg-[#C9A84C] hover:text-[#0A0A0A] active:bg-[#C9A84C] active:text-[#0A0A0A]",
  "block-outline":
    "w-full px-8 py-5 border-2 border-white text-white bg-[linear-gradient(#C9A84C,#C9A84C)] bg-no-repeat bg-bottom [background-size:100%_0%] hover:[background-size:100%_100%] hover:border-[#C9A84C] hover:text-[#0A0A0A] active:[background-size:100%_100%] active:border-[#C9A84C] active:text-[#0A0A0A] duration-[320ms] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:[background-size:100%_0%] disabled:hover:text-white disabled:hover:border-white disabled:active:[background-size:100%_0%] disabled:active:text-white disabled:active:border-white",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "solid",
  className = "",
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";
  return (
    <Component className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />
  );
}
