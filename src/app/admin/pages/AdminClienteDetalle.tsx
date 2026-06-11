import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDIENTE:  { label: 'Pendiente',  color: '#EAB308' },
  CONFIRMADO: { label: 'Confirmado', color: '#3B82F6' },
  EN_CAMINO:  { label: 'En camino',  color: '#F97316' },
  ENTREGADO:  { label: 'Entregado',  color: '#22C55E' },
  CANCELADO:  { label: 'Cancelado',  color: '#EF4444' },
};

interface ClienteDetalle {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  ciudad?: string;
  departamento?: string;
  direccion?: string;
  rol: string;
  createdAt: string;
  totalGastado: number;
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    items: { nombre: string; cantidad: number }[];
  }[];
}

export default function AdminClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<ClienteDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get<ClienteDetalle>(`/users/${id}`)
      .then(({ data }) => setCliente(data))
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="py-10 text-center">
        <p className="text-white/40 text-sm mb-4">{error || 'Cliente no encontrado'}</p>
        <Link to="/admin/clientes" className="text-[#C9A84C] text-sm hover:underline">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/clientes" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">{cliente.nombre}</h1>
          <p className="text-xs text-white/40 mt-0.5">
            Registrado el {format(new Date(cliente.createdAt), "d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Datos personales */}
        <section className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white mb-4">Datos personales</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-white/40 mb-0.5">Email</p>
              <p className="text-white/80">{cliente.email}</p>
            </div>
            {cliente.telefono && (
              <div>
                <p className="text-xs text-white/40 mb-0.5">Teléfono</p>
                <p className="text-white/80">{cliente.telefono}</p>
              </div>
            )}
            {cliente.ciudad && (
              <div>
                <p className="text-xs text-white/40 mb-0.5">Ciudad</p>
                <p className="text-white/80">{cliente.ciudad}{cliente.departamento ? `, ${cliente.departamento}` : ''}</p>
              </div>
            )}
            {cliente.direccion && (
              <div>
                <p className="text-xs text-white/40 mb-0.5">Dirección</p>
                <p className="text-white/80">{cliente.direccion}</p>
              </div>
            )}
          </div>
        </section>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total pedidos</p>
            <p className="text-2xl font-semibold text-white">{cliente.orders.length}</p>
          </div>
          <div className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total gastado</p>
            <p className="text-2xl font-semibold" style={{ color: '#C9A84C' }}>{COP(cliente.totalGastado)}</p>
          </div>
        </div>

        {/* Historial de pedidos */}
        <section className="rounded-lg border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white">Historial de pedidos</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {cliente.orders.length === 0 && (
              <p className="px-5 py-8 text-sm text-white/30 text-center">Sin pedidos</p>
            )}
            {cliente.orders.map((o) => {
              const st = STATUS_CONFIG[o.status] ?? { label: o.status, color: '#fff' };
              return (
                <Link
                  key={o.id}
                  to={`/admin/pedidos/${o.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-mono text-white">{o.orderNumber}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {format(new Date(o.createdAt), "d MMM yyyy", { locale: es })}
                      {' · '}{o.items.map((i) => `${i.nombre} ×${i.cantidad}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm text-white/70">{COP(o.total)}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: st.color + '20', color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
