import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface Fuerza {
  nivel: 0 | 1 | 2 | 3;
  label: string;
  color: string;
}

function calcFuerza(p: string): Fuerza {
  if (!p) return { nivel: 0, label: '', color: '' };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { nivel: 1, label: 'Débil', color: '#ef4444' };
  if (score === 2) return { nivel: 2, label: 'Regular', color: '#f59e0b' };
  return { nivel: 3, label: 'Fuerte', color: '#22c55e' };
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const fuerza = calcFuerza(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (fuerza.nivel < 2) {
      setError('La contraseña es demasiado débil. Usa al menos 8 caracteres, una mayúscula y un número.');
      return;
    }

    setEnviando(true);
    try {
      await register(email, password, nombre);
      navigate('/catalog');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Error al crear la cuenta');
    } finally {
      setEnviando(false);
    }
  }

  const inputClasses =
    'w-full border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C9A84C] transition-colors bg-[#1A1A1A]';
  const labelClasses = 'block text-sm tracking-widest uppercase text-white/70 mb-1.5';

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
            Crear cuenta
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClasses}>Nombre completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClasses}
              placeholder="Tu nombre"
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
            />
            {/* Indicador de fortaleza */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: fuerza.nivel >= n ? fuerza.color : '#2a2a2a',
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm" style={{ color: fuerza.color }}>
                  {fuerza.label}
                  {fuerza.nivel < 2 && (
                    <span className="text-white/30 ml-1">— añade mayúsculas, números o símbolos</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 text-sm tracking-widest uppercase text-white rounded transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: '#C9A84C' }}
          >
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/50">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#C9A84C] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
