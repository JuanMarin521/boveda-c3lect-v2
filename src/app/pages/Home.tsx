// ============================================================
// PÁGINA: INICIO — /
//
// Dirección "Vitrina Nocturna" (desktop) / "Índice" (móvil) —
// ver design_handoff_c3lect_visual/README.md
//
// IMAGEN HERO: /images/homePage-C3LECT.webp (Curren 8467 — Negro)
// IMAGEN COLECCIÓN RELOJES: /images/relojes/skeleton-kosmo-644-6-negro-1.webp
// IMAGEN COLECCIÓN PERFUMES: /images/perfumes/afnan-9-pm-rebel-roja-1.webp
//
// Para cambiar estas imágenes, edita las rutas "src" en cada <img> de esta página.
// ============================================================

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ChevronRight } from "lucide-react";
import { CONFIG } from "../config";
import { Button } from "../components/ds/Button";
import { useProductos } from "../context/ProductosContext";
import { Precio } from "../components/Precio";
import type { Producto } from "../data/types";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const { productos } = useProductos();
  const relojes = useMemo(() => productos.filter((p) => p.cat === "reloj"), [productos]);
  const perfumes = useMemo(() => productos.filter((p) => p.cat === "perfume"), [productos]);
  // Sin precio "Desde": el catálogo aún tiene un producto de prueba con precio
  // simbólico (ver memoria del proyecto) que rompería esta cifra en el hero.
  // Reactivar cuando ese producto se limpie de la base de datos.

  // Selección de temporada — se marca por producto desde el panel de administración
  // ("Destacado en Home" en el formulario de producto). Se ordena por "destacadoOrden"
  // (menor primero; sin orden asignado va al final). Tope de 5 piezas: si hay más
  // marcadas, se muestran las primeras 5 y el resto se ignora silenciosamente.
  const piezasTemporada = useMemo(() => {
    return productos
      .filter((p) => p.destacado && p.disponible)
      .sort((a, b) => (a.destacadoOrden ?? Infinity) - (b.destacadoOrden ?? Infinity))
      .slice(0, 5);
  }, [productos]);

  // La pieza en pantalla en el hero de escritorio — su foto es el fondo del hero.
  const [temporadaIndex, setTemporadaIndex] = useState(0);
  const piezaActual = piezasTemporada.length > 0 ? piezasTemporada[temporadaIndex % piezasTemporada.length] : undefined;
  function siguientePieza() {
    setTemporadaIndex((i) => (i + 1) % piezasTemporada.length);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── HERO — desktop: "Vitrina Nocturna" ──────────────────── */}
      <div ref={heroRef} className="hidden md:block relative bg-black" style={{ minHeight: 820 }}>
        {/* Imagen de fondo — la pieza en temporada. Las fotos de producto son
            verticales (4:5) y el hero es panorámico, así que object-cover las
            recortaba hasta perder el reloj/frasco completo. Ahora hay dos
            capas: una versión difuminada a pantalla completa (solo ambiente,
            para que no queden bordes negros vacíos) y la foto nítida completa
            sin recortar, alineada a la derecha junto a su ficha. */}
        <div className="absolute inset-0 overflow-hidden" style={{ height: 820 }}>
          <motion.div style={{ y: imgY }} className="absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.img
                key={`bg-${piezaActual?.id ?? "default"}`}
                src={import.meta.env.BASE_URL + (piezaActual ? piezaActual.imgs[0] : "images/homePage-C3LECT.webp")}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "blur(50px) saturate(1.15)", transform: "scale(1.15)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
              />
              <motion.img
                key={piezaActual?.id ?? "default"}
                src={import.meta.env.BASE_URL + (piezaActual ? piezaActual.imgs[0] : "images/homePage-C3LECT.webp")}
                alt={piezaActual ? piezaActual.display : "Reloj C3LECT — Curren 8467 Negro"}
                className="absolute inset-0 w-full h-full object-contain object-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.92 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                loading="eager"
                fetchPriority="high"
              />
            </AnimatePresence>
          </motion.div>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg,#0A0A0A 8%, rgba(10,10,10,.72) 42%, rgba(10,10,10,.15) 100%)" }}
          />
          <div
            className="absolute left-0 right-0"
            style={{
              top: 600,
              height: 260,
              background: "linear-gradient(180deg, rgba(10,10,10,0), #0A0A0A 88%)",
            }}
          />
        </div>

        {/* Bloque de texto */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative z-10 flex flex-col"
          style={{ paddingTop: 220, paddingBottom: 64, paddingLeft: 96, maxWidth: 900, gap: 34 }}
        >
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 132,
              lineHeight: 0.92,
              letterSpacing: "0.02em",
            }}
          >
            Máquinas y elixires,
            <br />
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>curados a mano.</span>
          </h1>

          <p className="text-[15px] text-white/60" style={{ lineHeight: 1.9, maxWidth: 460 }}>
            {CONFIG.tagline}
          </p>

          <div className="flex" style={{ gap: 18 }}>
            <Button as={Link} to="/catalog" variant="solid">
              Ver la selección
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
            <Button as={Link} to="/about" variant="solid">
              La curaduría
            </Button>
          </div>
        </motion.div>

        {/* Ficha de la pieza en temporada — su foto ya es el fondo del hero; avanza con la flecha */}
        {piezaActual && (
          <TemporadaFicha
            pieza={piezaActual}
            index={temporadaIndex % piezasTemporada.length}
            total={piezasTemporada.length}
            onNext={siguientePieza}
          />
        )}
      </div>

      {/* ── HERO — móvil: "Índice" ──────────────────────────────── */}
      <div className="md:hidden bg-black text-white">
        <div className="pt-10 pb-6 px-6">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ width: 40, height: 1, backgroundColor: "#C9A84C" }} />
            <p className="text-[10px] uppercase text-white/60" style={{ letterSpacing: "0.28em" }}>
              Selección 01 — Medellín
            </p>
          </div>
          <h1
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 42, lineHeight: 1.05 }}
            className="mb-4"
          >
            Máquinas y elixires,{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>curados a mano.</span>
          </h1>
          <p className="text-[14px] text-white/55 mb-8" style={{ lineHeight: 1.7, maxWidth: 420 }}>
            {CONFIG.tagline}
          </p>
        </div>

        {/* Pieza de temporada — misma fuente de datos que el hero de escritorio */}
        <div className="relative overflow-hidden bg-[#141414]" style={{ height: 440 }}>
          <AnimatePresence initial={false}>
            <motion.img
              key={`bg-${piezaActual?.id ?? "default"}`}
              src={import.meta.env.BASE_URL + (piezaActual ? piezaActual.imgs[0] : "images/homePage-C3LECT.webp")}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "blur(40px) saturate(1.15)", transform: "scale(1.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            />
            <motion.img
              key={piezaActual?.id ?? "default"}
              src={import.meta.env.BASE_URL + (piezaActual ? piezaActual.imgs[0] : "images/homePage-C3LECT.webp")}
              alt={piezaActual ? piezaActual.display : "Selección C3LECT"}
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              loading="eager"
              fetchPriority="high"
            />
          </AnimatePresence>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(10,10,10,0) 38%, rgba(10,10,10,.9) 100%)" }}
          />

          {piezasTemporada.length > 1 && (
            <span
              className="absolute top-4 right-4 text-[10px] uppercase text-white/70"
              style={{ letterSpacing: "0.22em" }}
            >
              {String((temporadaIndex % piezasTemporada.length) + 1).padStart(2, "0")} / {String(piezasTemporada.length).padStart(2, "0")}
            </span>
          )}

          {piezaActual && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={piezaActual.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 right-0 bottom-0 p-6 flex items-end justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-[10px] uppercase text-white/50 mb-1.5" style={{ letterSpacing: "0.24em" }}>
                    {piezaActual.nombre}
                  </p>
                  <Precio producto={piezaActual} className="text-2xl" />
                </div>
                {piezasTemporada.length > 1 && (
                  <button
                    onClick={siguientePieza}
                    aria-label="Ver la siguiente pieza de la selección de temporada"
                    className="shrink-0 flex items-center justify-center rounded-full border border-white/40 active:bg-[#C9A84C]/15 active:border-[#C9A84C] transition-colors"
                    style={{ width: 48, height: 48 }}
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="px-6 pt-8">
          <div className="flex flex-col">
            <IndiceFila to="/catalog/watches" nombre="Relojería" conteo={relojes.length} />
            <IndiceFila to="/catalog/perfumes" nombre="Perfumería" conteo={perfumes.length} />
          </div>
          <Link
            to="/catalog"
            className="mt-8 flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 text-sm uppercase tracking-widest"
          >
            Ver la selección
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10">
          <Ticker />
        </div>
      </div>

      {/* ── BANDA DE TRANSICIÓN — colecciones ───────────────────── */}
      <section className="hidden md:block bg-[#0A0A0A]" style={{ paddingTop: 40, paddingBottom: 128 }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2" style={{ gap: 32 }}>
            <CollectionTile
              to="/catalog/watches"
              img="images/relojes/skeleton-kosmo-644-6-negro-1.webp"
              alt="Colección Máquinas y Joyas — alta relojería"
              titulo="Máquinas y Joyas"
              subtitulo="Alta Relojería"
              delay={0}
            />
            <CollectionTile
              to="/catalog/perfumes"
              img="images/perfumes/afnan-9-pm-rebel-roja-1.webp"
              alt="Colección Firmas y Elixires — perfumería de autor"
              titulo="Firmas y Elixires"
              subtitulo="Perfumería de Autor"
              delay={0.12}
            />
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
              className="text-2xl md:text-4xl mb-12 leading-relaxed"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
            >
              {CONFIG.quote}
            </p>
            <Button as={Link} to="/about" variant="outline">
              Nuestro Manifiesto
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ── Subcomponentes ────────────────────────────────────────────

function MetaPar({ label, valor, dorado }: { label: string; valor: ReactNode; dorado?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-white/35 mb-1" style={{ letterSpacing: "0.28em" }}>
        {label}
      </p>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: dorado ? "#C9A84C" : "#FFFFFF" }}>
        {valor}
      </div>
    </div>
  );
}

function TemporadaFicha({
  pieza, index, total, onNext,
}: {
  pieza: Producto; index: number; total: number; onNext: () => void;
}) {
  return (
    <>
      {/* Ficha de la pieza — la foto vive de fondo en el hero, esto es solo el dato */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute z-10 flex flex-col text-right"
        style={{
          right: 96,
          top: 150,
          paddingRight: 24,
          paddingLeft: 28,
          paddingTop: 24,
          paddingBottom: 24,
          gap: 20,
          borderRight: "1px solid rgba(201,168,76,0.4)",
          background: "rgba(10,10,10,0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pieza.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col"
            style={{ gap: 20 }}
          >
            <MetaPar label="Pieza" valor={pieza.nombre} />
            {pieza.estilo && pieza.estilo.toUpperCase() !== "N/A" && (
              <MetaPar label="Estilo" valor={pieza.estilo} />
            )}
            <MetaPar label="Precio" valor={<Precio producto={pieza} className="text-[26px]" />} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Avance manual del carrusel — grande y visible para invitar al clic */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        aria-label="Ver la siguiente pieza de la selección de temporada"
        className="absolute z-10 flex flex-col items-center gap-3 text-white/60 hover:text-[#C9A84C] transition-colors group"
        style={{ right: 96, top: 740 }}
      >
        <span
          className="flex items-center justify-center rounded-full border border-white/35 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/10 transition-colors"
          style={{ width: 64, height: 64 }}
        >
          <ChevronRight size={28} aria-hidden="true" />
        </span>
        <span className="text-[10px] uppercase" style={{ letterSpacing: "0.24em" }}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </motion.button>
    </>
  );
}

function CollectionTile({
  to, img, alt, titulo, subtitulo, delay,
}: {
  to: string; img: string; alt: string; titulo: string; subtitulo: string;
  delay: number;
}) {
  return (
    <Link to={to} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="relative overflow-hidden bg-black"
        style={{ aspectRatio: "3 / 4" }}
      >
        <img
          src={import.meta.env.BASE_URL + img}
          alt={alt}
          width={700}
          height={933}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          style={{ transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
        <div className="absolute inset-0 flex items-end p-8 md:p-12">
          <div className="text-white flex-1">
            <h3
              className="text-3xl md:text-4xl mb-1 tracking-wide"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {titulo}
            </h3>
            <p className="text-sm text-white/80 uppercase tracking-widest">{subtitulo}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function IndiceFila({ to, nombre, conteo }: { to: string; nombre: string; conteo: number }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between py-[14px] border-b border-white/12 hover:pl-[18px] transition-[padding] duration-500"
    >
      <span style={{ fontFamily: "var(--font-serif)", fontSize: 26 }} className="group-hover:text-[#C9A84C] transition-colors">
        {nombre}
      </span>
      <span className="text-[10px] text-white/40" style={{ letterSpacing: "0.22em" }}>
        {String(conteo).padStart(2, "0")}
      </span>
    </Link>
  );
}

const TICKER_ITEMS = [
  "ENVÍO A TODA COLOMBIA",
  "PAGO CONTRAENTREGA DISPONIBLE",
  "PIEZAS SELECCIONADAS A MANO",
  "SOPORTE POR WHATSAPP",
];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="border-t border-white/10 overflow-hidden" style={{ height: 44 }}>
      <div
        className="flex items-center h-full whitespace-nowrap animate-[ticker_22s_linear_infinite] hover:[animation-play-state:paused]"
      >
        {items.map((item, i) => (
          <span key={i} className="text-[10px] uppercase text-white/40 px-6" style={{ letterSpacing: "0.22em" }}>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
