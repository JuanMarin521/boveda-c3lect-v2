import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router';
import {
  Plus, Pencil, Eye, EyeOff, Trash2, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Star, GripVertical, Check,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '../../lib/api';
import { formatPrecio as COP } from '../../lib/format';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';
import type { Producto } from '../../data/types';


const esIncompleto = (p: Producto) => p.precio === 0 || p.estilo === '' || p.imgs.length === 0;
const ordenDestacado = (a: Producto, b: Producto) => (a.destacadoOrden ?? Infinity) - (b.destacadoOrden ?? Infinity);

export default function AdminProductos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [destacadosCount, setDestacadosCount] = useState<number | null>(null);
  const [ordenIds, setOrdenIds] = useState<string[]>([]);
  const [guardandoOrden, setGuardandoOrden] = useState(false);
  const [ordenGuardado, setOrdenGuardado] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const LIMIT = 20;
  const totalPages = Math.ceil(total / LIMIT);

  // Los filtros viven en la URL (querystring) en vez de en estado local, así que
  // se conservan al volver de editar un producto (ver navegación con `state.from`).
  const page = Number(searchParams.get('page') ?? '1');
  const categoria = searchParams.get('categoria') ?? '';
  const disponible = searchParams.get('disponible') ?? '';
  const destacado = searchParams.get('destacado') === 'true';
  const incompletos = searchParams.get('incompletos') === 'true';
  const sortOrder = searchParams.get('sortOrder') ?? '';

  function updateParams(patch: Record<string, string | null>, resetPage = false) {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    if (resetPage) next.delete('page');
    setSearchParams(next);
  }

  function fetchProductos() {
    setCargando(true);
    const params: Record<string, string> = { page: String(page), limit: String(LIMIT) };
    if (categoria) params.categoria = categoria;
    if (disponible !== '') params.soloDisponibles = disponible;
    if (destacado) params.destacado = 'true';
    if (incompletos) params.incompletos = 'true';
    if (sortOrder) { params.sortBy = 'precio'; params.sortOrder = sortOrder; }
    api.get<Producto[]>('/products', { params })
      .then(({ data }) => {
        setProductos(Array.isArray(data) ? data : (data as { data: Producto[] }).data ?? []);
        setTotal(
          Array.isArray(data)
            ? data.length
            : (data as { meta?: { total: number } }).meta?.total ?? (data as Producto[]).length,
        );
      })
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  }

  function fetchDestacadosCount() {
    api.get('/products', { params: { destacado: 'true', limit: 100 } })
      .then(({ data }) => {
        const total = (data as { meta?: { total: number } })?.meta?.total;
        setDestacadosCount(typeof total === 'number' ? total : null);
      })
      .catch(() => setDestacadosCount(null));
  }

  useEffect(() => { fetchProductos(); }, [page, categoria, disponible, destacado, incompletos, sortOrder]);
  useEffect(() => { fetchDestacadosCount(); }, []);
  useRefetchOnFocus(fetchProductos);
  useRefetchOnFocus(fetchDestacadosCount);

  // Orden de arrastre — solo tiene sentido en la vista "Destacados", que ya
  // trae nada más esos productos. Se resincroniza cada vez que llega una
  // nueva lista del servidor (cambio de filtro, refetch al volver de editar).
  useEffect(() => {
    if (destacado) {
      setOrdenIds([...productos].sort(ordenDestacado).map((p) => p.id));
    }
  }, [destacado, productos]);

  async function toggleDisponible(id: string, current: boolean) {
    await api.patch(`/products/${id}`, { disponible: !current });
    setProductos((prev) => prev.map((p) => p.id === id ? { ...p, disponible: !current } : p));
  }

  // Optimista: se actualiza la fila al instante y el PATCH corre en segundo
  // plano, en vez de esperar la respuesta antes de mover el ícono (que se
  // sentía lento). Si falla, se revierte al estado anterior. Al desmarcar se
  // limpia destacadoOrden para que si se vuelve a marcar entre al final de
  // la cola en vez de conservar una posición vieja.
  function toggleDestacado(id: string, current: boolean) {
    const anterior = productos.find((p) => p.id === id);
    if (!anterior) return;

    setProductos((prev) => prev.map((p) => p.id === id
      ? { ...p, destacado: !current, destacadoOrden: current ? null : p.destacadoOrden }
      : p));

    const payload = current ? { destacado: false, destacadoOrden: null } : { destacado: true };
    api.patch(`/products/${id}`, payload)
      .then(() => fetchDestacadosCount())
      .catch(() => setProductos((prev) => prev.map((p) => p.id === id ? anterior : p)));
  }

  async function eliminar(id: string) {
    await api.delete(`/products/${id}`);
    setConfirmDelete(null);
    fetchProductos();
  }

  async function persistirOrden(idsEnOrden: string[]) {
    const cambios = idsEnOrden
      .map((id, i) => ({ id, destacadoOrden: i + 1 }))
      .filter(({ id, destacadoOrden }) => productos.find((p) => p.id === id)?.destacadoOrden !== destacadoOrden);

    if (cambios.length === 0) return;

    setGuardandoOrden(true);
    setOrdenGuardado(false);
    try {
      await Promise.all(cambios.map(({ id, destacadoOrden }) => api.patch(`/products/${id}`, { destacadoOrden })));
      setProductos((prev) => prev.map((p) => {
        const posicion = idsEnOrden.indexOf(p.id);
        return posicion === -1 ? p : { ...p, destacadoOrden: posicion + 1 };
      }));
      setOrdenGuardado(true);
      setTimeout(() => setOrdenGuardado(false), 1800);
    } finally {
      setGuardandoOrden(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrdenIds((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      const next = arrayMove(prev, oldIndex, newIndex);
      void persistirOrden(next);
      return next;
    });
  }

  const productosVisibles = destacado
    ? ordenIds.map((id) => productos.find((p) => p.id === id)).filter((p): p is Producto => !!p)
    : productos;


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Productos</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-white/40">{total} productos en total</p>
            {destacadosCount !== null && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={
                  destacadosCount === 0
                    ? { background: 'rgba(234,179,8,0.15)', color: '#EAB308' }
                    : { background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }
                }
                title="El Home muestra máximo 5 a la vez; si marcas más quedan de respaldo por si algo se vende"
              >
                Destacados en Home: {destacadosCount} marcado{destacadosCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>
        <Link
          to="/admin/productos/nuevo"
          state={{ from: `${location.pathname}${location.search}` }}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-black"
          style={{ background: '#C9A84C' }}
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select
          value={categoria}
          onChange={(e) => updateParams({ categoria: e.target.value }, true)}
          className="text-sm rounded px-3 py-2 border outline-none"
          style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          <option value="">Todas las categorías</option>
          <option value="reloj">Relojes</option>
          <option value="perfume">Perfumes</option>
          <option value="accesorio">Accesorios</option>
        </select>
        <select
          value={disponible}
          onChange={(e) => updateParams({ disponible: e.target.value }, true)}
          className="text-sm rounded px-3 py-2 border outline-none"
          style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          <option value="">Todos</option>
          <option value="true">Disponibles</option>
          <option value="false">No disponibles</option>
        </select>
        <button
          onClick={() => updateParams({ destacado: destacado ? null : 'true' }, true)}
          className="flex items-center gap-1.5 text-sm rounded px-3 py-2 border transition-colors"
          style={
            destacado
              ? { background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }
              : { background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
          }
        >
          <Star size={13} />
          Destacados
        </button>
        <button
          onClick={() => updateParams({ incompletos: incompletos ? null : 'true' }, true)}
          className="text-sm rounded px-3 py-2 border transition-colors"
          style={
            incompletos
              ? { background: 'rgba(234,179,8,0.15)', borderColor: 'rgba(234,179,8,0.4)', color: '#EAB308' }
              : { background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
          }
        >
          Pendientes por completar
        </button>
        {destacado ? (
          <div className="flex items-center gap-2 ml-auto text-xs">
            <GripVertical size={14} className="text-white/30" />
            <span className="text-white/40">Arrastra las filas para cambiar el orden en el carrusel del Home</span>
            {guardandoOrden && (
              <span className="flex items-center gap-1.5 text-[#C9A84C]">
                <span className="w-3 h-3 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
                Guardando…
              </span>
            )}
            {!guardandoOrden && ordenGuardado && (
              <span className="flex items-center gap-1 text-[#22C55E]">
                <Check size={13} /> Guardado
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-white/40">Precio</span>
            <button
              onClick={() => updateParams({ sortOrder: sortOrder === 'asc' ? null : 'asc' }, true)}
              title="Ordenar por precio ascendente"
              className="p-2 rounded border transition-colors"
              style={
                sortOrder === 'asc'
                  ? { background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }
                  : { background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
              }
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => updateParams({ sortOrder: sortOrder === 'desc' ? null : 'desc' }, true)}
              title="Ordenar por precio descendente"
              className="p-2 rounded border transition-colors"
              style={
                sortOrder === 'desc'
                  ? { background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }
                  : { background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
              }
            >
              <ArrowDown size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-lg border overflow-hidden" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {destacado && (
                    <th className="px-2 py-3 w-14" />
                  )}
                  {['Producto', 'Categoría', 'Marca', 'Precio', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              {destacado ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={ordenIds} strategy={verticalListSortingStrategy}>
                    <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      {productosVisibles.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-white/30">Sin productos</td>
                        </tr>
                      )}
                      {productosVisibles.map((p, i) => (
                        <FilaSortable
                          key={p.id}
                          p={p}
                          posicion={i + 1}
                          onEditar={() => navigate(`/admin/productos/${p.id}`, { state: { from: `${location.pathname}${location.search}` } })}
                          onToggleDisponible={() => toggleDisponible(p.id, p.disponible)}
                          onToggleDestacado={() => toggleDestacado(p.id, p.destacado)}
                          onEliminar={() => setConfirmDelete(p.id)}
                        />
                      ))}
                    </tbody>
                  </SortableContext>
                </DndContext>
              ) : (
                <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {productosVisibles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-white/30">Sin productos</td>
                    </tr>
                  )}
                  {productosVisibles.map((p) => (
                    <FilaProducto
                      key={p.id}
                      p={p}
                      onEditar={() => navigate(`/admin/productos/${p.id}`, { state: { from: `${location.pathname}${location.search}` } })}
                      onToggleDisponible={() => toggleDisponible(p.id, p.disponible)}
                      onToggleDestacado={() => toggleDestacado(p.id, p.destacado)}
                      onEliminar={() => setConfirmDelete(p.id)}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
                className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
                className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal confirmación eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-lg p-6 max-w-sm w-full mx-4 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.1)' }}>
            <h3 className="text-base font-medium text-white mb-2">Eliminar producto</h3>
            <p className="text-sm text-white/50 mb-5">
              ¿Confirmas que deseas eliminar el producto <span className="text-white">{confirmDelete}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(confirmDelete)}
                className="px-4 py-2 text-sm rounded text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Fila de la tabla ──────────────────────────────────────────

function CeldasProducto({ p, onEditar, onToggleDisponible, onToggleDestacado, onEliminar }: {
  p: Producto;
  onEditar: () => void;
  onToggleDisponible: () => void;
  onToggleDestacado: () => void;
  onEliminar: () => void;
}) {
  return (
    <>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {p.imgs[0] && (
            <img
              src={import.meta.env.BASE_URL + p.imgs[0]}
              alt={p.display}
              className="w-9 h-9 object-cover rounded shrink-0 opacity-80"
            />
          )}
          <div className="min-w-0">
            <p className="text-white truncate max-w-[180px]">{p.display}</p>
            <p className="text-white/30 text-xs">{p.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-white/60 capitalize">{p.cat}</td>
      <td className="px-4 py-3 text-white/60">{p.marca ?? '—'}</td>
      <td className="px-4 py-3 text-white/80">{COP(p.precio)}</td>
      <td className="px-4 py-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={
            p.disponible
              ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E' }
              : { background: 'rgba(239,68,68,0.15)', color: '#EF4444' }
          }
        >
          {p.disponible ? 'Disponible' : 'No disponible'}
        </span>
        {esIncompleto(p) && (
          <span
            className="text-xs px-2 py-0.5 rounded-full ml-1.5"
            style={{ background: 'rgba(234,179,8,0.15)', color: '#EAB308' }}
          >
            Pendiente
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={onEditar} className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors" title="Editar">
            <Pencil size={15} />
          </button>
          <button
            onClick={onToggleDisponible}
            className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors"
            title={p.disponible ? 'Deshabilitar' : 'Habilitar'}
          >
            {p.disponible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button
            onClick={onToggleDestacado}
            className={
              'p-1.5 transition-colors ' +
              (p.destacado ? 'text-[#C9A84C] hover:text-white/60' : 'text-white/40 hover:text-[#C9A84C]')
            }
            title={p.destacado ? 'Quitar de destacados' : 'Marcar como destacado en Home'}
          >
            <Star size={15} fill={p.destacado ? 'currentColor' : 'none'} />
          </button>
          <button onClick={onEliminar} className="p-1.5 text-white/40 hover:text-red-400 transition-colors" title="Eliminar">
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </>
  );
}

function FilaProducto({ p, onEditar, onToggleDisponible, onToggleDestacado, onEliminar }: {
  p: Producto;
  onEditar: () => void;
  onToggleDisponible: () => void;
  onToggleDestacado: () => void;
  onEliminar: () => void;
}) {
  return (
    <tr className="hover:bg-white/3 transition-colors">
      <CeldasProducto p={p} onEditar={onEditar} onToggleDisponible={onToggleDisponible} onToggleDestacado={onToggleDestacado} onEliminar={onEliminar} />
    </tr>
  );
}

// Fila arrastrable — solo se usa en la vista "Destacados". El handle es el
// único elemento con los listeners de dnd-kit para que arrastrar no choque
// con hacer click en "Editar"/"Eliminar" del resto de la fila.
function FilaSortable({ p, posicion, onEditar, onToggleDisponible, onToggleDestacado, onEliminar }: {
  p: Producto;
  posicion: number;
  onEditar: () => void;
  onToggleDisponible: () => void;
  onToggleDestacado: () => void;
  onEliminar: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? 'rgba(201,168,76,0.08)' : undefined,
        position: 'relative',
        zIndex: isDragging ? 1 : undefined,
      }}
      className="hover:bg-white/3 transition-colors"
    >
      <td className="px-2 py-3 w-14">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-white/30 hover:text-[#C9A84C] cursor-grab active:cursor-grabbing touch-none"
            style={{ touchAction: 'none' }}
            aria-label={`Arrastrar para reordenar ${p.display}`}
          >
            <GripVertical size={16} />
          </button>
          <span className="text-white/40 text-xs tabular-nums">{posicion}</span>
        </div>
      </td>
      <CeldasProducto p={p} onEditar={onEditar} onToggleDisponible={onToggleDisponible} onToggleDestacado={onToggleDestacado} onEliminar={onEliminar} />
    </tr>
  );
}
