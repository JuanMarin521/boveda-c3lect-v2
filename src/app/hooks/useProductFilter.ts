import { useState, useMemo } from "react";
import type { Producto, GeneroProducto } from "../data/types";

export type RangoPrecio = "0-150" | "150-300" | "300+";

function enRango(precio: number, rango: RangoPrecio): boolean {
  if (rango === "0-150")   return precio <= 150000;
  if (rango === "150-300") return precio > 150000 && precio <= 300000;
  return precio > 300000;
}

export function useProductFilter(productos: Producto[]) {
  // ── Selección pendiente (lo que el usuario va marcando en el dropdown) ──
  const [seleccionMarcas,  setSeleccionMarcas]  = useState<string[]>([]);
  const [seleccionGeneros, setSeleccionGeneros] = useState<GeneroProducto[]>([]);
  const [seleccionPrecios, setSeleccionPrecios] = useState<RangoPrecio[]>([]);

  // ── Estado aplicado (lo que realmente filtra el catálogo) ──
  const [filtroMarcas,  setFiltroMarcas]  = useState<string[]>([]);
  const [filtroGeneros, setFiltroGeneros] = useState<GeneroProducto[]>([]);
  const [filtroPrecios, setFiltroPrecios] = useState<RangoPrecio[]>([]);
  const [filtroDisponible, setFiltroDisponible] = useState(false);

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

  // Aplicar: copia la selección al estado aplicado
  function aplicarMarcas()  { setFiltroMarcas([...seleccionMarcas]); }
  function aplicarGeneros() { setFiltroGeneros([...seleccionGeneros]); }
  function aplicarPrecios() { setFiltroPrecios([...seleccionPrecios]); }

  // Resetea marcas en selección y aplicado (usado al cambiar categoría)
  function resetMarcas() {
    setSeleccionMarcas([]);
    setFiltroMarcas([]);
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

  // Limpiar resetea AMBOS estados
  function limpiarFiltros() {
    setSeleccionMarcas([]);  setFiltroMarcas([]);
    setSeleccionGeneros([]); setFiltroGeneros([]);
    setSeleccionPrecios([]); setFiltroPrecios([]);
    setFiltroDisponible(false);
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
