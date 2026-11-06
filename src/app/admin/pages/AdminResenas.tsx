import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, MessageSquareReply, X } from 'lucide-react';
import { resenasApi, type EstadoResena, type Resena } from '../../api/resenas';
import type { Paginado } from '../../api/common';
import { formatFecha } from '../../lib/format';
import { LIMITES_RESENA } from '../../lib/resenas';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';
import { Estrellas } from '../../components/resenas/Estrellas';

const LIMIT = 20;

const FILTROS: { valor: EstadoResena | ''; label: string }[] = [
  { valor: '', label: 'Todas' },
  { valor: 'PUBLICADA', label: 'Publicadas' },
  { valor: 'OCULTA', label: 'Ocultas' },
];

function mensajeDeError(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return Array.isArray(message) ? message[0] : (message ?? fallback);
}

export default function AdminResenas() {
  const [estado, setEstado] = useState<EstadoResena | ''>('');
  const [page, setPage] = useState(1);

  const query = useApiQuery<Paginado<Resena>>(
    (signal) => resenasApi.listar({ estado: estado || undefined, page, limit: LIMIT }, signal),
    [estado, page],
  );
  useRefetchOnFocus(query.refetch);
  const resenas = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Reseñas</h1>
          <p className="text-sm text-white/40">
            Se publican al instante. Oculta las que no deban verse y responde como tienda.
          </p>
        </div>
        <div className="flex gap-1 rounded border p-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {FILTROS.map((f) => (
            <button
              key={f.label}
              onClick={() => { setEstado(f.valor); setPage(1); }}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                estado === f.valor ? 'bg-[#C9A84C]/15 text-[#C9A84C]' : 'text-white/50 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {query.error ? (
        <div className="rounded-lg border p-8 text-center" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-sm text-white/50 mb-3">No se pudieron cargar las reseñas.</p>
          <button onClick={query.refetch} className="text-xs text-[#C9A84C] hover:underline">Reintentar</button>
        </div>
      ) : query.loading && !query.data ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
        </div>
      ) : resenas.length === 0 ? (
        <p className="text-sm text-white/30 text-center py-16">Sin reseñas</p>
      ) : (
        <div className="flex flex-col gap-3">
          {resenas.map((r) => (
            <TarjetaResena key={r.id} resena={r} onCambio={query.refetch} />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 text-white/50 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft size={15} /> Anterior
          </button>
          <span className="text-white/40 text-xs">Página {meta.page} de {meta.totalPages} · {meta.total} reseñas</span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages}
            className="flex items-center gap-1 text-white/50 hover:text-white disabled:opacity-30"
          >
            Siguiente <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function TarjetaResena({ resena, onCambio }: { resena: Resena; onCambio: () => void }) {
  const [respondiendo, setRespondiendo] = useState(false);
  const [respuesta, setRespuesta] = useState(resena.respuesta ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const oculta = resena.estado === 'OCULTA';

  async function ejecutar(accion: () => Promise<void>, fallback: string) {
    setGuardando(true);
    setError('');
    try {
      await accion();
      onCambio();
      return true;
    } catch (err) {
      setError(mensajeDeError(err, fallback));
      return false;
    } finally {
      setGuardando(false);
    }
  }

  const alternarEstado = () =>
    ejecutar(
      () => resenasApi.cambiarEstado(resena.id, oculta ? 'PUBLICADA' : 'OCULTA'),
      'No se pudo cambiar el estado',
    );

  async function guardarRespuesta(texto: string) {
    const ok = await ejecutar(() => resenasApi.responder(resena.id, texto), 'No se pudo guardar la respuesta');
    if (ok) setRespondiendo(false);
  }

  return (
    <article
      className="rounded-lg border p-5"
      style={{
        background: '#161616',
        borderColor: oculta ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)',
        opacity: oculta ? 0.75 : 1,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm text-white font-medium truncate">{resena.productoNombre}</p>
          <p className="text-xs text-white/40 mt-0.5">
            {resena.autorNombre} · {formatFecha(resena.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Estrellas valor={resena.calificacion} />
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
              oculta ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
            }`}
          >
            {oculta ? 'Oculta' : 'Publicada'}
          </span>
        </div>
      </div>

      {resena.titulo && <p className="text-sm text-white/90 font-medium mb-1">{resena.titulo}</p>}
      <p className="text-sm text-white/60 whitespace-pre-line">{resena.comentario}</p>

      {resena.respuesta && !respondiendo && (
        <div className="mt-4 pl-3 border-l-2 border-[#C9A84C]/50">
          <p className="text-[10px] uppercase tracking-wider text-[#C9A84C] mb-1">
            Respuesta de C3LECT{resena.respondidaAt ? ` · ${formatFecha(resena.respondidaAt)}` : ''}
          </p>
          <p className="text-sm text-white/60 whitespace-pre-line">{resena.respuesta}</p>
        </div>
      )}

      {respondiendo && (
        <div className="mt-4">
          <textarea
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            maxLength={LIMITES_RESENA.respuestaMax}
            rows={3}
            autoFocus
            placeholder="Gracias por tu compra…"
            className="bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 w-full resize-y"
          />
          <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
            {resena.respuesta && (
              <button
                onClick={() => guardarRespuesta('')}
                disabled={guardando}
                className="mr-auto text-xs text-red-400/80 hover:text-red-400"
              >
                Retirar respuesta
              </button>
            )}
            <button
              onClick={() => { setRespondiendo(false); setRespuesta(resena.respuesta ?? ''); }}
              className="px-3 py-1.5 text-xs text-white/50 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={() => guardarRespuesta(respuesta)}
              disabled={guardando || !respuesta.trim()}
              className="px-4 py-1.5 rounded text-xs font-medium disabled:opacity-40"
              style={{ background: '#C9A84C', color: '#000' }}
            >
              {guardando ? 'Guardando…' : 'Publicar respuesta'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

      {!respondiendo && (
        <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setRespondiendo(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white/60 hover:text-[#C9A84C] hover:bg-white/5"
          >
            <MessageSquareReply size={14} />
            {resena.respuesta ? 'Editar respuesta' : 'Responder'}
          </button>
          <button
            onClick={alternarEstado}
            disabled={guardando}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-40"
          >
            {oculta ? <Eye size={14} /> : <EyeOff size={14} />}
            {oculta ? 'Publicar' : 'Ocultar'}
          </button>
          {error && (
            <button onClick={() => setError('')} className="ml-auto text-white/30 hover:text-white" aria-label="Descartar error">
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </article>
  );
}
