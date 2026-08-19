import { motion } from "motion/react";
import { CONFIG } from "../config";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <section className="pt-24 md:pt-40 pb-12 md:pb-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span style={{ width: 40, height: 1, backgroundColor: "#C9A84C" }} />
            <p className="text-[11px] uppercase text-white/60" style={{ letterSpacing: "0.32em" }}>
              La curaduría
            </p>
            <span style={{ width: 40, height: 1, backgroundColor: "#C9A84C" }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl mb-10 tracking-wide leading-[0.96]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}
          >
            Cinco piezas,
            <br />
            no cinco mil.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 leading-relaxed"
          >
            En un mundo saturado de ruido, elegimos el silencio. En una era de abundancia vacía, curamos la escasez significativa.
          </motion.p>
        </div>
      </section>

      {/* Origen */}
      <section className="py-20 md:py-28 bg-black text-white border-t border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl leading-relaxed text-white/85"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}
          >
            Empezamos en 2026 comprando un solo reloj por mes, el que sí queríamos usar. La regla no cambió: si no lo usaríamos nosotros, no entra a la vitrina.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Sections */}
      <section className="pt-12 md:pt-16 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-24">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2
              className="text-3xl md:text-4xl tracking-wide text-white"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              La paradoja del lujo verdadero
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                El lujo auténtico no requiere validación externa. No necesita logos ostentosos ni campañas publicitarias estridentes. Se manifiesta en la perfección técnica invisible, en la herencia de generaciones de maestros artesanos, en la decisión consciente de poseer menos pero mejor.
              </p>
              <p>
                Un reloj de manufactura suiza no es un accesorio. Es un compañero de vida que sobrevivirá generaciones. Un perfume de autor no es una fragancia. Es una firma invisible, una declaración de identidad sin palabras.
              </p>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2
              className="text-3xl md:text-4xl tracking-wide text-white"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Curación, no catálogo
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                C3LECT no es una tienda. Es una galería editorial. Cada pieza es seleccionada bajo criterios inquebrantables: excelencia técnica, diseño atemporal, herencia auténtica.
              </p>
              <p>
                No ofrecemos tendencias. Ofrecemos permanencia. No vendemos productos. Facilitamos adquisiciones meditadas de objetos que trascienden su función utilitaria para convertirse en compañeros de una vida bien vivida.
              </p>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2
              className="text-3xl md:text-4xl tracking-wide text-white"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              El arte de poseer menos
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                En la era de la sobreproducción y el consumo compulsivo, proponemos un contra-manifiesto: la posesión deliberada. Tres relojes excepcionales. Dos fragancias que definen momentos. Objetos que no se remplazan, sino que se heredan.
              </p>
              <p>
                Esta es nuestra invitación: a desacelerar, a discernir, a elegir calidad sobre cantidad, permanencia sobre novedad, silencio sobre ruido.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Signature */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p
              className="text-3xl md:text-4xl mb-6 tracking-[0.22em] text-white"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              C3LECT
            </p>
            <p className="text-sm text-white/40 uppercase tracking-widest">
              {CONFIG.ciudad}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
