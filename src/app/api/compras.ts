import { api } from './client';

export interface Compra {
  id: string;
  fecha: string;
  marca: string;
  modelo: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  categoria: string;
}

export interface DatosCompra {
  fecha: string;
  marca: string;
  modelo: string;
  cantidad: number;
  costoUnitario: number;
  categoria: string;
}

// El listado paginado de compras sale de metrics (ver metricsApi.compras).
export const comprasApi = {
  async crear(compra: DatosCompra) {
    await api.post('/compras', compra);
  },

  async actualizar(id: string, cambios: Partial<DatosCompra>) {
    await api.put(`/compras/${id}`, cambios);
  },
};
