export interface PaginaMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginado<T> {
  data: T[];
  meta: PaginaMeta;
}

/** Parámetros de query: los vacíos no se envían. */
export function params(
  values: Record<string, string | number | boolean | undefined | null>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)]),
  );
}
