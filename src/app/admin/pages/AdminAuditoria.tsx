import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';

interface AuditEntry {
  id: string;
  accion: string;
  entidad: string;
  entidadId: string;
  descripcion: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

interface Paginado { data: AuditEntry[]; meta: { total: number; page: number; totalPages: number } }

const ACCION_CONFIG: Record<string, { label: string; color: string }> = {
  CREAR:    { label: 'Crear',   color: '#22C55E' },
  EDITAR:   { label: 'Editar',  color: '#3B82F6' },
  ELIMINAR: { label: 'Eliminar', color: '#EF4444' },
  ESTADO:   { label: 'Estado',  color: '#F97316' },
};

const ACCIONES = ['', 'CREAR', 'EDITAR', 'ELIMINAR', 'ESTADO'];

export default function AdminAuditoria() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [accion, setAccion] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [cargando, setCargando] = useState(true);

  function fetchAudit() {
    setCargando(true);
    const params: Record<string, string> = { page: String(page), limit: '30' };
    if (accion) params.accion = accion;
    if (fechaDesde) params.fechaDesde = fechaDesde;
    if (fechaHasta) params.fechaHasta = fechaHasta;
    api.get<Paginado>('/audit', { params })
      .then(({ data }) => {
        setEntries(data.data);
        setMeta(data.meta);
      })
      .catch(() => setEntries([]))
      .finally(() => setCargando(false));
  }

  useEffect(() => { fetchAudit(); }, [page, accion, fechaDesde, fechaHasta]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Auditoría</h1>
        <p className="text-sm text-white/40 mt-0.5">Log de acciones del panel de administración</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={accion}
          onChange={(e) => { setAccion(e.target.value); setPage(1); }}
          className="text-sm rounded px-3 py-2 border outline-none"
          style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          {ACCIONES.map((a) => (
            <option key={a} value={a}>{a ? ACCION_CONFIG[a]?.label : 'Todas las acciones'}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }}
            className="text-sm rounded px-3 py-2 border outline-none"
            style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', colorScheme: 'dark' }}
          />
          <span className="text-white/30 text-xs">—</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }}
            className="text-sm rounded px-3 py-2 border outline-none"
            style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', colorScheme: 'dark' }}
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {['Fecha', 'Acción', 'Entidad', 'Descripción', 'Usuario'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-white/30">Sin registros</td>
                  </tr>
                )}
                {entries.map((e) => {
                  const ac = ACCION_CONFIG[e.accion] ?? { label: e.accion, color: '#fff' };
                  return (
                    <tr key={e.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                        {format(new Date(e.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{ background: ac.color + '20', color: ac.color }}
                        >
                          {ac.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-white/60 capitalize">{e.entidad}</span>
                        <p className="text-[10px] text-white/30 font-mono mt-0.5">{e.entidadId.slice(0, 12)}…</p>
                      </td>
                      <td className="px-4 py-3 text-white/70 max-w-[260px] truncate">{e.descripcion}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{e.userName ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40">Página {page} de {meta.totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 text-white/40 hover:text-white disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 text-white/40 hover:text-white disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
