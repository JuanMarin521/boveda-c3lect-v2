import type { EstadoPedido } from '../api/orders';

// Presentación de los estados de pedido en el panel admin. Antes estaba
// copiada en cuatro páginas. Las reglas (qué transición se permite) no van
// aquí: las da el backend en PedidoDetalle.transicionesPermitidas.
export const ESTADO_PEDIDO: Record<EstadoPedido, { label: string; color: string }> = {
  PENDIENTE:  { label: 'Pendiente',  color: '#EAB308' },
  CONFIRMADO: { label: 'Confirmado', color: '#3B82F6' },
  EN_CAMINO:  { label: 'En camino',  color: '#F97316' },
  ENTREGADO:  { label: 'Entregado',  color: '#22C55E' },
  CANCELADO:  { label: 'Cancelado',  color: '#EF4444' },
};

export const ESTADOS_PEDIDO = Object.keys(ESTADO_PEDIDO) as EstadoPedido[];
