import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { api } from '../../lib/api';
import { formatPrecio as COP, formatFecha as fmtFecha } from '../../lib/format';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

interface Gasto {
  id: string; fecha: string; concepto: string; monto: number;
  responsable: string | null; estado: string | null;
}

const EMPTY_FORM = {
  fecha: new Date().toISOString().split('T')[0],
  concepto: '', monto: '', responsable: '', estado: 'Pagado',
};

export default function AdminGastos() {
  const [gastos, setGastos]   = useState<Gasto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId]   = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<typeof EMPTY_FORM>>({});
  const [eliminando, setEliminando] = useState<string | null>(null);

  const cargar = () => {
    setCargando(true);
    api.get<Gasto[]>('/gastos').then(({ data }) => setGastos(data)).finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);
  useRefetchOnFocus(cargar);

  const total = gastos.reduce((s, g) => s + g.monto, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setGuardando(true);
    try {
      await api.post('/gastos', {
        fecha: form.fecha, concepto: form.concepto,
        monto: Number(form.monto),
        responsable: form.responsable || undefined,
        estado: form.estado || undefined,
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      cargar();
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const handleEdit = (g: Gasto) => {
    setEditId(g.id);
    setEditForm({ fecha: g.fecha.split('T')[0], concepto: g.concepto, monto: String(g.monto), responsable: g.responsable ?? '', estado: g.estado ?? '' });
  };

  const handleEditSave = async (id: string) => {
    setGuardando(true);
    try {
      await api.put(`/gastos/${id}`, { ...editForm, monto: Number(editForm.monto) });
      setEditId(null);
      cargar();
    } finally { setGuardando(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    setEliminando(id);
    try { await api.delete(`/gastos/${id}`); cargar(); }
    finally { setEliminando(null); }
  };

  const inp = "bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 w-full";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Gastos Adicionales</h1>
          <p className="text-sm text-white/40">Total: <span className="text-[#C9A84C]">{COP(total)}</span></p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
          style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Cancelar' : 'Nuevo gasto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-5 mb-5" style={{ background: '#161616', borderColor: 'rgba(201,168,76,0.2)' }}>
          <h2 className="text-sm font-medium text-[#C9A84C] mb-4">Registrar nuevo gasto</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div><label className="text-xs text-white/40 mb-1 block">Fecha *</label><input type="date" required value={form.fecha} onChange={e => setForm(f => ({...f, fecha: e.target.value}))} className={inp} /></div>
            <div className="md:col-span-2"><label className="text-xs text-white/40 mb-1 block">Concepto *</label><input type="text" required placeholder="Ej: Empaque, transporte..." value={form.concepto} onChange={e => setForm(f => ({...f, concepto: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Monto *</label><input type="number" required min="0" placeholder="50000" value={form.monto} onChange={e => setForm(f => ({...f, monto: e.target.value}))} className={inp} /></div>
            <div><label className="text-xs text-white/40 mb-1 block">Estado</label>
              <select value={form.estado} onChange={e => setForm(f => ({...f, estado: e.target.value}))} className={inp + " cursor-pointer"}>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-white/40 mb-1 block">Responsable</label>
            <input type="text" placeholder="Admin" value={form.responsable} onChange={e => setForm(f => ({...f, responsable: e.target.value}))} className={inp + " max-w-xs"} />
          </div>
          {formError && <p className="text-xs text-red-400 mb-3">{formError}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancelar</button>
            <button type="submit" disabled={guardando} className="px-5 py-2 rounded text-sm font-medium" style={{ background: '#C9A84C', color: '#000' }}>
              {guardando ? 'Guardando…' : 'Guardar gasto'}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border overflow-x-auto" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" /></div>
        ) : gastos.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-16">Sin gastos registrados</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {['Fecha','Concepto','Monto','Responsable','Estado',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {gastos.map(g => {
                const isEditing = editId === g.id;
                return (
                  <tr key={g.id} className="hover:bg-white/5 transition-colors">
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2"><input type="date" value={editForm.fecha} onChange={e => setEditForm(f => ({...f, fecha: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-full" /></td>
                        <td className="px-4 py-2"><input type="text" value={editForm.concepto} onChange={e => setEditForm(f => ({...f, concepto: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-full" /></td>
                        <td className="px-4 py-2"><input type="number" value={editForm.monto} onChange={e => setEditForm(f => ({...f, monto: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-28" /></td>
                        <td className="px-4 py-2"><input type="text" value={editForm.responsable} onChange={e => setEditForm(f => ({...f, responsable: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white w-full" /></td>
                        <td className="px-4 py-2">
                          <select value={editForm.estado} onChange={e => setEditForm(f => ({...f, estado: e.target.value}))} className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-white">
                            <option>Pagado</option><option>Pendiente</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1">
                            <button onClick={() => handleEditSave(g.id)} disabled={guardando} className="p-1.5 rounded hover:bg-green-500/20 text-green-400"><Check size={14} /></button>
                            <button onClick={() => setEditId(null)} className="p-1.5 rounded hover:bg-white/10 text-white/40"><X size={14} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-white/70 whitespace-nowrap">{fmtFecha(g.fecha)}</td>
                        <td className="px-4 py-3 text-white">{g.concepto}</td>
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{COP(g.monto)}</td>
                        <td className="px-4 py-3 text-white/50">{g.responsable ?? '—'}</td>
                        <td className="px-4 py-3">
                          {g.estado && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: g.estado === 'Pagado' ? '#22C55E20' : '#EAB30820', color: g.estado === 'Pagado' ? '#22C55E' : '#EAB308' }}>{g.estado}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => handleEdit(g)} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(g.id)} disabled={eliminando === g.id} className="p-1.5 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <td colSpan={2} className="px-4 py-3 text-xs text-white/40 uppercase tracking-wider">Total gastos</td>
                <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{COP(total)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
