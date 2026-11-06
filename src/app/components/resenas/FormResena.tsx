import { useState, type FormEvent } from "react";
import { resenasApi } from "../../api/resenas";
import { LIMITES_RESENA } from "../../lib/resenas";
import { Field, FieldArea } from "../ds/Field";
import { FormError } from "../ds/FormError";
import { Button } from "../ds/Button";
import { SelectorEstrellas } from "./Estrellas";

function mensajeDeError(err: unknown): string {
  const status = (err as { response?: { status?: number } })?.response?.status;
  const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  if (status === 409) return "Ya habías reseñado esta pieza.";
  if (Array.isArray(message)) return message[0];
  return message ?? "No pudimos publicar tu reseña. Inténtalo de nuevo en un momento.";
}

export function FormResena({
  productId,
  onPublicada,
  onCancelar,
}: {
  productId: string;
  onPublicada: () => void;
  onCancelar: () => void;
}) {
  const [calificacion, setCalificacion] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const largo = comentario.trim().length;
  const valido = calificacion > 0 && largo >= LIMITES_RESENA.comentarioMin;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valido) {
      setError(calificacion === 0 ? "Elige una calificación." : `Cuéntanos un poco más (mínimo ${LIMITES_RESENA.comentarioMin} caracteres).`);
      return;
    }
    setError("");
    setEnviando(true);
    try {
      await resenasApi.crear({
        productId,
        calificacion,
        titulo: titulo.trim() || undefined,
        comentario,
      });
      onPublicada();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-8 border-b border-white/10" noValidate>
      <SelectorEstrellas valor={calificacion} onChange={setCalificacion} />

      <Field
        label="Título (opcional)"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        maxLength={LIMITES_RESENA.tituloMax}
        placeholder="En una frase"
      />

      <div>
        <FieldArea
          label="Tu experiencia"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={LIMITES_RESENA.comentarioMax}
          rows={5}
          placeholder="¿Cómo te llegó? ¿Qué te pareció la pieza y la atención?"
          required
        />
        <p className="mt-2 text-right text-[10px] text-white/30 tabular-nums">
          {comentario.length} / {LIMITES_RESENA.comentarioMax}
        </p>
      </div>

      {error && <FormError>{error}</FormError>}

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <Button type="submit" disabled={enviando} className="disabled:opacity-50">
          {enviando ? "Publicando…" : "Publicar reseña"}
        </Button>
        <button
          type="button"
          onClick={onCancelar}
          className="text-[11px] uppercase text-white/40 hover:text-white transition-colors"
          style={{ letterSpacing: "0.2em" }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
