import { api } from './client';

export interface Precio {
  id: string;
  marca: string;
  modelo: string;
  costoUnitario: number;
  costoAdicional: number;
  costoTotal: number;
  precioPublico: number | null;
  precioCierre: number | null;
  gananciaMinima: number | null;
}

export interface DatosPrecio {
  marca: string;
  modelo: string;
  costoUnitario: number;
  /** Si se omite, el backend aplica su valor por defecto. */
  costoAdicional?: number;
  precioPublico?: number;
  precioCierre?: number;
}

export const preciosApi = {
  async listar(signal?: AbortSignal) {
    const { data } = await api.get<Precio[]>('/precios', { signal });
    return data;
  },

  /** Valores que el backend aplica si no se indican (p. ej. el costo adicional). */
  async valoresPorDefecto(signal?: AbortSignal) {
    const { data } = await api.get<{ costoAdicional: number }>(
      '/precios/valores-por-defecto',
      { signal },
    );
    return data;
  },

  async crear(precio: DatosPrecio) {
    await api.post('/precios', precio);
  },

  async actualizar(
    id: string,
    cambios: Partial<Omit<DatosPrecio, 'marca' | 'modelo'>>,
  ) {
    await api.put(`/precios/${id}`, cambios);
  },
};
