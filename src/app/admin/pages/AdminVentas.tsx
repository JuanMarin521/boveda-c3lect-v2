import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const fmtFecha = (s: string) =>
  format(new Date(s), 'd MMM yyyy', { locale: es });

const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  Pagado:         { label: 'Pagado',        color: '#22C55E' },
  Abonado:        { label: 'Abonado',       color: '#EAB308' },
  Pendiente:      { label: 'Pendiente',     color: '#EF4444' },
  'Uso Personal': { label: 'Uso Personal',  color: '#6B7280' },
};

const ESTADOS  = ['', 'Pagado', 'Abonado', 'Pendiente', 'Uso Personal'];
const FUENTES  = ['', 'WhatsApp', 'Presencial', 'Referido', 'Instagram'];

interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  celular: string | null;
  modelo: string;
  estilo: string | null;
  precioVenta: number;
  costoProducto: number;
  costoEnvio: number;
  abono: number;
  saldoPendiente: number;
  gananciaNeta: number | null;
  fuente: string | null;
  estado: string;
}

interface Paginado { data: Venta[]; total: number; page: number; limit: number; pages: number }

function exportCSV(data: Venta[]) {
  const headers = ['Fecha','Cliente','Celular','Modelo','Estilo','Precio Venta','Costo','Envío','Abono','Saldo','Ganancia','Fuente','Estado'];
  const rows = data.map((v) => [
    fmtFecha(v.fecha), v.cliente, v.celular ?? '',
    v.modelo, v.estilo ?? '',
    v.precioVenta, v.costoProducto, v.costoEnvio,
    v.abono, v.saldoPendiente, v.gananciaNeta ?? '',
    v.fuente ?? '', v.estado,
  ]);
  const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ventas-c3lect-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminVentas() {
  const [data, setData]   = useState<Venta[]>([]);
  const [meta, setMeta]   = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage]   = useState(1);
  const [estado, setEstado] = useState('');
  const [fuente, setFuente] = useState('');
  const [desde, setDesde]   = useState('');
  const [hasta, setHasta]   = useState('');
  const [cargando, setCargando] = useState(true);
  const [exportando, setExportando] = useState(false);

  const cargar = useCallback((p: number) => {
    setCargando(true);
    const params: Record<string, string> = { page: String(p), limit: '20' };
    if (estado) params.estado = estado;
    if (fuente) params.fuente = fuente;
    if (desde)  params.desde  = desde;
    if (hasta)  params.hasta  = hasta;

    api.get<Paginado>('/metrics/sales', { params })
      .then(({ data: res }) => {
        setData(res.data);
        setMeta({ total: res.total, page: res.page, pages: res.pages });
      })
      .finally(() => setCargando(false));
  }, [estado, fuente, desde, hasta]);

  useEffect(() => {
    setPage(1);
    cargar(1);
  }, [estado, fuente, desde, hasta, cargar]);

  const handlePage = (p: number) => {
    setPage(p);
    cargar(p);
  };

  const handleExport = async () => {
    setExportando(true);
    try {
      const params: Record<string, string> = { page: '1', limit: '1000' };
      if (estado) params.estado = estado;
      if (fuente) params.fuente = fuente;
      if (desde)  params.desde  = desde;
      if (hasta)  params.hasta  = hasta;
      const { data: res } = await api.get<Paginado>('/metrics/sales', { params });
      exportCSV(res.data);
    } finally {
      setExportando(false);
    }
  };

  const inputCls = "bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-[#C9A84C]/50";
  const selectCls = inputCls + " cursor-pointer";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Ventas Históricas</h1>
          <p className="text-sm text-white/40">{meta.total} registros totales</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exportando}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors"
          style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          <Download size={15} />
          {exportando ? 'Exportando…' : 'Exportar CSV'}
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className={selectCls}>
          <option value="">Todos los estados</option>
          {ESTADOS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={fuente} onChange={(e) => setFuente(e.target.value)} className={selectCls}>
          <option value="">Todas las fuentes</option>
          {FUENTES.filter(Boolean).map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className={inputCls} placeholder="Desde" />
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className={inputCls} placeholder="Hasta" />
        {(estado || fuente || desde || hasta) && (
          <button
            onClick={() => { setEstado(''); setFuente(''); setDesde(''); setHasta(''); }}
            className="text-xs text-white/40 hover:text-white/70 px-2"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-lg border overflow-x-auto" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-16">Sin resultados</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {['Fecha','Cliente','Celular','Modelo','Estilo','Precio','Costo','Envío','Abono','Saldo','Ganancia','Fuente','Estado'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {data.map((v) => {
                const cfg = ESTADO_CONFIG[v.estado] ?? { label: v.estado, color: '#6B7280' };
                return (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">{fmtFecha(v.fecha)}</td>
                    <td className="px-4 py-3 text-white whitespace-nowrap">{v.cliente}</td>
                    <td className="px-4 py-3 text-white/50">{v.celular ?? '—'}</td>
                    <td className="px-4 py-3 text-white max-w-[180px] truncate">{v.modelo}</td>
                    <td className="px-4 py-3 text-white/50">{v.estilo ?? '—'}</td>
                    <td className="px-4 py-3 text-white whitespace-nowrap">{COP(v.precioVenta)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.costoProducto)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.costoEnvio)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.abono)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.saldoPendiente)}</td>
                    <td className="px-4 py-3 text-white/80 whitespace-nowrap">
                      {v.gananciaNeta != null ? COP(v.gananciaNeta) : '—'}
                    </td>
                    <td className="px-4 py-3 text-white/50">{v.fuente ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ background: cfg.color + '20', color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-white/40">
            Página {meta.page} de {meta.pages} — {meta.total} registros
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => handlePage(page - 1)}
              className="p-1.5 rounded border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= meta.pages}
              onClick={() => handlePage(page + 1)}
              className="p-1.5 rounded border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
