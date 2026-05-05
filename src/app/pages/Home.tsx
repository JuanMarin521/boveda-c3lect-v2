// ============================================================
// PÁGINA: INICIO — /
//
// IMAGEN HERO: /images/relojes/curren-8467-negro-1.jpg
// IMAGEN COLECCIÓN RELOJES: /images/relojes/curren-8488-rectangular-blue-gold-1.jpg
// IMAGEN COLECCIÓN PERFUMES: /images/perfumes/afnan-9-pm-rebel-roja-1.jpg
//
// Para cambiar estas imágenes, edita las rutas "src" en cada <img> de esta página.
// ============================================================

import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { CONFIG } from "../config";

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">

        {/* Imagen de fondo con animación de entrada */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src="/images/relojes/curren-8467-negro-1.jpg"
            alt="Reloj C3LECT — Curren 8467 Negro"
            className="w-full h-full object-cover opacity-70"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </motion.div>

        {/* Contenido centrado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl mb-8 tracking-wide"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
          >
            Máquinas y Elixires
          </h1>
          <p className="text-lg md:text-xl mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed">
            {CONFIG.tagline}
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 text-sm uppercase tracking-widest hover:bg-[#C9A84C] hover:text-white transition-all duration-300"
          >
            Explorar Colecciones
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-16 bg-white/40"
          />
        </motion.div>
      </section>

      {/* ── PREVIEW DE COLECCIONES ───────────────────────────── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl mb-20 text-center tracking-wide"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Nuestras Colecciones
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

            {/* Colección Relojes */}
            <Link to="/catalog/watches" className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative aspect-[3/4] overflow-hidden bg-black"
              >
                <img
                  src="/images/relojes/curren-8488-rectangular-blue-gold-1.jpg"
                  alt="Colección Máquinas y Joyas — alta relojería"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-end p-8 md:p-12">
                  <div className="text-white">
                    <h3
                      className="text-3xl md:text-4xl mb-2 tracking-wide"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Máquinas y Joyas
                    </h3>
                    <p className="text-sm text-white/80 uppercase tracking-widest">Alta Relojería</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Colección Perfumes */}
            <Link to="/catalog/perfumes" className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[3/4] overflow-hidden bg-black"
              >
                <img
                  src="/images/perfumes/afnan-9-pm-rebel-roja-1.jpg"
                  alt="Colección Firmas y Elixires — perfumería de autor"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-end p-8 md:p-12">
                  <div className="text-white">
                    <h3
                      className="text-3xl md:text-4xl mb-2 tracking-wide"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Firmas y Elixires
                    </h3>
                    <p className="text-sm text-white/80 uppercase tracking-widest">Perfumería de Autor</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CITA — MANIFIESTO ────────────────────────────────── */}
      {/* SECCIÓN EDITABLE: cambia la cita en src/app/config.ts → CONFIG.quote */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p
              className="text-2xl md:text-3xl lg:text-4xl mb-12 leading-relaxed"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
            >
              {CONFIG.quote}
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-[#C9A84C] hover:border-[#C9A84C] transition-all duration-300"
            >
              Nuestro Manifiesto
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
