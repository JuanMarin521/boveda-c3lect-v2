import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await requestPasswordReset(email);
    } finally {
      setEnviando(false);
      setEnviado(true);
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
            Recuperar contraseña
          </p>
        </div>

        {enviado ? (
          <div className="text-center space-y-6">
            <p className="text-sm text-black/60 leading-relaxed">
              Si <strong className="text-black/70">{email}</strong> está registrado,
              recibirás un enlace de recuperación en tu correo.
            </p>
            <Link
              to="/login"
              className="inline-block text-sm text-[#C9A84C] hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-black/50 leading-relaxed">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
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
              className="w-full py-3 text-sm tracking-widest uppercase text-white rounded transition-opacity disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {enviando ? 'Enviando…' : 'Enviar enlace'}
            </button>
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-black/40 hover:text-[#C9A84C] transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
