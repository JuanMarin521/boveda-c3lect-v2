import { api } from './client';

export interface Gasto {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  responsable: string | null;
  estado: string | null;
}

export interface DatosGasto {
  fecha: string;
  concepto: string;
  monto: number;
  responsable?: string;
  estado?: string;
}

export const gastosApi = {
  async listar(signal?: AbortSignal) {
    const { data } = await api.get<Gasto[]>('/gastos', { signal });
    return data;
  },

  async crear(gasto: DatosGasto) {
    await api.post('/gastos', gasto);
  },

  async actualizar(id: string, cambios: Partial<DatosGasto>) {
    await api.put(`/gastos/${id}`, cambios);
  },

  async eliminar(id: string) {
    await api.delete(`/gastos/${id}`);
  },
};
