import { api } from './client';
import { params, type Paginado } from './common';

// Escritura y moderación de reseñas. La lectura pública no pasa por aquí: se
// lee de la vista `resenas_publicas` de Supabase (ver data/resenas.ts).

export type EstadoResena = 'PUBLICADA' | 'OCULTA';

/** Producto que el cliente recibió y todavía no reseñó. */
export interface ProductoPorResenar {
  productId: string;
  nombre: string;
}

export interface DatosResena {
  productId: string;
  calificacion: number;
  titulo?: string;
  comentario: string;
}

/** Reseña completa, como la ve el panel admin. */
export interface Resena {
  id: string;
  productId: string;
  productoNombre: string;
  userId: string;
  autorNombre: string;
  calificacion: number;
  titulo: string | null;
  comentario: string;
  estado: EstadoResena;
  respuesta: string | null;
  respondidaAt: string | null;
  createdAt: string;
}

export const resenasApi = {
  async pendientes(signal?: AbortSignal) {
    const { data } = await api.get<ProductoPorResenar[]>('/resenas/pendientes', {
      signal,
    });
    return data;
  },

  async crear(resena: DatosResena) {
    await api.post('/resenas', resena);
  },

  async listar(
    filtros: { estado?: EstadoResena; page?: number; limit?: number },
    signal?: AbortSignal,
  ) {
    const { data } = await api.get<Paginado<Resena>>('/resenas', {
      params: params(filtros),
      signal,
    });
    return data;
  },

  async cambiarEstado(id: string, estado: EstadoResena) {
    await api.patch(`/resenas/${id}/estado`, { estado });
  },

  /** Texto vacío retira la respuesta. */
  async responder(id: string, respuesta: string) {
    await api.put(`/resenas/${id}/respuesta`, { respuesta });
  },
};
