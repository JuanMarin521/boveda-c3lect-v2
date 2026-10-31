import { useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useProductos } from "../context/ProductosContext";
import { precioEfectivo, type PrecioEfectivo } from "../lib/precio";
import type { Producto } from "../data/types";

/**
 * Devuelve una función que resuelve el precio a mostrar de un producto,
 * usando la versión vigente del catálogo cuando está cargada. Así un
 * producto guardado en el carrito (copia en localStorage) refleja el precio
 * y las promociones actuales, no los del día en que se agregó.
 */
export function usePrecioDe(): (producto: Producto) => PrecioEfectivo {
  const { productos } = useProductos();
  const { autenticado } = useAuth();
  const vigentes = useMemo(
    () => new Map(productos.map((p) => [p.id, p])),
    [productos],
  );

  return useCallback(
    (producto) => precioEfectivo(vigentes.get(producto.id) ?? producto, autenticado),
    [vigentes, autenticado],
  );
}

export function usePrecioEfectivo(producto: Producto): PrecioEfectivo {
  return usePrecioDe()(producto);
}
