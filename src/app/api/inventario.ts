import { api } from './client';

export interface ItemInventario {
  id: string;
  marca: string | null;
  modelo: string;
  stock: number;
  costoUnitario: number;
  categoria: string;
  capitalItem: number;
}

export const inventarioApi = {
  async listar(signal?: AbortSignal) {
    const { data } = await api.get<ItemInventario[]>('/inventario', {
      signal,
    });
    return data;
  },

  /** Recalcula el inventario completo desde compras y ventas históricas. */
  async recalcular() {
    const { data } = await api.post<{ seeded: number; modelos: string[] }>(
      '/inventario/seed',
    );
    return data;
  },
};
