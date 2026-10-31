import { api } from './client';

export const marcasApi = {
  /** Marcas conocidas por el catálogo y las compras, ordenadas. */
  async listar(signal?: AbortSignal) {
    const { data } = await api.get<string[]>('/marcas', { signal });
    return data;
  },
};
