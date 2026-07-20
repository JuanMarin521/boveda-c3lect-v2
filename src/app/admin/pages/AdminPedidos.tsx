import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';
import { formatPrecio as COP } from '../../lib/format';


const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDIENTE:  { label: 'Pendiente',  color: '#EAB308' },
  CONFIRMADO: { label: 'Confirmado', color: '#3B82F6' },
  EN_CAMINO:  { label: 'En camino',  color: '#F97316' },
  ENTREGADO:  { label: 'Entregado',  color: '#22C55E' },
  CANCELADO:  { label: 'Cancelado',  color: '#EF4444' },
};

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { nombre: string; cantidad: number }[];
  shippingInfo: { nombreCompleto: string } | null;
  user: { nombre: string } | null;
}

interface Paginado { data: Order[]; meta: { total: number; page: number; totalPages: number } }

const ESTADOS = ['', 'PENDIENTE', 'CONFIRMADO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'];

export default function AdminPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [cargando, setCargando] = useState(true);

  function fetchPedidos() {
    setCargando(true);
    const params: Record<string, string> = { page: String(page), limit: '20' };
    if (status) params.status = status;
    if (fechaDesde) params.fechaDesde = fechaDesde;
    if (fechaHasta) params.fechaHasta = fechaHasta;
    api.get<Paginado>('/orders', { params })
      .then(({ data }) => {
        setPedidos(data.data);
        setMeta(data.meta);
      })
      .catch(() => setPedidos([]))
      .finally(() => setCargando(false));
  }

  useEffect(() => { fetchPedidos(); }, [page, status, fechaDesde, fechaHasta]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Pedidos</h1>
        <p className="text-sm text-white/40 mt-0.5">{meta.total} pedidos en total</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="text-sm rounded px-3 py-2 border outline-none"
          style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          {ESTADOS.map((s) => (
            <option key={s} value={s}>{s ? STATUS_CONFIG[s]?.label : 'Todos los estados'}</option>
          ))}
        </select>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-white/40 whitespace-nowrap">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }}
              className="text-sm rounded px-3 py-2 border outline-none"
              style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', colorScheme: 'dark' }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-white/40 whitespace-nowrap">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }}
              className="text-sm rounded px-3 py-2 border outline-none"
              style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', colorScheme: 'dark' }}
            />
          </div>
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
                  {['Orden', 'Cliente', 'Productos', 'Total', 'Estado', 'Fecha'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {pedidos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-white/30">Sin pedidos</td>
                  </tr>
                )}
                {pedidos.map((o) => {
                  const st = STATUS_CONFIG[o.status] ?? { label: o.status, color: '#fff' };
                  const cliente = o.shippingInfo?.nombreCompleto ?? o.user?.nombre ?? 'Invitado';
                  const primerItem = o.items[0]?.nombre ?? '—';
                  const totalItems = o.items.reduce((s, i) => s + i.cantidad, 0);
                  return (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/admin/pedidos/${o.id}`)}
                      className="hover:bg-white/3 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-white font-mono text-xs">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-white/80 max-w-[140px] truncate">{cliente}</td>
                      <td className="px-4 py-3 text-white/60">
                        <span className="truncate block max-w-[160px]">{primerItem}</span>
                        {totalItems > 1 && <span className="text-xs text-white/30">+{totalItems - 1} más</span>}
                      </td>
                      <td className="px-4 py-3 text-white/80">{COP(o.total)}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{ background: st.color + '20', color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                        {format(new Date(o.createdAt), 'dd MMM yyyy', { locale: es })}
                      </td>
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
