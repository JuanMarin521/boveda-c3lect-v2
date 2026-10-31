import { api } from './client';
import type { DatosEnvio } from './orders';

export interface PagoPendiente {
  items: { productId: string; cantidad: number }[];
  shippingInfo: DatosEnvio;
  fbp?: string;
  fbc?: string;
}

export const paymentsApi = {
  /**
   * Crea la preferencia de MercadoPago sin crear el pedido: el pedido solo
   * nace (ya confirmado) cuando el webhook informa el pago aprobado.
   */
  async crearPendiente(pago: PagoPendiente) {
    const { data } = await api.post<{ checkoutUrl: string }>(
      '/payments/create-pending',
      pago,
    );
    return data;
  },
};
