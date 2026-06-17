import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Pencil, Eye, EyeOff, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

interface Producto {
  id: string;
  nombre: string;
  estilo: string;
  display: string;
  cat: string;
  marca?: string;
  precio: number;
  disponible: boolean;
  imgs: string[];
}

const CATEGORIAS = ['', 'reloj', 'perfume', 'accesorio'];

const esIncompleto = (p: Producto) => p.precio === 0 || p.estilo === '' || p.imgs.length === 0;

export default function AdminProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [disponible, setDisponible] = useState('');
  const [incompletos, setIncompletos] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const LIMIT = 20;
  const totalPages = Math.ceil(total / LIMIT);

  function fetchProductos() {
    setCargando(true);
    const params: Record<string, string> = { page: String(page), limit: String(LIMIT) };
    if (categoria) params.categoria = categoria;
    if (disponible !== '') params.soloDisponibles = disponible;
    if (incompletos) params.incompletos = 'true';
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

  useEffect(() => { fetchProductos(); }, [page, categoria, disponible, incompletos]);
  useRefetchOnFocus(fetchProductos);

  async function toggleDisponible(id: string, current: boolean) {
    await api.patch(`/products/${id}`, { disponible: !current });
    setProductos((prev) => prev.map((p) => p.id === id ? { ...p, disponible: !current } : p));
  }

  async function eliminar(id: string) {
    await api.delete(`/products/${id}`);
    setConfirmDelete(null);
    fetchProductos();
  }


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Productos</h1>
          <p className="text-sm text-white/40 mt-0.5">{total} productos en total</p>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-black"
          style={{ background: '#C9A84C' }}
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={categoria}
          onChange={(e) => { setCategoria(e.target.value); setPage(1); }}
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
          onChange={(e) => { setDisponible(e.target.value); setPage(1); }}
          className="text-sm rounded px-3 py-2 border outline-none"
          style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          <option value="">Todos</option>
          <option value="true">Disponibles</option>
        </select>
        <button
          onClick={() => { setIncompletos((v) => !v); setPage(1); }}
          className="text-sm rounded px-3 py-2 border transition-colors"
          style={
            incompletos
              ? { background: 'rgba(234,179,8,0.15)', borderColor: 'rgba(234,179,8,0.4)', color: '#EAB308' }
              : { background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
          }
        >
          Pendientes por completar
        </button>
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
                  {['Producto', 'Categoría', 'Marca', 'Precio', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-white/30">Sin productos</td>
                  </tr>
                )}
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imgs[0] && (
                          <img
                            src={`/boveda-c3lect-v2/${p.imgs[0]}`}
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
                        <button
                          onClick={() => navigate(`/admin/productos/${p.id}`)}
                          className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleDisponible(p.id, p.disponible)}
                          className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors"
                          title={p.disponible ? 'Deshabilitar' : 'Habilitar'}
                        >
                          {p.disponible ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
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
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
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
