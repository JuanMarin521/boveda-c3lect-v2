import { api } from './client';
import { params, type Paginado } from './common';

export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO';

export type MetodoPago = 'MERCADOPAGO' | 'CONTRAENTREGA';

export interface DatosEnvio {
  nombreCompleto: string;
  email: string;
  telefono: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  notas?: string | null;
}

export interface LineaPedido {
  id: string;
  productId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  orderNumber: string;
  status: EstadoPedido;
  subtotal: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: LineaPedido[];
  shippingInfo: DatosEnvio | null;
  user: { id: string; nombre: string; email: string } | null;
}

export interface CambioDeEstado {
  id: string;
  statusAnterior: EstadoPedido | null;
  statusNuevo: EstadoPedido;
  createdAt: string;
}

export interface PedidoDetalle extends Pedido {
  statusHistory: CambioDeEstado[];
  /** Estados a los que el backend permite pasar desde el actual. */
  transicionesPermitidas: EstadoPedido[];
}

export interface FiltroPedidos {
  page?: number;
  limit?: number;
  status?: EstadoPedido | '';
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
}

export interface NuevoPedido {
  metodoPago: MetodoPago;
  items: { productId: string; cantidad: number }[];
  shippingInfo: DatosEnvio;
  fbp?: string;
  fbc?: string;
}

export const ordersApi = {
  /** Admin: todos con filtros. Cliente: solo los suyos. */
  async listar(filtro: FiltroPedidos, signal?: AbortSignal) {
    const { data } = await api.get<Paginado<Pedido>>('/orders', {
      params: params({ ...filtro }),
      signal,
    });
    return data;
  },

  async obtener(id: string, signal?: AbortSignal) {
    const { data } = await api.get<PedidoDetalle>(`/orders/${id}`, { signal });
    return data;
  },

  async cambiarEstado(id: string, status: EstadoPedido) {
    await api.patch(`/orders/${id}/status`, { status });
  },

  async crear(pedido: NuevoPedido) {
    const { data } = await api.post<{ id: string; orderNumber: string }>(
      '/orders',
      pedido,
    );
    return data;
  },
};
