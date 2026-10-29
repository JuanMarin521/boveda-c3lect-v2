import { api } from './client';
import { params, type Paginado } from './common';
import type { EstadoPedido } from './orders';

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  createdAt: string;
  totalPedidos: number;
  totalGastado: number;
}

export interface ClienteDetalle {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  ciudad: string | null;
  departamento: string | null;
  direccion: string | null;
  rol: string;
  createdAt: string;
  totalGastado: number;
  orders: {
    id: string;
    orderNumber: string;
    status: EstadoPedido;
    total: number;
    createdAt: string;
    items: { nombre: string; cantidad: number }[];
  }[];
}

export const usersApi = {
  async listar(
    filtro: { search?: string; page?: number; limit?: number },
    signal?: AbortSignal,
  ) {
    const { data } = await api.get<Paginado<Cliente>>('/users', {
      params: params(filtro),
      signal,
    });
    return data;
  },

  async obtener(id: string, signal?: AbortSignal) {
    const { data } = await api.get<ClienteDetalle>(`/users/${id}`, { signal });
    return data;
  },
};
