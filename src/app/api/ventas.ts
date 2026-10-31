import { api } from './client';

export interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  celular: string | null;
  marca: string;
  modelo: string;
  estilo: string | null;
  precioVenta: number;
  costoProducto: number;
  costoEnvio: number;
  abono: number;
  saldoPendiente: number;
  gananciaNeta: number | null;
  fuente: string | null;
  estado: string;
}

export interface DatosVenta {
  fecha: string;
  cliente: string;
  celular?: string;
  marca: string;
  modelo: string;
  estilo?: string;
  precioVenta: number;
  costoProducto: number;
  costoEnvio: number;
  abono: number;
  fuente?: string;
  estado: string;
}

// El listado paginado de ventas sale de metrics (ver metricsApi.ventas).
export const ventasApi = {
  async crear(venta: DatosVenta) {
    await api.post('/ventas', venta);
  },

  async actualizar(id: string, cambios: Partial<DatosVenta>) {
    await api.put(`/ventas/${id}`, cambios);
  },

  async eliminar(id: string) {
    await api.delete(`/ventas/${id}`);
  },
};
