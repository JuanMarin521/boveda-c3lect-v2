// ============================================================
// PÁGINA: CATÁLOGO — /catalog
//
// Muestra todos los productos con filtros por categoría.
// El badge "Agotado" aparece automáticamente si disponible === false.
// ============================================================

import { Link, useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { productos, Producto } from "../data/products";

export default function Catalog() {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  const filtroActivo: "all" | "reloj" | "perfume" =
    category === "watches" ? "reloj" :
    category === "perfumes" ? "perfume" : "all";

  function cambiarFiltro(filtro: "all" | "reloj" | "perfume") {
    if (filtro === "reloj") navigate("/catalog/watches");
    else if (filtro === "perfume") navigate("/catalog/perfumes");
    else navigate("/catalog");
  }

  const productosFiltrados = productos
    .filter((p) => {
      if (filtroActivo === "all") return true;
      return p.cat === filtroActivo;
    })
    .sort((a, b) => {
      // Disponibles primero, agotados al final
      if (a.disponible === b.disponible) return 0;
      return a.disponible ? -1 : 1;
    });

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1
            className="text-4xl md:text-6xl mb-6 tracking-wide"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Colecciones
          </h1>
          <p className="text-black/60 max-w-2xl">
            Cada pieza es seleccionada con criterio excepcional. Relojería de precisión y perfumería de autor.
          </p>
        </motion.div>

        {/* SECCIÓN: FILTROS DE CATEGORÍA */}
        <div
          className="flex gap-4 mb-16 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Filtrar por categoría"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <BotónFiltro
            activo={filtroActivo === "all"}
            onClick={() => cambiarFiltro("all")}
            label="Todas"
          />
          <BotónFiltro
            activo={filtroActivo === "reloj"}
            onClick={() => cambiarFiltro("reloj")}
            label="Máquinas y Joyas"
          />
          <BotónFiltro
            activo={filtroActivo === "perfume"}
            onClick={() => cambiarFiltro("perfume")}
            label="Firmas y Elixires"
          />
        </div>

        {/* SECCIÓN: GRILLA DE PRODUCTOS */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          {productosFiltrados.map((producto, index) => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              index={index}
            />
          ))}
        </motion.div>

        {/* Mensaje cuando no hay productos */}
        {productosFiltrados.length === 0 && (
          <p className="text-center text-black/40 py-20">
            No hay productos en esta categoría.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── BOTÓN DE FILTRO ────────────────────────────────────────

function BotónFiltro({
  activo,
  onClick,
  label,
}: {
  activo: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={activo}
      className="relative px-6 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-colors"
      style={{
        color: activo ? "#C9A84C" : "#000000",
        borderBottom: activo ? "2px solid #C9A84C" : "2px solid transparent",
      }}
    >
      {label}
    </button>
  );
}

// ─── TARJETA DE PRODUCTO ────────────────────────────────────

function TarjetaProducto({
  producto,
  index,
}: {
  producto: Producto;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/product/${producto.id}`} className="group block">

        {/* Imagen principal con lazy loading y badge de estado */}
        <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-neutral-100">
          <img
            src={producto.imgs[0]}
            alt={producto.display}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Badge "Agotado" — aparece si disponible es false */}
          {!producto.disponible && (
            <div className="absolute top-4 left-4 bg-black/80 text-white text-xs uppercase tracking-widest px-3 py-1">
              Agotado
            </div>
          )}

          {/* Badge "Disponible" — dorado para productos disponibles */}
          {producto.disponible && (
            <div
              className="absolute top-4 left-4 text-white text-xs uppercase tracking-widest px-3 py-1"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Disponible
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div>
          {/* Categoría pequeña */}
          <p className="text-xs uppercase tracking-widest text-black/40 mb-2">
            {producto.cat === "reloj" ? "Relojería" : "Perfumería"}
          </p>

          {/* Nombre completo */}
          <h3
            className="text-xl md:text-2xl mb-3 tracking-wide group-hover:text-[#C9A84C] transition-colors"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {producto.display}
          </h3>

          {/* Descripción breve para perfumes */}
          {producto.notas && (
            <p className="text-sm text-black/50 mb-4 line-clamp-2">
              {producto.notas.descripcion}
            </p>
          )}

          {/* Precio */}
          <p className="text-lg font-medium" style={{ color: "#C9A84C" }}>
            {producto.precio}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
