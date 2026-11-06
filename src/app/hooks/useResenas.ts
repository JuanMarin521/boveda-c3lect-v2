import { useMemo } from 'react';
import { getResenas, getResenasDeProducto } from '../data/resenas';
import { resenasApi } from '../api/resenas';
import { resumirResenas } from '../lib/resenas';
import { useApiQuery } from './useApiQuery';

/** Reseñas publicadas de un producto, con su resumen ya calculado. */
export function useResenasDeProducto(productId: string | undefined) {
  const query = useApiQuery(
    () => (productId ? getResenasDeProducto(productId) : Promise.resolve([])),
    [productId],
  );
  const resumen = useMemo(() => resumirResenas(query.data ?? []), [query.data]);
  return { ...query, resenas: query.data ?? [], resumen };
}

/** Todas las reseñas publicadas de la tienda. */
export function useResenas() {
  const query = useApiQuery(() => getResenas(), []);
  return { ...query, resenas: query.data ?? [] };
}

/**
 * Ids de los productos que el cliente recibió y aún no reseñó. Sin sesión no
 * consulta la API (la respuesta sería 401) y devuelve un conjunto vacío.
 */
export function usePendientesDeResena(autenticado: boolean) {
  const query = useApiQuery(
    (signal) => (autenticado ? resenasApi.pendientes(signal) : Promise.resolve([])),
    [autenticado],
  );
  const ids = useMemo(
    () => new Set((query.data ?? []).map((p) => p.productId)),
    [query.data],
  );
  return { ...query, ids };
}
