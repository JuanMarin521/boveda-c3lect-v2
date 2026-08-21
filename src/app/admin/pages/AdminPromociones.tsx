import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/api';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';
import { estaVigente, type Promocion } from '../../lib/promotions';

const ALCANCE_LABEL: Record<Promocion['alcance'], string> = {
  TODOS: 'Todos los productos',
  CATEGORIA: 'Categoría',
  MARCA: 'Marca',
  PRODUCTO: 'Productos específicos',
};

function detalleAlcance(p: Promocion): string {
  switch (p.alcance) {
    case 'TODOS':
      return p.excluidos.length ? `Todos (${p.excluidos.length} excluido${p.excluidos.length === 1 ? '' : 's'})` : 'Todos';
    case 'CATEGORIA':
      return p.categoria ?? '—';
    case 'MARCA':
      return p.marca ?? '—';
    case 'PRODUCTO':
      return `${p.productosIncluidos.length} producto${p.productosIncluidos.length === 1 ? '' : 's'}`;
  }
}

export default function AdminPromociones() {
  const navigate = useNavigate();
  const location = useLocation();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function fetchPromociones() {
    setCargando(true);
    api.get<Promocion[]>('/promotions')
      .then(({ data }) => setPromociones(data))
      .catch(() => setPromociones([]))
      .finally(() => setCargando(false));
  }

  useEffect(() => { fetchPromociones(); }, []);
  useRefetchOnFocus(fetchPromociones);

  async function toggleActivo(id: string, current: boolean) {
    await api.patch(`/promotions/${id}`, { activo: !current });
    setPromociones((prev) => prev.map((p) => p.id === id ? { ...p, activo: !current } : p));
  }

  async function eliminar(id: string) {
    await api.delete(`/promotions/${id}`);
    setConfirmDelete(null);
    fetchPromociones();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Promociones</h1>
          <p className="text-sm text-white/40 mt-0.5">{promociones.length} promociones en total</p>
        </div>
        <Link
          to="/admin/promociones/nuevo"
          state={{ from: `${location.pathname}${location.search}` }}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-black"
          style={{ background: '#C9A84C' }}
        >
          <Plus size={16} />
          Nueva promoción
        </Link>
      </div>

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
                  {['Nombre', 'Alcance', 'Descuento', 'Vigencia', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {promociones.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-white/30">Sin promociones</td>
                  </tr>
                )}
                {promociones.map((p) => {
                  const vigente = estaVigente(p);
                  return (
                    <tr key={p.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white">{p.nombre}</p>
                        {p.soloCuentaActiva && (
                          <p className="text-white/30 text-xs">Solo cuenta activa</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {ALCANCE_LABEL[p.alcance]}
                        <p className="text-white/30 text-xs">{detalleAlcance(p)}</p>
                      </td>
                      <td className="px-4 py-3 text-white/80">-{p.porcentaje}%</td>
                      <td className="px-4 py-3 text-white/60 text-xs">
                        {new Date(p.fechaInicio).toLocaleString('es-CO')}
                        <br />
                        {new Date(p.fechaFin).toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={
                            vigente
                              ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E' }
                              : p.activo
                              ? { background: 'rgba(234,179,8,0.15)', color: '#EAB308' }
                              : { background: 'rgba(239,68,68,0.15)', color: '#EF4444' }
                          }
                        >
                          {vigente ? 'Vigente' : p.activo ? 'Programada / vencida' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/promociones/${p.id}`, { state: { from: `${location.pathname}${location.search}` } })}
                            className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => toggleActivo(p.id, p.activo)}
                            className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors"
                            title={p.activo ? 'Desactivar' : 'Activar'}
                          >
                            {p.activo ? <Eye size={15} /> : <EyeOff size={15} />}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-lg p-6 max-w-sm w-full mx-4 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.1)' }}>
            <h3 className="text-base font-medium text-white mb-2">Eliminar promoción</h3>
            <p className="text-sm text-white/50 mb-5">
              ¿Confirmas que deseas eliminar esta promoción? Esta acción no se puede deshacer.
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
