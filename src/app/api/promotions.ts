import { api } from './client';

export type AlcancePromocion = 'PRODUCTO' | 'CATEGORIA' | 'MARCA' | 'TODOS';

export interface Promocion {
  id: string;
  nombre: string;
  alcance: AlcancePromocion;
  porcentaje: number;
  productosIncluidos: string[];
  categoria: string | null;
  marca: string | null;
  excluidos: string[];
  soloCuentaActiva: boolean;
  fechaInicio: string; // ISO
  fechaFin: string; // ISO
  activo: boolean;
  /** La calcula el backend: activa y dentro de su rango de fechas. */
  vigente: boolean;
}

export interface DatosPromocion {
  nombre: string;
  alcance: AlcancePromocion;
  porcentaje: number;
  productosIncluidos?: string[];
  categoria?: string;
  marca?: string;
  excluidos?: string[];
  soloCuentaActiva?: boolean;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export const promotionsApi = {
  async listar(signal?: AbortSignal) {
    const { data } = await api.get<Promocion[]>('/promotions', { signal });
    return data;
  },

  async obtener(id: string, signal?: AbortSignal) {
    const { data } = await api.get<Promocion>(`/promotions/${id}`, { signal });
    return data;
  },

  async crear(promocion: DatosPromocion) {
    await api.post('/promotions', promocion);
  },

  async actualizar(id: string, cambios: Partial<DatosPromocion>) {
    await api.patch(`/promotions/${id}`, cambios);
  },

  async eliminar(id: string) {
    await api.delete(`/promotions/${id}`);
  },
};
