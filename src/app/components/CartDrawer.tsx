import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useCart, formatPrecio } from "../context/CartContext";
import { usePromociones } from "../context/PromocionesContext";
import { useAuth } from "../context/AuthContext";
import { mejorDescuento, calcularPrecioFinal } from "../lib/promotions";
import type { Producto } from "../data/types";
import { CONFIG } from "../config";
import { trackContactWhatsApp } from "../lib/metaPixel";
import { Button } from "./ds/Button";
import { PriceTag } from "./ds/PriceTag";

function buildWhatsAppMessage(
  items: ReturnType<typeof useCart>["items"],
  total: number,
  precioUnitarioDe: (producto: Producto) => number,
): string {
  const lineas = items.map((item) => {
    const subtotal = precioUnitarioDe(item.producto) * item.cantidad;
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
  const { promociones } = usePromociones();
  const { autenticado } = useAuth();
  const navigate = useNavigate();

  const precioUnitarioDe = (producto: Producto) =>
    calcularPrecioFinal(producto.precio, mejorDescuento(promociones, producto, autenticado));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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

          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-label="Carrito de compras"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-white" />
                <h2
                  className="text-lg tracking-widest uppercase text-white"
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
                    className="text-xs uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                    aria-label="Vaciar carrito"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={48} className="text-white/40" />
                <p className="text-white/70 tracking-wide">Tu carrito está vacío</p>
                <button
                  onClick={() => { closeCart(); navigate("/catalog"); }}
                  className="mt-2 text-sm uppercase tracking-widest underline underline-offset-4 text-white/50 hover:text-white transition-colors"
                >
                  Explorar colecciones
                </button>
              </div>
            ) : (
              <>
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
                        <div className="w-20 h-24 shrink-0 bg-[#1A1A1A] overflow-hidden">
                          <img
                            src={import.meta.env.BASE_URL + item.producto.imgs[0]}
                            alt={item.producto.display}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-widest text-white/40 mb-0.5">
                                {item.producto.cat === "reloj"
                                  ? "Relojería"
                                  : item.producto.cat === "perfume"
                                  ? "Perfumería"
                                  : "Accesorios"}
                              </p>
                              <p
                                className="text-sm tracking-wide truncate text-white"
                                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                              >
                                {item.producto.display}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.producto.id)}
                              className="shrink-0 p-1 text-white/20 hover:text-white transition-colors"
                              aria-label={`Eliminar ${item.producto.display}`}
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <p className="text-sm" style={{ color: "#C9A84C" }}>
                              {formatPrecio(precioUnitarioDe(item.producto) * item.cantidad)}
                            </p>
                            <div className="flex items-center gap-2 border border-white/15">
                              <button
                                onClick={() => updateQty(item.producto.id, item.cantidad - 1)}
                                className="px-2.5 py-1.5 text-white/50 hover:text-white transition-colors"
                                aria-label="Reducir cantidad"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm w-5 text-center tabular-nums text-white">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => updateQty(item.producto.id, item.cantidad + 1)}
                                disabled={item.producto.stock != null && item.cantidad >= item.producto.stock}
                                className="px-2.5 py-1.5 text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/50"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          {item.producto.stock != null && item.cantidad >= item.producto.stock && (
                            <p className="text-xs text-white/30 text-right">Stock máximo disponible</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="px-6 py-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-white/50">
                      Total estimado
                    </span>
                    <PriceTag value={formatPrecio(totalPrice)} />
                  </div>
                  <Button
                    as="button"
                    onClick={() => { closeCart(); navigate("/checkout"); }}
                    variant="block-dark"
                  >
                    Continuar al pago
                  </Button>
                  <a
                    href={buildWhatsAppMessage(items, totalPrice, precioUnitarioDe)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackContactWhatsApp({ origen: "carrito", valor: totalPrice });
                      closeCart();
                    }}
                    className="w-full text-white/40 hover:text-white px-6 py-2 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    aria-label="Preguntar por WhatsApp"
                  >
                    <MessageCircle size={14} />
                    O pregúntanos por WhatsApp
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
