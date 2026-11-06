import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { rutaDeAcceso } from "../../lib/volver";
import { usePendientesDeResena } from "../../hooks/useResenas";
import type { ResenaPublica } from "../../data/resenas";
import type { ResumenResenas as Resumen } from "../../lib/resenas";
import { AvisoError } from "../AvisoError";
import { Button } from "../ds/Button";
import { ResumenResenas } from "./ResumenResenas";
import { ResenaItem } from "./ResenaItem";
import { FormResena } from "./FormResena";

const POR_PAGINA = 5;

export const ID_SECCION_RESENAS = "resenas";

/**
 * Reseñas en la ficha de producto. Los datos los carga la página (también
 * muestra el promedio junto al título); aquí vive solo la invitación a
 * escribir, que depende de la sesión y de si el cliente ya recibió la pieza.
 */
export function SeccionResenas({
  productId,
  resenas,
  resumen,
  cargando,
  error,
  recargar,
}: {
  productId: string;
  resenas: ResenaPublica[];
  resumen: Resumen;
  cargando: boolean;
  error: Error | null;
  recargar: () => void;
}) {
  const { autenticado } = useAuth();
  const pendientes = usePendientesDeResena(autenticado);
  const puedeResenar = pendientes.ids.has(productId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [formAbierto, setFormAbierto] = useState(false);
  const [gracias, setGracias] = useState(false);
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const ref = useRef<HTMLElement>(null);

  // Desde "Mis pedidos" se llega con ?resenar=1: abre el formulario y baja
  // hasta él en cuanto se sabe que el cliente puede reseñar.
  const pidioResenar = searchParams.get("resenar") === "1";
  useEffect(() => {
    if (!pidioResenar || pendientes.loading) return;
    if (puedeResenar) setFormAbierto(true);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSearchParams((p) => { p.delete("resenar"); return p; }, { replace: true });
  }, [pidioResenar, pendientes.loading, puedeResenar, setSearchParams]);

  function handlePublicada() {
    setFormAbierto(false);
    setGracias(true);
    recargar();
    pendientes.refetch();
  }

  return (
    <section
      id={ID_SECCION_RESENAS}
      ref={ref}
      className="border-t border-white/10 scroll-mt-24"
      aria-labelledby="titulo-resenas"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-6">
            <span style={{ width: 32, height: 1, backgroundColor: "#C9A84C" }} />
            <p className="text-[11px] uppercase text-white/50" style={{ letterSpacing: "0.32em" }}>
              Opiniones
            </p>
          </div>
          <h2
            id="titulo-resenas"
            className="text-3xl md:text-5xl text-white tracking-wide"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
          >
            Lo que dicen quienes la tienen
          </h2>
        </motion.div>

        {error ? (
          <AvisoError
            titulo="No pudimos cargar las reseñas"
            detalle="Puede ser un problema temporal de conexión — inténtalo de nuevo en un momento."
            onRetry={recargar}
          />
        ) : cargando ? (
          <p className="text-white/40 uppercase tracking-widest text-sm py-10">Cargando reseñas...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20">
            <aside>
              {resumen.total > 0 ? (
                <ResumenResenas resumen={resumen} />
              ) : (
                <p className="text-white/50 leading-relaxed">
                  Esta pieza aún no tiene reseñas.
                </p>
              )}

              <div className="mt-10 pt-8 border-t border-white/10">
                <Invitacion
                  rutaLogin={rutaDeAcceso(`/product/${productId}?resenar=1`)}
                  autenticado={autenticado}
                  cargando={pendientes.loading}
                  puedeResenar={puedeResenar}
                  formAbierto={formAbierto}
                  gracias={gracias}
                  onEscribir={() => { setGracias(false); setFormAbierto(true); }}
                />
              </div>
            </aside>

            <div>
              {formAbierto && (
                <FormResena
                  productId={productId}
                  onPublicada={handlePublicada}
                  onCancelar={() => setFormAbierto(false)}
                />
              )}

              {resenas.length > 0 && (
                <div className={`divide-y divide-white/10 ${formAbierto ? "" : "-mt-8"}`}>
                  {resenas.slice(0, visibles).map((r) => (
                    <ResenaItem key={r.id} resena={r} />
                  ))}
                </div>
              )}

              {resenas.length > visibles && (
                <div className="pt-8 border-t border-white/10">
                  <Button as="button" variant="outline" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
                    Ver más reseñas
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Invitacion({
  rutaLogin,
  autenticado,
  cargando,
  puedeResenar,
  formAbierto,
  gracias,
  onEscribir,
}: {
  rutaLogin: string;
  autenticado: boolean;
  cargando: boolean;
  puedeResenar: boolean;
  formAbierto: boolean;
  gracias: boolean;
  onEscribir: () => void;
}) {
  const nota = "text-sm text-white/50 leading-relaxed";

  if (gracias) {
    return <p className="text-sm text-[#C9A84C] leading-relaxed">Gracias por contarnos tu experiencia.</p>;
  }
  if (!autenticado) {
    return (
      <p className={nota}>
        ¿Ya tienes esta pieza?{" "}
        <Link to={rutaLogin} className="text-white underline underline-offset-4 hover:text-[#C9A84C] transition-colors">
          Inicia sesión
        </Link>{" "}
        para contar tu experiencia.
      </p>
    );
  }
  if (cargando) return null;
  if (puedeResenar) {
    return formAbierto ? (
      <p className={nota}>Tu reseña se publica con tu nombre de pila y la inicial de tu apellido.</p>
    ) : (
      <Button as="button" variant="outline" onClick={onEscribir} className="w-full">
        Escribir una reseña
      </Button>
    );
  }
  return <p className={nota}>Las reseñas son de clientes que ya recibieron esta pieza.</p>;
}
