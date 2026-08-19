import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Field } from '../components/ds/Field';
import { Button } from '../components/ds/Button';

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
            Recuperar contraseña
          </h1>
        </div>

        {enviado ? (
          <div className="text-center space-y-6">
            <p className="text-base text-white/60 leading-relaxed">
              Si <strong className="text-white/70">{email}</strong> está registrado,
              recibirás un enlace de recuperación en tu correo.
            </p>
            <Link
              to="/login"
              className="inline-block text-xs uppercase tracking-widest text-[#C9A84C] hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7">
            <p className="text-sm text-white/50 leading-relaxed">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
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
              {enviando ? 'Enviando…' : 'Enviar enlace'}
            </Button>
            <div className="text-center">
              <Link
                to="/login"
                className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] transition-colors"
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
