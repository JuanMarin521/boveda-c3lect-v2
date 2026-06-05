import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { GeneroProducto } from "../data/types";
import type { RangoPrecio } from "../hooks/useProductFilter";

type DropdownId = "marca" | "genero" | "precio";

const RANGOS: { id: RangoPrecio; label: string }[] = [
  { id: "0-150",   label: "Hasta $150.000" },
  { id: "150-300", label: "$150.000 – $300.000" },
  { id: "300+",    label: "Más de $300.000" },
];

const GENEROS: GeneroProducto[] = ["Hombre", "Mujer", "Unisex"];

interface BarraFiltrosProps {
  marcasDisponibles: string[];
  seleccionMarcas: string[];
  seleccionGeneros: GeneroProducto[];
  seleccionPrecios: RangoPrecio[];
  filtroMarcas: string[];
  filtroGeneros: GeneroProducto[];
  filtroPrecios: RangoPrecio[];
  filtroDisponible: boolean;
  onMarca: (v: string) => void;
  onGenero: (v: GeneroProducto) => void;
  onPrecio: (v: RangoPrecio) => void;
  onIniciarMarcas: () => void;
  onIniciarGeneros: () => void;
  onIniciarPrecios: () => void;
  onAplicarMarcas: () => void;
  onAplicarGeneros: () => void;
  onAplicarPrecios: () => void;
  onDisponible: (v: boolean) => void;
  onLimpiar: () => void;
  hayFiltrosActivos: boolean;
  cantidadFiltrosActivos: number;
}

