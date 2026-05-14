import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import type { Producto } from "../data/types";
import { useProductos } from "../context/ProductosContext";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { productos, cargando } = useProductos();

  const term = query.toLowerCase().trim();
  const resultados = term
    ? productos.filter((p) =>
        p.display.toLowerCase().includes(term) ||
        p.nombre.toLowerCase().includes(term) ||
        p.estilo.toLowerCase().includes(term) ||
        (p.cat === "reloj" ? "relojería" : p.cat === "perfume" ? "perfumería" : "accesorios").includes(term)
      )
    : [];

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-black/40 mb-3">
            Búsqueda
          </p>
          <h1
            className="text-4xl md:text-6xl mb-4 tracking-wide"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            "{query}"
          </h1>
          <p className="text-black/50 text-sm tracking-wide">
            {cargando
              ? "Buscando..."
              : resultados.length === 0
              ? "Sin resultados"
              : resultados.length === 1
              ? "1 resultado"
              : `${resultados.length} resultados`}
          </p>
        </motion.div>

        {!cargando && resultados.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {resultados.map((producto, index) => (
              <TarjetaProducto key={producto.id} producto={producto} index={index} />
            ))}
          </motion.div>
        )}

        {!cargando && resultados.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-black/40 mb-6">
              No encontramos productos que coincidan con tu búsqueda.
            </p>
            <Link
              to="/catalog"
              className="text-sm uppercase tracking-widest underline underline-offset-4 text-black/60 hover:text-black transition-colors"
            >
              Ver todas las colecciones
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function TarjetaProducto({ producto, index }: { producto: Producto; index: number }) {
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
        <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-neutral-100">
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
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-black/40 mb-2">
            {producto.cat === "reloj" ? "Relojería" : producto.cat === "perfume" ? "Perfumería" : "Accesorios Premium"}
          </p>
          <h3
            className="text-xl md:text-2xl mb-3 tracking-wide group-hover:text-[#C9A84C] transition-colors"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {producto.display}
          </h3>
          <p className="text-sm text-black/60 tracking-wide">{precioFormateado}</p>
        </div>
      </Link>
    </motion.div>
  );
}