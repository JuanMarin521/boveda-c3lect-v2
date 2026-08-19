import { Link, useLocation } from 'react-router';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '../components/ds/Button';

type Status = 'success' | 'failure' | 'pending';

const CONTENT: Record<Status, { icon: typeof CheckCircle2; color: string; title: string; body: string }> = {
  success: {
    icon: CheckCircle2,
    color: '#C9A84C',
    title: 'Pago aprobado',
    body: 'Tu pago fue procesado correctamente. Te enviamos el comprobante a tu correo.',
  },
  failure: {
    icon: XCircle,
    color: '#C9A84C',
    title: 'Pago rechazado',
    body: 'No pudimos procesar tu pago. Tu pedido fue cancelado — puedes intentarlo de nuevo desde el carrito.',
  },
  pending: {
    icon: Clock,
    color: '#C9A84C',
    title: 'Pago en proceso',
    body: 'Tu pago está siendo revisado. Te notificaremos por correo en cuanto se confirme.',
  },
};

export default function CheckoutResult() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderNumber = params.get('external_reference');

  const status: Status = location.pathname.endsWith('success')
    ? 'success'
    : location.pathname.endsWith('failure')
    ? 'failure'
    : 'pending';

  const { icon: Icon, color, title, body } = CONTENT[status];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0A0A0A]">
      <div className="w-full max-w-sm text-center">
        <Icon size={40} className="mx-auto mb-6" style={{ color }} />
        <h1 className="text-3xl mb-4 text-white" style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}>
          {title}
        </h1>
        {orderNumber && (
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Pedido #{orderNumber}</p>
        )}
        <p className="text-white/60 text-sm leading-relaxed mb-10">{body}</p>
        <Button as={Link} to="/catalog" variant="block-dark">
          Seguir explorando
        </Button>
      </div>
    </div>
  );
}
