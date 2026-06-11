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
    'w-full border border-black/15 rounded px-4 py-3 text-sm outline-none focus:border-[#C9A84C] transition-colors';
  const labelClasses = 'block text-xs tracking-widest uppercase text-black/50 mb-1.5';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="text-2xl tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: '#C9A84C' }}
          >
            C3LECT
          </Link>
          <p className="mt-2 text-xs tracking-widest uppercase text-black/40">
            Crear cuenta
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-red-700 text-sm rounded">
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
                        backgroundColor: fuerza.nivel >= n ? fuerza.color : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: fuerza.color }}>
                  {fuerza.label}
                  {fuerza.nivel < 2 && (
                    <span className="text-black/30 ml-1">— añade mayúsculas, números o símbolos</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 text-sm tracking-widest uppercase text-white rounded transition-opacity disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: '#C9A84C' }}
          >
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-black/40">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#C9A84C] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
