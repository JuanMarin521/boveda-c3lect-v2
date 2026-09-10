import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

interface UseApiQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Centraliza el patrón de fetch+loading+error que se repetía a mano en cada
 * página (useState + useEffect + api.get().then/.catch/.finally). No impone
 * una forma de respuesta: el caller decide qué pide y cómo la interpreta —
 * el hook solo es dueño del estado de carga y de cancelar el request
 * anterior con AbortController cuando cambian las `deps` o el componente se
 * desmonta, para que una respuesta vieja nunca sobreescriba una más nueva
 * (ej. el usuario cambia de filtro rápido en una lista paginada).
 */
export function useApiQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
): UseApiQueryResult<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  // Siempre la última closure, sin forzar al caller a memoizar el fetcher
  // para poder listarlo en `deps` — `deps` ya la controla el caller.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((err) => {
        if (controller.signal.aborted) return; // cancelado por nosotros — no es un error real
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, refetch };
}
