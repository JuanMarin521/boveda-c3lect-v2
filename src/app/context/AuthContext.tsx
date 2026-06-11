import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  cargando: boolean;
  autenticado: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginConOtp: (email: string, code: string) => Promise<{ requiresRegistration?: boolean }>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function saveSession(accessToken: string, refreshToken: string, user: AuthUser) {
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);
  sessionStorage.setItem('authUser', JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('authUser');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('accessToken');
    if (!storedToken) {
      setCargando(false);
      return;
    }

    api.get<AuthUser>('/auth/me')
      .then(({ data }) => {
        setUser(data);
        setAccessToken(storedToken);
      })
      .catch(() => {
        // Fallback: leer usuario del sessionStorage si /auth/me no existe aún
        const stored = sessionStorage.getItem('authUser');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
            setAccessToken(storedToken);
          } catch {
            clearSession();
          }
        } else {
          clearSession();
        }
      })
      .finally(() => setCargando(false));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>('/auth/login', { email, password });
    saveSession(data.accessToken, data.refreshToken, data.user);
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function loginConOtp(email: string, code: string) {
    const { data } = await api.post<{
      accessToken?: string;
      refreshToken?: string;
      user?: AuthUser;
      requiresRegistration?: boolean;
    }>('/auth/verify-otp', { email, code });
    if (data.accessToken && data.user) {
      saveSession(data.accessToken, data.refreshToken!, data.user);
      setAccessToken(data.accessToken);
      setUser(data.user);
    }
    return { requiresRegistration: data.requiresRegistration };
  }

  async function register(email: string, password: string, nombre: string) {
    const { data } = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>('/auth/register', { email, password, nombre });
    saveSession(data.accessToken, data.refreshToken, data.user);
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignorar error — el token puede estar expirado
    }
    clearSession();
    setAccessToken(null);
    setUser(null);
  }

  async function requestOtp(email: string) {
    await api.post('/auth/request-otp', { email });
  }

  async function requestPasswordReset(email: string) {
    await api.post('/auth/request-password-reset', { email });
  }

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      cargando,
      autenticado: !!user,
      login,
      loginConOtp,
      register,
      logout,
      requestOtp,
      requestPasswordReset,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
