import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Producto, GeneroProducto } from "../data/types";

export type RangoPrecio = "0-150" | "150-300" | "300+";

export const RANGOS_VALIDOS: RangoPrecio[] = ["0-150", "150-300", "300+"];

export function enRango(precio: number, rango: RangoPrecio): boolean {
  if (rango === "0-150")   return precio <= 150000;
  if (rango === "150-300") return precio > 150000 && precio <= 300000;
  return precio > 300000;
}

function parseLista(valor: string | null): string[] {
  return valor ? valor.split(",").filter(Boolean) : [];
}

// El filtro aplicado vive en la URL (?marca=...&genero=...&precio=...&disponible=1)
// para que "volver atrás" desde un producto restaure exactamente lo que el
// usuario había filtrado — antes vivía solo en useState y se perdía al
// desmontarse la página del catálogo.
export function useProductFilter(productos: Producto[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Selección pendiente (lo que el usuario va marcando en el dropdown) ──
  const [seleccionMarcas,  setSeleccionMarcas]  = useState<string[]>([]);
  const [seleccionGeneros, setSeleccionGeneros] = useState<GeneroProducto[]>([]);
  const [seleccionPrecios, setSeleccionPrecios] = useState<RangoPrecio[]>([]);

  // ── Estado aplicado (lo que realmente filtra el catálogo) — inicializado desde la URL ──
  const [filtroMarcas,  setFiltroMarcasState]  = useState<string[]>(() => parseLista(searchParams.get("marca")));
  const [filtroGeneros, setFiltroGenerosState] = useState<GeneroProducto[]>(() => parseLista(searchParams.get("genero")) as GeneroProducto[]);
  const [filtroPrecios, setFiltroPreciosState] = useState<RangoPrecio[]>(() =>
    parseLista(searchParams.get("precio")).filter((r): r is RangoPrecio => RANGOS_VALIDOS.includes(r as RangoPrecio))
  );
  const [filtroDisponible, setFiltroDisponibleState] = useState(() => searchParams.get("disponible") === "1");

  // Refleja el estado aplicado en la URL (reemplaza la entrada actual del
  // historial, no crea una nueva por cada click en "Aplicar").
  function syncUrl(next: {
    marca?: string[]; genero?: string[]; precio?: string[]; disponible?: boolean;
  }) {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      const setLista = (key: string, valores: string[] | undefined) => {
        if (valores === undefined) return;
        if (valores.length > 0) p.set(key, valores.join(","));
        else p.delete(key);
      };
      setLista("marca", next.marca);
      setLista("genero", next.genero);
      setLista("precio", next.precio);
      if (next.disponible !== undefined) {
        if (next.disponible) p.set("disponible", "1");
        else p.delete("disponible");
      }
      return p;
    }, { replace: true });
  }

  // Sincroniza la selección con el estado aplicado al abrir un dropdown
  function iniciarMarcas()  { setSeleccionMarcas([...filtroMarcas]); }
  function iniciarGeneros() { setSeleccionGeneros([...filtroGeneros]); }
  function iniciarPrecios() { setSeleccionPrecios([...filtroPrecios]); }

  // Toggles sobre la selección pendiente
  function toggleMarca(v: string) {
    setSeleccionMarcas(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  }
  function toggleGenero(v: GeneroProducto) {
    setSeleccionGeneros(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  }
  function togglePrecio(v: RangoPrecio) {
    setSeleccionPrecios(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  }

  // Aplicar: copia la selección al estado aplicado (y a la URL)
  function aplicarMarcas()  { setFiltroMarcasState([...seleccionMarcas]);   syncUrl({ marca: seleccionMarcas }); }
  function aplicarGeneros() { setFiltroGenerosState([...seleccionGeneros]); syncUrl({ genero: seleccionGeneros }); }
  function aplicarPrecios() { setFiltroPreciosState([...seleccionPrecios]); syncUrl({ precio: seleccionPrecios }); }

  function setFiltroDisponible(v: boolean) {
    setFiltroDisponibleState(v);
    syncUrl({ disponible: v });
  }

  // Resetea marcas en selección y aplicado (usado al cambiar categoría)
  function resetMarcas() {
    setSeleccionMarcas([]);
    setFiltroMarcasState([]);
    syncUrl({ marca: [] });
  }

  const marcasDisponibles = useMemo(() => {
    const ms = productos.map(p => p.marca).filter((m): m is string => Boolean(m));
    return [...new Set(ms)].sort();
  }, [productos]);

  // El filtrado usa SOLO el estado aplicado — OR dentro de cada filtro, AND entre filtros
  const productosFiltrados = useMemo(() => {
    return productos
      .filter(p =>
        filtroMarcas.length === 0 ||
        (p.marca != null && filtroMarcas.includes(p.marca))
      )
      .filter(p =>
        filtroGeneros.length === 0 ||
        (p.genero != null && filtroGeneros.includes(p.genero))
      )
      .filter(p =>
        filtroPrecios.length === 0 ||
        filtroPrecios.some(r => enRango(p.precio, r))
      )
      .filter(p => !filtroDisponible || p.disponible)
      .sort((a, b) => {
        if (a.disponible === b.disponible) return 0;
        return a.disponible ? -1 : 1;
      });
  }, [productos, filtroMarcas, filtroGeneros, filtroPrecios, filtroDisponible]);

  // Basado en estado APLICADO, no en selección
  const cantidadFiltrosActivos =
    (filtroMarcas.length  > 0 ? 1 : 0) +
    (filtroGeneros.length > 0 ? 1 : 0) +
    (filtroPrecios.length > 0 ? 1 : 0) +
    (filtroDisponible     ? 1 : 0);

  const hayFiltrosActivos = cantidadFiltrosActivos > 0;

  // Limpiar resetea AMBOS estados (y la URL)
  function limpiarFiltros() {
    setSeleccionMarcas([]);  setFiltroMarcasState([]);
    setSeleccionGeneros([]); setFiltroGenerosState([]);
    setSeleccionPrecios([]); setFiltroPreciosState([]);
    setFiltroDisponibleState(false);
    syncUrl({ marca: [], genero: [], precio: [], disponible: false });
  }

  return {
    // Selección pendiente
    seleccionMarcas, seleccionGeneros, seleccionPrecios,
    toggleMarca, toggleGenero, togglePrecio,
    iniciarMarcas, iniciarGeneros, iniciarPrecios,
    aplicarMarcas, aplicarGeneros, aplicarPrecios,
    // Estado aplicado
    filtroMarcas, filtroGeneros, filtroPrecios,
    filtroDisponible, setFiltroDisponible,
    resetMarcas,
    // Derivados
    marcasDisponibles,
    productosFiltrados,
    hayFiltrosActivos,
    cantidadFiltrosActivos,
    limpiarFiltros,
  };
}
