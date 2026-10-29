import { api } from './client';

export interface Perfil {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
}

export interface Direccion {
  id: string;
  alias: string | null;
  ciudad: string;
  departamento: string;
  direccion: string;
  esPrincipal: boolean;
}

export interface DatosDireccion {
  alias?: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  esPrincipal?: boolean;
}

export const accountApi = {
  async perfil(signal?: AbortSignal) {
    const { data } = await api.get<Perfil>('/account/profile', { signal });
    return data;
  },

  async actualizarPerfil(cambios: { nombre?: string; telefono?: string }) {
    const { data } = await api.patch<Perfil>('/account/profile', cambios);
    return data;
  },

  async direcciones(signal?: AbortSignal) {
    const { data } = await api.get<Direccion[]>('/account/addresses', {
      signal,
    });
    return data;
  },

  async crearDireccion(datos: DatosDireccion) {
    await api.post('/account/addresses', datos);
  },

  async actualizarDireccion(id: string, datos: Partial<DatosDireccion>) {
    await api.patch(`/account/addresses/${id}`, datos);
  },

  async marcarPrincipal(id: string) {
    await api.post(`/account/addresses/${id}/principal`);
  },

  async eliminarDireccion(id: string) {
    await api.delete(`/account/addresses/${id}`);
  },
};
