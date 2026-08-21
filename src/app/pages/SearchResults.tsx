import { Link, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { Producto } from "../data/types";
import { useProductos } from "../context/ProductosContext";
import { useProductFilter } from "../hooks/useProductFilter";
import { BarraFiltros } from "../components/BarraFiltros";
import { AvisoError } from "../components/AvisoError";
import { Badge } from "../components/ds/Badge";
import { Precio } from "../components/Precio";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { productos, cargando, error, recargar } = useProductos();

  const term = query.toLowerCase().trim();
  const resultadosBusqueda = term
    ? productos.filter(p =>
        p.display.toLowerCase().includes(term)  ||
        p.nombre.toLowerCase().includes(term)   ||
        p.estilo.toLowerCase().includes(term)   ||
        (p.marca  ?? "").toLowerCase().includes(term) ||
        (p.genero ?? "").toLowerCase().includes(term) ||
        (p.cat === "reloj" ? "relojería" : p.cat === "perfume" ? "perfumería" : "accesorios").includes(term)
      )
    : [];

  const {
    seleccionMarcas, seleccionGeneros, seleccionPrecios,
    toggleMarca, toggleGenero, togglePrecio,
    iniciarMarcas, iniciarGeneros, iniciarPrecios,
    aplicarMarcas, aplicarGeneros, aplicarPrecios,
    filtroMarcas, filtroGeneros, filtroPrecios,
    filtroDisponible, setFiltroDisponible,
    marcasDisponibles,
    productosFiltrados,
    hayFiltrosActivos,
    cantidadFiltrosActivos,
    limpiarFiltros,
  } = useProductFilter(resultadosBusqueda);

  // Limpiar filtros solo cuando el término de búsqueda CAMBIA (no en el
  // montaje inicial) — si no, al volver desde un producto con "atrás" se
  // perdían los filtros que la URL acababa de restaurar.
  const queryAnterior = useRef(query);
  useEffect(() => {
    if (queryAnterior.current !== query) {
      queryAnterior.current = query;
      limpiarFiltros();
    }
  }, [query]);

  const total = productosFiltrados.length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
            Búsqueda
          </p>
          <h1
            className="text-4xl md:text-6xl mb-4 tracking-wide text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            "{query}"
          </h1>
          <p className="text-white/50 text-sm tracking-wide">
            {error
              ? "No se pudo cargar"
              : cargando
              ? "Buscando..."
              : total === 0
              ? "Sin resultados"
              : total === 1
              ? "1 resultado"
              : `${total} resultados`}
          </p>
        </motion.div>

        {error && <AvisoError onRetry={recargar} />}

        {/* Barra de filtros (solo cuando hay resultados de búsqueda) */}
        {!error && !cargando && resultadosBusqueda.length > 0 && (
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
        )}

        {!error && !cargando && productosFiltrados.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-2 md:gap-x-14 md:gap-y-[72px] gap-x-3 gap-y-8 pt-11"
          >
            {productosFiltrados.map((producto, index) => (
              <TarjetaProducto key={producto.id} producto={producto} index={index} orden={index + 1} />
            ))}
          </motion.div>
        )}

        {!error && !cargando && productosFiltrados.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/40 mb-6">
              {hayFiltrosActivos
                ? "No hay productos que coincidan con la búsqueda y los filtros seleccionados."
                : "No encontramos productos que coincidan con tu búsqueda."}
            </p>
            {hayFiltrosActivos ? (
              <button
                onClick={limpiarFiltros}
                className="text-sm uppercase tracking-widest underline underline-offset-4 text-white/60 hover:text-white transition-colors"
              >
                Limpiar filtros
              </button>
            ) : (
              <Link
                to="/catalog"
                className="text-sm uppercase tracking-widest underline underline-offset-4 text-white/60 hover:text-white transition-colors"
              >
                Ver todas las colecciones
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TarjetaProducto({ producto, index, orden }: { producto: Producto; index: number; orden: number }) {
  const categoriaLabel =
    producto.cat === "reloj" ? "Relojería" : producto.cat === "perfume" ? "Perfumería" : "Accesorios";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/product/${producto.id}`} className="group block">
        <div className="relative overflow-hidden bg-[#141414]" style={{ aspectRatio: "4 / 5" }}>
          <img
            src={import.meta.env.BASE_URL + producto.imgs[0]}
            alt={producto.display}
            loading="lazy"
            className="w-full h-full object-cover transition-transform ease-out group-hover:scale-[1.06]"
            style={{ transitionDuration: "1200ms", transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
          />
          <p className="absolute top-3 left-3 md:top-4 md:left-4 text-white/50" style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}>
            {String(orden).padStart(2, "0")}
          </p>
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{ height: 140, background: "linear-gradient(180deg, rgba(10,10,10,0), rgba(10,10,10,.85))" }}
          />
          <p className="absolute bottom-3 right-3 md:bottom-4 md:right-4 text-white/60 text-[10px] uppercase" style={{ letterSpacing: "0.26em" }}>
            {categoriaLabel}
          </p>
          {!producto.disponible && (
            <div className="absolute top-3 right-3 md:top-4 md:right-4">
              <Badge status="soldout" />
            </div>
          )}
        </div>
        <div className="pt-6 border-t border-white/12 mt-6 flex items-start justify-between gap-4">
          <h3
            className="text-lg md:text-[34px] mb-1 tracking-wide text-white group-hover:text-[#C9A84C] transition-colors duration-[400ms] leading-tight min-w-0"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
          >
            {producto.display}
          </h3>
          <Precio producto={producto} className="shrink-0 text-base md:text-[28px]" />
        </div>
      </Link>
    </motion.div>
  );
}
