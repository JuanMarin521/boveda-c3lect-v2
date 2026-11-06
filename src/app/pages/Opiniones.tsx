// ============================================================
// PÁGINA: OPINIONES — /opiniones
//
// Todas las reseñas publicadas de la tienda, con el promedio general y un
// filtro por colección. Las reseñas vienen de la vista `resenas_publicas`
// (data/resenas.ts); la miniatura y la colección de cada producto se
// resuelven del catálogo ya cargado en memoria.
// ============================================================

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { MessageSquareQuote } from "lucide-react";
import { useProductos } from "../context/ProductosContext";
import { useResenas } from "../hooks/useResenas";
import { resumirResenas } from "../lib/resenas";
import type { Producto } from "../data/types";
import { AvisoError } from "../components/AvisoError";
import { Button } from "../components/ds/Button";
import { ResumenResenas } from "../components/resenas/ResumenResenas";
import { ResenaItem } from "../components/resenas/ResenaItem";

const POR_PAGINA = 10;

type Coleccion = "todas" | "reloj" | "perfume";

const COLECCIONES: { valor: Coleccion; label: string }[] = [
  { valor: "todas", label: "Todas" },
  { valor: "reloj", label: "Relojería" },
  { valor: "perfume", label: "Perfumería" },
];

export default function Opiniones() {
  const { productos } = useProductos();
  const { resenas, loading, error, refetch } = useResenas();
  const [coleccion, setColeccion] = useState<Coleccion>("todas");
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const productoPorId = useMemo(() => {
    const m = new Map<string, Producto>();
    for (const p of productos) m.set(p.id, p);
    return m;
  }, [productos]);

  const filtradas = useMemo(
    () =>
      coleccion === "todas"
        ? resenas
        : resenas.filter((r) => productoPorId.get(r.productId)?.cat === coleccion),
    [resenas, coleccion, productoPorId],
  );
  const resumen = useMemo(() => resumirResenas(filtradas), [filtradas]);

  function elegirColeccion(c: Coleccion) {
    setColeccion(c);
    setVisibles(POR_PAGINA);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span style={{ width: 32, height: 1, backgroundColor: "#C9A84C" }} />
            <p className="text-[11px] uppercase text-white/50" style={{ letterSpacing: "0.32em" }}>
              Opiniones
            </p>
            <span style={{ width: 32, height: 1, backgroundColor: "#C9A84C" }} />
          </div>
          <h1
            className="text-4xl md:text-6xl mb-6 tracking-wide text-white"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
          >
            La voz de nuestros clientes
          </h1>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Cada reseña la escribe un cliente que ya recibió su pieza. Así se vive
            comprar en C3LECT.
          </p>
        </motion.div>

        {error ? (
          <AvisoError
            titulo="No pudimos cargar las opiniones"
            detalle="Puede ser un problema temporal de conexión — inténtalo de nuevo en un momento."
            onRetry={refetch}
          />
        ) : loading ? (
          <p className="text-white/40 text-center uppercase tracking-widest text-sm py-20">Cargando opiniones...</p>
        ) : resenas.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquareQuote size={28} className="mx-auto mb-6 text-white/30" aria-hidden="true" />
            <p className="text-white/60 mb-8">Muy pronto verás aquí las experiencias de nuestros clientes.</p>
            <Button as={Link} to="/catalog" variant="outline">
              Explorar colecciones
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-14 lg:gap-20">
            <aside className="lg:sticky lg:top-28 self-start">
              <nav className="flex gap-6 mb-10 border-b border-white/10" aria-label="Filtrar por colección">
                {COLECCIONES.map((c) => (
                  <button
                    key={c.valor}
                    onClick={() => elegirColeccion(c.valor)}
                    aria-pressed={coleccion === c.valor}
                    className={`pb-3 -mb-px text-[11px] uppercase border-b transition-colors ${
                      coleccion === c.valor
                        ? "text-[#C9A84C] border-[#C9A84C]"
                        : "text-white/50 border-transparent hover:text-white"
                    }`}
                    style={{ letterSpacing: "0.2em" }}
                  >
                    {c.label}
                  </button>
                ))}
              </nav>
              {resumen.total > 0 && <ResumenResenas resumen={resumen} />}
            </aside>

            <div>
              {filtradas.length === 0 ? (
                <p className="text-white/50 py-8">Todavía no hay reseñas en esta colección.</p>
              ) : (
                <div className="divide-y divide-white/10 -mt-8">
                  {filtradas.slice(0, visibles).map((r) => (
                    <ResenaItem
                      key={r.id}
                      resena={r}
                      encabezado={<ProductoDeLaResena productId={r.productId} nombre={r.productoNombre} producto={productoPorId.get(r.productId)} />}
                    />
                  ))}
                </div>
              )}

              {filtradas.length > visibles && (
                <div className="pt-8 border-t border-white/10">
                  <Button as="button" variant="outline" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
                    Ver más opiniones
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Miniatura + nombre del producto reseñado; enlaza a la ficha si sigue en el catálogo. */
function ProductoDeLaResena({
  productId,
  nombre,
  producto,
}: {
  productId: string;
  nombre: string;
  producto: Producto | undefined;
}) {
  const contenido = (
    <>
      <span className="w-12 h-14 shrink-0 bg-[#141414] overflow-hidden">
        {producto?.imgs[0] && (
          <img
            src={import.meta.env.BASE_URL + producto.imgs[0]}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            width={48}
            height={56}
          />
        )}
      </span>
      <span
        className="text-[11px] uppercase text-white/60 group-hover:text-[#C9A84C] transition-colors"
        style={{ letterSpacing: "0.2em" }}
      >
        {producto?.display ?? nombre}
      </span>
    </>
  );

  return producto ? (
    <Link to={`/product/${productId}`} className="group inline-flex items-center gap-4 mb-6">
      {contenido}
    </Link>
  ) : (
    <div className="inline-flex items-center gap-4 mb-6">{contenido}</div>
  );
}
