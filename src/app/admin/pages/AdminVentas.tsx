import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Download, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const fmtFecha = (s: string) => format(new Date(s), 'd MMM yyyy', { locale: es });

const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  Pagado:         { label: 'Pagado',        color: '#22C55E' },
  Abonado:        { label: 'Abonado',       color: '#EAB308' },
  Pendiente:      { label: 'Pendiente',     color: '#EF4444' },
  'Uso Personal': { label: 'Uso Personal',  color: '#6B7280' },
};

const ESTADOS  = ['Pagado', 'Abonado', 'Pendiente', 'Uso Personal'];
const FUENTES  = ['WhatsApp', 'Presencial', 'Referido', 'Instagram'];

interface Venta {
  id: string; fecha: string; cliente: string; celular: string | null;
  modelo: string; estilo: string | null; precioVenta: number; costoProducto: number;
  costoEnvio: number; abono: number; saldoPendiente: number; gananciaNeta: number | null;
  fuente: string | null; estado: string;
}
interface Paginado { data: Venta[]; total: number; page: number; limit: number; pages: number }

const EMPTY_FORM = {
  fecha: new Date().toISOString().split('T')[0],
  cliente: '', celular: '', modelo: '', estilo: '',
  precioVenta: '', costoProducto: '', costoEnvio: '0',
  abono: '', fuente: '', estado: 'Pagado',
};

