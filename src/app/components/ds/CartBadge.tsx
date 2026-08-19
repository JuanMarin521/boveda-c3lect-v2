import { motion, AnimatePresence } from "motion/react";

// Late una vez cada vez que cambia el conteo (el remount por `key` reinicia
// la animación de entrada, dándole el efecto de "pulso" al añadir un ítem).
export function CartBadge({ totalItems, className }: { totalItems: number; className: string }) {
  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.span
          key={totalItems}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={className}
          style={{ backgroundColor: "#C9A84C" }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
