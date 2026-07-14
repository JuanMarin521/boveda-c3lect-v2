import { useEffect, useState } from 'react';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const NUEVO_MODELO = '__nuevo__';
const NUEVA_MARCA = '__nueva__';

interface Precio {
  id: string; marca: string; modelo: string; costoUnitario: number; costoAdicional: number;
  costoTotal: number; precioPublico: number | null; precioCierre: number | null;
  gananciaMinima: number | null;
}
interface InvItem { marca: string | null; modelo: string }

const EMPTY_FORM = {
  marca: '', modelo: '', costoUnitario: '', costoAdicional: '25028',
  precioPublico: '', precioCierre: '',
};

export default function AdminPrecios() {
  const [items, setItems]   = useState<Precio[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [inventarioItems, setInventarioItems] = useState<InvItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [modoMarcaNueva, setModoMarcaNueva] = useState(false);
  const [modoModeloNuevo, setModoModeloNuevo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const cargar = () => {
    setCargando(true);
    api.get<Precio[]>('/precios').then(({ data }) => setItems(data)).finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);
  useRefetchOnFocus(cargar);
  useEffect(() => {
    api.get<string[]>('/marcas').then(({ data }) => setMarcas(data)).catch(() => {});
    api.get<InvItem[]>('/inventario').then(({ data }) => setInventarioItems(data)).catch(() => {});
  }, []);

  const modelosPorMarca: Record<string, string[]> = {};
  for (const item of inventarioItems) {
    if (!item.marca) continue;
    if (!modelosPorMarca[item.marca]) modelosPorMarca[item.marca] = [];
    if (!modelosPorMarca[item.marca].includes(item.modelo)) modelosPorMarca[item.marca].push(item.modelo);
  }
  for (const key of Object.keys(modelosPorMarca)) modelosPorMarca[key].sort();
  const modelosDisponibles = modelosPorMarca[form.marca] ?? [];

  function handleMarcaChange(value: string) {
    if (value === NUEVA_MARCA) {
      setModoMarcaNueva(true);
      setModoModeloNuevo(true);
      setForm(f => ({ ...f, marca: '', modelo: '' }));
    } else {
      setModoMarcaNueva(false);
      setModoModeloNuevo(false);
      setForm(f => ({ ...f, marca: value, modelo: '' }));
    }
  }

  function handleModeloChange(value: string) {
    if (value === NUEVO_MODELO) {
      setModoModeloNuevo(true);
      setForm(f => ({ ...f, modelo: '' }));
    } else {
      setForm(f => ({ ...f, modelo: value }));
    }
  }

  const costoTotalPreview = Number(form.costoUnitario || 0) + Number(form.costoAdicional || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setGuardando(true);
    try {
      await api.post('/precios', {
        marca: form.marca,
        modelo: form.modelo,
        costoUnitario: Number(form.costoUnitario),
        costoAdicional: Number(form.costoAdicional),
        precioPublico: form.precioPublico ? Number(form.precioPublico) : undefined,
        precioCierre: form.precioCierre ? Number(form.precioCierre) : undefined,
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      setModoMarcaNueva(false);
      setModoModeloNuevo(false);
      cargar();
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const handleEdit = (p: Precio) => {
    setEditId(p.id);
    setEditForm({
      costoUnitario: String(p.costoUnitario),
      costoAdicional: String(p.costoAdicional),
      precioPublico: p.precioPublico != null ? String(p.precioPublico) : '',
      precioCierre: p.precioCierre != null ? String(p.precioCierre) : '',
    });
  };

  const [editError, setEditError] = useState('');

  const handleEditSave = async (id: string) => {
    setGuardando(true);
    setEditError('');
    try {
      await api.put(`/precios/${id}`, {
        costoUnitario: editForm.costoUnitario ? Number(editForm.costoUnitario) : undefined,
        costoAdicional: editForm.costoAdicional ? Number(editForm.costoAdicional) : undefined,
        precioPublico: editForm.precioPublico ? Number(editForm.precioPublico) : undefined,
        precioCierre: editForm.precioCierre ? Number(editForm.precioCierre) : undefined,
      });
      setEditId(null);
      cargar();
    } catch (err: any) {
      setEditError(err?.response?.data?.message ?? 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const inp = "bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 w-full";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Cálculo de Precios</h1>
          <p className="text-sm text-white/40">{items.length} productos</p>
        </div>
        <div className="flex gap-2">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
          style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Cancelar' : 'Nuevo producto'}
        </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-5 mb-5" style={{ background: '#161616', borderColor: 'rgba(201,168,76,0.2)' }}>
          <h2 className="text-sm font-medium text-[#C9A84C] mb-4">Agregar producto a tabla de precios</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div><label className="text-xs text-white/40 mb-1 block">Marca *</label>
              {modoMarcaNueva ? (
                <div className="flex gap-2">
                  <input type="text" required placeholder="Naviforce..." value={form.marca} onChange={e => setForm(f => ({...f, marca: e.target.value}))} className={inp} />
                  {marcas.length > 0 && (
                    <button type="button" onClick={() => { setModoMarcaNueva(false); setForm(f => ({...f, marca: ''})); }} className="text-xs text-white/40 hover:text-white whitespace-nowrap px-2">
                      Elegir existente
                    </button>
                  )}
                </div>
              ) : (
                <select required value={form.marca} onChange={e => handleMarcaChange(e.target.value)} className={inp + ' cursor-pointer'}>
                  <option value="">Seleccionar marca…</option>
                  {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value={NUEVA_MARCA}>+ Nueva marca</option>
                </select>
              )}
            </div>
            <div className="md:col-span-2"><label className="text-xs text-white/40 mb-1 block">Modelo *</label>
              {modoModeloNuevo ? (
                <div className="flex gap-2">
                  <input type="text" required placeholder="NF 7105..." value={form.modelo} onChange={e => setForm(f => ({...f, modelo: e.target.value}))} className={inp} />
                  {modelosDisponibles.length > 0 && (
                    <button type="button" onClick={() => { setModoModeloNuevo(false); setForm(f => ({...f, modelo: ''})); }} className="text-xs text-white/40 hover:text-white whitespace-nowrap px-2">
                      Elegir existente
                    </button>
                  )}
                </div>
              ) : (
                <select required value={form.modelo} onChange={e => handleModeloChange(e.target.value)} className={inp + ' cursor-pointer'}>
                  <option value="">Seleccionar modelo…</option>
                  {modelosDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value={NUEVO_MODELO}>+ Nuevo modelo (no listado)</option>
                </select>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div><label className="text-xs text-white/40 mb-1 block">Costo Unitario *</label><input type="number" required min="0" placeholder="80000" value={form.costoUnitario} onChange={e => setForm(f => ({...f, costoUnitario: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Costo Adicional</label><input type="number" min="0" value={form.costoAdicional} onChange={e => setForm(f => ({...f, costoAdicional: e.target.value}))} className={inp} /></div>
            <div className="flex flex-col justify-end">
              <label className="text-xs text-white/40 mb-1 block">Costo Total (auto)</label>
              <div className="px-3 py-2 rounded text-sm font-medium text-[#C9A84C]" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
                {COP(costoTotalPreview)}
              </div>
            </div>
            <div><label className="text-xs text-white/40 mb-1 block">Precio Público</label><input type="number" min="0" placeholder="180000" value={form.precioPublico} onChange={e => setForm(f => ({...f, precioPublico: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Precio Cierre</label><input type="number" min="0" placeholder="150000" value={form.precioCierre} onChange={e => setForm(f => ({...f, precioCierre: e.target.value}))} className={inp} /></div>
          </div>
          {formError && <p className="text-xs text-red-400 mb-3">{formError}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancelar</button>
            <button type="submit" disabled={guardando} className="px-5 py-2 rounded text-sm font-medium" style={{ background: '#C9A84C', color: '#000' }}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border overflow-x-auto" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" /></div>
        ) : items.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-16">Sin productos. Agrega una compra para poblar esta tabla automáticamente.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {['Marca','Modelo','Costo U.','Costo Adicional','Costo Total','Precio Público','Precio Cierre','Gan. Mínima',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {items.map(p => {
                const isEditing = editId === p.id;
                const editTotal = isEditing ? Number(editForm.costoUnitario || 0) + Number(editForm.costoAdicional || 0) : 0;
                const editGanancia = isEditing && editForm.precioCierre ? Number(editForm.precioCierre) - editTotal : null;
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{p.marca}</td>
                    <td className="px-4 py-3 text-white max-w-[180px] truncate">{p.modelo}</td>
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2"><input type="number" value={editForm.costoUnitario} onChange={e => setEditForm(f => ({...f, costoUnitario: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-24" /></td>
                        <td className="px-4 py-2"><input type="number" value={editForm.costoAdicional} onChange={e => setEditForm(f => ({...f, costoAdicional: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-24" /></td>
                        <td className="px-4 py-3 text-[#C9A84C] whitespace-nowrap">{COP(editTotal)}</td>
                        <td className="px-4 py-2"><input type="number" value={editForm.precioPublico} onChange={e => setEditForm(f => ({...f, precioPublico: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-28" /></td>
                        <td className="px-4 py-2"><input type="number" value={editForm.precioCierre} onChange={e => setEditForm(f => ({...f, precioCierre: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-28" /></td>
                        <td className="px-4 py-3 text-white/60 whitespace-nowrap">{editGanancia != null ? COP(editGanancia) : '—'}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                              <button onClick={() => handleEditSave(p.id)} disabled={guardando} className="p-1.5 rounded hover:bg-green-500/20 text-green-400"><Check size={14} /></button>
                              <button onClick={() => { setEditId(null); setEditError(''); }} className="p-1.5 rounded hover:bg-white/10 text-white/40"><X size={14} /></button>
                            </div>
                            {editError && <p className="text-xs text-red-400 whitespace-nowrap">{editError}</p>}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-white/70 whitespace-nowrap">{COP(p.costoUnitario)}</td>
                        <td className="px-4 py-3 text-white/50 whitespace-nowrap">{COP(p.costoAdicional)}</td>
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{COP(p.costoTotal)}</td>
                        <td className="px-4 py-3 text-white/70 whitespace-nowrap">{p.precioPublico != null ? COP(p.precioPublico) : '—'}</td>
                        <td className="px-4 py-3 text-white/70 whitespace-nowrap">{p.precioCierre != null ? COP(p.precioCierre) : '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {p.gananciaMinima != null
                            ? <span className={p.gananciaMinima >= 0 ? 'text-green-400' : 'text-red-400'}>{COP(p.gananciaMinima)}</span>
                            : <span className="text-white/30">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white"><Pencil size={14} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
