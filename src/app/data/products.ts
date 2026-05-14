export type { NotasPerfume, Producto } from "./types";

import { supabase } from "../supabase";
import type { Producto } from "./types";

export async function getProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("cat", { ascending: false });

  if (error) throw error;

  return data.map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    estilo: p.estilo,
    display: p.display,
    precio: p.precio,
    disponible: p.disponible,
    cat: p.cat,
    imgs: p.imgs,
    specs: p.spec_movimiento ? {
      movimiento: p.spec_movimiento,
      dimensiones: p.spec_dimensiones,
      caja: p.spec_caja,
      correa: p.spec_correa,
      cristal: p.spec_cristal,
      funciones: p.spec_funciones,
      resistenciaAgua: p.spec_resistencia_agua,
      peso: p.spec_peso,
      bateria: p.spec_bateria,
      reservaMarcha: p.spec_reserva_marcha,
      observaciones: p.spec_observaciones,
    } : undefined,
    notas: p.notas_descripcion ? {
      descripcion: p.notas_descripcion,
      notas_top: p.notas_top,
      notas_corazon: p.notas_corazon,
      notas_base: p.notas_base,
    } : undefined,
  }));
}

export function getProductoById(id: string, productos: Producto[]) {
  return productos.find((p) => p.id === id);
}

export function getProductosPorCategoria(cat: 'reloj' | 'perfume' | 'accesorio', productos: Producto[]) {
  return productos.filter((p) => p.cat === cat);
}