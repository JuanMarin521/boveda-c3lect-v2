import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  TrendingUp, TrendingDown, ShoppingBag, Package, Users,
  DollarSign, BarChart2, Clock,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const fmtFecha = (s: string) =>
  format(new Date(s), 'd MMM yyyy', { locale: es });

const ESTADO_VENTA: Record<string, { label: string; color: string }> = {
  Pagado:         { label: 'Pagado',        color: '#22C55E' },
  Abonado:        { label: 'Abonado',       color: '#EAB308' },
  Pendiente:      { label: 'Pendiente',     color: '#EF4444' },
  'Uso Personal': { label: 'Uso Personal',  color: '#6B7280' },
};

const ESTADO_PEDIDO: Record<string, { label: string; color: string }> = {
  PENDIENTE:  { label: 'Pendiente',  color: '#EAB308' },
  CONFIRMADO: { label: 'Confirmado', color: '#3B82F6' },
  EN_CAMINO:  { label: 'En camino',  color: '#F97316' },
  ENTREGADO:  { label: 'Entregado',  color: '#22C55E' },
  CANCELADO:  { label: 'Cancelado',  color: '#EF4444' },
};

interface HistoricalSale {
  id: string; fecha: string; cliente: string; modelo: string;
  precioVenta: number; estado: string;
}

interface Order {
  id: string; orderNumber: string; status: string; total: number;
  shippingInfo: { nombreCompleto: string } | null;
  user: { nombre: string } | null;
}

interface Summary {
  totalVentas: number;
  ventasMes: number;
  ventasMesAnterior: number;
  pedidosActivos: number;
  totalPedidosHistoricos: number;
  productosDisponibles: number;
  clientesRegistrados: number;
  totalClientesHistoricos: number;
  totalCompras: number;
  totalGastos: number;
  capitalInventario: number;
  gananciaNeta: number;
  pendienteCobro: number;
  ultimosPedidos: Order[];
  ultimasVentas: HistoricalSale[];
  ventasPorCategoria: { reloj: number; perfume: number; accesorio: number };
  topProductos: { modelo: string; cantidad: number; total: number }[];
}

interface Financial {
  totalVendido: number;
  gananciaNetaVentas: number;
  pendienteCobro: number;
  totalCompras: number;
  capitalInventario: number;
  totalGastos: number;
  gananciaNeta: number;
}

function StatCard({
  label, value, icon: Icon, sub, badge,
}: {
  label: string; value: string; icon: React.ElementType; sub?: string; badge?: boolean;
}) {
  return (
    <div className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded" style={{ background: 'rgba(201,168,76,0.1)' }}>
          <Icon size={18} style={{ color: '#C9A84C' }} />
        </div>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">pendiente</span>
        )}
      </div>
      <p className="text-2xl font-semibold text-white mb-1">{value}</p>
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-xs text-white/25 mt-1">{sub}</p>}
    </div>
  );
}

