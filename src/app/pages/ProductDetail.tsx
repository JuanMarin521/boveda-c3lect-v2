// ============================================================
// PÁGINA: DETALLE DE PRODUCTO — /product/:id
//
// Para cambiar el mensaje de WhatsApp → busca la función whatsappLink()
// en src/app/config.ts. El número se configura ahí también.
// ============================================================

import { useParams, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronLeft, MessageCircle, ShoppingBag, Check, ZoomIn, X } from "lucide-react";
import { getProductoById } from "../data/products";
import { whatsappLink } from "../config";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const producto = id ? getProductoById(id) : undefined;
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [zoomAbierto, setZoomAbierto] = useState(false);
  const [añadido, setAñadido] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!zoomAbierto) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setZoomAbierto(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomAbierto]);

  function handleAddToCart() {
    if (!producto) return;
    addItem(producto);
    setAñadido(true);
    setTimeout(() => setAñadido(false), 1500);
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Producto no encontrado
          </h2>
          <Link to="/catalog" className="text-[#C9A84C] hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Genera el link de WhatsApp con el nombre completo del producto
  const urlWhatsApp = whatsappLink(producto.display);

  return (
    <div className="min-h-screen bg-white">

      {/* Botón volver */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-[#C9A84C] transition-colors"
          aria-label="Volver a la página anterior"
        >
          <ChevronLeft size={18} />
          Volver
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">

          {/* SECCIÓN: GALERÍA DE IMÁGENES */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Imagen principal */}
            <button
              onClick={() => setZoomAbierto(true)}
              className="aspect-square mb-6 bg-neutral-100 overflow-hidden relative w-full block group cursor-zoom-in"
              aria-label="Ampliar imagen"
            >
              <img
                src={import.meta.env.BASE_URL + producto.imgs[imagenSeleccionada]}
                alt={`${producto.display} — foto ${imagenSeleccionada + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              {/* Badge de disponibilidad */}
              {!producto.disponible && (
                <div className="absolute top-4 left-4 bg-black/80 text-white text-xs uppercase tracking-widest px-3 py-1">
                  Agotado
                </div>
              )}
              {/* Hint de zoom */}
              <div className="absolute bottom-4 right-4 w-9 h-9 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ZoomIn size={16} className="text-white" />
              </div>
            </button>

            {/* Miniaturas (si hay más de una imagen) */}
            {producto.imgs.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {producto.imgs.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenSeleccionada(index)}
                    className="aspect-square bg-neutral-100 overflow-hidden transition-opacity"
                    style={{ opacity: imagenSeleccionada === index ? 1 : 0.45 }}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-pressed={imagenSeleccionada === index}
                  >
                    <img
                      src={import.meta.env.BASE_URL + img}
                      alt={`${producto.display} — foto ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* SECCIÓN: INFORMACIÓN DEL PRODUCTO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Categoría */}
            <p className="text-xs uppercase tracking-widest text-black/40 mb-4">
              {producto.cat === "reloj" ? "Relojería · Máquinas y Joyas" : "Perfumería · Firmas y Elixires"}
            </p>

            {/* Nombre */}
            <h1
              className="text-4xl md:text-5xl mb-6 tracking-wide"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {producto.display}
            </h1>

            {/* Precio */}
            <p className="text-3xl mb-8" style={{ color: "#C9A84C" }}>
              {producto.precio}
            </p>

            {/* SECCIÓN: NOTAS AROMÁTICAS (solo perfumes) */}
            {producto.notas && (
              <div className="mb-10">
                <p className="text-black/70 leading-relaxed mb-8">
                  {producto.notas.descripcion}
                </p>

                <div className="space-y-4 border-t border-black/5 pt-6">
                  <h3 className="text-xs uppercase tracking-widest text-black/40 mb-4">
                    Pirámide Olfativa
                  </h3>
                  <NotasPerfume label="Notas de Salida" valor={producto.notas.notas_top} />
                  <NotasPerfume label="Notas de Corazón" valor={producto.notas.notas_corazon} />
                  <NotasPerfume label="Notas de Base" valor={producto.notas.notas_base} />
                </div>
              </div>
            )}

            {/* SECCIÓN: FICHA TÉCNICA (solo relojes) */}
            {producto.specs && (
              <div className="mb-10 border-t border-black/5 pt-6">
                <h3 className="text-xs uppercase tracking-widest text-black/40 mb-5">
                  Ficha Técnica
                </h3>
                <div className="space-y-0">
                  <FilaTecnica label="Movimiento"        valor={producto.specs.movimiento} />
                  {producto.specs.dimensiones   && <FilaTecnica label="Dimensiones"       valor={producto.specs.dimensiones} />}
                  {producto.specs.caja          && <FilaTecnica label="Caja"               valor={producto.specs.caja} />}
                  {producto.specs.correa        && <FilaTecnica label="Correa"             valor={producto.specs.correa} />}
                  {producto.specs.cristal       && <FilaTecnica label="Cristal"            valor={producto.specs.cristal} />}
                  {producto.specs.funciones     && <FilaTecnica label="Funciones"          valor={producto.specs.funciones} />}
                  {producto.specs.bateria       && <FilaTecnica label="Batería"            valor={producto.specs.bateria} />}
                  {producto.specs.reservaMarcha && <FilaTecnica label="Reserva de marcha" valor={producto.specs.reservaMarcha} />}
                  {producto.specs.peso          && <FilaTecnica label="Peso"               valor={producto.specs.peso} />}
                  <FilaTecnica label="Resistencia al agua"  valor={producto.specs.resistenciaAgua} />
                  {producto.specs.observaciones && (
                    <p className="mt-4 text-xs text-black/40 leading-relaxed border-t border-black/5 pt-4">
                      {producto.specs.observaciones}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SECCIÓN: ACCIONES DE COMPRA */}
            <div className="space-y-4 mt-auto">

              {/* Botón principal: WhatsApp */}
              <a
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-black text-white px-8 py-5 text-sm uppercase tracking-widest hover:bg-[#C9A84C] transition-all duration-300 flex items-center justify-center gap-3"
                aria-label={`Ordenar ${producto.display} por WhatsApp`}
              >
                <MessageCircle size={18} aria-hidden="true" />
                {producto.disponible ? "Ordenar por WhatsApp" : "Consultar disponibilidad"}
              </a>

              {/* Botón secundario: Añadir al carrito */}
              <button
                onClick={handleAddToCart}
                className="w-full border-2 px-8 py-5 text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3"
                style={añadido
                  ? { borderColor: "#C9A84C", color: "#C9A84C" }
                  : { borderColor: "black", color: "black" }
                }
                aria-label={añadido ? "Producto añadido al carrito" : `Añadir ${producto.display} al carrito`}
              >
                {añadido ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
                {añadido ? "¡Añadido al carrito!" : "Añadir al carrito"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal de zoom */}
      <AnimatePresence>
        {zoomAbierto && (
          <>
            <motion.div
              key="zoom-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/90 z-50"
              onClick={() => setZoomAbierto(false)}
              aria-hidden="true"
            />
            <motion.div
              key="zoom-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 pointer-events-none"
            >
              <div className="relative max-w-3xl w-full pointer-events-auto">
                <img
                  src={import.meta.env.BASE_URL + producto.imgs[imagenSeleccionada]}
                  alt={`${producto.display} — foto ${imagenSeleccionada + 1}`}
                  className="w-full max-h-[85vh] object-contain"
                />
                {/* Navegación entre fotos dentro del zoom */}
                {producto.imgs.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {producto.imgs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImagenSeleccionada(i)}
                        className="w-2 h-2 rounded-full transition-colors"
                        style={{ backgroundColor: i === imagenSeleccionada ? "#C9A84C" : "rgba(255,255,255,0.4)" }}
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Botón cerrar */}
              <button
                onClick={() => setZoomAbierto(false)}
                className="fixed top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors pointer-events-auto"
                aria-label="Cerrar zoom"
              >
                <X size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── COMPONENTE: FILA DE FICHA TÉCNICA ──────────────────────

function FilaTecnica({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-black/5 last:border-0">
      <span className="text-xs uppercase tracking-wider text-black/35 w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-black/70 leading-relaxed">{valor}</span>
    </div>
  );
}

// ─── COMPONENTE: LÍNEA DE NOTAS AROMÁTICAS ──────────────────

function NotasPerfume({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-black/40">{label}</span>
      <span className="text-sm text-black/70">{valor}</span>
    </div>
  );
}
