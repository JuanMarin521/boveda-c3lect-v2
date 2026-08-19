import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Field } from '../components/ds/Field';
import { FormError } from '../components/ds/FormError';
import { Button } from '../components/ds/Button';

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
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      await register(email, password, nombre, telefono || undefined);
      navigate('/catalog');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Error al crear la cuenta');
    } finally {
      setEnviando(false);
    }
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
            Crear cuenta
          </h1>
        </div>

        {error && <div className="mb-6"><FormError>{error}</FormError></div>}

        <form onSubmit={handleSubmit} className="space-y-7">
          <Field
            label="Nombre completo"
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
          />

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
            label="Celular"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+57 300 000 0000"
            autoComplete="tel"
          />

          <div>
            <Field
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
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
            {/* Indicador de fortaleza */}
            {password && (
              <div className="mt-3 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-px flex-1 transition-colors duration-300"
                      style={{
                        backgroundColor: fuerza.nivel >= n ? fuerza.color : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs uppercase tracking-widest" style={{ color: fuerza.color }}>
                  {fuerza.label}
                  {fuerza.nivel < 2 && (
                    <span className="text-white/30 ml-1 normal-case tracking-normal">— añade mayúsculas, números o símbolos</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <Button type="submit" disabled={enviando} variant="block-dark">
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
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
