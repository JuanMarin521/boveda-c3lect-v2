// Puerto manual de c3lect-api/src/modules/promotions/promotions.util.ts — misma
// lógica pura evaluada acá porque el catálogo público lee productos y
// promociones directo de Supabase, sin pasar por el backend. Cualquier
// cambio de reglas acá debe replicarse también ahí.

export interface Promocion {
  id: string;
  nombre: string;
  alcance: 'PRODUCTO' | 'CATEGORIA' | 'MARCA' | 'TODOS';
  porcentaje: number;
  productosIncluidos: string[];
  categoria: string | null;
  marca: string | null;
  excluidos: string[];
  soloCuentaActiva: boolean;
  fechaInicio: string; // ISO
  fechaFin: string;    // ISO
  activo: boolean;
}

interface ProductoLike {
  id: string;
  cat: string;
  marca?: string | null;
}

export function promocionAplica(promo: Promocion, producto: ProductoLike): boolean {
  if (promo.excluidos.includes(producto.id)) return false;

  switch (promo.alcance) {
    case 'TODOS':
      return true;
    case 'CATEGORIA':
      return promo.categoria != null && promo.categoria === producto.cat;
    case 'MARCA':
      return promo.marca != null && promo.marca === producto.marca;
    case 'PRODUCTO':
      return promo.productosIncluidos.includes(producto.id);
  }
}

export function estaVigente(promo: Promocion, ahora: Date = new Date()): boolean {
  return promo.activo && ahora >= new Date(promo.fechaInicio) && ahora <= new Date(promo.fechaFin);
}

export function mejorDescuento(
  promociones: Promocion[],
  producto: ProductoLike,
  autenticado: boolean,
): number {
  return promociones.reduce((mejor, promo) => {
    if (!estaVigente(promo)) return mejor;
    if (promo.soloCuentaActiva && !autenticado) return mejor;
    if (!promocionAplica(promo, producto)) return mejor;
    return Math.max(mejor, promo.porcentaje);
  }, 0);
}

export function calcularPrecioFinal(precioOriginal: number, descuentoPorcentaje: number): number {
  if (descuentoPorcentaje <= 0) return precioOriginal;
  return Math.round(precioOriginal * (1 - descuentoPorcentaje / 100));
}
