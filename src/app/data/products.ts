import { supabase } from "../supabase";
import { api } from "../lib/api";
import type { Producto } from "./types";

async function getStockPorModelo(): Promise<Map<string, number>> {
  try {
    const { data } = await api.get<{ modelo: string; stock: number }[]>("/inventario/stock");
    return new Map(data.map((i) => [i.modelo.toLowerCase(), i.stock]));
  } catch {
    return new Map();
  }
}

// Deriva el "modelo" de un producto igual que el backend (common/marca-modelo.util.ts
// en c3lect-api): el inventario guarda el modelo SIN la marca (ej. "8467"), mientras
// que Product.nombre es el texto completo "Marca Modelo" (ej. "Curren 8467"). Si no
// se deriva un modelo (marca ausente o no es prefijo del nombre), cae al nombre
// completo — mismo comportamiento legado que usa el backend al confirmar pedidos.
function derivarModelo(nombre: string, marca: string | null | undefined): string {
  if (marca && nombre.toLowerCase().startsWith(marca.toLowerCase())) {
    const resto = nombre.slice(marca.length).trim();
    if (resto) return resto;
  }
  return nombre;
}

function buscarStock(stockPorModelo: Map<string, number>, nombre: string, marca: string | null | undefined) {
  const modelo = derivarModelo(nombre, marca);
  const porModelo = stockPorModelo.get(modelo.toLowerCase());
  if (porModelo !== undefined) return porModelo;
  if (modelo.toLowerCase() !== nombre.toLowerCase()) {
    return stockPorModelo.get(nombre.toLowerCase());
  }
  return undefined;
}

// Lista explícita de columnas (en vez de select("*")) para que una columna interna futura
// (costo, margen) no llegue al navegador de un visitante anónimo por default. Debe mantenerse
// en sync con los campos que el mapeo de abajo efectivamente lee de `p`.
const PRODUCTOS_COLUMNAS =
  "id, nombre, estilo, display, precio, disponible, destacado, destacado_orden, cat, marca, genero, imgs, " +
  "spec_movimiento, spec_dimensiones, spec_caja, spec_correa, spec_cristal, spec_funciones, " +
  "spec_resistencia_agua, spec_peso, spec_bateria, spec_reserva_marcha, spec_observaciones, " +
  "notas_descripcion, notas_top, notas_corazon, notas_base";

// Algunos productos (sobre todo perfumes importados de la planilla) tienen
// "estilo" literalmente en "N/A" en vez de vacío — sin esto, "display" (armado
// en el panel admin como "Nombre — Estilo") muestra "... — N/A" en toda la
// tienda. Se sanea acá, en el único punto donde se leen productos, en vez de
// en cada componente que renderiza display/estilo.
function esEstiloVacio(estilo: string | null | undefined): boolean {
  return !estilo || estilo.trim().toUpperCase() === "N/A";
}

export async function getProductos(): Promise<Producto[]> {
  const [{ data, error }, stockPorModelo] = await Promise.all([
    supabase.from("productos").select(PRODUCTOS_COLUMNAS).order("cat", { ascending: false }),
    getStockPorModelo(),
  ]);

  if (error) throw error;

  return data
    .filter((p: any) => p.precio > 0 && !!p.estilo && Array.isArray(p.imgs) && p.imgs.length > 0)
    .map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    estilo: esEstiloVacio(p.estilo) ? "" : p.estilo,
    display: esEstiloVacio(p.estilo) ? p.nombre : p.display,
    precio: p.precio,
    disponible: p.disponible,
    destacado: p.destacado ?? false,
    destacadoOrden: p.destacado_orden ?? null,
    stock: buscarStock(stockPorModelo, p.nombre, p.marca),
    cat: p.cat,
    marca: p.marca ?? undefined,
    genero: p.genero ?? undefined,
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