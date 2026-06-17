import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';

const NUEVO_MODELO = '__nuevo__';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const fmtFecha = (s: string) => {
  const [y, m, d] = s.split('T')[0].split('-').map(Number);
  return format(new Date(y, m - 1, d), 'd MMM yyyy', { locale: es });
};

const CATEGORIAS = ['Reloj', 'Perfume', 'Accesorio'];

interface Compra {
  id: string; fecha: string; modelo: string; cantidad: number;
  costoUnitario: number; costoTotal: number; categoria: string;
}
interface Paginado { data: Compra[]; total: number; page: number; limit: number; pages: number }
interface Resumen { totalCompras: number; comprasPorCategoria: Record<string, number> }

const EMPTY_FORM = {
  fecha: new Date().toISOString().split('T')[0],
  modelo: '', cantidad: '1', costoUnitario: '', categoria: 'Reloj',
};
type FormState = typeof EMPTY_FORM;

const inp = 'bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 w-full';
const sel = inp + ' cursor-pointer';

function CompraForm({ title, f, setF, costoPreview, onSubmit, onCancel, error, saving, submitLabel, nombresProducto }: {
  title: string; f: FormState; setF: (fn: (p: FormState) => FormState) => void;
  costoPreview: number; onSubmit: (e: React.FormEvent) => void; onCancel: () => void;
  error: string; saving: boolean; submitLabel: string; nombresProducto: string[];
}) {
  const [modoNuevo, setModoNuevo] = useState(() => f.modelo !== '' && !nombresProducto.includes(f.modelo));

  function handleSelectChange(value: string) {
    if (value === NUEVO_MODELO) {
      setModoNuevo(true);
      setF(p => ({ ...p, modelo: '' }));
    } else {
      setF(p => ({ ...p, modelo: value }));
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border p-5 mb-5" style={{ background: '#161616', borderColor: 'rgba(201,168,76,0.2)' }}>
      <h2 className="text-sm font-medium text-[#C9A84C] mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div><label className="text-xs text-white/40 mb-1 block">Fecha *</label>
          <input type="date" required value={f.fecha} onChange={e => setF(p => ({ ...p, fecha: e.target.value }))} className={inp} /></div>
        <div className="md:col-span-2"><label className="text-xs text-white/40 mb-1 block">Modelo *</label>
          {modoNuevo ? (
            <div className="flex gap-2">
              <input type="text" required placeholder="Naviforce NF 7105..." value={f.modelo} onChange={e => setF(p => ({ ...p, modelo: e.target.value }))} className={inp} />
              {nombresProducto.length > 0 && (
                <button type="button" onClick={() => { setModoNuevo(false); setF(p => ({ ...p, modelo: '' })); }} className="text-xs text-white/40 hover:text-white whitespace-nowrap px-2">
                  Elegir existente
                </button>
              )}
            </div>
          ) : (
            <select required value={f.modelo} onChange={e => handleSelectChange(e.target.value)} className={sel}>
              <option value="">Seleccionar producto…</option>
              {nombresProducto.map(n => <option key={n} value={n}>{n}</option>)}
              <option value={NUEVO_MODELO}>+ Nuevo modelo (no listado)</option>
            </select>
          )}
        </div>
        <div><label className="text-xs text-white/40 mb-1 block">Cantidad *</label>
          <input type="number" required min="1" value={f.cantidad} onChange={e => setF(p => ({ ...p, cantidad: e.target.value }))} className={inp} /></div>
        <div><label className="text-xs text-white/40 mb-1 block">Categoría *</label>
          <select required value={f.categoria} onChange={e => setF(p => ({ ...p, categoria: e.target.value }))} className={sel}>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div><label className="text-xs text-white/40 mb-1 block">Costo Unitario *</label>
          <input type="number" required min="0" placeholder="80000" value={f.costoUnitario} onChange={e => setF(p => ({ ...p, costoUnitario: e.target.value }))} className={inp} /></div>
        <div className="flex flex-col justify-end">
          <label className="text-xs text-white/40 mb-1 block">Costo Total (auto)</label>
          <div className="px-3 py-2 rounded text-sm font-medium text-[#C9A84C]" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
            {COP(costoPreview)}
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancelar</button>
        <button type="submit" disabled={saving} className="px-5 py-2 rounded text-sm font-medium" style={{ background: '#C9A84C', color: '#000' }}>
          {saving ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default function AdminCompras() {
  const [data, setData]         = useState<Compra[]>([]);
  const [meta, setMeta]         = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage]         = useState(1);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [desde, setDesde]       = useState('');
  const [hasta, setHasta]       = useState('');
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');
  const [resumen, setResumen]   = useState<Resumen | null>(null);
  const [nombresProducto, setNombresProducto] = useState<string[]>([]);
  const [editId, setEditId]     = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [editError, setEditError] = useState('');

  const cargar = useCallback((p: number) => {
    setCargando(true);
    const params: Record<string, string> = { page: String(p), limit: '20' };
    if (filtroCategoria) params.categoria = filtroCategoria;
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    api.get<Paginado>('/metrics/purchases', { params })
      .then(({ data: res }) => { setData(res.data); setMeta({ total: res.total, page: res.page, pages: res.pages }); })
      .finally(() => setCargando(false));
  }, [filtroCategoria, desde, hasta]);

  const cargarResumen = useCallback(() => {
    api.get<Resumen>('/metrics/financial').then(({ data }) => setResumen(data)).catch(() => {});
  }, []);

  useEffect(() => { setPage(1); cargar(1); }, [filtroCategoria, desde, hasta, cargar]);
  useEffect(() => { cargarResumen(); }, [cargarResumen]);
  useEffect(() => {
    api.get<{ nombre: string }[]>('/products').then(({ data }) => {
      setNombresProducto([...new Set(data.map(p => p.nombre))].sort());
    }).catch(() => {});
  }, []);

  const handlePage = (p: number) => { setPage(p); cargar(p); };

  const costoTotalPreview     = Number(form.cantidad || 0) * Number(form.costoUnitario || 0);
  const editCostoTotalPreview = Number(editForm.cantidad || 0) * Number(editForm.costoUnitario || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setGuardando(true);
    try {
      await api.post('/compras', {
        fecha: form.fecha, modelo: form.modelo,
        cantidad: Number(form.cantidad),
        costoUnitario: Number(form.costoUnitario),
        categoria: form.categoria,
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      cargar(1);
      cargarResumen();
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Error al guardar la compra');
    } finally { setGuardando(false); }
  };

  const handleEdit = (c: Compra) => {
    setEditId(c.id);
    setEditError('');
    setShowForm(false);
    setEditForm({
      fecha:         c.fecha.split('T')[0],
      modelo:        c.modelo,
      cantidad:      String(c.cantidad),
      costoUnitario: String(c.costoUnitario),
      categoria:     c.categoria,
    });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setEditError('');
    try {
      await api.put(`/compras/${editId}`, {
        fecha:         editForm.fecha,
        modelo:        editForm.modelo,
        cantidad:      Number(editForm.cantidad),
        costoUnitario: Number(editForm.costoUnitario),
        categoria:     editForm.categoria,
      });
      setEditId(null);
      cargar(page);
      cargarResumen();
    } catch (err: any) {
      setEditError(err?.response?.data?.message ?? 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const cat = resumen?.comprasPorCategoria ?? {};

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Compras de Inventario</h1>
          <p className="text-sm text-white/40">{meta.total} registros</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
          style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Cancelar' : 'Nueva compra'}
        </button>
      </div>

      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg p-4" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Comprado</p>
            <p className="text-lg font-semibold text-white">{COP(resumen.totalCompras)}</p>
          </div>
          <div className="rounded-lg p-4" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Relojes</p>
            <p className="text-lg font-semibold text-[#C9A84C]">{COP(cat['Reloj'] ?? 0)}</p>
          </div>
          <div className="rounded-lg p-4" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Perfumes</p>
            <p className="text-lg font-semibold text-[#C9A84C]">{COP(cat['Perfume'] ?? 0)}</p>
          </div>
          <div className="rounded-lg p-4" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Accesorios</p>
            <p className="text-lg font-semibold text-[#C9A84C]">{COP(cat['Accesorio'] ?? 0)}</p>
          </div>
        </div>
      )}

      {showForm && (
        <CompraForm
          title="Registrar nueva compra"
          f={form} setF={setForm} costoPreview={costoTotalPreview}
          onSubmit={handleSubmit} onCancel={() => setShowForm(false)}
          error={formError} saving={guardando} submitLabel="Guardar compra"
          nombresProducto={nombresProducto}
        />
      )}

      {editId && (
        <CompraForm
          title="Editar compra"
          f={editForm} setF={setEditForm} costoPreview={editCostoTotalPreview}
          onSubmit={handleEditSave} onCancel={() => { setEditId(null); setEditError(''); }}
          error={editError} saving={guardando} submitLabel="Guardar cambios"
          nombresProducto={nombresProducto}
        />
      )}

      <div className="flex flex-wrap gap-3 mb-5">
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none cursor-pointer">
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-white/40 whitespace-nowrap">Desde</label>
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none" style={{ colorScheme: 'dark' }} />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-white/40 whitespace-nowrap">Hasta</label>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none" style={{ colorScheme: 'dark' }} />
        </div>
        {(filtroCategoria || desde || hasta) && (
          <button onClick={() => { setFiltroCategoria(''); setDesde(''); setHasta(''); }} className="text-xs text-white/40 hover:text-white/70 px-2">Limpiar</button>
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
                {['Fecha','Modelo','Cantidad','Costo Unitario','Costo Total','Categoría',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {data.map(c => (
                <tr key={c.id} className={`transition-colors ${editId === c.id ? 'bg-[#C9A84C]/5' : 'hover:bg-white/5'}`}>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{fmtFecha(c.fecha)}</td>
                  <td className="px-4 py-3 text-white max-w-[220px] truncate">{c.modelo}</td>
                  <td className="px-4 py-3 text-white/80 text-center">{c.cantidad}</td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{COP(c.costoUnitario)}</td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{COP(c.costoTotal)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>{c.categoria}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleEdit(c)} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white">
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <td colSpan={4} className="px-4 py-3 text-xs text-white/40 uppercase tracking-wider">Total página</td>
                <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{COP(data.reduce((s, c) => s + c.costoTotal, 0))}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
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
