import { Check, ChevronLeft, ChevronRight, Download, Pencil, Plus, Trash2, X } from 'lucide-react';
import { formatPrecio as COP, formatFecha as fmtFecha } from '../../lib/format';
import { useVentas } from '../ventas/useVentas';
import { VentaForm } from '../ventas/VentaForm';
import { CATEGORIAS_FILTRO, ESTADO_VENTA as ESTADO_CONFIG, ESTADOS, FUENTES } from '../ventas/venta-form';

export default function AdminVentas() {
  const {
    data, meta, page, cargando, resumen, handlePage,
    filtroEstado, setFiltroEstado, filtroFuente, setFiltroFuente,
    filtroCategoria, setFiltroCategoria, desde, setDesde, hasta, setHasta,
    marcas, inventario, precios, productos, errorOpciones,
    showForm, setShowForm, form, setForm, formError, handleSubmit,
    editId, setEditId, editForm, setEditForm, editError, setEditError,
    handleEdit, handleEditSave,
    guardando, exportando, handleExport, eliminando, handleDelete,
  } = useVentas();

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
