// ============================================================
// ACCESORIOS PREMIUM
//
// PARA AÑADIR UN ACCESORIO:
//   1. Copia un bloque completo (entre llaves { ... })
//   2. Pégalo al final de la lista
//   3. Cambia id, nombre, estilo, precio, disponible e imgs
//
// PARA CAMBIAR PRECIO:   modifica el campo "precio"
// PARA MARCAR AGOTADO:   cambia "disponible" a false
// PARA CAMBIAR FOTOS:    reemplaza las rutas en "imgs"
//
// Imágenes en: public/images/accesorios/
// Rutas sin barra inicial, ej: "images/accesorios/foto.jpg"  (NO "/images/...")
// ============================================================

import type { Producto } from "./types";

export const accesorios: Producto[] = [

  {
    id: "a-Organizador-relojes",
    nombre: "Organizador de Relojes 5 Ranuras",
    estilo: "Negro",
    display: "Organizador de Relojes 5 Ranuras",
    precio: "$79.000",
    disponible: true,
    cat: "accesorio",
    imgs: [
      "images/accesorios/Organizador-de-Relojes-5-Ranuras-1.jpg",
      "images/accesorios/Organizador-de-Relojes-5-Ranuras-2.jpg",
      "images/accesorios/Organizador-de-Relojes-5-Ranuras-3.jpg",
    ],
  },

];
