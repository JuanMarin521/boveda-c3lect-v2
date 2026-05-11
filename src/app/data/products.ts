// ============================================================
// CATÁLOGO C3LECT — Punto de entrada
//
// Este archivo combina todas las categorías. NO agregues productos aquí.
//
// ¿Dónde editar productos?
//   Relojes     →  relojes.ts
//   Perfumes    →  perfumes.ts
//   Accesorios  →  accesorios.ts
//
// ¿Quieres agregar una categoría nueva?
//   1. Crea un archivo nuevo, ej: bolsos.ts  (copia la estructura de accesorios.ts)
//   2. Impórtalo aquí y agrégalo al spread de "productos"
// ============================================================

export type { NotasPerfume, Producto } from "./types";

import { relojes }    from "./relojes";
import { perfumes }   from "./perfumes";
import { accesorios } from "./accesorios";

export const productos = [...relojes, ...perfumes, ...accesorios];

// ─── HELPERS ────────────────────────────────────────────────

export function getProductoById(id: string) {
  return productos.find((p) => p.id === id);
}

export function getProductosPorCategoria(cat: 'reloj' | 'perfume' | 'accesorio') {
  return productos.filter((p) => p.cat === cat);
}
