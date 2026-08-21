import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check, Download, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import { formatPrecio as COP, formatFecha as fmtFecha } from '../../lib/format';
import { useMarcaModeloToggle, NUEVA_MARCA, NUEVO_MODELO } from '../../hooks/useMarcaModeloToggle';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  Pagado:         { label: 'Pagado',        color: '#22C55E' },
  Abonado:        { label: 'Abonado',       color: '#EAB308' },
  Pendiente:      { label: 'Pendiente',     color: '#EF4444' },
  'Uso Personal': { label: 'Uso Personal',  color: '#6B7280' },
};

const ESTADOS = ['Pagado', 'Abonado', 'Pendiente', 'Uso Personal'];
const FUENTES = ['WhatsApp', 'Presencial', 'Referido', 'Instagram', 'Uso Personal'];
const CATEGORIAS_FILTRO = [
  { value: 'reloj', label: 'Relojes' },
  { value: 'perfume', label: 'Perfumes' },
  { value: 'accesorio', label: 'Accesorios' },
];

interface Venta {
  id: string; fecha: string; cliente: string; celular: string | null;
  marca: string; modelo: string; estilo: string | null; precioVenta: number; costoProducto: number;
  costoEnvio: number; abono: number; saldoPendiente: number; gananciaNeta: number | null;
  fuente: string | null; estado: string;
}
interface Paginado {
  data: Venta[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  agregados: { totalVendido: number; pendienteCobro: number };
}
interface InvItem { marca: string | null; modelo: string; stock: number; }
interface PrecioItem { marca: string | null; modelo: string; costoTotal: number; precioCierre: number | null; }
interface ProductoItem { nombre: string; estilo: string; }

const EMPTY_FORM = {
  fecha: new Date().toISOString().split('T')[0],
  cliente: '', celular: '', marca: '', modelo: '', estilo: '',
  precioVenta: '', costoProducto: '', costoEnvio: '0',
  abono: '', fuente: '', estado: 'Pagado',
};
type FormState = typeof EMPTY_FORM;

// Estilos definidos a nivel de módulo para que VentaForm no los pierda en cada render
const inp = 'bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 w-full';
const sel = inp + ' cursor-pointer';

function recalcEstado(f: FormState): FormState {
  const pv = Number(f.precioVenta);
  const ab = Number(f.abono);
  if (pv > 0) {
    if (ab >= pv) return { ...f, estado: 'Pagado' };
    if (ab > 0)   return { ...f, estado: 'Abonado' };
    return { ...f, estado: 'Pendiente' };
  }
  return f;
}

// Componente a nivel de módulo — no se recrea en cada render del padre
function VentaForm({ title, f, setF, onSubmit, onCancel, error, saving, submitLabel, marcas, inventario, precios, productos, errorOpciones }: {
  title: string; f: FormState; setF: (fn: (prev: FormState) => FormState) => void;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void;
  error: string; saving: boolean; submitLabel: string;
  marcas?: string[]; inventario?: InvItem[]; precios?: PrecioItem[]; productos?: ProductoItem[];
  errorOpciones?: boolean;
}) {
  const disponibles = inventario?.filter(i => i.stock > 0) ?? [];
  const marcasDisponibles = marcas ?? [];

  function onModeloChange(marca: string, modelo: string) {
    const precio = precios?.find(p => p.modelo === modelo && (!p.marca || p.marca === marca));
    const nombreCompleto = `${marca} ${modelo}`.trim();
    const estilos = [...new Set((productos ?? []).filter(p => p.nombre === nombreCompleto).map(p => p.estilo))];
    setF(p => ({
      ...p,
      modelo,
      estilo: estilos.length === 1 ? estilos[0] : '',
      costoProducto: precio ? String(precio.costoTotal) : p.costoProducto,
    }));
  }

  function handleMarcaChange(value: string) {
    if (value === NUEVA_MARCA) {
      setModoMarcaNueva(true);
      setModoModeloNuevo(true);
      setF(p => ({ ...p, marca: '', modelo: '', estilo: '', costoProducto: '' }));
    } else {
      setModoMarcaNueva(false);
      setModoModeloNuevo(false);
      setF(p => ({ ...p, marca: value, modelo: '', estilo: '', costoProducto: '' }));
    }
  }

  // Opciones para el selector de modelo, filtradas por la marca elegida:
  // - Si hay inventario con stock → muestra solo productos disponibles (nueva venta)
  // - Si hay precios pero no inventario → muestra todos los productos (editar venta)
  const modeloOpciones: { value: string; label: string }[] =
    disponibles.length > 0
      ? disponibles
          .filter(i => !f.marca || i.marca === f.marca)
          .map(i => ({ value: i.modelo, label: `${i.modelo} — ${i.stock} ud${i.stock !== 1 ? 's' : ''}` }))
      : (precios ?? [])
          .filter(p => !f.marca || p.marca === f.marca)
          .map(p => ({ value: p.modelo, label: p.modelo }));

  const { modoMarcaNueva, setModoMarcaNueva, modoModeloNuevo, setModoModeloNuevo } =
    useMarcaModeloToggle(f.marca, f.modelo, marcasDisponibles, modeloOpciones.map(o => o.value));

  function handleModeloSelectChange(value: string) {
    if (value === NUEVO_MODELO) {
      setModoModeloNuevo(true);
      setF(p => ({ ...p, modelo: '', estilo: '', costoProducto: '' }));
    } else {
      onModeloChange(f.marca, value);
    }
  }

  const nombreCompletoActual = `${f.marca} ${f.modelo}`.trim();
  let estilosDisponibles = [...new Set((productos ?? []).filter(p => p.nombre === nombreCompletoActual).map(p => p.estilo))];
  if (f.estilo && !estilosDisponibles.includes(f.estilo)) estilosDisponibles = [f.estilo, ...estilosDisponibles];

  const precioCierreActual = precios?.find(p => p.modelo === f.modelo && (!p.marca || p.marca === f.marca))?.precioCierre ?? null;

  return (
    <form onSubmit={onSubmit} className="rounded-lg border p-5 mb-5" style={{ background: '#161616', borderColor: 'rgba(201,168,76,0.2)' }}>
      <h2 className="text-sm font-medium text-[#C9A84C] mb-4">{title}</h2>
      {errorOpciones && <p className="text-xs text-red-400 mb-3">No se pudieron cargar marcas/modelos/inventario existentes — puedes escribirlos manualmente.</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div><label className="text-xs text-white/40 mb-1 block">Fecha *</label>
          <input type="date" required value={f.fecha} onChange={e => setF(p => ({ ...p, fecha: e.target.value }))} className={inp} /></div>
        <div><label className="text-xs text-white/40 mb-1 block">Cliente *</label>
          <input type="text" required placeholder="Nombre" value={f.cliente} onChange={e => setF(p => ({ ...p, cliente: e.target.value }))} className={inp} /></div>
        <div><label className="text-xs text-white/40 mb-1 block">Celular</label>
          <input type="text" placeholder="300..." value={f.celular} onChange={e => setF(p => ({ ...p, celular: e.target.value }))} className={inp} /></div>
        <div><label className="text-xs text-white/40 mb-1 block">Estado *</label>
          <select required value={f.estado} onChange={e => setF(p => ({ ...p, estado: e.target.value }))} className={sel}>
            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Marca *</label>
          {modoMarcaNueva ? (
            <div className="flex gap-2">
              <input type="text" required placeholder="Naviforce..." value={f.marca} onChange={e => setF(p => ({ ...p, marca: e.target.value }))} className={inp} />
              {marcasDisponibles.length > 0 && (
                <button type="button" onClick={() => { setModoMarcaNueva(false); setF(p => ({ ...p, marca: '' })); }} className="text-xs text-white/40 hover:text-white whitespace-nowrap px-2">
                  Elegir existente
                </button>
              )}
            </div>
          ) : (
            <select required value={f.marca} onChange={e => handleMarcaChange(e.target.value)} className={sel}>
              <option value="">Seleccionar marca…</option>
              {marcasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
              <option value={NUEVA_MARCA}>+ Nueva marca</option>
            </select>
          )}
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Modelo *</label>
          {!modoModeloNuevo && modeloOpciones.length > 0 ? (
            <select required value={f.modelo} onChange={e => handleModeloSelectChange(e.target.value)} className={sel}>
              <option value="">Seleccionar producto…</option>
              {modeloOpciones.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
              <option value={NUEVO_MODELO}>+ Nuevo modelo (no listado)</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input type="text" required placeholder="NF 7105..." value={f.modelo} onChange={e => setF(p => ({ ...p, modelo: e.target.value }))} className={inp} />
              {modeloOpciones.length > 0 && (
                <button type="button" onClick={() => { setModoModeloNuevo(false); setF(p => ({ ...p, modelo: '' })); }} className="text-xs text-white/40 hover:text-white whitespace-nowrap px-2">
                  Elegir existente
                </button>
              )}
            </div>
          )}
        </div>
        <div><label className="text-xs text-white/40 mb-1 block">Estilo</label>
          {estilosDisponibles.length > 0 ? (
            <select value={f.estilo} onChange={e => setF(p => ({ ...p, estilo: e.target.value }))} className={sel}>
              <option value="">Seleccionar…</option>
              {estilosDisponibles.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          ) : (
            <input type="text" placeholder="Automático..." value={f.estilo} onChange={e => setF(p => ({ ...p, estilo: e.target.value }))} className={inp} />
          )}
        </div>
        <div><label className="text-xs text-white/40 mb-1 block">Fuente</label>
          <select value={f.fuente} onChange={e => setF(p => ({ ...p, fuente: e.target.value }))} className={sel}>
            <option value="">—</option>
            {FUENTES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div><label className="text-xs text-white/40 mb-1 block">Precio Venta *</label>
          <input type="number" required min="0" placeholder="250000" value={f.precioVenta}
            onChange={e => setF(p => recalcEstado({ ...p, precioVenta: e.target.value }))} className={inp} /></div>
        <div><label className="text-xs text-white/40 mb-1 block">Precio Cierre</label>
          <input type="number" readOnly tabIndex={-1} value={precioCierreActual ?? ''} placeholder="Auto"
            className={inp + ' opacity-50 cursor-not-allowed'} /></div>
        <div><label className="text-xs text-white/40 mb-1 block">Costo Envío</label>
          <input type="number" min="0" placeholder="0" value={f.costoEnvio}
            onChange={e => setF(p => ({ ...p, costoEnvio: e.target.value }))} className={inp} /></div>
        <div><label className="text-xs text-white/40 mb-1 block">Abono/Pago *</label>
          <input type="number" required min="0" placeholder="250000" value={f.abono}
            onChange={e => setF(p => recalcEstado({ ...p, abono: e.target.value }))} className={inp} /></div>
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

function exportCSV(data: Venta[]) {
  const headers = ['Fecha','Cliente','Celular','Marca','Modelo','Estilo','Precio Venta','Costo','Envío','Abono','Saldo Pendiente','Ganancia','Fuente','Estado'];
  const rows = data.map((v) => [
    fmtFecha(v.fecha), v.cliente, v.celular ?? '', v.marca, v.modelo, v.estilo ?? '',
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
  const [data, setData]         = useState<Venta[]>([]);
  const [meta, setMeta]         = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage]         = useState(1);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFuente, setFiltroFuente] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [desde, setDesde]       = useState('');
  const [hasta, setHasta]       = useState('');
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [guardando, setGuardando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [formError, setFormError] = useState('');
  const [resumen, setResumen] = useState({ totalVendido: 0, pendienteCobro: 0 });
  const [editId, setEditId]     = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [editError, setEditError] = useState('');
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [inventario, setInventario] = useState<InvItem[]>([]);
  const [precios, setPrecios]       = useState<PrecioItem[]>([]);
  const [productos, setProductos]   = useState<ProductoItem[]>([]);
  const [marcas, setMarcas]         = useState<string[]>([]);
  const [errorOpciones, setErrorOpciones] = useState(false);

  const cargar = useCallback((p: number) => {
    setCargando(true);
    const params: Record<string, string> = { page: String(p), limit: '20' };
    if (filtroEstado) params.estado = filtroEstado;
    if (filtroFuente) params.fuente = filtroFuente;
    if (filtroCategoria) params.categoria = filtroCategoria;
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    api.get<Paginado>('/metrics/sales', { params })
      .then(({ data: res }) => {
        setData(res.data);
        setMeta({ total: res.meta.total, page: res.meta.page, pages: res.meta.totalPages });
        setResumen(res.agregados);
      })
      .finally(() => setCargando(false));
  }, [filtroEstado, filtroFuente, filtroCategoria, desde, hasta]);

  useEffect(() => { setPage(1); cargar(1); }, [filtroEstado, filtroFuente, filtroCategoria, desde, hasta, cargar]);
  useRefetchOnFocus(useCallback(() => cargar(page), [cargar, page]));
  useEffect(() => {
    Promise.allSettled([
      api.get<InvItem[]>('/inventario').then(({ data }) => setInventario(data)),
      api.get<PrecioItem[]>('/precios').then(({ data }) => setPrecios(data)),
      api.get<ProductoItem[]>('/products').then(({ data }) => setProductos(data)),
      api.get<string[]>('/marcas').then(({ data }) => setMarcas(data)),
    ]).then((results) => setErrorOpciones(results.some((r) => r.status === 'rejected')));
  }, []);

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
        fecha: form.fecha, cliente: form.cliente,
        celular: form.celular || undefined,
        marca: form.marca, modelo: form.modelo, estilo: form.estilo || undefined,
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

  const handleEdit = (v: Venta) => {
    setEditId(v.id);
    setEditError('');
    setShowForm(false);
    setEditForm({
      fecha:         v.fecha.split('T')[0],
      cliente:       v.cliente,
      celular:       v.celular ?? '',
      marca:         v.marca,
      modelo:        v.modelo,
      estilo:        v.estilo ?? '',
      precioVenta:   String(v.precioVenta),
      costoProducto: String(v.costoProducto),
      costoEnvio:    String(v.costoEnvio),
      abono:         String(v.abono),
      fuente:        v.fuente ?? '',
      estado:        v.estado,
    });
  };

  const handleEditSave = async () => {
    setGuardando(true);
    setEditError('');
    try {
      await api.put(`/ventas/${editId}`, {
        fecha:         editForm.fecha,
        cliente:       editForm.cliente,
        celular:       editForm.celular || undefined,
        marca:         editForm.marca,
        modelo:        editForm.modelo,
        estilo:        editForm.estilo || undefined,
        precioVenta:   Number(editForm.precioVenta),
        costoProducto: Number(editForm.costoProducto),
        costoEnvio:    Number(editForm.costoEnvio),
        abono:         Number(editForm.abono),
        fuente:        editForm.fuente || undefined,
        estado:        editForm.estado,
      });
      setEditId(null);
      cargar(page);
    } catch (err: any) {
      setEditError(err?.response?.data?.message ?? 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta venta? Se revertirá el descuento de inventario.')) return;
    setEliminando(id);
    try {
      await api.delete(`/ventas/${id}`);
      cargar(page);
    } finally { setEliminando(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
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
          <button onClick={() => { setShowForm(!showForm); setEditId(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
            style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? 'Cancelar' : 'Nueva venta'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-lg p-4" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Vendido</p>
          <p className="text-lg font-semibold text-white">{COP(resumen.totalVendido)}</p>
        </div>
        <div className="rounded-lg p-4" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Pendiente de Cobro</p>
          <p className="text-lg font-semibold text-yellow-400">{COP(resumen.pendienteCobro)}</p>
        </div>
      </div>

      {showForm && (
        <VentaForm
          title="Registrar nueva venta"
          f={form} setF={setForm}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          error={formError} saving={guardando} submitLabel="Guardar venta"
          marcas={marcas} inventario={inventario} precios={precios} productos={productos} errorOpciones={errorOpciones}
        />
      )}

      {editId && (
        <VentaForm
          title="Editar venta"
          f={editForm} setF={setEditForm}
          onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}
          onCancel={() => { setEditId(null); setEditError(''); }}
          error={editError} saving={guardando} submitLabel="Guardar cambios"
          marcas={marcas} precios={precios} productos={productos} errorOpciones={errorOpciones}
        />
      )}

      <div className="flex flex-wrap gap-3 mb-5">
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none cursor-pointer">
          <option value="">Todos los estados</option>
          {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filtroFuente} onChange={e => setFiltroFuente(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none cursor-pointer">
          <option value="">Todas las fuentes</option>
          {FUENTES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none cursor-pointer">
          <option value="">Todas las categorías</option>
          {CATEGORIAS_FILTRO.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-white/40 whitespace-nowrap">Desde</label>
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none" style={{ colorScheme: 'dark' }} />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-white/40 whitespace-nowrap">Hasta</label>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none" style={{ colorScheme: 'dark' }} />
        </div>
        {(filtroEstado || filtroFuente || filtroCategoria || desde || hasta) && (
          <button onClick={() => { setFiltroEstado(''); setFiltroFuente(''); setFiltroCategoria(''); setDesde(''); setHasta(''); }} className="text-xs text-white/40 hover:text-white/70 px-2">Limpiar</button>
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
                {['Fecha','Cliente','Celular','Marca','Modelo','Estilo','Precio','Costo','Envío','Abono','Saldo Pendiente','Ganancia','Fuente','Estado',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {data.map(v => {
                const cfg       = ESTADO_CONFIG[v.estado] ?? { label: v.estado, color: '#6B7280' };
                const isEditing = editId === v.id;
                return (
                  <tr key={v.id} className={`transition-colors ${isEditing ? 'bg-[#C9A84C]/5' : 'hover:bg-white/5'}`}>
                    <td className="px-4 py-3 text-white/70 whitespace-nowrap">{fmtFecha(v.fecha)}</td>
                    <td className="px-4 py-3 text-white whitespace-nowrap">{v.cliente}</td>
                    <td className="px-4 py-3 text-white/50">{v.celular ?? '—'}</td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{v.marca}</td>
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
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Check size={14} className="text-[#C9A84C]" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(v)} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(v.id)} disabled={eliminando === v.id}
                            className="p-1.5 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 disabled:opacity-40">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
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
