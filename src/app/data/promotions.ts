import { supabase } from "../supabase";
import type { Promocion } from "../lib/promotions";

const PROMOCIONES_COLUMNAS =
  "id, nombre, alcance, porcentaje, productos_incluidos, categoria, marca, excluidos, " +
  "solo_cuenta_activa, fecha_inicio, fecha_fin, activo";

export async function getPromociones(): Promise<Promocion[]> {
  const { data, error } = await supabase.from("promociones").select(PROMOCIONES_COLUMNAS);
  if (error) throw error;

  return (data as any[]).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    alcance: p.alcance,
    porcentaje: p.porcentaje,
    productosIncluidos: p.productos_incluidos ?? [],
    categoria: p.categoria,
    marca: p.marca,
    excluidos: p.excluidos ?? [],
    soloCuentaActiva: p.solo_cuenta_activa,
    fechaInicio: p.fecha_inicio,
    fechaFin: p.fecha_fin,
    activo: p.activo,
  }));
}
