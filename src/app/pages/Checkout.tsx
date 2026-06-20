import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useCart, formatPrecio } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

type MetodoPago = 'MERCADOPAGO' | 'CONTRAENTREGA';

interface OrderResponse {
  id: string;
  orderNumber: string;
}

const inputClasses =
  'w-full border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C9A84C] transition-colors bg-[#1A1A1A]';
const labelClasses = 'block text-sm tracking-widest uppercase text-white/70 mb-1.5';
const btnPrimary =
  'w-full py-3 text-sm tracking-widest uppercase text-white rounded transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: user?.nombre ?? '',
    email: user?.email ?? '',
    telefono: '',
    ciudad: '',
    departamento: '',
    direccion: '',
    notas: '',
  });
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('MERCADOPAGO');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<OrderResponse | null>(null);

  function set<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  if (items.length === 0 && !pedidoConfirmado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <p className="text-white/70 tracking-wide">Tu carrito está vacío.</p>
        <Link
          to="/catalog"
          className="text-sm uppercase tracking-widest underline underline-offset-4 text-white/50 hover:text-white transition-colors"
        >
          Explorar colecciones
        </Link>
      </div>
    );
  }

  if (pedidoConfirmado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="w-full max-w-sm text-center">
          <CheckCircle2 size={48} className="mx-auto mb-6" style={{ color: '#C9A84C' }} />
          <h1 className="text-xl tracking-widest uppercase text-white mb-3">Pedido recibido</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Tu número de pedido es <strong className="text-white">#{pedidoConfirmado.orderNumber}</strong>.
            Te contactaremos para coordinar la entrega y el pago contra entrega.
          </p>
          <Link
            to="/catalog"
            className={`${btnPrimary} inline-block`}
            style={{ backgroundColor: '#C9A84C' }}
          >
            Seguir explorando
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const itemsPayload = items.map((i) => ({ productId: i.producto.id, cantidad: i.cantidad }));

      if (metodoPago === 'CONTRAENTREGA') {
        const { data: order } = await api.post<OrderResponse>('/orders', {
          metodoPago,
          items: itemsPayload,
          shippingInfo: form,
        });
        clearCart();
        setPedidoConfirmado(order);
        return;
      }

      // El pedido todavía no existe — solo se crea (ya confirmado) cuando
      // MercadoPago avise que el pago fue aprobado. Así, si el pago falla o
      // se abandona, no queda ningún pedido huérfano.
      const { data: pago } = await api.post<{ checkoutUrl: string }>('/payments/create-pending', {
        items: itemsPayload,
        shippingInfo: form,
      });
      clearCart();
      window.location.href = pago.checkoutUrl;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'No se pudo procesar el pedido. Intenta de nuevo.');
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-16" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto grid md:grid-cols-[1.3fr_1fr] gap-12">
        <div>
          <h1 className="text-2xl tracking-widest uppercase text-white mb-8">Finalizar pedido</h1>

          {error && (
            <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClasses}>Nombre completo</label>
              <input required value={form.nombreCompleto} onChange={set('nombreCompleto')} className={inputClasses} placeholder="Juan Pérez" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Correo electrónico</label>
                <input type="email" required value={form.email} onChange={set('email')} className={inputClasses} placeholder="tu@correo.com" />
              </div>
              <div>
                <label className={labelClasses}>Teléfono</label>
                <input required value={form.telefono} onChange={set('telefono')} className={inputClasses} placeholder="+57 300 000 0000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Ciudad</label>
                <input required value={form.ciudad} onChange={set('ciudad')} className={inputClasses} placeholder="Medellín" />
              </div>
              <div>
                <label className={labelClasses}>Departamento</label>
                <input required value={form.departamento} onChange={set('departamento')} className={inputClasses} placeholder="Antioquia" />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Dirección</label>
              <input required value={form.direccion} onChange={set('direccion')} className={inputClasses} placeholder="Calle 10 #20-30, Apt 5" />
            </div>
            <div>
              <label className={labelClasses}>Notas (opcional)</label>
              <textarea value={form.notas} onChange={set('notas')} className={inputClasses} rows={2} placeholder="Indicaciones de entrega" />
            </div>

            <div>
              <label className={labelClasses}>Método de pago</label>
              <div className="space-y-3 mt-2">
                <button
                  type="button"
                  onClick={() => setMetodoPago('MERCADOPAGO')}
                  className="w-full flex items-center gap-3 px-4 py-3 border rounded text-left transition-colors"
                  style={{
                    borderColor: metodoPago === 'MERCADOPAGO' ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                    backgroundColor: metodoPago === 'MERCADOPAGO' ? 'rgba(201,168,76,0.08)' : 'transparent',
                  }}
                >
                  <CreditCard size={18} className={metodoPago === 'MERCADOPAGO' ? 'text-[#C9A84C]' : 'text-white/40'} />
                  <span>
                    <span className="block text-sm text-white">Pagar en línea con MercadoPago</span>
                    <span className="block text-xs text-white/40">Tarjeta, Nequi, PSE y más</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMetodoPago('CONTRAENTREGA')}
                  className="w-full flex items-center gap-3 px-4 py-3 border rounded text-left transition-colors"
                  style={{
                    borderColor: metodoPago === 'CONTRAENTREGA' ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                    backgroundColor: metodoPago === 'CONTRAENTREGA' ? 'rgba(201,168,76,0.08)' : 'transparent',
                  }}
                >
                  <Truck size={18} className={metodoPago === 'CONTRAENTREGA' ? 'text-[#C9A84C]' : 'text-white/40'} />
                  <span>
                    <span className="block text-sm text-white">Pago contra entrega</span>
                    <span className="block text-xs text-white/40">Pagas en efectivo o transferencia al recibir</span>
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={enviando} className={btnPrimary} style={{ backgroundColor: '#C9A84C' }}>
              {enviando ? 'Procesando…' : metodoPago === 'MERCADOPAGO' ? 'Continuar al pago' : 'Confirmar pedido'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-sm tracking-widest uppercase text-white/50 mb-4">Resumen</h2>
          <div className="space-y-4 border-t border-white/10 pt-4">
            {items.map((item) => (
              <div key={item.producto.id} className="flex justify-between gap-3 text-sm">
                <span className="text-white/70">
                  {item.producto.display} <span className="text-white/30">× {item.cantidad}</span>
                </span>
                <span style={{ color: '#C9A84C' }}>
                  {formatPrecio((item.producto.precio as number) * item.cantidad)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
            <span className="text-sm uppercase tracking-widest text-white/50">Total</span>
            <span className="text-xl" style={{ color: '#C9A84C' }}>{formatPrecio(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