export function BarraFiltros({
  marcasDisponibles,
  seleccionMarcas, seleccionGeneros, seleccionPrecios,
  filtroMarcas, filtroGeneros, filtroPrecios, filtroDisponible,
  onMarca, onGenero, onPrecio,
  onIniciarMarcas, onIniciarGeneros, onIniciarPrecios,
  onAplicarMarcas, onAplicarGeneros, onAplicarPrecios,
  onDisponible, onLimpiar,
  hayFiltrosActivos, cantidadFiltrosActivos,
}: BarraFiltrosProps) {
  const [abierto, setAbierto] = useState<DropdownId | null>(null);

  // Estable para no recrear el effect de click-outside en cada render
  const cerrar = useCallback(() => setAbierto(null), []);

  function abrirDropdown(id: DropdownId) {
    if (abierto === id) { setAbierto(null); return; }
    if (id === "marca")  onIniciarMarcas();
    if (id === "genero") onIniciarGeneros();
    if (id === "precio") onIniciarPrecios();
    setAbierto(id);
  }

  return (
    <div className="relative mb-10">
      <div
        className="flex items-stretch border-y border-black/10 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {/* Marca */}
        {marcasDisponibles.length > 0 && (
          <FiltroBtn
            label="Marca"
            activo={filtroMarcas.length > 0}
            abierto={abierto === "marca"}
            onClick={() => abrirDropdown("marca")}
            onAplicar={() => { onAplicarMarcas(); setAbierto(null); }}
            onClose={cerrar}
          >
            {marcasDisponibles.map(m => (
              <OpcionFiltro
                key={m}
                label={m}
                activo={seleccionMarcas.includes(m)}
                onClick={() => onMarca(m)}
              />
            ))}
          </FiltroBtn>
        )}

        {/* Género */}
        <FiltroBtn
          label="Género"
          activo={filtroGeneros.length > 0}
          abierto={abierto === "genero"}
          onClick={() => abrirDropdown("genero")}
          onAplicar={() => { onAplicarGeneros(); setAbierto(null); }}
          onClose={cerrar}
        >
          {GENEROS.map(g => (
            <OpcionFiltro
              key={g}
              label={g}
              activo={seleccionGeneros.includes(g)}
              onClick={() => onGenero(g)}
            />
          ))}
        </FiltroBtn>

        {/* Precio */}
        <FiltroBtn
          label="Precio"
          activo={filtroPrecios.length > 0}
          abierto={abierto === "precio"}
          onClick={() => abrirDropdown("precio")}
          onAplicar={() => { onAplicarPrecios(); setAbierto(null); }}
          onClose={cerrar}
        >
          {RANGOS.map(r => (
            <OpcionFiltro
              key={r.id}
              label={r.label}
              activo={seleccionPrecios.includes(r.id)}
              onClick={() => onPrecio(r.id)}
            />
          ))}
        </FiltroBtn>

        {/* Disponibilidad — toggle directo, sin dropdown */}
        <button
          onClick={() => onDisponible(!filtroDisponible)}
          className="flex items-center gap-2.5 px-6 py-4 text-xs uppercase tracking-widest border-r border-black/10 transition-colors whitespace-nowrap"
          style={{ color: filtroDisponible ? "#C9A84C" : "#000" }}
        >
          Solo disponibles
          {filtroDisponible && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
          )}
        </button>

        {/* Limpiar filtros */}
        {hayFiltrosActivos && (
          <button
            onClick={onLimpiar}
            className="ml-auto flex-shrink-0 flex items-center gap-2 px-6 text-xs uppercase tracking-widest text-black/40 hover:text-black transition-colors border-l border-black/10"
          >
            <X size={12} />
            Limpiar
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
              style={{ backgroundColor: "#C9A84C" }}
            >
              {cantidadFiltrosActivos}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Subcomponentes internos ────────────────────────────────

function FiltroBtn({
  label, activo, abierto, onClick, onAplicar, onClose, children,
}: {
  label: string;
  activo: boolean;
  abierto: boolean;
  onClick: () => void;
  onAplicar: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const btnRef    = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Calcula la posición del dropdown al abrir y al hacer scroll/resize
  useEffect(() => {
    if (!abierto || !btnRef.current) return;
    function calcPos() {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom, left: rect.left });
    }
    calcPos();
    window.addEventListener("scroll", calcPos, { passive: true });
    window.addEventListener("resize", calcPos, { passive: true });
    return () => {
      window.removeEventListener("scroll", calcPos);
      window.removeEventListener("resize", calcPos);
    };
  }, [abierto]);

  // Click-outside: verifica TANTO el botón como el portal para no cerrar
  // prematuramente cuando el usuario hace clic en las opciones del dropdown
  useEffect(() => {
    if (!abierto) return;
    function onMouseDown(e: MouseEvent) {
      const enBoton  = btnRef.current?.contains(e.target as Node);
      const enPortal = portalRef.current?.contains(e.target as Node);
      if (!enBoton && !enPortal) onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [abierto, onClose]);

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={btnRef}
        onClick={onClick}
        className="flex items-center gap-2.5 px-6 py-4 text-xs uppercase tracking-widest border-r border-black/10 transition-colors whitespace-nowrap h-full"
        style={{ color: activo ? "#C9A84C" : "#000" }}
      >
        {label}
        {activo && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />}
        <ChevronDown
          size={12}
          className="transition-transform duration-200"
          style={{ transform: abierto ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {createPortal(
        <AnimatePresence>
          {abierto && (
            // div wrapper con ref para que click-outside detecte correctamente
            // el contenido del portal (está en document.body, fuera del DOM del componente)
            <div
              ref={portalRef}
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                zIndex: 9999,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="bg-white border border-black/10 shadow-2xl min-w-[220px]"
              >
                <div className="py-2">
                  {children}
                </div>
                <div className="border-t border-black/10 p-2">
                  <button
                    onClick={onAplicar}
                    className="w-full py-2.5 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#C9A84C" }}
                  >
                    Aplicar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function OpcionFiltro({
  label, activo, onClick,
}: {
  label: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-5 py-3 text-left hover:bg-neutral-50 transition-colors"
    >
      <span
        className="w-4 h-4 border flex-shrink-0 flex items-center justify-center"
        style={{
          borderColor:     activo ? "#C9A84C" : "rgba(0,0,0,0.25)",
          backgroundColor: activo ? "#C9A84C" : "transparent",
        }}
      >
        {activo && <Check size={9} color="white" />}
      </span>
      <span
        className="text-xs uppercase tracking-wider"
        style={{ color: activo ? "#C9A84C" : "#000" }}
      >
        {label}
      </span>
    </button>
  );
}
