import type { ItemInventario } from '../../api/inventario';
import type { Precio } from '../../api/precios';
import type { ProductoAdmin } from '../../api/products';
import { useMarcaModeloToggle, NUEVA_MARCA, NUEVO_MODELO } from '../../hooks/useMarcaModeloToggle';
import { ESTADOS, FUENTES, recalcEstado, type FormState } from './venta-form';

// Estilos definidos a nivel de módulo para que VentaForm no los pierda en cada render
const inp = 'bg-[#0A0A0A] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 w-full';
const sel = inp + ' cursor-pointer';

export function VentaForm({ title, f, setF, onSubmit, onCancel, error, saving, submitLabel, marcas, inventario, precios, productos, errorOpciones }: {
  title: string; f: FormState; setF: (fn: (prev: FormState) => FormState) => void;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void;
  error: string; saving: boolean; submitLabel: string;
  marcas?: string[]; inventario?: ItemInventario[]; precios?: Precio[]; productos?: ProductoAdmin[];
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
