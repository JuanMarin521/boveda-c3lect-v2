// ============================================================
// PÁGINA: DETALLE DE PRODUCTO — /product/:id
//
// Para cambiar el mensaje de WhatsApp → busca la función whatsappLink()
// en src/app/config.ts. El número se configura ahí también.
// ============================================================

import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ChevronLeft, MessageCircle, ShoppingCart } from "lucide-react";
import { getProductoById } from "../data/products";
import { whatsappLink } from "../config";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const producto = id ? getProductoById(id) : undefined;
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

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
            <div className="aspect-square mb-6 bg-neutral-100 overflow-hidden relative">
              <img
                src={producto.imgs[imagenSeleccionada]}
                alt={`${producto.display} — foto ${imagenSeleccionada + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="eager"
              />

              {/* Badge de disponibilidad sobre la imagen */}
              {!producto.disponible && (
                <div className="absolute top-4 left-4 bg-black/80 text-white text-xs uppercase tracking-widest px-3 py-1">
                  Agotado
                </div>
              )}
            </div>

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
                      src={img}
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
              style={{ fontFamily: "var(--font-serif)" }}
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

              {/* Botón secundario: Carrito — DESHABILITADO (próximamente) */}
              {/* PASARELA DE PAGO: cambia disabled a false y añade el handler cuando esté lista */}
              <div className="relative group">
                <button
                  disabled
                  className="w-full border-2 border-black/10 text-black/30 px-8 py-5 text-sm uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-3"
                  aria-label="Añadir al carrito — próximamente disponible"
                >
                  <ShoppingCart size={18} aria-hidden="true" />
                  Añadir al carrito
                </button>
                {/* Tooltip "Próximamente" */}
                <span
                  className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1.5 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  role="tooltip"
                >
                  Próximamente
                </span>
              </div>
            </div>

            {/* Nota informativa */}
            <p className="text-xs text-black/40 mt-6 text-center">
              Pasarela de pago en desarrollo. Actualmente aceptamos órdenes por WhatsApp.
            </p>
          </motion.div>
        </div>
      </div>
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
