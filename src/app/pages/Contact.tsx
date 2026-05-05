// ============================================================
// PÁGINA: CONTACTO — /contact
//
// Los links de WhatsApp e Instagram vienen de src/app/config.ts
// Cambia el número o las redes SOLO en ese archivo.
// ============================================================

import { motion } from "motion/react";
import { MessageCircle, Instagram, MapPin } from "lucide-react";
import { CONFIG, whatsappContactLink } from "../config";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h1
            className="text-5xl md:text-7xl mb-8 tracking-wide"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
          >
            Contacto
          </h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto leading-relaxed">
            Estamos aquí para responder tus preguntas sobre nuestras piezas excepcionales. Escríbenos para consultas personalizadas.
          </p>
        </motion.div>

        {/* SECCIÓN: MÉTODOS DE CONTACTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

          {/* WhatsApp */}
          <motion.a
            href={whatsappContactLink()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group p-12 border border-black/10 hover:border-[#C9A84C] transition-all duration-300 hover:shadow-lg"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle size={32} className="mb-6 text-[#C9A84C]" aria-hidden="true" />
            <h3
              className="text-2xl mb-4 tracking-wide group-hover:text-[#C9A84C] transition-colors"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              WhatsApp
            </h3>
            <p className="text-black/60 mb-2">
              Asesoría personalizada y órdenes directas
            </p>
            <p className="text-sm text-black/40 mb-4">{CONFIG.whatsappDisplay}</p>
            <span className="text-sm uppercase tracking-widest text-[#C9A84C]">
              Iniciar conversación →
            </span>
          </motion.a>

          {/* Instagram */}
          <motion.a
            href={CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group p-12 border border-black/10 hover:border-[#C9A84C] transition-all duration-300 hover:shadow-lg"
            aria-label="Ver Instagram de C3LECT"
          >
            <Instagram size={32} className="mb-6 text-[#C9A84C]" aria-hidden="true" />
            <h3
              className="text-2xl mb-4 tracking-wide group-hover:text-[#C9A84C] transition-colors"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Instagram
            </h3>
            <p className="text-black/60 mb-4">
              Curadurías visuales y nuevas adquisiciones
            </p>
            <span className="text-sm uppercase tracking-widest text-[#C9A84C]">
              {CONFIG.instagramHandle} →
            </span>
          </motion.a>
        </div>

        {/* SECCIÓN: UBICACIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-16 border-t border-black/10"
        >
          <MapPin size={24} className="mx-auto mb-6 text-[#C9A84C]" aria-hidden="true" />
          <h3
            className="text-2xl mb-4 tracking-wide"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {CONFIG.ciudad}
          </h3>
          <p className="text-black/60">
            Atención con cita previa para inspección personal de piezas selectas
          </p>
        </motion.div>

        {/* Nota de servicio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 bg-neutral-50 text-center"
        >
          <p className="text-sm text-black/50 leading-relaxed">
            Valoramos cada consulta. Responderemos personalmente dentro de 24 horas. No utilizamos formularios automatizados ni respuestas genéricas.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
