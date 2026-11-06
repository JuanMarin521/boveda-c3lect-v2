// Agregados de reseñas para la UI (promedio y distribución por estrellas).
// Se calculan en el navegador sobre lo que devuelve la vista pública: el
// volumen de una tienda boutique no justifica otra vista agregada.

export interface ResumenResenas {
  total: number;
  /** Promedio con un decimal; 0 si no hay reseñas. */
  promedio: number;
  /** Cantidad por estrellas, de 5 a 1. */
  distribucion: { estrellas: number; cantidad: number }[];
}

export function resumirResenas(resenas: { calificacion: number }[]): ResumenResenas {
  const conteo = [0, 0, 0, 0, 0];
  for (const r of resenas) {
    if (r.calificacion >= 1 && r.calificacion <= 5) conteo[r.calificacion - 1]++;
  }
  const total = conteo.reduce((a, b) => a + b, 0);
  const suma = conteo.reduce((acc, n, i) => acc + n * (i + 1), 0);
  return {
    total,
    promedio: total === 0 ? 0 : Math.round((suma / total) * 10) / 10,
    distribucion: [5, 4, 3, 2, 1].map((estrellas) => ({
      estrellas,
      cantidad: conteo[estrellas - 1],
    })),
  };
}

export function etiquetaCantidad(total: number): string {
  return `${total} reseña${total === 1 ? "" : "s"}`;
}

/** Límites de texto; los mismos que valida el dominio en c3lect-api. */
export const LIMITES_RESENA = {
  tituloMax: 80,
  comentarioMin: 10,
  comentarioMax: 1000,
  respuestaMax: 1000,
} as const;
