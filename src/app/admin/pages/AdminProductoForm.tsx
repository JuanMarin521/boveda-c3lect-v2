import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { api } from '../../lib/api';

interface ProductoForm {
  id: string;
  nombre: string;
  estilo: string;
  display: string;
  cat: string;
  marca: string;
  genero: string;
  precio: string;
  disponible: boolean;
  destacado: boolean;
  imgsRaw: string;
  specMovimiento: string;
  specDimensiones: string;
  specCaja: string;
  specCorrea: string;
  specCristal: string;
  specFunciones: string;
  specResistenciaAgua: string;
  specPeso: string;
  specBateria: string;
  specReservaMarcha: string;
  specObservaciones: string;
  notasDescripcion: string;
  notasTop: string;
  notasCorazon: string;
  notasBase: string;
}

const EMPTY: ProductoForm = {
  id: '', nombre: '', estilo: '', display: '', cat: 'reloj',
  marca: '', genero: '', precio: '', disponible: true, destacado: false, imgsRaw: '',
  specMovimiento: '', specDimensiones: '', specCaja: '', specCorrea: '',
  specCristal: '', specFunciones: '', specResistenciaAgua: '', specPeso: '',
  specBateria: '', specReservaMarcha: '', specObservaciones: '',
  notasDescripcion: '', notasTop: '', notasCorazon: '', notasBase: '',
};

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
        style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
      />
    </div>
  );
}

function TextArea({ label, id, value, onChange }: {
  label: string; id: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-white/50 mb-1">{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 text-sm rounded border outline-none resize-none transition-colors focus:border-[#C9A84C]/50"
        style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
      />
    </div>
  );
}