function exportCSV(data: Venta[]) {
  const headers = ['Fecha','Cliente','Celular','Modelo','Estilo','Precio Venta','Costo','Envío','Abono','Saldo','Ganancia','Fuente','Estado'];
  const rows = data.map((v) => [
    fmtFecha(v.fecha), v.cliente, v.celular ?? '', v.modelo, v.estilo ?? '',
    v.precioVenta, v.costoProducto, v.costoEnvio, v.abono, v.saldoPendiente,
    v.gananciaNeta ?? '', v.fuente ?? '', v.estado,
  ]);
  const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `ventas-c3lect-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminVentas() {
  const [data, setData]     = useState<Venta[]>([]);
  const [meta, setMeta]     = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage]     = useState(1);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFuente, setFiltroFuente] = useState('');
  const [desde, setDesde]   = useState('');
  const [hasta, setHasta]   = useState('');
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [guardando, setGuardando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [formError, setFormError] = useState('');

  const cargar = useCallback((p: number) => {
    setCargando(true);
    const params: Record<string, string> = { page: String(p), limit: '20' };
    if (filtroEstado) params.estado = filtroEstado;
    if (filtroFuente) params.fuente = filtroFuente;
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    api.get<Paginado>('/metrics/sales', { params })
      .then(({ data: res }) => { setData(res.data); setMeta({ total: res.total, page: res.page, pages: res.pages }); })
      .finally(() => setCargando(false));
  }, [filtroEstado, filtroFuente, desde, hasta]);

  useEffect(() => { setPage(1); cargar(1); }, [filtroEstado, filtroFuente, desde, hasta, cargar]);

  const handlePage = (p: number) => { setPage(p); cargar(p); };

  const handleExport = async () => {
    setExportando(true);
    try {
      const { data: res } = await api.get<Paginado>('/metrics/sales', { params: { page: '1', limit: '1000' } });
      exportCSV(res.data);
    } finally { setExportando(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setGuardando(true);
    try {
      await api.post('/ventas', {
        fecha: form.fecha,
        cliente: form.cliente,
        celular: form.celular || undefined,
        modelo: form.modelo,
        estilo: form.estilo || undefined,
        precioVenta: Number(form.precioVenta),
        costoProducto: Number(form.costoProducto),
        costoEnvio: Number(form.costoEnvio),
        abono: Number(form.abono),
        fuente: form.fuente || undefined,
        estado: form.estado,
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      cargar(1);
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Error al guardar la venta');
    } finally { setGuardando(false); }
  };

  const inp = "bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 w-full";
  const sel = inp + " cursor-pointer";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Ventas Históricas</h1>
          <p className="text-sm text-white/40">{meta.total} registros</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} disabled={exportando}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Download size={15} />{exportando ? 'Exportando…' : 'CSV'}
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
            style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? 'Cancelar' : 'Nueva venta'}
          </button>
        </div>
      </div>

      {/* Formulario nueva venta */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-5 mb-5" style={{ background: '#161616', borderColor: 'rgba(201,168,76,0.2)' }}>
          <h2 className="text-sm font-medium text-[#C9A84C] mb-4">Registrar nueva venta</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div><label className="text-xs text-white/40 mb-1 block">Fecha *</label><input type="date" required value={form.fecha} onChange={e => setForm(f => ({...f, fecha: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Cliente *</label><input type="text" required placeholder="Nombre" value={form.cliente} onChange={e => setForm(f => ({...f, cliente: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Celular</label><input type="text" placeholder="300..." value={form.celular} onChange={e => setForm(f => ({...f, celular: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Estado *</label>
              <select required value={form.estado} onChange={e => setForm(f => ({...f, estado: e.target.value}))} className={sel}>
                {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="md:col-span-2"><label className="text-xs text-white/40 mb-1 block">Modelo *</label><input type="text" required placeholder="Naviforce NF 7105..." value={form.modelo} onChange={e => setForm(f => ({...f, modelo: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Estilo</label><input type="text" placeholder="Automático..." value={form.estilo} onChange={e => setForm(f => ({...f, estilo: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Fuente</label>
              <select value={form.fuente} onChange={e => setForm(f => ({...f, fuente: e.target.value}))} className={sel}>
                <option value="">—</option>
                {FUENTES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div><label className="text-xs text-white/40 mb-1 block">Precio Venta *</label><input type="number" required min="0" placeholder="250000" value={form.precioVenta} onChange={e => setForm(f => ({...f, precioVenta: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Costo Producto *</label><input type="number" required min="0" placeholder="180000" value={form.costoProducto} onChange={e => setForm(f => ({...f, costoProducto: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Costo Envío</label><input type="number" min="0" placeholder="0" value={form.costoEnvio} onChange={e => setForm(f => ({...f, costoEnvio: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Abono/Pago *</label><input type="number" required min="0" placeholder="250000" value={form.abono} onChange={e => setForm(f => ({...f, abono: e.target.value}))} className={inp} /></div>
          </div>
          {formError && <p className="text-xs text-red-400 mb-3">{formError}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancelar</button>
            <button type="submit" disabled={guardando} className="px-5 py-2 rounded text-sm font-medium" style={{ background: '#C9A84C', color: '#000' }}>
              {guardando ? 'Guardando…' : 'Guardar venta'}
            </button>
          </div>
        </form>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none cursor-pointer">
          <option value="">Todos los estados</option>
          {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filtroFuente} onChange={e => setFiltroFuente(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none cursor-pointer">
          <option value="">Todas las fuentes</option>
          {FUENTES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none" />
        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none" />
        {(filtroEstado || filtroFuente || desde || hasta) && (
          <button onClick={() => { setFiltroEstado(''); setFiltroFuente(''); setDesde(''); setHasta(''); }} className="text-xs text-white/40 hover:text-white/70 px-2">Limpiar</button>
        )}
      </div>

      <div className="rounded-lg border overflow-x-auto" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" /></div>
        ) : data.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-16">Sin resultados</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {['Fecha','Cliente','Celular','Modelo','Estilo','Precio','Costo','Envío','Abono','Saldo','Ganancia','Fuente','Estado'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {data.map(v => {
                const cfg = ESTADO_CONFIG[v.estado] ?? { label: v.estado, color: '#6B7280' };
                return (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">{fmtFecha(v.fecha)}</td>
                    <td className="px-4 py-3 text-white whitespace-nowrap">{v.cliente}</td>
                    <td className="px-4 py-3 text-white/50">{v.celular ?? '—'}</td>
                    <td className="px-4 py-3 text-white max-w-[160px] truncate">{v.modelo}</td>
                    <td className="px-4 py-3 text-white/50">{v.estilo ?? '—'}</td>
                    <td className="px-4 py-3 text-white whitespace-nowrap">{COP(v.precioVenta)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.costoProducto)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.costoEnvio)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.abono)}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{COP(v.saldoPendiente)}</td>
                    <td className="px-4 py-3 text-white/80 whitespace-nowrap">{v.gananciaNeta != null ? COP(v.gananciaNeta) : '—'}</td>
                    <td className="px-4 py-3 text-white/50">{v.fuente ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: cfg.color + '20', color: cfg.color }}>{cfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {meta.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-white/40">Página {meta.page} de {meta.pages} — {meta.total} registros</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => handlePage(page - 1)} className="p-1.5 rounded border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
            <button disabled={page >= meta.pages} onClick={() => handlePage(page + 1)} className="p-1.5 rounded border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
