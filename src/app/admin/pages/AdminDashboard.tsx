import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { TrendingUp, TrendingDown, ShoppingBag, Package, Users, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDIENTE:  { label: 'Pendiente',  color: '#EAB308' },
  CONFIRMADO: { label: 'Confirmado', color: '#3B82F6' },
  EN_CAMINO:  { label: 'En camino',  color: '#F97316' },
  ENTREGADO:  { label: 'Entregado',  color: '#22C55E' },
  CANCELADO:  { label: 'Cancelado',  color: '#EF4444' },
};

interface Summary {
  ventasMes: number;
  ventasMesAnterior: number;
  pedidosActivos: number;
  productosDisponibles: number;
  clientesRegistrados: number;
  ultimosPedidos: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    shippingInfo: { nombreCompleto: string } | null;
    user: { nombre: string } | null;
  }[];
}

function StatCard({
  label, value, icon: Icon, variacion,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  variacion?: number;
}) {
  const isPositive = (variacion ?? 0) >= 0;
  return (
    <div className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded" style={{ background: 'rgba(201,168,76,0.1)' }}>
          <Icon size={18} style={{ color: '#C9A84C' }} />
        </div>
        {variacion !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(variacion).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-white mb-1">{value}</p>
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Summary>('/metrics/summary')
      .then(({ data }) => setSummary(data))
      .catch(() => setError('No se pudo cargar el resumen.'))
      .finally(() => setCargando(false));
  }, []);

  const variacionVentas =
    summary && summary.ventasMesAnterior > 0
      ? ((summary.ventasMes - summary.ventasMesAnterior) / summary.ventasMesAnterior) * 100
      : undefined;

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-white/40">Resumen del panel de administración</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded text-sm text-red-400 border border-red-500/20 bg-red-500/5">
          {error}
        </div>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Ventas del mes"
              value={COP(summary.ventasMes)}
              icon={DollarSign}
              variacion={variacionVentas}
            />
            <StatCard
              label="Pedidos activos"
              value={String(summary.pedidosActivos)}
              icon={ShoppingBag}
            />
            <StatCard
              label="Productos disponibles"
              value={String(summary.productosDisponibles)}
              icon={Package}
            />
            <StatCard
              label="Clientes registrados"
              value={String(summary.clientesRegistrados)}
              icon={Users}
            />
          </div>

          <div className="rounded-lg border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h2 className="text-sm font-medium text-white">Últimos pedidos</h2>
              <Link to="/admin/pedidos" className="text-xs text-[#C9A84C] hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {summary.ultimosPedidos.length === 0 && (
                <p className="px-5 py-8 text-sm text-white/30 text-center">Sin pedidos</p>
              )}
              {summary.ultimosPedidos.map((order) => {
                const st = STATUS_LABEL[order.status] ?? { label: order.status, color: '#fff' };
                const cliente = order.shippingInfo?.nombreCompleto ?? order.user?.nombre ?? 'Invitado';
                return (
                  <Link
                    key={order.id}
                    to={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white">{order.orderNumber}</p>
                      <p className="text-xs text-white/40 mt-0.5">{cliente}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm text-white/70">{COP(order.total)}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: st.color + '20', color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
