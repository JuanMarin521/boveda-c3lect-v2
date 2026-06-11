// ============================================================
// PÁGINA: CATÁLOGO — /catalog
//
// Filtros: categoría (URL) + marca, género, precio,
// disponibilidad (BarraFiltros). Todos combinan con AND.
// ============================================================

import { Link, useParams, useNavigate } from "react-router";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Check } from "lucide-react";
import type { Producto } from "../data/types";
import { useProductos } from "../context/ProductosContext";
import { useCart } from "../context/CartContext";
import { useProductFilter } from "../hooks/useProductFilter";
import { BarraFiltros } from "../components/BarraFiltros";

export default function Catalog() {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { productos, cargando } = useProductos();

  const filtroActivo: "all" | "reloj" | "perfume" | "accesorio" =
    category === "watches"    ? "reloj"     :
    category === "perfumes"   ? "perfume"   :
    category === "accesorios" ? "accesorio" : "all";

  function cambiarCategoria(filtro: "all" | "reloj" | "perfume" | "accesorio") {
    if (filtro === "reloj")          navigate("/catalog/watches");
    else if (filtro === "perfume")   navigate("/catalog/perfumes");
    else if (filtro === "accesorio") navigate("/catalog/accesorios");
    else                             navigate("/catalog");
  }

  // Productos de la categoría activa (base para el hook de filtros)
  const productosPorCategoria = useMemo(() =>
    filtroActivo === "all"
      ? productos
      : productos.filter(p => p.cat === filtroActivo),
    [productos, filtroActivo]
  );

  const {
    seleccionMarcas, seleccionGeneros, seleccionPrecios,
    toggleMarca, toggleGenero, togglePrecio,
    iniciarMarcas, iniciarGeneros, iniciarPrecios,
    aplicarMarcas, aplicarGeneros, aplicarPrecios,
    filtroMarcas, filtroGeneros, filtroPrecios,
    filtroDisponible, setFiltroDisponible,
    resetMarcas,
    marcasDisponibles,
    productosFiltrados,
    hayFiltrosActivos,
    cantidadFiltrosActivos,
    limpiarFiltros,
  } = useProductFilter(productosPorCategoria);

  // Al cambiar categoría, resetear marcas en selección y aplicado
  useEffect(() => {
    resetMarcas();
  }, [filtroActivo]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1
            className="text-4xl md:text-6xl mb-6 tracking-wide text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Colecciones
          </h1>
          <p className="text-white/60 max-w-2xl">
            Cada pieza es seleccionada con criterio excepcional. Relojería de precisión y perfumería de autor.
          </p>
        </motion.div>

        {/* Tabs de categoría */}
        <div
          className="flex gap-4 mb-8 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Filtrar por categoría"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <BotónFiltro activo={filtroActivo === "all"}       onClick={() => cambiarCategoria("all")}       label="Todas" />
          <BotónFiltro activo={filtroActivo === "reloj"}     onClick={() => cambiarCategoria("reloj")}     label="Máquinas y Joyas" />
          <BotónFiltro activo={filtroActivo === "perfume"}   onClick={() => cambiarCategoria("perfume")}   label="Firmas y Elixires" />
          <BotónFiltro activo={filtroActivo === "accesorio"} onClick={() => cambiarCategoria("accesorio")} label="Accesorios Premium" />
        </div>

        {/* Barra de filtros premium */}
        <BarraFiltros
          marcasDisponibles={marcasDisponibles}
          seleccionMarcas={seleccionMarcas}
          seleccionGeneros={seleccionGeneros}
          seleccionPrecios={seleccionPrecios}
          filtroMarcas={filtroMarcas}
          filtroGeneros={filtroGeneros}
          filtroPrecios={filtroPrecios}
          filtroDisponible={filtroDisponible}
          onMarca={toggleMarca}
          onGenero={toggleGenero}
          onPrecio={togglePrecio}
          onIniciarMarcas={iniciarMarcas}
          onIniciarGeneros={iniciarGeneros}
          onIniciarPrecios={iniciarPrecios}
          onAplicarMarcas={aplicarMarcas}
          onAplicarGeneros={aplicarGeneros}
          onAplicarPrecios={aplicarPrecios}
          onDisponible={setFiltroDisponible}
          onLimpiar={limpiarFiltros}
          hayFiltrosActivos={hayFiltrosActivos}
          cantidadFiltrosActivos={cantidadFiltrosActivos}
        />

        {/* Contador de resultados con filtros activos */}
        {hayFiltrosActivos && !cargando && (
          <p className="text-sm text-white/40 mb-8 -mt-4">
            {productosFiltrados.length}{" "}
            {productosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
        )}

        {cargando ? (
          <p className="text-center text-white/40 py-20">Cargando colección...</p>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            >
              {productosFiltrados.map((producto, index) => (
                <TarjetaProducto key={producto.id} producto={producto} index={index} />
              ))}
            </motion.div>

            {productosFiltrados.length === 0 && (
              <div className="text-center py-20">
                <p className="text-white/40 mb-6">
                  No hay productos que coincidan con los filtros seleccionados.
                </p>
                {hayFiltrosActivos && (
                  <button
                    onClick={limpiarFiltros}
                    className="text-sm uppercase tracking-widest underline underline-offset-4 text-white/60 hover:text-white transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Subcomponentes ─────────────────────────────────────────

function BotónFiltro({
  activo, onClick, label,
}: { activo: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={activo}
      className="relative px-6 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-colors"
      style={{
        color: activo ? "#C9A84C" : "#FFFFFF",
        borderBottom: activo ? "2px solid #C9A84C" : "2px solid transparent",
      }}
    >
      {label}
    </button>
  );
}

function TarjetaProducto({ producto, index }: { producto: Producto; index: number }) {
  const { addItem } = useCart();
  const [añadido, setAñadido] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!producto.disponible) return;
    addItem(producto);
    setAñadido(true);
    setTimeout(() => setAñadido(false), 1500);
  }

  const precioFormateado = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(producto.precio as number);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/product/${producto.id}`} className="group block">
        <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#1A1A1A]">
          <img
            src={import.meta.env.BASE_URL + producto.imgs[0]}
            alt={producto.display}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {!producto.disponible && (
            <div className="absolute top-4 left-4 bg-black/80 text-white text-xs uppercase tracking-widest px-3 py-1">
              Agotado
            </div>
          )}
          {producto.disponible && (
            <div
              className="absolute top-4 left-4 text-white text-xs uppercase tracking-widest px-3 py-1"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Disponible
            </div>
          )}
          {producto.disponible && (
            <button
              onClick={handleAddToCart}
              aria-label={añadido ? "Añadido al carrito" : `Añadir ${producto.display} al carrito`}
              className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center text-white transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
              style={{ backgroundColor: añadido ? "#C9A84C" : "rgba(0,0,0,0.75)" }}
            >
              {añadido ? <Check size={16} /> : <ShoppingBag size={16} />}
            </button>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
            {producto.cat === "reloj"
              ? "Relojería"
              : producto.cat === "perfume"
              ? "Perfumería"
              : "Accesorios Premium"}
          </p>
          <h3
            className="text-xl md:text-2xl mb-3 tracking-wide text-white group-hover:text-[#C9A84C] transition-colors"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {producto.display}
          </h3>
          {producto.notas && (
            <p className="text-sm text-white/50 mb-4 line-clamp-2">
              {producto.notas.descripcion}
            </p>
          )}
          <p className="text-lg font-medium" style={{ color: "#C9A84C" }}>
            {precioFormateado}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
