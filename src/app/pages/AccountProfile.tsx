// ============================================================
// PÁGINA: MI CUENTA — DATOS PERSONALES — /cuenta/datos
//
// Nombre y teléfono son editables (PATCH /account/profile). El correo es
// de solo lectura porque es la identidad de login — cambiarlo necesitaría
// re-verificación, fuera de alcance por ahora.
// ============================================================

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Field } from "../components/ds/Field";
import { FormError } from "../components/ds/FormError";
import { Button } from "../components/ds/Button";

interface Perfil {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
}

export default function AccountProfile() {
  const { refrescarUsuario } = useAuth();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    api.get<Perfil>("/account/profile").then(({ data }) => {
      setPerfil(data);
      setNombre(data.nombre);
      setTelefono(data.telefono ?? "");
    }).finally(() => setCargando(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      const { data } = await api.patch<Perfil>("/account/profile", { nombre, telefono });
      setPerfil(data);
      await refrescarUsuario();
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "No se pudo actualizar tu perfil.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p className="text-white/40 py-20">Cargando...</p>;
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl mb-12 pb-7 border-b border-white/10 tracking-wide text-white"
        style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
      >
        Datos personales
      </motion.h1>

      {error && <div className="mb-8"><FormError>{error}</FormError></div>}

      <form onSubmit={handleSubmit} className="space-y-7 max-w-md">
        <Field label="Nombre completo" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <Field label="Correo electrónico" value={perfil?.email ?? ""} disabled className="opacity-50 cursor-not-allowed" />
        <Field label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+57 300 000 0000" />
        <Button type="submit" disabled={guardando} variant="block-dark">
          {guardando ? "Guardando…" : guardado ? "Guardado" : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}
