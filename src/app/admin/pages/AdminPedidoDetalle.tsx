import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Check } from 'lucide-react';
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

const TRANSITIONS: Record<string, string[]> = {
  PENDIENTE:  ['CONFIRMADO', 'CANCELADO'],
  CONFIRMADO: ['EN_CAMINO', 'CANCELADO'],
  EN_CAMINO:  ['ENTREGADO', 'CANCELADO'],
  ENTREGADO:  [],
  CANCELADO:  [],
};

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  paymentMethod: string;
  createdAt: string;
  user: { nombre: string; email: string } | null;
  items: { id: string; nombre: string; precioUnitario: number; cantidad: number; subtotal: number }[];
  shippingInfo: {
    nombreCompleto: string; email: string; telefono: string;
    ciudad: string; departamento: string; direccion: string; notas?: string;
  } | null;
  statusHistory: {
    id: string; statusAnterior: string | null; statusNuevo: string; createdAt: string;
  }[];
}

export default function AdminPedidoDetalle() {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Order | null>(null);
  const [cargando, setCargando] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get<Order>(`/orders/${id}`)
      .then(({ data }) => {
        setPedido(data);
        const options = TRANSITIONS[data.status] ?? [];
        if (options.length > 0) setNuevoEstado(options[0]);
      })
      .catch(() => setError('No se pudo cargar el pedido.'))
      .finally(() => setCargando(false));
  }, [id]);

  async function actualizarEstado() {
    if (!pedido || !nuevoEstado) return;
    setActualizando(true);
    setError('');
    try {
      await api.patch(`/orders/${id}/status`, { status: nuevoEstado });
      const { data } = await api.get<Order>(`/orders/${id}`);
      setPedido(data);
      const options = TRANSITIONS[data.status] ?? [];
      setNuevoEstado(options[0] ?? '');
    } catch {
      setError('No se pudo actualizar el estado.');
    } finally {
      setActualizando(false);
    }
  }

  if (cargando) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="py-10 text-center">
        <p className="text-white/40 text-sm mb-4">{error || 'Pedido no encontrado'}</p>
        <Link to="/admin/pedidos" className="text-[#C9A84C] text-sm hover:underline">← Volver</Link>
      </div>
    );
  }

  const st = STATUS_CONFIG[pedido.status] ?? { label: pedido.status, color: '#fff' };
  const opciones = TRANSITIONS[pedido.status] ?? [];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/pedidos" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white font-mono">{pedido.orderNumber}</h1>
          <p className="text-xs text-white/40 mt-0.5">
            {format(new Date(pedido.createdAt), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
          </p>
        </div>
        <span
          className="ml-auto text-xs px-2.5 py-1 rounded-full"
          style={{ background: st.color + '20', color: st.color }}
        >
          {st.label}
        </span>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded text-sm text-red-400 border border-red-500/20 bg-red-500/5">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Productos */}
        <section className="rounded-lg border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white">Productos</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {pedido.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-white">{item.nombre}</p>
                  <p className="text-xs text-white/40">
                    {COP(item.precioUnitario)} × {item.cantidad}
                  </p>
                </div>
                <p className="text-sm text-white/80">{COP(item.subtotal)}</p>
              </div>
            ))}
            <div className="flex justify-between px-5 py-3">
              <p className="text-sm font-medium text-white">Total</p>
              <p className="text-sm font-semibold text-[#C9A84C]">{COP(pedido.total)}</p>
            </div>
          </div>
        </section>

        {/* Info envío + cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pedido.shippingInfo && (
            <section className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
              <h2 className="text-sm font-medium text-white mb-3">Datos de envío</h2>
              <div className="space-y-1.5 text-xs text-white/60">
                <p className="text-white text-sm">{pedido.shippingInfo.nombreCompleto}</p>
                <p>{pedido.shippingInfo.email}</p>
                <p>{pedido.shippingInfo.telefono}</p>
                <p>{pedido.shippingInfo.direccion}</p>
                <p>{pedido.shippingInfo.ciudad}, {pedido.shippingInfo.departamento}</p>
                {pedido.shippingInfo.notas && <p className="text-white/40 italic">{pedido.shippingInfo.notas}</p>}
              </div>
            </section>
          )}
          <section className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white mb-3">Pago</h2>
            <div className="space-y-1.5 text-xs text-white/60">
              <p>Método: <span className="text-white/80">{pedido.paymentMethod.replace('_', ' ')}</span></p>
              {pedido.user && <p>Cliente: <span className="text-white/80">{pedido.user.nombre}</span></p>}
              {!pedido.user && <p className="text-white/40">Compra como invitado</p>}
            </div>
          </section>
        </div>

        {/* Historial */}
        <section className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-medium text-white mb-4">Historial de estados</h2>
          <div className="relative pl-5">
            <div className="absolute left-1.5 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="space-y-4">
              {pedido.statusHistory.map((h) => {
                const s = STATUS_CONFIG[h.statusNuevo] ?? { label: h.statusNuevo, color: '#fff' };
                return (
                  <div key={h.id} className="relative flex items-start gap-3">
                    <div
                      className="absolute -left-5 w-3 h-3 rounded-full border-2 border-[#0A0A0A] mt-0.5"
                      style={{ background: s.color }}
                    />
                    <div>
                      <p className="text-sm text-white">{s.label}</p>
                      {h.statusAnterior && (
                        <p className="text-xs text-white/30">
                          desde {STATUS_CONFIG[h.statusAnterior]?.label ?? h.statusAnterior}
                        </p>
                      )}
                      <p className="text-xs text-white/30 mt-0.5">
                        {format(new Date(h.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cambiar estado */}
        {opciones.length > 0 && (
          <section className="rounded-lg p-5 border" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-medium text-white mb-4">Actualizar estado</h2>
            <div className="flex gap-3">
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="flex-1 text-sm rounded px-3 py-2 border outline-none"
                style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                {opciones.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
                ))}
              </select>
              <button
                onClick={actualizarEstado}
                disabled={actualizando || !nuevoEstado}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded font-medium text-black disabled:opacity-60"
                style={{ background: '#C9A84C' }}
              >
                <Check size={15} />
                {actualizando ? 'Actualizando…' : 'Actualizar'}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