export default function AdminProductoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const volverA = (location.state as { from?: string } | null)?.from ?? '/admin/productos';
  const isEdit = !!id && id !== 'nuevo';
  const [form, setForm] = useState<ProductoForm>(EMPTY);
  const [cargando, setCargando] = useState(isEdit);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<keyof ProductoForm, string>>>({});
  const [errorGlobal, setErrorGlobal] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`)
      .then(({ data }: { data: Record<string, unknown> }) => {
        setForm({
          id: String(data.id ?? ''),
          nombre: String(data.nombre ?? ''),
          estilo: String(data.estilo ?? ''),
          display: String(data.display ?? ''),
          cat: String(data.cat ?? 'reloj'),
          marca: String(data.marca ?? ''),
          genero: String(data.genero ?? ''),
          precio: String(data.precio ?? ''),
          disponible: Boolean(data.disponible ?? true),
          destacado: Boolean(data.destacado ?? false),
          imgsRaw: Array.isArray(data.imgs) ? (data.imgs as string[]).join(', ') : '',
          specMovimiento: String(data.specMovimiento ?? ''),
          specDimensiones: String(data.specDimensiones ?? ''),
          specCaja: String(data.specCaja ?? ''),
          specCorrea: String(data.specCorrea ?? ''),
          specCristal: String(data.specCristal ?? ''),
          specFunciones: String(data.specFunciones ?? ''),
          specResistenciaAgua: String(data.specResistenciaAgua ?? ''),
          specPeso: String(data.specPeso ?? ''),
          specBateria: String(data.specBateria ?? ''),
          specReservaMarcha: String(data.specReservaMarcha ?? ''),
          specObservaciones: String(data.specObservaciones ?? ''),
          notasDescripcion: String(data.notasDescripcion ?? ''),
          notasTop: String(data.notasTop ?? ''),
          notasCorazon: String(data.notasCorazon ?? ''),
          notasBase: String(data.notasBase ?? ''),
        });
      })
      .catch(() => setErrorGlobal('No se pudo cargar el producto.'))
      .finally(() => setCargando(false));
  }, [id, isEdit]);

  const set = (key: keyof ProductoForm) => (v: string | boolean) =>
    setForm((prev) => {
      const next = { ...prev, [key]: v };
      if (key === 'nombre' || key === 'estilo') {
        next.display = `${next.nombre}${next.estilo ? ' — ' + next.estilo : ''}`;
      }
      return next;
    });

  function validate() {
    const errs: typeof errores = {};
    if (!form.nombre.trim()) errs.nombre = 'Requerido';
    if (!isEdit && !form.id.trim()) errs.id = 'Requerido';
    if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) <= 0)
      errs.precio = 'Precio inválido';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  }

  async function guardar() {
    if (!validate()) return;
    setGuardando(true);
    setErrorGlobal('');
    const imgs = form.imgsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      nombre: form.nombre,
      estilo: form.estilo,
      display: form.display || `${form.nombre}${form.estilo ? ' — ' + form.estilo : ''}`,
      cat: form.cat,
      precio: Number(form.precio),
      disponible: form.disponible,
      destacado: form.destacado,
      imgs,
    };
    if (form.marca) payload.marca = form.marca;
    if (form.genero) payload.genero = form.genero;

    if (form.cat === 'reloj') {
      if (form.specMovimiento) payload.specMovimiento = form.specMovimiento;
      if (form.specDimensiones) payload.specDimensiones = form.specDimensiones;
      if (form.specCaja) payload.specCaja = form.specCaja;
      if (form.specCorrea) payload.specCorrea = form.specCorrea;
      if (form.specCristal) payload.specCristal = form.specCristal;
      if (form.specFunciones) payload.specFunciones = form.specFunciones;
      if (form.specResistenciaAgua) payload.specResistenciaAgua = form.specResistenciaAgua;
      if (form.specPeso) payload.specPeso = form.specPeso;
      if (form.specBateria) payload.specBateria = form.specBateria;
      if (form.specReservaMarcha) payload.specReservaMarcha = form.specReservaMarcha;
      if (form.specObservaciones) payload.specObservaciones = form.specObservaciones;
    }

    if (form.cat === 'perfume') {
      if (form.notasDescripcion) payload.notasDescripcion = form.notasDescripcion;
      if (form.notasTop) payload.notasTop = form.notasTop;
      if (form.notasCorazon) payload.notasCorazon = form.notasCorazon;
      if (form.notasBase) payload.notasBase = form.notasBase;
    }

    try {
      if (isEdit) {
        await api.patch(`/products/${id}`, payload);
      } else {
        payload.id = form.id;
        await api.post('/products', payload);
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
          {isEdit ? 'Editar producto' : 'Nuevo producto'}
        </h1>
        <p className="text-sm text-white/40 mt-0.5">
          {isEdit ? `ID: ${id}` : 'Completa los datos del producto'}
        </p>
      </div>

      {errorGlobal && (
        <div className="mb-5 px-4 py-3 rounded text-sm text-red-400 border border-red-500/20 bg-red-500/5">
          {errorGlobal}
        </div>
      )}

      <div className="space-y-5">
        {/* Datos básicos */}
        <section className="rounded-lg p-5 border space-y-4" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white">Datos básicos</h2>

          {!isEdit && (
            <div>
              <Field label="ID" id="id" value={form.id} onChange={set('id')} required />
              {errores.id && <p className="text-xs text-red-400 mt-1">{errores.id}</p>}
              <p className="text-xs text-white/30 mt-1">Ej: r-fossil-chicago (sin espacios, con guiones)</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Field label="Nombre" id="nombre" value={form.nombre} onChange={set('nombre')} required />
              {errores.nombre && <p className="text-xs text-red-400 mt-1">{errores.nombre}</p>}
            </div>
            <Field label="Estilo / variante" id="estilo" value={form.estilo} onChange={set('estilo')} />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Display (auto)</label>
            <input
              readOnly
              value={form.display || `${form.nombre}${form.estilo ? ' — ' + form.estilo : ''}`}
              className="w-full px-3 py-2 text-sm rounded border text-white/40"
              style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Categoría<span className="text-red-400 ml-0.5">*</span></label>
              <select
                value={form.cat}
                onChange={(e) => set('cat')(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <option value="reloj">Reloj</option>
                <option value="perfume">Perfume</option>
                <option value="accesorio">Accesorio</option>
              </select>
            </div>
            <Field label="Marca" id="marca" value={form.marca} onChange={set('marca')} />
            <div>
              <label className="block text-xs text-white/50 mb-1">Género</label>
              <select
                value={form.genero}
                onChange={(e) => set('genero')(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <option value="">Sin especificar</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Field label="Precio (COP)" id="precio" value={form.precio} onChange={set('precio')} type="number" required />
              {errores.precio && <p className="text-xs text-red-400 mt-1">{errores.precio}</p>}
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set('disponible')(!form.disponible)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.disponible ? 'bg-[#C9A84C]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.disponible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-white/60">Disponible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set('destacado')(!form.destacado)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.destacado ? 'bg-[#C9A84C]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.destacado ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-white/60">Destacado en Home</span>
              </label>
            </div>
          </div>
          <p className="text-xs text-white/30">
            "Destacado en Home" lo muestra en el carrusel de la portada — solo si además está "Disponible" (si se vende, sale solo del carrusel). El orden en el carrusel se define arrastrando las filas en la lista de Productos con el filtro "Destacados" activo. El Home muestra máximo 5 a la vez, aunque marques más: si marcas 6, 7 u 8 como respaldo, cuando uno se venda otro ya marcado toma su lugar automáticamente, sin que tengas que entrar a cambiar nada.
          </p>
        </section>

        {/* Imágenes */}
        <section className="rounded-lg p-5 border space-y-3" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white">Imágenes</h2>
          <TextArea
            label="Rutas separadas por comas (ej: images/relojes/foto-1.webp, images/relojes/foto-2.webp)"
            id="imgsRaw"
            value={form.imgsRaw}
            onChange={set('imgsRaw')}
          />
          {form.imgsRaw && (
            <div className="flex gap-2 flex-wrap mt-2">
              {form.imgsRaw.split(',').map((s) => s.trim()).filter(Boolean).map((ruta, i) => (
                <div key={i} className="text-xs px-2 py-1 rounded text-white/50 border" style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#111' }}>
                  {ruta}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Specs reloj */}
        {form.cat === 'reloj' && (
          <section className="rounded-lg p-5 border space-y-4" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white">Especificaciones técnicas</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Movimiento" id="specMovimiento" value={form.specMovimiento} onChange={set('specMovimiento')} />
              <Field label="Dimensiones" id="specDimensiones" value={form.specDimensiones} onChange={set('specDimensiones')} />
              <Field label="Caja" id="specCaja" value={form.specCaja} onChange={set('specCaja')} />
              <Field label="Correa" id="specCorrea" value={form.specCorrea} onChange={set('specCorrea')} />
              <Field label="Cristal" id="specCristal" value={form.specCristal} onChange={set('specCristal')} />
              <Field label="Funciones" id="specFunciones" value={form.specFunciones} onChange={set('specFunciones')} />
              <Field label="Resistencia al agua" id="specResistenciaAgua" value={form.specResistenciaAgua} onChange={set('specResistenciaAgua')} />
              <Field label="Peso" id="specPeso" value={form.specPeso} onChange={set('specPeso')} />
              <Field label="Batería" id="specBateria" value={form.specBateria} onChange={set('specBateria')} />
              <Field label="Reserva de marcha" id="specReservaMarcha" value={form.specReservaMarcha} onChange={set('specReservaMarcha')} />
            </div>
            <TextArea label="Observaciones" id="specObservaciones" value={form.specObservaciones} onChange={set('specObservaciones')} />
          </section>
        )}

        {/* Notas perfume */}
        {form.cat === 'perfume' && (
          <section className="rounded-lg p-5 border space-y-4" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white">Notas olfativas</h2>
            <TextArea label="Descripción" id="notasDescripcion" value={form.notasDescripcion} onChange={set('notasDescripcion')} />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Notas de salida" id="notasTop" value={form.notasTop} onChange={set('notasTop')} />
              <Field label="Notas de corazón" id="notasCorazon" value={form.notasCorazon} onChange={set('notasCorazon')} />
              <Field label="Notas de fondo" id="notasBase" value={form.notasBase} onChange={set('notasBase')} />
            </div>
          </section>
        )}

        {/* Acciones */}
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
