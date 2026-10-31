import { api } from './client';
import { params, type Paginado } from './common';
import type { Compra } from './compras';
import type { Pedido } from './orders';
import type { Venta } from './ventas';

export interface Resumen {
  totalVendido: number;
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
  ultimosPedidos: (Pick<Pedido, 'id' | 'orderNumber' | 'status' | 'total'> & {
    shippingInfo: { nombreCompleto: string } | null;
    user: { nombre: string } | null;
  })[];
  ultimasVentas: Pick<
    Venta,
    'id' | 'fecha' | 'cliente' | 'modelo' | 'precioVenta' | 'estado'
  >[];
  ventasPorCategoria: { reloj: number; perfume: number; accesorio: number };
  topProductos: { modelo: string; cantidad: number; total: number }[];
}

export interface Financiero {
  totalVendido: number;
  gananciaNetaVentas: number;
  pendienteCobro: number;
  totalCompras: number;
  comprasPorCategoria: Record<string, number>;
  capitalInventario: number;
  totalGastos: number;
  gananciaNeta: number;
}

export interface VentasPaginadas extends Paginado<Venta> {
  agregados: { totalVendido: number; pendienteCobro: number };
}

type Filtro = Record<string, string | number | undefined>;

// Modelo de lectura del dashboard: agrega datos de varios contextos.
export const metricsApi = {
  async resumen(signal?: AbortSignal) {
    const { data } = await api.get<Resumen>('/metrics/summary', { signal });
    return data;
  },

  async financiero(signal?: AbortSignal) {
    const { data } = await api.get<Financiero>('/metrics/financial', {
      signal,
    });
    return data;
  },

  async ventas(filtro: Filtro, signal?: AbortSignal) {
    const { data } = await api.get<VentasPaginadas>('/metrics/sales', {
      params: params(filtro),
      signal,
    });
    return data;
  },

  async compras(filtro: Filtro, signal?: AbortSignal) {
    const { data } = await api.get<Paginado<Compra>>('/metrics/purchases', {
      params: params(filtro),
      signal,
    });
    return data;
  },
};
