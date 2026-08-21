// ============================================================
// PÁGINA: LA VITRINA — /catalog
//
// Dirección "pocas piezas, escala grande" —
// ver design_handoff_c3lect_visual/README.md, sección 2.
// Riel de categorías + marca/género/precio a la izquierda (desktop,
// sticky) / tabs + panel plegable (móvil). Filtros propios en URL,
// separados de BarraFiltros/useProductFilter (esos siguen existiendo
// para SearchResults.tsx, que usa el patrón de dropdowns + "Aplicar").
// ============================================================

import { Link, useParams, useNavigate, useSearchParams } from "react-router";
import { useState, useMemo, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { GeneroProducto, Producto } from "../data/types";
import { useProductos } from "../context/ProductosContext";
import { useCart } from "../context/CartContext";
import { enRango, RANGOS_VALIDOS, type RangoPrecio } from "../hooks/useProductFilter";
import { AvisoError } from "../components/AvisoError";
import { Badge } from "../components/ds/Badge";
import { Precio } from "../components/Precio";

type Categoria = "all" | "reloj" | "perfume" | "accesorio";

const RANGOS: { id: RangoPrecio; label: string }[] = [
  { id: "0-150",   label: "Hasta $150.000" },
  { id: "150-300", label: "$150.000 – $300.000" },
  { id: "300+",    label: "Más de $300.000" },
];
const GENEROS: GeneroProducto[] = ["Hombre", "Mujer", "Unisex"];

type OrdenId = "curaduria" | "precio-asc" | "precio-desc";
const OPCIONES_ORDEN: { id: OrdenId; label: string }[] = [
  { id: "curaduria",   label: "Curaduría" },
  { id: "precio-asc",  label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
];

function parseLista(valor: string | null): string[] {
  return valor ? valor.split(",").filter(Boolean) : [];
}

export default function Catalog() {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { productos, cargando, error, recargar } = useProductos();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtrosMóvilAbierto, setFiltrosMóvilAbierto] = useState(false);

  const filtroActivo: Categoria =
    category === "watches"    ? "reloj"     :
    category === "perfumes"   ? "perfume"   :
    category === "accesorios" ? "accesorio" : "all";

  const soloDisponible = searchParams.get("disponible") === "1";
  const filtroMarcas = useMemo(() => parseLista(searchParams.get("marca")), [searchParams]);
  const filtroGeneros = useMemo(() => parseLista(searchParams.get("genero")) as GeneroProducto[], [searchParams]);
  const filtroPrecios = useMemo(
    () => parseLista(searchParams.get("precio")).filter((r): r is RangoPrecio => RANGOS_VALIDOS.includes(r as RangoPrecio)),
    [searchParams]
  );
  const ordenParam = searchParams.get("orden");
  const criterioOrden: OrdenId = OPCIONES_ORDEN.some((o) => o.id === ordenParam) ? (ordenParam as OrdenId) : "curaduria";

  function irACategoria(cat: Categoria) {
    if (cat === "reloj")          navigate("/catalog/watches");
    else if (cat === "perfume")   navigate("/catalog/perfumes");
    else if (cat === "accesorio") navigate("/catalog/accesorios");
    else                          navigate("/catalog");
  }

  function toggleDisponible() {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (soloDisponible) p.delete("disponible");
      else p.set("disponible", "1");
      return p;
    }, { replace: true });
  }

  function toggleListParam(key: "marca" | "genero" | "precio", valor: string) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      const actuales = parseLista(p.get(key));
      const siguientes = actuales.includes(valor) ? actuales.filter((v) => v !== valor) : [...actuales, valor];
      if (siguientes.length > 0) p.set(key, siguientes.join(","));
      else p.delete(key);
      return p;
    }, { replace: true });
  }

  function limpiarFiltros() {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete("marca"); p.delete("genero"); p.delete("precio"); p.delete("disponible");
      return p;
    }, { replace: true });
  }

  function seleccionarOrden(valor: OrdenId) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (valor === "curaduria") p.delete("orden");
      else p.set("orden", valor);
      return p;
    }, { replace: true });
  }

  const conteoRelojes = useMemo(() => productos.filter((p) => p.cat === "reloj").length, [productos]);
  const conteoPerfumes = useMemo(() => productos.filter((p) => p.cat === "perfume").length, [productos]);
  const conteoAccesorios = useMemo(() => productos.filter((p) => p.cat === "accesorio").length, [productos]);

  const productosPorCategoria = useMemo(
    () => productos.filter((p) => filtroActivo === "all" || p.cat === filtroActivo),
    [productos, filtroActivo]
  );

  const marcasDisponibles = useMemo(() => {
    const ms = productosPorCategoria.map((p) => p.marca).filter((m): m is string => Boolean(m));
    return [...new Set(ms)].sort();
  }, [productosPorCategoria]);

  const productosFiltrados = useMemo(() => {
    const filtrados = productosPorCategoria
      .filter((p) => filtroMarcas.length === 0 || (p.marca != null && filtroMarcas.includes(p.marca)))
      .filter((p) => filtroGeneros.length === 0 || (p.genero != null && filtroGeneros.includes(p.genero)))
      .filter((p) => filtroPrecios.length === 0 || filtroPrecios.some((r) => enRango(p.precio, r)))
      .filter((p) => !soloDisponible || p.disponible);

    if (criterioOrden === "precio-asc") return [...filtrados].sort((a, b) => a.precio - b.precio);
    if (criterioOrden === "precio-desc") return [...filtrados].sort((a, b) => b.precio - a.precio);
    // "Curaduría": el orden que ya trae el catálogo, con los agotados al final.
    return [...filtrados].sort((a, b) => (a.disponible === b.disponible ? 0 : a.disponible ? -1 : 1));
  }, [productosPorCategoria, filtroMarcas, filtroGeneros, filtroPrecios, soloDisponible, criterioOrden]);

  const cantidadFiltrosActivos =
    (filtroMarcas.length > 0 ? 1 : 0) +
    (filtroGeneros.length > 0 ? 1 : 0) +
    (filtroPrecios.length > 0 ? 1 : 0) +
    (soloDisponible ? 1 : 0);
  const hayFiltrosActivos = cantidadFiltrosActivos > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Encabezado — desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-end justify-between border-b border-white/10 pb-7"
          style={{ paddingTop: 140 }}
        >
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 76, letterSpacing: "0.04em" }}>
            La vitrina
          </h1>
          <div className="flex items-center" style={{ gap: 24 }}>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-[11px] uppercase text-[#C9A84C] hover:text-white transition-colors"
                style={{ letterSpacing: "0.26em" }}
              >
                Limpiar filtros
              </button>
            )}
            {!cargando && !error && (
              <span className="text-[11px] uppercase text-white/40" style={{ letterSpacing: "0.26em" }}>
                {String(productosFiltrados.length).padStart(2, "0")} piezas disponibles · Medellín
              </span>
            )}
          </div>
        </motion.div>

        {/* Encabezado — móvil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden pt-12 pb-4"
        >
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 38 }}>La vitrina</h1>
        </motion.div>

        {/* Tabs de categoría — móvil */}
        <div
          className="md:hidden flex gap-1 border-b border-white/10 overflow-x-auto"
          role="tablist"
          aria-label="Filtrar por categoría"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <TabMóvil activo={filtroActivo === "all"}     onClick={() => irACategoria("all")}     label="Todo" />
          <TabMóvil activo={filtroActivo === "reloj"}   onClick={() => irACategoria("reloj")}   label="Relojes" />
          <TabMóvil activo={filtroActivo === "perfume"} onClick={() => irACategoria("perfume")} label="Perfumes" />
          {conteoAccesorios > 0 && (
            <TabMóvil activo={filtroActivo === "accesorio"} onClick={() => irACategoria("accesorio")} label="Accesorios" />
          )}
        </div>

        {/* Barra de filtros — móvil */}
        <div className="md:hidden flex items-center justify-between py-4 mb-2">
          <button
            onClick={() => setFiltrosMóvilAbierto(true)}
            className="flex items-center gap-2 text-[11px] uppercase text-white border border-white/25 rounded-full pl-3.5 pr-4 py-2 active:border-[#C9A84C] active:text-[#C9A84C] transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            <SlidersHorizontal size={13} aria-hidden="true" />
            Filtros{hayFiltrosActivos && ` · ${cantidadFiltrosActivos}`}
          </button>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="text-[10px] uppercase text-[#C9A84C]"
              style={{ letterSpacing: "0.22em" }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <FiltrosMovilSheet
          abierto={filtrosMóvilAbierto}
          onClose={() => setFiltrosMóvilAbierto(false)}
          soloDisponible={soloDisponible}
          onToggleDisponible={toggleDisponible}
          marcasDisponibles={marcasDisponibles}
          filtroMarcas={filtroMarcas}
          onToggleMarca={(m) => toggleListParam("marca", m)}
          filtroGeneros={filtroGeneros}
          onToggleGenero={(g) => toggleListParam("genero", g)}
          filtroPrecios={filtroPrecios}
          onTogglePrecio={(p) => toggleListParam("precio", p)}
          criterioOrden={criterioOrden}
          onSeleccionarOrden={seleccionarOrden}
          hayFiltrosActivos={hayFiltrosActivos}
          onLimpiar={limpiarFiltros}
          totalResultados={productosFiltrados.length}
        />

        <div className="flex gap-12 pb-12 md:pb-20">
          {/* Riel de filtros — desktop, sticky */}
          <aside
            className="hidden md:flex flex-col shrink-0 overflow-y-auto riel-filtros-scroll"
            style={{
              width: 180,
              paddingTop: 44,
              paddingBottom: 40,
              gap: 28,
              position: "sticky",
              top: 120,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 120px)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(201,168,76,0.35) transparent",
            } as React.CSSProperties}
          >
            <RielGrupo titulo="Filtrar">
              <RielItem activo={filtroActivo === "all"} onClick={() => irACategoria("all")}
                label={`Todo · ${String(productos.length).padStart(2, "0")}`} />
              <RielItem activo={filtroActivo === "reloj"} onClick={() => irACategoria("reloj")}
                label={`Relojería · ${String(conteoRelojes).padStart(2, "0")}`} />
              <RielItem activo={filtroActivo === "perfume"} onClick={() => irACategoria("perfume")}
                label={`Perfumería · ${String(conteoPerfumes).padStart(2, "0")}`} />
              {conteoAccesorios > 0 && (
                <RielItem activo={filtroActivo === "accesorio"} onClick={() => irACategoria("accesorio")}
                  label={`Accesorios · ${String(conteoAccesorios).padStart(2, "0")}`} />
              )}
              <RielItem activo={soloDisponible} onClick={toggleDisponible} label="Disponible" />
            </RielGrupo>

            <RielMarcas marcas={marcasDisponibles} filtroMarcas={filtroMarcas} onToggle={(m) => toggleListParam("marca", m)} />

            <RielGrupo titulo="Género">
              {GENEROS.map((genero) => (
                <RielItem key={genero} activo={filtroGeneros.includes(genero)} onClick={() => toggleListParam("genero", genero)} label={genero} />
              ))}
            </RielGrupo>

            <RielGrupo titulo="Precio">
              {RANGOS.map((r) => (
                <RielItem key={r.id} activo={filtroPrecios.includes(r.id)} onClick={() => toggleListParam("precio", r.id)} label={r.label} />
              ))}
            </RielGrupo>

            <RielOrden valor={criterioOrden} onSeleccionar={seleccionarOrden} />
            <style>{`
              .riel-filtros-scroll::-webkit-scrollbar { width: 5px; }
              .riel-filtros-scroll::-webkit-scrollbar-track { background: transparent; }
              .riel-filtros-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.35); border-radius: 3px; }
              .riel-filtros-scroll::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.6); }
            `}</style>
          </aside>

          {/* Grilla */}
          <div className="flex-1">
            {error ? (
              <AvisoError
                titulo="No pudimos cargar la vitrina"
                detalle="Revisá tu conexión y volvé a intentarlo. Las piezas siguen ahí."
                onRetry={recargar}
              />
            ) : cargando ? (
              <p className="text-center text-white/40 py-20">Cargando colección...</p>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-14 md:gap-y-[72px] pt-11"
                >
                  {productosFiltrados.map((producto, index) => (
                    <TarjetaProducto key={producto.id} producto={producto} index={index} />
                  ))}
                </motion.div>

                {productosFiltrados.length === 0 && (
                  <div className="text-center py-20">
                    <p
                      className="text-2xl md:text-[44px] mb-4 text-white"
                      style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
                    >
                      Ninguna pieza cumple esos filtros.
                    </p>
                    <p className="text-sm text-white/50 mb-6">
                      Prueba quitando alguno de los filtros seleccionados.
                    </p>
                    {hayFiltrosActivos && (
                      <button
                        onClick={limpiarFiltros}
                        className="border border-white/30 text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-[#0A0A0A] active:bg-[#C9A84C] active:border-[#C9A84C] active:text-[#0A0A0A] transition-all duration-300"
                      >
                        Quitar filtros
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponentes ─────────────────────────────────────────

function RielGrupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <span className="text-[10px] uppercase text-white/30" style={{ letterSpacing: "0.3em" }}>
        {titulo}
      </span>
      <div className="flex flex-col text-[12px] uppercase" style={{ gap: 14, letterSpacing: "0.2em" }}>
        {children}
      </div>
    </div>
  );
}

function RielMarcas({
  marcas, filtroMarcas, onToggle,
}: { marcas: string[]; filtroMarcas: string[]; onToggle: (marca: string) => void }) {
  const [abierto, setAbierto] = useState(filtroMarcas.length > 0);

  if (marcas.length === 0) return null;

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="flex items-center justify-between text-left text-[10px] uppercase text-white/30 hover:text-white/60 transition-colors"
        style={{ letterSpacing: "0.3em" }}
      >
        <span>Marca{filtroMarcas.length > 0 ? ` · ${filtroMarcas.length}` : ""}</span>
        <ChevronDown size={12} style={{ transform: abierto ? "rotate(180deg)" : undefined, transition: "transform .3s" }} />
      </button>
      {abierto && (
        <div className="flex flex-col" style={{ gap: 12 }}>
          {marcas.map((marca) => (
            <MarcaCheckbox key={marca} marca={marca} activo={filtroMarcas.includes(marca)} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function MarcaCheckbox({ marca, activo, onToggle }: { marca: string; activo: boolean; onToggle: (marca: string) => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={activo}
      onClick={() => onToggle(marca)}
      className={
        "flex items-center gap-3 text-left text-[12px] uppercase transition-colors " +
        (activo ? "text-[#C9A84C]" : "text-white/55 hover:text-white/80")
      }
      style={{ letterSpacing: "0.2em" }}
    >
      <span
        className="flex items-center justify-center shrink-0 border transition-colors"
        style={{
          width: 14,
          height: 14,
          borderColor: activo ? "#C9A84C" : "rgba(255,255,255,0.3)",
          backgroundColor: activo ? "#C9A84C" : "transparent",
        }}
      >
        {activo && <Check size={10} color="#0A0A0A" strokeWidth={3} aria-hidden="true" />}
      </span>
      {marca}
    </button>
  );
}

function RielOrden({ valor, onSeleccionar }: { valor: OrdenId; onSeleccionar: (v: OrdenId) => void }) {
  const [abierto, setAbierto] = useState(false);
  const actual = OPCIONES_ORDEN.find((o) => o.id === valor) ?? OPCIONES_ORDEN[0];

  return (
    <div className="flex flex-col" style={{ gap: 14, marginTop: 12 }}>
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="flex items-center justify-between text-left text-[10px] uppercase text-white/30 hover:text-white/60 transition-colors"
        style={{ letterSpacing: "0.24em" }}
      >
        <span>Orden</span>
        <ChevronDown size={12} style={{ transform: abierto ? "rotate(180deg)" : undefined, transition: "transform .3s" }} />
      </button>
      {abierto ? (
        <div className="flex flex-col text-[12px] uppercase" style={{ gap: 14, letterSpacing: "0.2em" }}>
          {OPCIONES_ORDEN.map((o) => (
            <RielItem
              key={o.id}
              activo={valor === o.id}
              onClick={() => { onSeleccionar(o.id); setAbierto(false); }}
              label={o.label}
            />
          ))}
        </div>
      ) : (
        <span className="text-[12px] uppercase text-[#C9A84C]" style={{ letterSpacing: "0.2em" }}>
          {actual.label}
        </span>
      )}
    </div>
  );
}

function RielItem({ activo, onClick, label }: { activo: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={
        "text-left pb-2 border-b transition-colors duration-[400ms] " +
        (activo ? "text-[#C9A84C] border-[#C9A84C]" : "text-white/55 border-white/[.08] hover:text-[#C9A84C]")
      }
    >
      {label}
    </button>
  );
}

function SeccionFiltroMovil({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] uppercase text-white/35" style={{ letterSpacing: "0.26em" }}>
        {titulo}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ activo, onClick, label }: { activo: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={
        "px-4 py-2.5 rounded-full text-[12px] uppercase border transition-colors " +
        (activo
          ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]"
          : "border-white/20 text-white/65 active:border-white/45 active:text-white")
      }
      style={{ letterSpacing: "0.12em" }}
    >
      {label}
    </button>
  );
}

function FiltrosMovilSheet({
  abierto, onClose,
  soloDisponible, onToggleDisponible,
  marcasDisponibles, filtroMarcas, onToggleMarca,
  filtroGeneros, onToggleGenero,
  filtroPrecios, onTogglePrecio,
  criterioOrden, onSeleccionarOrden,
  hayFiltrosActivos, onLimpiar,
  totalResultados,
}: {
  abierto: boolean;
  onClose: () => void;
  soloDisponible: boolean;
  onToggleDisponible: () => void;
  marcasDisponibles: string[];
  filtroMarcas: string[];
  onToggleMarca: (marca: string) => void;
  filtroGeneros: GeneroProducto[];
  onToggleGenero: (genero: GeneroProducto) => void;
  filtroPrecios: RangoPrecio[];
  onTogglePrecio: (rango: RangoPrecio) => void;
  criterioOrden: OrdenId;
  onSeleccionarOrden: (orden: OrdenId) => void;
  hayFiltrosActivos: boolean;
  onLimpiar: () => void;
  totalResultados: number;
}) {
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [abierto]);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            key="filtros-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="filtros-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed left-0 right-0 bottom-0 z-50 md:hidden flex flex-col rounded-t-2xl border-t border-white/10"
            style={{ background: "#0F0F0F", maxHeight: "85vh" }}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros del catálogo"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <h2
                className="text-base uppercase tracking-widest text-white"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                Filtros
              </h2>
              <button onClick={onClose} className="p-1 text-white/50 active:text-white" aria-label="Cerrar filtros">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">
              <SeccionFiltroMovil titulo="Disponibilidad">
                <Chip activo={soloDisponible} onClick={onToggleDisponible} label="Solo disponibles" />
              </SeccionFiltroMovil>

              {marcasDisponibles.length > 0 && (
                <SeccionFiltroMovil titulo="Marca">
                  {marcasDisponibles.map((marca) => (
                    <Chip key={marca} activo={filtroMarcas.includes(marca)} onClick={() => onToggleMarca(marca)} label={marca} />
                  ))}
                </SeccionFiltroMovil>
              )}

              <SeccionFiltroMovil titulo="Género">
                {GENEROS.map((genero) => (
                  <Chip key={genero} activo={filtroGeneros.includes(genero)} onClick={() => onToggleGenero(genero)} label={genero} />
                ))}
              </SeccionFiltroMovil>

              <SeccionFiltroMovil titulo="Precio">
                {RANGOS.map((r) => (
                  <Chip key={r.id} activo={filtroPrecios.includes(r.id)} onClick={() => onTogglePrecio(r.id)} label={r.label} />
                ))}
              </SeccionFiltroMovil>

              <SeccionFiltroMovil titulo="Ordenar por">
                {OPCIONES_ORDEN.map((o) => (
                  <Chip key={o.id} activo={criterioOrden === o.id} onClick={() => onSeleccionarOrden(o.id)} label={o.label} />
                ))}
              </SeccionFiltroMovil>
            </div>

            <div className="px-6 py-5 border-t border-white/10 shrink-0 flex items-center gap-4">
              {hayFiltrosActivos && (
                <button
                  onClick={onLimpiar}
                  className="shrink-0 text-[11px] uppercase text-white/50 active:text-white transition-colors"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-[#C9A84C] text-[#0A0A0A] py-3.5 text-sm uppercase tracking-widest"
              >
                Ver {totalResultados} {totalResultados === 1 ? "pieza" : "piezas"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TabMóvil({ activo, onClick, label }: { activo: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={activo}
      className={
        "shrink-0 px-3 py-2 text-[10px] uppercase whitespace-nowrap border-b-2 transition-colors " +
        (activo ? "text-[#C9A84C] border-[#C9A84C]" : "text-white border-transparent")
      }
      style={{ letterSpacing: "0.22em" }}
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
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{ height: 140, background: "linear-gradient(180deg, rgba(10,10,10,0), rgba(10,10,10,.85))" }}
          />
          <p
            className="absolute bottom-3 right-3 md:bottom-6 md:right-6 text-white/60 text-[10px] uppercase"
            style={{ letterSpacing: "0.26em" }}
          >
            {categoriaLabel}
          </p>
          {!producto.disponible && (
            <div className="absolute top-3 right-3 md:top-6 md:right-6">
              <Badge status="soldout" />
            </div>
          )}
          {producto.disponible && (
            <button
              onClick={handleAddToCart}
              aria-label={añadido ? "Añadido al carrito" : `Añadir ${producto.display} al carrito`}
              className="absolute bottom-3 left-3 md:bottom-6 md:left-6 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
              style={{ backgroundColor: añadido ? "#C9A84C" : "rgba(0,0,0,0.75)" }}
            >
              {añadido ? <Check size={16} /> : <ShoppingBag size={16} />}
            </button>
          )}
        </div>

        <div className="pt-6 border-t border-white/12 mt-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3
              className="text-lg md:text-[34px] mb-1 tracking-wide text-white group-hover:text-[#C9A84C] transition-colors duration-[400ms] leading-tight"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
            >
              {producto.display}
            </h3>
            {producto.notas && (
              <p className="hidden md:block text-[13px] text-white/45 max-w-[340px] line-clamp-2 mt-2">
                {producto.notas.descripcion}
              </p>
            )}
          </div>
          <Precio
            producto={producto}
            className="shrink-0 text-base md:text-[28px] transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </Link>
    </motion.div>
  );
}