function Badge({ estado }: { estado: string }) {
  const cfg = ESTADO_VENTA[estado] ?? { label: estado, color: '#6B7280' };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: cfg.color + '20', color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

const DONUT_COLORS = { reloj: '#C9A84C', perfume: '#FFFFFF', accesorio: '#555555' };

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [financial, setFinancial] = useState<Financial | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Summary>('/metrics/summary'),
      api.get<Financial>('/metrics/financial'),
    ])
      .then(([s, f]) => {
        setSummary(s.data);
        setFinancial(f.data);
      })
      .catch(() => setError('No se pudo cargar el dashboard.'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded text-sm text-red-400 border border-red-500/20 bg-red-500/5">
        {error}
      </div>
    );
  }

  if (!summary || !financial) return null;

  const donutData = [
    { name: 'Relojes',   value: summary.ventasPorCategoria.reloj,    key: 'reloj' },
    { name: 'Perfumes',  value: summary.ventasPorCategoria.perfume,  key: 'perfume' },
    { name: 'Accesorios',value: summary.ventasPorCategoria.accesorio,key: 'accesorio' },
  ].filter((d) => d.value > 0);

  const totalDonut = donutData.reduce((s, d) => s + d.value, 0);
  const topMax = summary.topProductos[0]?.cantidad ?? 1;

  const variacion =
    summary.ventasMesAnterior > 0
      ? ((summary.ventasMes - summary.ventasMesAnterior) / summary.ventasMesAnterior) * 100
      : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-white/40">Resumen operativo y financiero de C3LECT</p>
      </div>

      {/* Fila 1 — Financiero */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vendido" value={COP(summary.totalVentas)} icon={DollarSign} />
        <StatCard label="Ganancia Neta" value={COP(summary.gananciaNeta)} icon={TrendingUp} />
        <StatCard
          label="Pendiente de Cobro"
          value={COP(summary.pendienteCobro)}
          icon={Clock}
          badge={summary.pendienteCobro > 0}
        />
        <StatCard label="Capital en Inventario" value={COP(summary.capitalInventario)} icon={BarChart2} />
      </div>

      {/* Fila 2 — Operativo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pedidos Activos"
          value={String(summary.pedidosActivos)}
          icon={ShoppingBag}
          sub="en la plataforma"
        />
        <StatCard
          label="Ventas Históricas"
          value={String(summary.totalPedidosHistoricos)}
          icon={DollarSign}
          sub="del registro Excel"
        />
        <StatCard
          label="Productos Disponibles"
          value={String(summary.productosDisponibles)}
          icon={Package}
        />
        <StatCard
          label="Clientes Únicos"
          value={String(summary.totalClientesHistoricos)}
          icon={Users}
          sub="en histórico"
        />
      </div>

      {/* Fila 3 — Gráfica + Top productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfica dona */}
        <div className="rounded-lg border p-5" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white mb-4">Ventas por Categoría</h2>
          {totalDonut === 0 ? (
            <p className="text-sm text-white/30 text-center py-10">Sin datos</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.key} fill={DONUT_COLORS[entry.key as keyof typeof DONUT_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6 }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(v: number) => COP(v)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {donutData.map((d) => {
                  const pct = totalDonut > 0 ? ((d.value / totalDonut) * 100).toFixed(1) : '0';
                  return (
                    <div key={d.key} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: DONUT_COLORS[d.key as keyof typeof DONUT_COLORS] }}
                        />
                        <span className="text-white/70">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-white/40 text-xs">{pct}%</span>
                        <span className="text-white font-medium">{COP(d.value)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Top 5 productos */}
        <div className="rounded-lg border p-5" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white mb-4">Top 5 Productos</h2>
          {summary.topProductos.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-10">Sin datos</p>
          ) : (
            <div className="space-y-4">
              {summary.topProductos.map((p, i) => {
                const pct = topMax > 0 ? (p.cantidad / topMax) * 100 : 0;
                return (
                  <div key={p.modelo}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-white/30 font-mono w-4 shrink-0">{i + 1}</span>
                        <span className="text-sm text-white truncate">{p.modelo}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="text-xs text-white/40">{p.cantidad} uds</span>
                        <span className="text-sm text-white font-medium">{COP(p.total)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: '#C9A84C' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fila 4 — Últimas ventas + últimos pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Últimas ventas históricas */}
        <div className="rounded-lg border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white">Últimas ventas históricas</h2>
            <Link to="/admin/ventas" className="text-xs text-[#C9A84C] hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {summary.ultimasVentas.length === 0 && (
              <p className="px-5 py-8 text-sm text-white/30 text-center">Sin ventas</p>
            )}
            {summary.ultimasVentas.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{v.modelo}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {v.cliente} · {fmtFecha(v.fecha)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-sm text-white/70">{COP(v.precioVenta)}</span>
                  <Badge estado={v.estado} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos pedidos plataforma */}
        <div className="rounded-lg border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white">Últimos pedidos plataforma</h2>
            <Link to="/admin/pedidos" className="text-xs text-[#C9A84C] hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {summary.ultimosPedidos.length === 0 && (
              <p className="px-5 py-8 text-sm text-white/30 text-center">Sin pedidos</p>
            )}
            {summary.ultimosPedidos.map((o) => {
              const st = ESTADO_PEDIDO[o.status] ?? { label: o.status, color: '#fff' };
              const cliente = o.shippingInfo?.nombreCompleto ?? o.user?.nombre ?? 'Invitado';
              return (
                <Link
                  key={o.id}
                  to={`/admin/pedidos/${o.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white">{o.orderNumber}</p>
                    <p className="text-xs text-white/40 mt-0.5">{cliente}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-sm text-white/70">{COP(o.total)}</span>
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
      </div>

      {/* Fila 5 — Resumen financiero completo */}
      <div className="rounded-lg border p-5" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        <h2 className="text-sm font-medium text-white mb-4">Resumen financiero completo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Vendido',       value: COP(financial.totalVendido) },
            { label: 'Ganancia Neta Ventas',value: COP(financial.gananciaNetaVentas) },
            { label: 'Pendiente de Cobro',  value: COP(financial.pendienteCobro) },
            { label: 'Total Compras',        value: COP(financial.totalCompras) },
            { label: 'Total Gastos',         value: COP(financial.totalGastos) },
            { label: 'Ganancia Neta Real',   value: COP(financial.gananciaNeta) },
          ].map(({ label, value }) => (
            <div key={label} className="border-l-2 border-[#C9A84C]/30 pl-3">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-base font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Variación mes */}
      {variacion !== undefined && (
        <p className="text-xs text-white/30 text-right">
          Ventas del mes vs mes anterior:{' '}
          <span className={variacion >= 0 ? 'text-green-400' : 'text-red-400'}>
            {variacion >= 0 ? <TrendingUp size={11} className="inline mr-0.5" /> : <TrendingDown size={11} className="inline mr-0.5" />}
            {Math.abs(variacion).toFixed(1)}%
          </span>
        </p>
      )}
    </div>
  );
}
