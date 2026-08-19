import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Field } from '../components/ds/Field';
import { FormError } from '../components/ds/FormError';
import { Button } from '../components/ds/Button';

type Modo = 'password' | 'otp-request' | 'otp-verify';

export default function Login() {
  const { login, requestOtp, loginConOtp } = useAuth();
  const navigate = useNavigate();

  const [modo, setModo] = useState<Modo>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0A0A0A]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-12 text-center">
          <Link
            to="/"
            className="text-2xl tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: '#C9A84C' }}
          >
            C3LECT
          </Link>
          <h1
            className="mt-6 text-4xl text-white"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}
          >
            {modo === 'password' ? 'Ingresar' : 'Código de acceso'}
          </h1>
        </div>

        {error && <div className="mb-6"><FormError>{error}</FormError></div>}

        {modo === 'password' && (
          <form onSubmit={handleLogin} className="space-y-7">
            <Field
              label="Correo electrónico"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
            />
            <Field
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-white/30 hover:text-[#C9A84C] transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button type="submit" disabled={enviando} variant="block-dark">
              {enviando ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>
        )}

        {modo === 'otp-request' && (
          <form onSubmit={handleRequestOtp} className="space-y-7">
            <p className="text-sm text-white/50">
              Te enviaremos un código de 6 dígitos al correo para entrar sin contraseña.
            </p>
            <Field
              label="Correo electrónico"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
            />
            <Button type="submit" disabled={enviando} variant="block-dark">
              {enviando ? 'Enviando…' : 'Enviar código'}
            </Button>
          </form>
        )}

        {modo === 'otp-verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-7">
            <p className="text-sm text-white/50">
              Se envió un código a <strong className="text-white/70">{email}</strong>. Ingrésalo abajo.
            </p>
            <Field
              label="Código OTP"
              type="text"
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center tracking-[0.5em] text-lg"
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            <Button type="submit" disabled={enviando} variant="block-dark">
              {enviando ? 'Verificando…' : 'Verificar código'}
            </Button>
          </form>
        )}

        {/* Toggle OTP / contraseña */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-1">
          {modo === 'password' ? (
            <button
              onClick={() => cambiarModo('otp-request')}
              className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Entrar con código OTP
            </button>
          ) : (
            <button
              onClick={() => cambiarModo('password')}
              className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Volver al inicio de sesión
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4 text-white/15">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] uppercase tracking-widest">o</span>
          <div className="flex-1 h-px bg-white/10" />
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
