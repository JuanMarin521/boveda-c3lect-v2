import type { CartItem } from '../context/CartContext';
import { api } from './api';
import {
  trackInitiateCheckout,
  trackPurchase,
  setMetaUserData,
  getFbCookies,
} from './metaPixel';

export type MetodoPago = 'MERCADOPAGO' | 'CONTRAENTREGA';

export interface ShippingForm {
  nombreCompleto: string;
  email: string;
  telefono: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  notas: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
}

export type CheckoutResult =
  | { kind: 'contraentrega'; order: OrderResponse }
  | { kind: 'mercadopago'; checkoutUrl: string };

// Orquesta el envío del checkout: tracking de Meta Pixel + la llamada a la
// API correspondiente al método de pago. No toca el carrito ni el estado de
// UI — eso queda del lado del componente, que decide qué hacer con el
// resultado (limpiar el carrito, navegar, mostrar la confirmación).
export async function submitCheckout(params: {
  items: CartItem[];
  totalPrice: number;
  metodoPago: MetodoPago;
  form: ShippingForm;
}): Promise<CheckoutResult> {
  const { items, totalPrice, metodoPago, form } = params;
  const itemsPayload = items.map((i) => ({ productId: i.producto.id, cantidad: i.cantidad }));

  // Ya tenemos los datos del cliente: se los pasamos a Meta (el navegador
  // los hashea antes de enviarlos) para subir el Event Match Quality, que
  // es lo que decide si Meta puede atribuir la venta al anuncio.
  setMetaUserData({
    email: form.email,
    phone: form.telefono,
    firstName: form.nombreCompleto.trim().split(' ')[0],
    lastName: form.nombreCompleto.trim().split(' ').slice(1).join(' ') || undefined,
    city: form.ciudad,
    state: form.departamento,
  });
  trackInitiateCheckout(items, totalPrice);

  // _fbp y _fbc son las cookies que atan la conversión al clic del anuncio.
  // Viajan al backend porque el evento de servidor las necesita, y en la
  // rama de MercadoPago ese evento se manda mucho después — cuando llega
  // el webhook — y para entonces ya no tenemos el navegador del cliente.
  const fb = getFbCookies();

  if (metodoPago === 'CONTRAENTREGA') {
    const { data: order } = await api.post<OrderResponse>('/orders', {
      metodoPago,
      items: itemsPayload,
      shippingInfo: form,
      fbp: fb.fbp,
      fbc: fb.fbc,
    });

    // El Purchase de contraentrega va AQUÍ: esta rama nunca navega a
    // /checkout/success — el caller muestra la confirmación en la misma
    // página, así que este es el único momento en que hay items/total que enviar.
    trackPurchase({ orderNumber: order.orderNumber, items, total: totalPrice });

    return { kind: 'contraentrega', order };
  }

  // El pedido todavía no existe — solo se crea (ya confirmado) cuando
  // MercadoPago avise que el pago fue aprobado. Así, si el pago falla o
  // se abandona, no queda ningún pedido huérfano.
  // En esta rama NO disparamos Purchase en el navegador: el cliente se va
  // al dominio de MercadoPago y vuelve a /checkout/success sin datos del
  // pedido. La fuente de verdad es el evento que manda el backend por
  // Conversions API cuando el webhook confirma el pago.
  const { data: pago } = await api.post<{ checkoutUrl: string }>('/payments/create-pending', {
    items: itemsPayload,
    shippingInfo: form,
    fbp: fb.fbp,
    fbc: fb.fbc,
  });

  return { kind: 'mercadopago', checkoutUrl: pago.checkoutUrl };
}
