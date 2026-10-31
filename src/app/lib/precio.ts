import type { Producto } from "../data/types";

export interface PrecioEfectivo {
  precioOriginal: number;
  precioFinal: number;
  descuentoPorcentaje: number;
  enPromocion: boolean;
}

// Elige, entre los dos precios que publica el catálogo, el que corresponde al
// comprador. No calcula descuentos: esa regla vive en el backend (vista
// catalogo_publico y promotions.util). Tolera productos sin `precios`, como
// los que quedaron guardados en el carrito antes de este cambio.
export function precioEfectivo(
  producto: Pick<Producto, "precio"> & { precios?: Producto["precios"] },
  autenticado: boolean,
): PrecioEfectivo {
  const publicado = producto.precios?.[autenticado ? "cuenta" : "invitado"];
  const descuento = publicado?.descuento ?? 0;
  return {
    precioOriginal: producto.precio,
    precioFinal: publicado?.final ?? producto.precio,
    descuentoPorcentaje: descuento,
    enPromocion: descuento > 0,
  };
}
