import { Link } from "react-router";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="text-8xl md:text-9xl mb-6 tracking-wider"
          style={{ fontFamily: 'var(--font-serif)', color: '#C9A84C' }}
        >
          404
        </h1>
        <h2
          className="text-2xl md:text-3xl mb-6 tracking-wide"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Página no encontrada
        </h2>
        <p className="text-black/60 mb-12 max-w-md mx-auto">
          La página que buscas no existe. Quizás fue movida o eliminada.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-[#C9A84C] transition-all duration-300"
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
}
