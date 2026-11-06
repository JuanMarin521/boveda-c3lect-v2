import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import type { ResenaPublica } from "../../data/resenas";
import { formatFecha } from "../../lib/format";
import { Estrellas } from "./Estrellas";

/** Una reseña publicada, con la respuesta de la tienda si la hay. */
export function ResenaItem({ resena, encabezado }: { resena: ResenaPublica; encabezado?: ReactNode }) {
  return (
    <article className="py-8">
      {encabezado}
      <div className="flex items-center gap-4 mb-4">
        <Estrellas valor={resena.calificacion} />
        <time
          dateTime={resena.createdAt}
          className="text-[10px] uppercase text-white/35"
          style={{ letterSpacing: "0.2em" }}
        >
          {formatFecha(resena.createdAt)}
        </time>
      </div>

      {resena.titulo && (
        <h3
          className="text-2xl text-white mb-3 leading-tight"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
        >
          {resena.titulo}
        </h3>
      )}
      <p className="text-white/70 leading-relaxed whitespace-pre-line">{resena.comentario}</p>

      <p
        className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase text-white/45"
        style={{ letterSpacing: "0.2em" }}
      >
        {resena.autor}
        <span className="text-white/20" aria-hidden="true">·</span>
        <BadgeCheck size={13} className="text-[#C9A84C]" aria-hidden="true" />
        Compra verificada
      </p>

      {resena.respuesta && (
        <div className="mt-6 pl-5 border-l border-[#C9A84C]/50">
          <p className="text-[10px] uppercase text-[#C9A84C] mb-2" style={{ letterSpacing: "0.24em" }}>
            Respuesta de C3LECT
          </p>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{resena.respuesta}</p>
        </div>
      )}
    </article>
  );
}
