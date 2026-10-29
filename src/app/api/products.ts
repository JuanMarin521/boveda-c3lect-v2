import { api } from './client';
import { params, type Paginado } from './common';

// Producto tal como lo administra el panel (modelo plano del backend). La
// tienda usa otro modelo, el de la vista catalogo_publico (data/types.ts).
export interface ProductoAdmin {
  id: string;
  nombre: string;
  estilo: string;
  display: string;
  precio: number;
  disponible: boolean;
  destacado: boolean;
  destacadoOrden: number | null;
  cat: 'reloj' | 'perfume' | 'accesorio';
  marca: string | null;
  genero: string | null;
  imgs: string[];
  specMovimiento: string | null;
  specDimensiones: string | null;
  specCaja: string | null;
  specCorrea: string | null;
  specCristal: string | null;
  specFunciones: string | null;
  specResistenciaAgua: string | null;
  specPeso: string | null;
  specBateria: string | null;
  specReservaMarcha: string | null;
  specObservaciones: string | null;
  notasDescripcion: string | null;
  notasTop: string | null;
  notasCorazon: string | null;
  notasBase: string | null;
  /** Sin precio, estilo o imágenes: no se publica. Lo calcula el backend. */
  incompleto: boolean;
}

export type DatosProducto = Partial<Omit<ProductoAdmin, 'id' | 'incompleto'>>;

export interface FiltroProductos {
  categoria?: string;
  soloDisponibles?: string;
  destacado?: boolean;
  incompletos?: boolean;
  sortBy?: 'precio';
  sortOrder?: 'asc' | 'desc';
}

export const productsApi = {
  /** Lista completa (sin paginar). */
  async listar(filtro: FiltroProductos = {}, signal?: AbortSignal) {
    const { data } = await api.get<ProductoAdmin[]>('/products', {
      params: params({ ...filtro }),
      signal,
    });
    return data;
  },

  async listarPaginado(
    filtro: FiltroProductos & { page: number; limit: number },
    signal?: AbortSignal,
  ) {
    const { data } = await api.get<Paginado<ProductoAdmin>>('/products', {
      params: params({ ...filtro }),
      signal,
    });
    return data;
  },

  async obtener(id: string, signal?: AbortSignal) {
    const { data } = await api.get<ProductoAdmin>(`/products/${id}`, {
      signal,
    });
    return data;
  },

  async crear(producto: DatosProducto & { id: string }) {
    await api.post('/products', producto);
  },

  async actualizar(id: string, cambios: DatosProducto) {
    await api.patch(`/products/${id}`, cambios);
  },

  async eliminar(id: string) {
    await api.delete(`/products/${id}`);
  },
};
