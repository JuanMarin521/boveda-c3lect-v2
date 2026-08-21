import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { api } from '../../lib/api';
import type { Producto } from '../../data/types';

type Alcance = 'PRODUCTO' | 'CATEGORIA' | 'MARCA' | 'TODOS';

interface PromocionForm {
  nombre: string;
  alcance: Alcance;
  porcentaje: string;
  productosIncluidos: string[];
  categoria: string;
  marca: string;
  excluidos: string[];
  soloCuentaActiva: boolean;
  fechaInicio: string; // datetime-local
  fechaFin: string;    // datetime-local
  activo: boolean;
}

const EMPTY: PromocionForm = {
  nombre: '', alcance: 'TODOS', porcentaje: '10',
  productosIncluidos: [], categoria: '', marca: '', excluidos: [],
  soloCuentaActiva: false, fechaInicio: '', fechaFin: '', activo: true,
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// datetime-local no lleva timezone — el navegador lo interpreta como hora
// local, que es lo que queremos (el admin opera desde Bogotá). Al guardar,
// new Date(valor) ya produce el instante correcto y toISOString() lo manda
// en UTC al backend.
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Field({
  label, id, value, onChange, type = 'text', required,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-white/50 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded border outline-none transition-colors focus:border-[#C9A84C]/50"
        style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', colorScheme: 'dark' }}
      />
    </div>
  );
}

export default function AdminPromocionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const volverA = (location.state as { from?: string } | null)?.from ?? '/admin/promociones';
  const isEdit = !!id && id !== 'nuevo';
  const [form, setForm] = useState<PromocionForm>(EMPTY);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(isEdit);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<keyof PromocionForm, string>>>({});
  const [errorGlobal, setErrorGlobal] = useState('');

  useEffect(() => {
    api.get<Producto[]>('/products').then(({ data }) => setProductos(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/promotions/${id}`)
      .then(({ data }: { data: Record<string, unknown> }) => {
        setForm({
          nombre: String(data.nombre ?? ''),
          alcance: (data.alcance as Alcance) ?? 'TODOS',
          porcentaje: String(data.porcentaje ?? ''),
          productosIncluidos: Array.isArray(data.productosIncluidos) ? data.productosIncluidos as string[] : [],
          categoria: String(data.categoria ?? ''),
          marca: String(data.marca ?? ''),
          excluidos: Array.isArray(data.excluidos) ? data.excluidos as string[] : [],
          soloCuentaActiva: Boolean(data.soloCuentaActiva ?? false),
          fechaInicio: toDatetimeLocal(String(data.fechaInicio)),
          fechaFin: toDatetimeLocal(String(data.fechaFin)),
          activo: Boolean(data.activo ?? true),
        });
      })
      .catch(() => setErrorGlobal('No se pudo cargar la promoción.'))
      .finally(() => setCargando(false));
  }, [id, isEdit]);

  const set = <K extends keyof PromocionForm>(key: K) => (v: PromocionForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  function toggleEnLista(key: 'productosIncluidos' | 'excluidos', productoId: string) {
    setForm((prev) => {
      const lista = prev[key];
      const next = lista.includes(productoId) ? lista.filter((x) => x !== productoId) : [...lista, productoId];
      return { ...prev, [key]: next };
    });
  }

  function validate() {
    const errs: typeof errores = {};
    if (!form.nombre.trim()) errs.nombre = 'Requerido';
    const pct = Number(form.porcentaje);
    if (!form.porcentaje || isNaN(pct) || pct < 1 || pct > 100) errs.porcentaje = 'Debe ser entre 1 y 100';
    if (form.alcance === 'CATEGORIA' && !form.categoria) errs.categoria = 'Requerido para alcance Categoría';
    if (form.alcance === 'MARCA' && !form.marca.trim()) errs.marca = 'Requerido para alcance Marca';
    if (form.alcance === 'PRODUCTO' && form.productosIncluidos.length === 0) {
      errs.productosIncluidos = 'Selecciona al menos un producto';
    }
    if (!form.fechaInicio) errs.fechaInicio = 'Requerido';
    if (!form.fechaFin) errs.fechaFin = 'Requerido';
    if (form.fechaInicio && form.fechaFin && new Date(form.fechaFin) <= new Date(form.fechaInicio)) {
      errs.fechaFin = 'Debe ser posterior a la fecha de inicio';
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  }

  async function guardar() {
    if (!validate()) return;
    setGuardando(true);
    setErrorGlobal('');

    const payload: Record<string, unknown> = {
      nombre: form.nombre,
      alcance: form.alcance,
      porcentaje: Number(form.porcentaje),
      excluidos: form.excluidos,
      soloCuentaActiva: form.soloCuentaActiva,
      fechaInicio: new Date(form.fechaInicio).toISOString(),
      fechaFin: new Date(form.fechaFin).toISOString(),
      activo: form.activo,
    };
    if (form.alcance === 'PRODUCTO') payload.productosIncluidos = form.productosIncluidos;
    if (form.alcance === 'CATEGORIA') payload.categoria = form.categoria;
    if (form.alcance === 'MARCA') payload.marca = form.marca;

    try {
      if (isEdit) {
        await api.patch(`/promotions/${id}`, payload);
      } else {
        await api.post('/promotions', payload);
      }
      navigate(volverA);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message;
      setErrorGlobal(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar'));
    } finally {
      setGuardando(false);
    }
  }

  const marcasDisponibles = Array.from(new Set(productos.map((p) => p.marca).filter((m): m is string => !!m))).sort();

  if (cargando) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          {isEdit ? 'Editar promoción' : 'Nueva promoción'}
        </h1>
      </div>

      {errorGlobal && (
        <div className="mb-5 px-4 py-3 rounded text-sm text-red-400 border border-red-500/20 bg-red-500/5">
          {errorGlobal}
        </div>
      )}

      <div className="space-y-5">
        <section className="rounded-lg p-5 border space-y-4" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white">Datos básicos</h2>

          <div>
            <Field label="Nombre" id="nombre" value={form.nombre} onChange={set('nombre')} required />
            {errores.nombre && <p className="text-xs text-red-400 mt-1">{errores.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Alcance<span className="text-red-400 ml-0.5">*</span></label>
              <select
                value={form.alcance}
                onChange={(e) => set('alcance')(e.target.value as Alcance)}
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <option value="TODOS">Todos los productos</option>
                <option value="CATEGORIA">Categoría</option>
                <option value="MARCA">Marca</option>
                <option value="PRODUCTO">Productos específicos</option>
              </select>
            </div>
            <div>
              <Field label="Descuento (%)" id="porcentaje" value={form.porcentaje} onChange={set('porcentaje')} type="number" required />
              {errores.porcentaje && <p className="text-xs text-red-400 mt-1">{errores.porcentaje}</p>}
            </div>
          </div>

          {form.alcance === 'CATEGORIA' && (
            <div>
              <label className="block text-xs text-white/50 mb-1">Categoría<span className="text-red-400 ml-0.5">*</span></label>
              <select
                value={form.categoria}
                onChange={(e) => set('categoria')(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <option value="">Seleccionar…</option>
                <option value="reloj">Relojes</option>
                <option value="perfume">Perfumes</option>
                <option value="accesorio">Accesorios</option>
              </select>
              {errores.categoria && <p className="text-xs text-red-400 mt-1">{errores.categoria}</p>}
            </div>
          )}

          {form.alcance === 'MARCA' && (
            <div>
              <label className="block text-xs text-white/50 mb-1">Marca<span className="text-red-400 ml-0.5">*</span></label>
              <input
                list="marcas-disponibles"
                value={form.marca}
                onChange={(e) => set('marca')(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <datalist id="marcas-disponibles">
                {marcasDisponibles.map((m) => <option key={m} value={m} />)}
              </datalist>
              {errores.marca && <p className="text-xs text-red-400 mt-1">{errores.marca}</p>}
            </div>
          )}

          {form.alcance === 'PRODUCTO' && (
            <div>
              <label className="block text-xs text-white/50 mb-1">Productos incluidos<span className="text-red-400 ml-0.5">*</span></label>
              <div className="max-h-48 overflow-y-auto rounded border p-2 space-y-1" style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#111' }}>
                {productos.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm text-white/70 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={form.productosIncluidos.includes(p.id)}
                      onChange={() => toggleEnLista('productosIncluidos', p.id)}
                    />
                    {p.display}
                  </label>
                ))}
              </div>
              {errores.productosIncluidos && <p className="text-xs text-red-400 mt-1">{errores.productosIncluidos}</p>}
            </div>
          )}

          {form.alcance !== 'PRODUCTO' && (
            <div>
              <label className="block text-xs text-white/50 mb-1">Excluir productos (opcional)</label>
              <div className="max-h-48 overflow-y-auto rounded border p-2 space-y-1" style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#111' }}>
                {productos.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm text-white/70 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={form.excluidos.includes(p.id)}
                      onChange={() => toggleEnLista('excluidos', p.id)}
                    />
                    {p.display}
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              onClick={() => set('soloCuentaActiva')(!form.soloCuentaActiva)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.soloCuentaActiva ? 'bg-[#C9A84C]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.soloCuentaActiva ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-xs text-white/60">Solo para compradores con cuenta activa (logueados)</span>
          </label>
        </section>

        <section className="rounded-lg p-5 border space-y-4" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white">Vigencia</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Field label="Fecha y hora de inicio" id="fechaInicio" value={form.fechaInicio} onChange={set('fechaInicio')} type="datetime-local" required />
              {errores.fechaInicio && <p className="text-xs text-red-400 mt-1">{errores.fechaInicio}</p>}
            </div>
            <div>
              <Field label="Fecha y hora de fin" id="fechaFin" value={form.fechaFin} onChange={set('fechaFin')} type="datetime-local" required />
              {errores.fechaFin && <p className="text-xs text-red-400 mt-1">{errores.fechaFin}</p>}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              onClick={() => set('activo')(!form.activo)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.activo ? 'bg-[#C9A84C]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.activo ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-xs text-white/60">Activa (interruptor manual — desactívala sin borrar la promoción)</span>
          </label>
        </section>

        <div className="flex gap-3 justify-end pb-4">
          <button
            type="button"
            onClick={() => navigate(volverA)}
            className="px-5 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="px-5 py-2 text-sm rounded font-medium text-black disabled:opacity-60"
            style={{ background: '#C9A84C' }}
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
