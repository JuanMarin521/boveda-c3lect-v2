import { api } from './client';

export interface UsuarioSesion {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

export interface Sesion {
  accessToken: string;
  refreshToken: string;
  user: UsuarioSesion;
}

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await api.post<Sesion>('/auth/login', { email, password });
    return data;
  },

  /** Sin cuenta para ese email devuelve { requiresRegistration: true }. */
  async verificarOtp(email: string, code: string) {
    const { data } = await api.post<
      Partial<Sesion> & { requiresRegistration?: boolean }
    >('/auth/verify-otp', { email, code });
    return data;
  },

  async registrar(datos: {
    email: string;
    password: string;
    nombre: string;
    telefono?: string;
  }) {
    const { data } = await api.post<Sesion>('/auth/register', datos);
    return data;
  },

  async yo() {
    const { data } = await api.get<UsuarioSesion>('/auth/me');
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async solicitarOtp(email: string) {
    await api.post('/auth/request-otp', { email });
  },

  async solicitarRestablecimiento(email: string) {
    await api.post('/auth/request-password-reset', { email });
  },
};
