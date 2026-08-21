// ============================================================
// PÁGINA: CONTACTO — /contact
//
// Los links de WhatsApp e Instagram vienen de src/app/config.ts
// Cambia el número o las redes SOLO en ese archivo.
// ============================================================

import { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Instagram, MapPin } from "lucide-react";
import { CONFIG, whatsappContactLink } from "../config";
import { trackContactWhatsApp, setMetaUserData } from "../lib/metaPixel";
import { Field, FieldArea } from "../components/ds/Field";
import { Button } from "../components/ds/Button";

function buildEncargoWhatsAppLink(nombre: string, whatsapp: string, queBuscas: string): string {
  const mensaje = [
    "Hola C3LECT, quiero hacer un encargo:",
    "",
    `Nombre: ${nombre}`,
    `WhatsApp: ${whatsapp}`,
    `Qué busco: ${queBuscas}`,
  ].join("\n");
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export default function Contact() {
  const [form, setForm] = useState({ nombre: "", whatsapp: "", queBuscas: "" });

  function set<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // El formulario de encargo ya nos dio nombre y teléfono: se los pasamos
    // a Meta hasheados para que pueda reconocer al usuario más adelante.
    setMetaUserData({ phone: form.whatsapp, firstName: form.nombre });
    trackContactWhatsApp({ origen: "contacto" });
    window.open(buildEncargoWhatsAppLink(form.nombre, form.whatsapp, form.queBuscas), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span style={{ width: 32, height: 1, backgroundColor: "#C9A84C" }} />
            <p className="text-[11px] uppercase text-white/50" style={{ letterSpacing: "0.32em" }}>
              Escríbenos
            </p>
            <span style={{ width: 32, height: 1, backgroundColor: "#C9A84C" }} />
          </div>
          <h1
            className="text-5xl md:text-7xl mb-8 tracking-wide text-white"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
          >
            Conseguimos por encargo.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Estamos aquí para responder tus preguntas sobre nuestras piezas excepcionales. Escríbenos para consultas personalizadas.
          </p>
        </motion.div>

        {/* SECCIÓN: ENCARGO + MÉTODOS DE CONTACTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">

          {/* Formulario de encargo — abre WhatsApp con el mensaje pre-armado */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-7"
          >
            <p className="text-[10px] uppercase text-white/40" style={{ letterSpacing: "0.28em" }}>
              Dinos la referencia que buscas
            </p>
            <Field label="Nombre" required value={form.nombre} onChange={set("nombre")} placeholder="Tu nombre" />
            <Field label="WhatsApp" required value={form.whatsapp} onChange={set("whatsapp")} placeholder="300 000 0000" />
            <FieldArea label="Qué buscas" required rows={3} value={form.queBuscas} onChange={set("queBuscas")} placeholder="Referencia, marca o descripción" />
            <Button type="submit" variant="block-dark">
              Enviar el encargo
            </Button>
          </motion.form>

          {/* Métodos de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <a
              href={whatsappContactLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4"
              aria-label="Contactar por WhatsApp"
              onClick={() => trackContactWhatsApp({ origen: "contacto" })}
            >
              <MessageCircle size={20} className="mt-1 shrink-0 text-[#C9A84C]" aria-hidden="true" />
              <div>
                <h3 className="text-lg text-white group-hover:text-[#C9A84C] transition-colors">WhatsApp</h3>
                <p className="text-white/50 text-sm">Asesoría personalizada y órdenes directas</p>
                <p className="text-sm text-white/40">{CONFIG.whatsappDisplay}</p>
              </div>
            </a>

            <a
              href={CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4"
              aria-label="Ver Instagram de C3LECT"
            >
              <Instagram size={20} className="mt-1 shrink-0 text-[#C9A84C]" aria-hidden="true" />
              <div>
                <h3 className="text-lg text-white group-hover:text-[#C9A84C] transition-colors">Instagram</h3>
                <p className="text-white/50 text-sm">Curadurías visuales y nuevas adquisiciones</p>
                <p className="text-sm text-white/40">{CONFIG.instagramHandle}</p>
              </div>
            </a>

            <div className="flex items-start gap-4">
              <MapPin size={20} className="mt-1 shrink-0 text-[#C9A84C]" aria-hidden="true" />
              <div>
                <h3 className="text-lg text-white">{CONFIG.ciudad}</h3>
                <p className="text-white/50 text-sm">Atención con cita previa para inspección personal de piezas selectas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nota de servicio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 bg-[#1A1A1A] text-center"
        >
          <p className="text-sm text-white/50 leading-relaxed">
            Valoramos cada consulta. Responderemos personalmente dentro de 24 horas. No utilizamos formularios automatizados ni respuestas genéricas.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
