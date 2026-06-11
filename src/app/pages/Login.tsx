import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

type Modo = 'password' | 'otp-request' | 'otp-verify';

export default function Login() {
  const { login, requestOtp, loginConOtp } = useAuth();
  const navigate = useNavigate();

  const [modo, setModo] = useState<Modo>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(email, password);
      navigate('/catalog');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Error al iniciar sesión');
    } finally {
      setEnviando(false);
    }
  }

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await requestOtp(email);
    } catch {
      // mismo mensaje siempre — no revelar si el email existe
    } finally {
      setEnviando(false);
      setModo('otp-verify');
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const result = await loginConOtp(email, otpCode);
      if (result?.requiresRegistration) {
        navigate('/register');
      } else {
        navigate('/catalog');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Código inválido o expirado');
    } finally {
      setEnviando(false);
    }
  }

  function cambiarModo(nuevo: Modo) {
    setModo(nuevo);
    setError('');
  }

  const inputClasses =
    'w-full border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C9A84C] transition-colors bg-[#1A1A1A]';
  const labelClasses = 'block text-sm tracking-widest uppercase text-white/70 mb-1.5';
  const btnPrimary =
    'w-full py-3 text-sm tracking-widest uppercase text-white rounded transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer';

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="text-3xl tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: '#C9A84C' }}
          >
            C3LECT
          </Link>
          <p className="mt-2 text-sm tracking-widest uppercase text-white/50">
            {modo === 'password' ? 'Iniciar sesión' : 'Código de acceso'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            {error}
          </div>
        )}

        {/* Formulario contraseña */}
        {modo === 'password' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={labelClasses}>Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="tu@correo.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className={labelClasses}>Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-sm text-white/50 hover:text-[#C9A84C] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              disabled={enviando}
              className={btnPrimary}
              style={{ backgroundColor: '#C9A84C' }}
            >
              {enviando ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>
        )}

        {/* Formulario OTP — solicitar */}
        {modo === 'otp-request' && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <p className="text-sm text-white/50">
              Te enviaremos un código de 6 dígitos al correo para entrar sin contraseña.
            </p>
            <div>
              <label className={labelClasses}>Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="tu@correo.com"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={enviando}
              className={btnPrimary}
              style={{ backgroundColor: '#C9A84C' }}
            >
              {enviando ? 'Enviando…' : 'Enviar código'}
            </button>
          </form>
        )}

        {/* Formulario OTP — verificar */}
        {modo === 'otp-verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <p className="text-sm text-white/50">
              Se envió un código a <strong className="text-white/70">{email}</strong>. Ingrésalo abajo.
            </p>
            <div>
              <label className={labelClasses}>Código OTP</label>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`${inputClasses} text-center tracking-[0.5em] text-lg`}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>
            <button
              type="submit"
              disabled={enviando}
              className={btnPrimary}
              style={{ backgroundColor: '#C9A84C' }}
            >
              {enviando ? 'Verificando…' : 'Verificar código'}
            </button>
          </form>
        )}

        {/* Toggle OTP / contraseña */}
        <div className="mt-8 pt-6 border-t border-white/10">
          {modo === 'password' ? (
            <button
              onClick={() => cambiarModo('otp-request')}
              className="w-full text-center text-sm text-white/50 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Entrar con código OTP
            </button>
          ) : (
            <button
              onClick={() => cambiarModo('password')}
              className="w-full text-center text-sm text-white/50 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Volver al inicio de sesión
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[#C9A84C] hover:underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
