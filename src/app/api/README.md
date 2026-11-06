# `src/app/api/` — acceso a la API de c3lect-api

Un archivo por bounded context del backend (`orders.ts` ↔ `modules/orders`,
`ventas.ts` ↔ `modules/ventas`…). Cada uno define **una sola vez** los tipos de
lo que ese contexto devuelve y las funciones para llamarlo.

Reglas (las verifica `scripts/check-architecture.mjs`, que corre en `pnpm typecheck`):

- `client.ts` (axios + renovación del token) solo se importa desde esta carpeta.
  Páginas, componentes y contextos llaman a las funciones de los módulos, nunca
  a axios directamente.
- Los tipos de respuesta se importan de aquí; no se redeclaran en las páginas.
- Aquí no hay reglas del negocio ni presentación (etiquetas, colores): solo el
  contrato HTTP.

El catálogo y las reseñas publicadas no pasan por aquí: se leen de las vistas
`catalogo_publico` y `resenas_publicas` de Supabase (ver `data/`). Escribir o
moderar una reseña sí pasa por la API (`resenas.ts`).
