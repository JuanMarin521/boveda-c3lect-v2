// ============================================================
// PÁGINA: MI CUENTA — DIRECCIONES — /cuenta/direcciones
//
// Varias direcciones por usuario, una marcada como principal. Toda la
// lógica de "solo una principal a la vez" vive en el backend
// (AccountService) — acá solo se refleja lo que devuelve la API.
// ============================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Pencil, Star, Trash2, X } from "lucide-react";
import { api } from "../lib/api";
import { Field } from "../components/ds/Field";
import { FormError } from "../components/ds/FormError";
import { Button } from "../components/ds/Button";

interface Direccion {
  id: string;
  alias: string | null;
  ciudad: string;
  departamento: string;
  direccion: string;
  esPrincipal: boolean;
}

const FORM_VACIO = { alias: "", ciudad: "", departamento: "", direccion: "" };

export default function AccountAddresses() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [porEliminar, setPorEliminar] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    api.get<Direccion[]>("/account/addresses")
      .then(({ data }) => setDirecciones(data))
      .catch(() => setError("No pudimos cargar tus direcciones."))
      .finally(() => setCargando(false));
  }

  useEffect(cargar, []);

  function set<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function abrirNueva() {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setCreando(true);
  }

  function abrirEdicion(d: Direccion) {
    setForm({ alias: d.alias ?? "", ciudad: d.ciudad, departamento: d.departamento, direccion: d.direccion });
    setEditandoId(d.id);
    setCreando(true);
  }

  function cerrarForm() {
    setCreando(false);
    setEditandoId(null);
    setForm(FORM_VACIO);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      if (editandoId) {
        await api.patch(`/account/addresses/${editandoId}`, form);
      } else {
        await api.post("/account/addresses", form);
      }
      cerrarForm();
      cargar();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "No se pudo guardar la dirección.");
    } finally {
      setGuardando(false);
    }
  }

  async function marcarPrincipal(id: string) {
    await api.post(`/account/addresses/${id}/principal`);
    cargar();
  }

  async function eliminar(id: string) {
    if (porEliminar !== id) {
      setPorEliminar(id);
      setTimeout(() => setPorEliminar((p) => (p === id ? null : p)), 3000);
      return;
    }
    setPorEliminar(null);
    await api.delete(`/account/addresses/${id}`);
    cargar();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-12 pb-7 border-b border-white/10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl tracking-wide text-white"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
        >
          Direcciones
        </motion.h1>
        {!creando && (
          <Button onClick={abrirNueva} variant="outline" className="w-auto inline-flex shrink-0 mt-2">
            Agregar
          </Button>
        )}
      </div>

      <AnimatePresence>
        {creando && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-12 max-w-md overflow-hidden"
          >
            <div className="space-y-7 pb-2">
              {error && <FormError>{error}</FormError>}
              <Field label="Alias (opcional)" value={form.alias} onChange={set("alias")} placeholder="Casa, Oficina…" />
              <Field label="Ciudad" required value={form.ciudad} onChange={set("ciudad")} placeholder="Medellín" />
              <Field label="Departamento" required value={form.departamento} onChange={set("departamento")} placeholder="Antioquia" />
              <Field label="Dirección" required value={form.direccion} onChange={set("direccion")} placeholder="Calle 10 #20-30, Apt 5" />
              <div className="flex gap-4">
                <Button type="submit" disabled={guardando} variant="block-dark">
                  {guardando ? "Guardando…" : editandoId ? "Guardar cambios" : "Agregar dirección"}
                </Button>
                <button
                  type="button"
                  onClick={cerrarForm}
                  className="text-white/40 hover:text-white transition-colors shrink-0"
                  aria-label="Cancelar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {cargando ? (
        <p className="text-white/40 py-20">Cargando...</p>
      ) : direcciones.length === 0 && !creando ? (
        <div className="text-center py-20">
          <MapPin size={28} className="mx-auto mb-6 text-white/30" aria-hidden="true" />
          <p className="text-white/60">Todavía no guardaste ninguna dirección.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {direcciones.map((d) => (
            <div key={d.id} className="py-6 flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg text-white">{d.alias || "Dirección"}</h3>
                  {d.esPrincipal && (
                    <span
                      className="text-[10px] uppercase px-2 py-0.5 border"
                      style={{ letterSpacing: "0.18em", color: "#C9A84C", borderColor: "rgba(201,168,76,0.5)" }}
                    >
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm">{d.direccion}</p>
                <p className="text-white/40 text-sm">{d.ciudad}, {d.departamento}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {!d.esPrincipal && (
                  <button
                    onClick={() => marcarPrincipal(d.id)}
                    className="text-white/40 hover:text-[#C9A84C] transition-colors"
                    aria-label={`Marcar ${d.alias || "esta dirección"} como principal`}
                    title="Marcar como principal"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button
                  onClick={() => abrirEdicion(d)}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label={`Editar ${d.alias || "dirección"}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => eliminar(d.id)}
                  className="transition-colors"
                  style={{ color: porEliminar === d.id ? "#C9A84C" : "rgba(255,255,255,0.4)" }}
                  aria-label={porEliminar === d.id ? "Confirmar eliminación" : `Eliminar ${d.alias || "dirección"}`}
                  title={porEliminar === d.id ? "Clic de nuevo para confirmar" : "Eliminar"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
