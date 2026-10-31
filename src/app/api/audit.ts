import { api } from './client';
import { params, type Paginado } from './common';

export interface RegistroAuditoria {
  id: string;
  accion: string;
  entidad: string;
  entidadId: string;
  descripcion: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export const auditApi = {
  async listar(
    filtro: {
      page?: number;
      limit?: number;
      accion?: string;
      fechaDesde?: string;
      fechaHasta?: string;
    },
    signal?: AbortSignal,
  ) {
    const { data } = await api.get<Paginado<RegistroAuditoria>>('/audit', {
      params: params(filtro),
      signal,
    });
    return data;
  },
};
