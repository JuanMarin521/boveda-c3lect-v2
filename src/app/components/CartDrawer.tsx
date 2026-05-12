import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useCart, formatPrecio, parsePrecio } from "../context/CartContext";
import { CONFIG } from "../config";

function buildWhatsAppMessage(items: ReturnType<typeof useCart>["items"], total: number): string {
  const lineas = items.map((item) => {
    const subtotal = parsePrecio(item.producto.precio) * item.cantidad;
    return `• ${item.producto.display} × ${item.cantidad} — ${formatPrecio(subtotal)}`;
  });

  const mensaje = [
    "Hola C3LECT, quiero hacer el siguiente pedido:",
    "",
    ...lineas,
    "",
    `Total estimado: ${formatPrecio(total)}`,
    "",
    "¿Están disponibles? ¡Gracias!",
  ].join("\n");

  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-label="Carrito de compras"
            aria-modal="true"
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2
                  className="text-lg tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                >
                  Carrito
                </h2>
                {totalItems > 0 && (
                  <span
                    className="text-xs text-white px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#C9A84C" }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs uppercase tracking-widest text-black/30 hover:text-black transition-colors"
                    aria-label="Vaciar carrito"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-2 text-black/40 hover:text-black transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={48} className="text-black/10" />
                <p className="text-black/40 tracking-wide">Tu carrito está vacío</p>
                <button
                  onClick={() => { closeCart(); navigate("/catalog"); }}
                  className="mt-2 text-sm uppercase tracking-widest underline underline-offset-4 text-black/50 hover:text-black transition-colors"
                >
                  Explorar colecciones
                </button>
              </div>
            ) : (
              <>
                {/* Lista de ítems */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.producto.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4"
                      >
                        {/* Imagen */}
                        <div className="w-20 h-24 shrink-0 bg-neutral-100 overflow-hidden">
                          <img
                            src={import.meta.env.BASE_URL + item.producto.imgs[0]}
                            alt={item.producto.display}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-widest text-black/40 mb-0.5">
                                {item.producto.cat === "reloj"
                                  ? "Relojería"
                                  : item.producto.cat === "perfume"
                                  ? "Perfumería"
                                  : "Accesorios"}
                              </p>
                              <p
                                className="text-sm tracking-wide truncate"
                                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                              >
                                {item.producto.display}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.producto.id)}
                              className="shrink-0 p-1 text-black/20 hover:text-black transition-colors"
                              aria-label={`Eliminar ${item.producto.display}`}
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Precio + cantidad */}
                          <div className="flex items-center justify-between mt-auto">
                            <p className="text-sm" style={{ color: "#C9A84C" }}>
                              {formatPrecio(parsePrecio(item.producto.precio) * item.cantidad)}
                            </p>
                            <div className="flex items-center gap-2 border border-black/15">
                              <button
                                onClick={() => updateQty(item.producto.id, item.cantidad - 1)}
                                className="px-2.5 py-1.5 text-black/50 hover:text-black transition-colors"
                                aria-label="Reducir cantidad"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm w-5 text-center tabular-nums">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => updateQty(item.producto.id, item.cantidad + 1)}
                                className="px-2.5 py-1.5 text-black/50 hover:text-black transition-colors"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-6 border-t border-black/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-widest text-black/50">
                      Total estimado
                    </span>
                    <span className="text-xl" style={{ color: "#C9A84C" }}>
                      {formatPrecio(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-black/30 leading-relaxed">
                    La disponibilidad y precio final se confirma por WhatsApp.
                  </p>
                  <a
                    href={buildWhatsAppMessage(items, totalPrice)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeCart}
                    className="w-full bg-black text-white px-6 py-4 text-sm uppercase tracking-widest hover:bg-[#C9A84C] transition-all duration-300 flex items-center justify-center gap-3"
                    aria-label="Finalizar pedido por WhatsApp"
                  >
                    <MessageCircle size={18} />
                    Finalizar por WhatsApp
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
