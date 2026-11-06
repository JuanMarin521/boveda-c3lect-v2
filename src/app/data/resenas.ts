import { supabase } from "../supabase";

// Las reseñas publicadas se leen de la vista `resenas_publicas` (migración
// 20261105000000 en c3lect-api), igual que el catálogo: sin depender de que
// Render esté despierto. La vista ya filtra las ocultas y no expone quién es
// el autor más allá de su firma pública ("Juan P."). Escribir una reseña sí
// pasa por la API (api/resenas.ts), porque exige sesión y compra recibida.

export interface ResenaPublica {
  id: string;
  productId: string;
  productoNombre: string;
  autor: string;
  calificacion: number;
  titulo: string | null;
  comentario: string;
  respuesta: string | null;
  respondidaAt: string | null;
  createdAt: string;
}

const COLUMNAS =
  "id, product_id, producto_nombre, autor_nombre, calificacion, titulo, comentario, respuesta, respondida_at, created_at";

function mapear(r: any): ResenaPublica {
  return {
    id: r.id,
    productId: r.product_id,
    productoNombre: r.producto_nombre,
    autor: r.autor_nombre,
    calificacion: r.calificacion,
    titulo: r.titulo,
    comentario: r.comentario,
    respuesta: r.respuesta,
    respondidaAt: r.respondida_at,
    createdAt: r.created_at,
  };
}

/** Todas las reseñas publicadas de un producto, de la más reciente a la más antigua. */
export async function getResenasDeProducto(productId: string): Promise<ResenaPublica[]> {
  const { data, error } = await supabase
    .from("resenas_publicas")
    .select(COLUMNAS)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapear);
}

/** Todas las reseñas publicadas de la tienda, de la más reciente a la más antigua. */
export async function getResenas(): Promise<ResenaPublica[]> {
  const { data, error } = await supabase
    .from("resenas_publicas")
    .select(COLUMNAS)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapear);
}
