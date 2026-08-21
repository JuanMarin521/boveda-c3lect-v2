// ============================================================
// PÁGINA: DETALLE DE PRODUCTO — /product/:id
//
// Para cambiar el mensaje de WhatsApp → busca la función whatsappLink()
// en src/app/config.ts. El número se configura ahí también.
// ============================================================

import { useParams, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, ShoppingBag, Check, ZoomIn, X } from "lucide-react";
import { getProductoById } from "../data/products";
import { useProductos } from "../context/ProductosContext";
import { whatsappLink, whatsappAvisarLink } from "../config";
import { trackViewContent, trackAddToCart, trackContactWhatsApp } from "../lib/metaPixel";
import { useCart } from "../context/CartContext";
import { AvisoError } from "../components/AvisoError";
import { Badge } from "../components/ds/Badge";
import { PrecioTag } from "../components/Precio";
import { SpecRow } from "../components/ds/SpecRow";
import { Button } from "../components/ds/Button";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { productos, cargando, error, recargar } = useProductos();
  const producto = getProductoById(id ?? "", productos);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [zoomAbierto, setZoomAbierto] = useState(false);
  const [añadido, setAñadido] = useState(false);
  const [avisado, setAvisado] = useState(false);
  const { addItem, items } = useCart();

  useEffect(() => {
    setImagenSeleccionada(0);
  }, [producto?.id]);

  // ViewContent del pixel. Alimenta el retargeting: el público de "vieron
  // ficha y no compraron" se construye con este evento.
  useEffect(() => {
    if (!producto) return;
    trackViewContent({
      id: producto.id,
      display: producto.display,
      precio: producto.precio,
      cat: producto.cat,
    });
    // Solo depende del id: si dependiera del objeto entero, cada refetch del
    // contexto de productos volvería a disparar el evento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto?.id]);

  useEffect(() => {
    if (!zoomAbierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomAbierto(false);
      if (e.key === "ArrowLeft")  setImagenSeleccionada((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setImagenSeleccionada((p) => producto ? Math.min(producto.imgs.length - 1, p + 1) : p);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomAbierto, producto]);

  function handleAddToCart() {
    if (!producto) return;
    addItem(producto);
    trackAddToCart({
      id: producto.id,
      display: producto.display,
      precio: producto.precio,
      cat: producto.cat,
    });
    setAñadido(true);
    setTimeout(() => setAñadido(false), 1500);
  }

  function handleAvisar() {
    if (!producto) return;
    trackContactWhatsApp({
      origen: "aviso_reingreso",
      productoId: producto.id,
      productoNombre: producto.display,
    });
    window.open(whatsappAvisarLink(producto.display), "_blank", "noopener,noreferrer");
    setAvisado(true);
    setTimeout(() => setAvisado(false), 2000);
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white/40 uppercase tracking-widest text-sm">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <AvisoError
          titulo="No pudimos cargar este producto"
          detalle="Puede ser un problema temporal de conexión — inténtalo de nuevo en un momento."
          onRetry={recargar}
        />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-white" style={{ fontFamily: "var(--font-serif)" }}>
            Producto no encontrado
          </h2>
          <Link to="/catalog" className="text-[#C9A84C] hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const urlWhatsApp = whatsappLink(producto.display);
  const cantidadEnCarrito = items.find((i) => i.producto.id === producto.id)?.cantidad ?? 0;
  const stockRestante = producto.stock != null ? Math.max(0, producto.stock - cantidadEnCarrito) : null;
  const stockAgotadoEnCarrito = stockRestante === 0;
  const stockBajo = producto.stock != null && producto.stock <= 2;
  const categoriaLabel = producto.cat === "reloj" ? "Relojería · Máquinas y Joyas" : "Perfumería · Firmas y Elixires";
  const categoriaCatalogo = producto.cat === "reloj" ? "/catalog/watches" : "/catalog/perfumes";

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-white hover:text-[#C9A84C] transition-colors"
          aria-label="Volver a la página anterior"
        >
          <ChevronLeft size={18} />
          Volver
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">

          {/* GALERÍA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-3">
              <button
                onClick={() => setZoomAbierto(true)}
                className="flex-1 aspect-square mb-6 bg-[#1A1A1A] overflow-hidden relative block group cursor-zoom-in"
                aria-label="Ampliar imagen"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={imagenSeleccionada}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    src={import.meta.env.BASE_URL + producto.imgs[imagenSeleccionada]}
                    alt={`${producto.display} — foto ${imagenSeleccionada + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={!producto.disponible ? { filter: "grayscale(.35)", opacity: 0.7 } : undefined}
                    loading="eager"
                    width={800}
                    height={800}
                  />
                </AnimatePresence>
                {!producto.disponible && (
                  <div className="absolute top-4 left-4">
                    <Badge status="soldout" />
                  </div>
                )}
                <div className="absolute bottom-4 right-4 w-9 h-9 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ZoomIn size={16} className="text-white" />
                </div>
              </button>
              <p
                className="hidden lg:block text-[10px] uppercase text-white/30 shrink-0"
                style={{ writingMode: "vertical-rl", letterSpacing: "0.2em" }}
              >
                Clic para ampliar
              </p>
            </div>

            {producto.imgs.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {producto.imgs.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenSeleccionada(index)}
                    className="aspect-square bg-[#1A1A1A] overflow-hidden transition-all"
                    style={{
                      opacity: imagenSeleccionada === index ? 1 : 0.55,
                      border: imagenSeleccionada === index ? "1px solid #C9A84C" : "1px solid transparent",
                      transitionDuration: "300ms",
                    }}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-pressed={imagenSeleccionada === index}
                  >
                    <img
                      src={import.meta.env.BASE_URL + img}
                      alt={`${producto.display} — foto ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      width={150}
                      height={150}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-5">
              <p className="text-xs uppercase tracking-widest text-white/40">
                {categoriaLabel}
                {producto.disponible && stockBajo && ` · Quedan ${producto.stock} unidad${producto.stock === 1 ? "" : "es"}`}
              </p>
              <Badge status={producto.disponible ? "available" : "soldout"} />
            </div>

            <h1
              className="text-4xl md:text-6xl mb-8 tracking-wide text-white leading-[0.95]"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
            >
              {producto.display}
            </h1>

            <div
              className={`py-7 mb-8 ${stockBajo && producto.disponible ? "border px-6" : "border-t border-b border-white/12"}`}
              style={stockBajo && producto.disponible ? { borderColor: "rgba(201,168,76,0.35)" } : undefined}
            >
              <PrecioTag
                producto={producto}
                size="lg"
                note={producto.disponible ? "COP · Envío incluido" : "Precio del último lote"}
              />

              {producto.disponible && producto.stock != null && (
                <p
                  className="mt-5 pt-5 border-t border-white/10 text-[11px] uppercase"
                  style={{
                    letterSpacing: "0.2em",
                    color: stockAgotadoEnCarrito ? "#C9A84C" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {stockAgotadoEnCarrito
                    ? "Ya tenés todo el stock disponible en tu carrito"
                    : `${stockRestante} unidad${stockRestante === 1 ? "" : "es"} disponible${stockRestante === 1 ? "" : "s"}`}
                </p>
              )}
            </div>

            {producto.notas && (
              <div className="mb-10">
                <p className="text-white/70 leading-relaxed mb-8">
                  {producto.notas.descripcion}
                </p>
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">
                    Pirámide Olfativa
                  </h3>
                  <NotasPerfume label="Notas de Salida"   valor={producto.notas.notas_top} />
                  <NotasPerfume label="Notas de Corazón"  valor={producto.notas.notas_corazon} />
                  <NotasPerfume label="Notas de Base"     valor={producto.notas.notas_base} />
                </div>
              </div>
            )}

            {producto.specs && (
              <div className="mb-10 border-t border-white/5 pt-6">
                <h3 className="text-xs uppercase tracking-widest text-white/60 mb-5">
                  Ficha Técnica
                </h3>
                <div className="space-y-0">
                  <SpecRow label="Movimiento" value={producto.specs.movimiento} />
                  {producto.specs.dimensiones   && <SpecRow label="Dimensiones"        value={producto.specs.dimensiones} />}
                  {producto.specs.caja          && <SpecRow label="Caja"                value={producto.specs.caja} />}
                  {producto.specs.correa        && <SpecRow label="Correa"              value={producto.specs.correa} />}
                  {producto.specs.cristal       && <SpecRow label="Cristal"             value={producto.specs.cristal} />}
                  {producto.specs.funciones     && <SpecRow label="Funciones"           value={producto.specs.funciones} />}
                  {producto.specs.bateria       && <SpecRow label="Batería"             value={producto.specs.bateria} />}
                  {producto.specs.reservaMarcha && <SpecRow label="Reserva de marcha"  value={producto.specs.reservaMarcha} />}
                  {producto.specs.peso          && <SpecRow label="Peso"                value={producto.specs.peso} />}
                  <SpecRow label="Resistencia al agua" value={producto.specs.resistenciaAgua} />
                  {producto.specs.observaciones && (
                    <p className="mt-4 text-xs text-white/60 leading-relaxed border-t border-white/10 pt-4">
                      {producto.specs.observaciones}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 mt-auto">
              {producto.disponible ? (
                <>
                  <Button as="a" href={urlWhatsApp} target="_blank" rel="noopener noreferrer" variant="block-dark"
                    aria-label={`Ordenar ${producto.display} por WhatsApp`}
                    onClick={() => trackContactWhatsApp({
                      origen: "ficha_producto",
                      productoId: producto.id,
                      productoNombre: producto.display,
                      valor: producto.precio,
                    })}
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Ordenar por WhatsApp
                  </Button>

                  <Button
                    as="button"
                    onClick={handleAddToCart}
                    disabled={stockAgotadoEnCarrito}
                    variant="block-outline"
                    aria-label={añadido ? "Producto añadido al carrito" : `Añadir ${producto.display} al carrito`}
                  >
                    {añadido ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
                    {añadido
                      ? "¡Añadido al carrito!"
                      : stockAgotadoEnCarrito
                      ? "Stock máximo en el carrito"
                      : "Añadir al carrito"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as="button"
                    onClick={handleAvisar}
                    disabled={avisado}
                    variant="block-outline"
                    aria-label={`Avisarme cuando ${producto.display} vuelva a estar disponible`}
                  >
                    {avisado ? "Te avisamos" : "Avisame cuando vuelva"}
                  </Button>
                  <Link
                    to={categoriaCatalogo}
                    className="block text-center text-[10px] uppercase text-white/40 hover:text-[#C9A84C] transition-colors"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    Ver alternativas en {producto.cat === "reloj" ? "relojería" : "perfumería"}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ZOOM */}
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
              <button
                onClick={() => setZoomAbierto(false)}
                className="fixed top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors pointer-events-auto"
                aria-label="Cerrar zoom"
              >
                <X size={20} />
              </button>
              {producto.imgs.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImagenSeleccionada((p) => Math.max(0, p - 1)); }}
                    disabled={imagenSeleccionada === 0}
                    className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors pointer-events-auto disabled:opacity-20"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImagenSeleccionada((p) => Math.min(producto.imgs.length - 1, p + 1)); }}
                    disabled={imagenSeleccionada === producto.imgs.length - 1}
                    className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors pointer-events-auto disabled:opacity-20"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotasPerfume({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-sm text-white/70">{valor}</span>
    </div>
  );
}
