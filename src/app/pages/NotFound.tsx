import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ds/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="text-8xl md:text-9xl mb-6 tracking-wider"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#C9A84C' }}
        >
          404
        </h1>
        <h2
          className="text-2xl md:text-3xl mb-6 tracking-wide text-white"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}
        >
          Página no encontrada
        </h2>
        <p className="text-white/50 mb-12 max-w-md mx-auto">
          La página que buscas no existe. Quizás fue movida o eliminada.
        </p>
        <Button as={Link} to="/" variant="block-dark" className="w-auto inline-flex">
          Volver al inicio
        </Button>
      </motion.div>
    </div>
  );
}
