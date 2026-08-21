import { useState } from 'react';
import { Link } from 'react-router';
import { CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useCart, formatPrecio } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePromociones } from '../context/PromocionesContext';
import { mejorDescuento, calcularPrecioFinal } from '../lib/promotions';
import { api } from '../lib/api';
import { Field, FieldArea } from '../components/ds/Field';
import { FormError } from '../components/ds/FormError';
import { Button } from '../components/ds/Button';

type MetodoPago = 'MERCADOPAGO' | 'CONTRAENTREGA';

interface OrderResponse {
  id: string;
  orderNumber: string;
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, autenticado } = useAuth();
  const { promociones } = usePromociones();
  const precioUnitarioDe = (producto: (typeof items)[number]['producto']) =>
    calcularPrecioFinal(producto.precio, mejorDescuento(promociones, producto, autenticado));

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 bg-[#0A0A0A]">
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
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#0A0A0A]">
        <div className="w-full max-w-sm text-center">
          <CheckCircle2 size={40} className="mx-auto mb-6 text-[#C9A84C]" />
          <h1 className="text-3xl mb-4 text-white" style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}>
            Pedido recibido
          </h1>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Tu número de pedido es <strong className="text-white">#{pedidoConfirmado.orderNumber}</strong>.
            Te contactaremos para coordinar la entrega y el pago contra entrega.
          </p>
          <Button as={Link} to="/catalog" variant="block-dark">
            Seguir explorando
          </Button>
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
    <div className="min-h-screen px-6 py-16 md:py-24 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-16">
        <div>
          <p className="text-[11px] uppercase text-white/40 mb-3" style={{ letterSpacing: '0.26em' }}>
            Paso 02 de 02 — Confirmación
          </p>
          <h1 className="text-4xl md:text-5xl mb-10 text-white" style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}>
            Finalizar pedido
          </h1>

          {error && <div className="mb-8"><FormError>{error}</FormError></div>}

          <form onSubmit={handleSubmit} className="space-y-7">
            <Field label="Nombre completo" required value={form.nombreCompleto} onChange={set('nombreCompleto')} placeholder="Juan Pérez" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="Correo electrónico" type="email" required value={form.email} onChange={set('email')} placeholder="tu@correo.com" />
              <Field label="Teléfono" required value={form.telefono} onChange={set('telefono')} placeholder="+57 300 000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Field label="Ciudad" required value={form.ciudad} onChange={set('ciudad')} placeholder="Medellín" />
              <Field label="Departamento" required value={form.departamento} onChange={set('departamento')} placeholder="Antioquia" />
            </div>
            <Field label="Dirección" required value={form.direccion} onChange={set('direccion')} placeholder="Calle 10 #20-30, Apt 5" />
            <FieldArea label="Notas (opcional)" value={form.notas} onChange={set('notas')} rows={2} placeholder="Indicaciones de entrega" />

            <div>
              <p className="text-[10px] uppercase text-white/40 mb-3" style={{ letterSpacing: '0.28em' }}>Método de pago</p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setMetodoPago('MERCADOPAGO')}
                  className="w-full flex items-center gap-4 px-5 py-4 border text-left transition-colors duration-300"
                  style={{
                    borderColor: metodoPago === 'MERCADOPAGO' ? '#C9A84C' : 'rgba(255,255,255,0.15)',
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
                  className="w-full flex items-center gap-4 px-5 py-4 border text-left transition-colors duration-300"
                  style={{
                    borderColor: metodoPago === 'CONTRAENTREGA' ? '#C9A84C' : 'rgba(255,255,255,0.15)',
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

            <Button type="submit" disabled={enviando} variant="block-dark">
              {enviando ? 'Procesando…' : metodoPago === 'MERCADOPAGO' ? 'Continuar al pago' : 'Confirmar pedido'}
            </Button>
          </form>
        </div>

        <div className="border border-[#C9A84C]/30 p-8 h-fit">
          <p className="text-[10px] uppercase text-white/40 mb-6" style={{ letterSpacing: '0.26em' }}>Resumen</p>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.producto.id} className="flex justify-between gap-3 text-sm">
                <span className="text-white/70">
                  {item.producto.display} <span className="text-white/30">× {item.cantidad}</span>
                </span>
                <span className="text-[#C9A84C]">
                  {formatPrecio(precioUnitarioDe(item.producto) * item.cantidad)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline mt-6 pt-6 border-t border-white/15">
            <span className="text-xs uppercase tracking-widest text-white/50">Total</span>
            <span className="text-3xl text-[#C9A84C]" style={{ fontFamily: 'var(--font-serif)' }}>
              {formatPrecio(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
