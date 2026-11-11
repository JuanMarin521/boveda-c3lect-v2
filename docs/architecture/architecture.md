# Arquitectura de Bóveda C3LECT

> **Estado:** vista lógica actual verificada por el código; despliegue actual reportado/configurado; vista AWS propuesta. **Fecha de evidencia:** 2026-11-11.

## Propósito y dominio

Bóveda C3LECT es la tienda web de C3LECT para una curaduría digital de relojería, perfumería y accesorios. La experiencia pública permite descubrir productos, consultar disponibilidad y precio, revisar información específica de relojes o perfumes, añadir piezas al carrito y completar un pedido. La superficie autenticada agrega cuenta, direcciones, historial de pedidos y reseñas. El equipo administrador dispone de un panel separado para gestionar catálogo, pedidos, clientes, inventario, ventas, compras, gastos, precios, promociones, reseñas y auditoría.

La descripción anterior está sustentada por `README.md`, las rutas de `src/app/routes.tsx`, las pantallas en `src/app/pages/` y `src/app/admin/pages/`. La operación del backend se documenta desde los contratos HTTP del frontend; el repositorio de la API no forma parte del workspace inspeccionado.

## Alcance y evidencia

### Fuentes inspeccionadas

- `README.md`: propósito, funcionalidades, stack y despliegue declarados. Estado: **documentado**, con despliegue no verificado desde este workspace.
- `package.json`, `vite.config.ts`, `tsconfig.json`: framework, build, dependencias y reglas de compilación. Estado: **verificado/configurado**.
- `src/main.tsx`, `src/app/App.tsx`, `src/app/routes.tsx`: entrada, composición de providers y rutas. Estado: **verificado**.
- `src/app/pages/`, `src/app/components/`, `src/app/context/`, `src/app/hooks/`: journeys y comportamiento de la UI. Estado: **verificado por implementación**.
- `src/app/data/products.ts`, `src/app/data/resenas.ts`, `src/app/supabase.ts`: lectura de vistas públicas de Supabase. Estado: **verificado por implementación**.
- `src/app/api/`, `src/app/lib/checkout.ts`: contratos del C3LECT API, autenticación, pedidos, pagos, reseñas y administración. Estado: **verificado como cliente HTTP**, backend externo no inspeccionado.
- `public/_headers`, `public/_redirects`, `public/sitemap.xml`: políticas de entrega y navegación SPA configuradas. Estado: **configurado**.
- `docs/screenshots/desktop.png`, `producto.png`, `movil.png`: evidencia visual entregada por el proyecto. Estado: **verificado como artefacto**, sin prueba de fecha de captura.
- `scripts/check-architecture.mjs`: reglas de aislamiento del cliente HTTP y de las lecturas públicas. Estado: **verificado**.

### Límites de certeza

- No se ejecutó la aplicación ni se hizo una prueba contra servicios externos durante esta documentación.
- El README declara Cloudflare Pages, Render y Supabase; se presenta como despliegue actual **reportado/configurado**, no como observación de infraestructura en vivo.
- El repositorio de `c3lect-api` se enlaza desde el README, pero está fuera del workspace y no fue inspeccionado. Sus persistencia, webhooks, migraciones y controles de servidor se describen solo hasta donde los contratos del frontend y la documentación local lo permiten.
- No se encontró `archify/SKILL.md`; por eso no se generan artefactos Archify.

## Contexto del sistema

| Actor o sistema | Interacción | Estado |
|---|---|---|
| Comprador web | Explora colecciones, filtra productos, consulta ficha, usa carrito y checkout. | Verificado: `routes.tsx`, `Home.tsx`, `Catalog.tsx`, `ProductDetail.tsx`, `Checkout.tsx`. |
| Cliente autenticado | Consulta pedidos, perfil y direcciones; puede dejar reseñas de compras recibidas. | Verificado: `AuthContext.tsx`, `AccountOrders.tsx`, `api/account.ts`, `api/resenas.ts`. |
| Administrador | Gestiona catálogo y operaciones comerciales desde `/admin`. | Verificado: `AdminRoute.tsx`, `AdminLayout.tsx`, `admin/pages/`. |
| Supabase | Expone las vistas `catalogo_publico` y `resenas_publicas` consumidas directamente por el frontend. | Verificado/configurado: `data/products.ts`, `data/resenas.ts`, `scripts/check-architecture.mjs`. |
| C3LECT API | Atiende autenticación, cuenta, pedidos, pagos, reseñas y operaciones administrativas. | Verificado como contrato HTTP del cliente; servidor externo no inspeccionado. |
| Mercado Pago | Recibe el flujo de pago en línea; el checkout obtiene una URL desde el API. | Verificado como integración invocada en `api/payments.ts` y `lib/checkout.ts`. |
| WhatsApp | Recibe enlaces/mensajes de consulta o pedido desde producto y carrito. | Verificado en `config.ts`, `ProductDetail.tsx` y `CartDrawer.tsx`. |
| Meta Pixel / Conversions API | Seguimiento de rutas y eventos de conversión; la recepción server-side depende del backend. | Parcialmente verificado: `lib/metaPixel.ts`, `lib/checkout.ts`; destino server-side no inspeccionado. |

## Componentes y responsabilidades

| Componente | Responsabilidad | Evidencia / estado |
|---|---|---|
| React SPA | Renderiza la experiencia pública y la consola `/admin`, monta providers y maneja la navegación. | Verificado: `src/main.tsx`, `src/app/App.tsx`, `src/app/routes.tsx`. |
| Enrutamiento y shell | Define rutas públicas, cuenta, checkout y panel; comparte navegación, footer, banner offline y drawer de carrito. | Verificado: `routes.tsx`, `components/Root.tsx`. |
| Catálogo y reseñas públicas | Lee y mapea vistas públicas de Supabase hacia modelos de UI. | Verificado: `data/products.ts`, `data/resenas.ts`. |
| Estado de sesión | Persiste tokens en `sessionStorage`, valida `/auth/me`, renueva tokens ante `401` y protege rutas admin. | Verificado: `context/AuthContext.tsx`, `api/client.ts`, `components/AdminRoute.tsx`. |
| Carrito | Mantiene items, cantidades limitadas por stock, total y persistencia local en `localStorage`. | Verificado: `context/CartContext.tsx`, `components/CartDrawer.tsx`. |
| Cliente HTTP por módulos | Centraliza Axios, `Authorization` y refresh token; expone contratos por bounded context. | Verificado: `api/client.ts`, `api/*.ts`, `api/README.md`. |
| Checkout | Orquesta contraentrega o creación de preferencia Mercado Pago, tracking y confirmación. | Verificado: `lib/checkout.ts`, `pages/Checkout.tsx`. |
| Administración | Presenta dashboard, catálogo, pedidos, clientes, inventario y finanzas usando contratos del API. | Verificado: `admin/AdminLayout.tsx`, `admin/pages/`, `api/metrics.ts` y módulos relacionados. |
| API C3LECT | Backend de autenticación, pedidos, pagos, reseñas y operación. | Contrato verificado en `src/app/api/`; implementación externa no inspeccionada. |
| PostgreSQL / datos de negocio | Persistencia declarada para el API; la tecnología y migraciones se documentan en README, pero están fuera del workspace. | Documentado, no verificado en este repositorio. |

## Diagramas

- [Diagrama lógico Mermaid](component-diagram.mmd)
- [Diagrama lógico editable Draw.io](component-diagram.drawio)
- [Despliegue actual reportado/configurado](current-deployment.drawio)
- [Objetivo AWS propuesto](aws-infrastructure.drawio)

El diagrama Mermaid y el Draw.io lógico representan los mismos componentes y relaciones. Los dos Draw.io de despliegue son deliberadamente distintos: uno representa el hosting declarado actualmente y el otro una opción AWS propuesta, no una migración aprobada.

## Interacciones y rutas principales

### Consulta de catálogo

1. El navegador entra a una ruta pública de la SPA.
2. `ProductosProvider` llama `getProductos()`.
3. `data/products.ts` consulta la vista `catalogo_publico` de Supabase y mapea productos, stock, precio final, especificaciones y notas olfativas.
4. `Catalog`, `ProductDetail` y la navegación de búsqueda presentan el resultado.

La lectura pública evita pasar por el C3LECT API. `scripts/check-architecture.mjs` limita el cliente Supabase a `src/app/data/` y a las vistas públicas declaradas.

### Pedido

1. El comprador agrega productos al carrito; el reducer limita la cantidad al stock conocido.
2. `Checkout` recopila datos de envío y método de pago.
3. Contraentrega: `ordersApi.crear()` llama `POST /orders` y muestra confirmación.
4. Mercado Pago: `paymentsApi.crearPendiente()` llama `POST /payments/create-pending`; la SPA redirige a la URL de checkout y retorna a las rutas de resultado.
5. El comportamiento definitivo de webhook, creación confirmada del pedido y notificación server-side queda fuera del repositorio inspeccionado.

### Sesión y administración

`AuthContext` usa `authApi` para login, OTP, registro, recuperación y `/auth/me`. `api/client.ts` añade el bearer token, intenta renovar tokens ante `401` y redirige al login si no puede recuperar la sesión. `AdminRoute` exige usuario autenticado con rol `ADMIN` antes de montar el panel.

## Datos e integraciones

| Flujo | Origen | Destino | Datos observables | Certeza |
|---|---|---|---|---|
| Catálogo público | SPA | Supabase `catalogo_publico` | Producto, imágenes, disponibilidad, stock, precio, especificaciones, notas y descuentos. | Verificado en `data/products.ts`. |
| Reseñas públicas | SPA | Supabase `resenas_publicas` | Autor público, calificación, título, comentario, respuesta y fechas. | Verificado en `data/resenas.ts`. |
| Escritura de reseñas | SPA autenticada | C3LECT API | Producto, calificación, título, comentario; moderación y respuesta desde admin. | Verificado como contrato en `api/resenas.ts`. |
| Cuenta y pedidos | SPA autenticada | C3LECT API | Perfil, direcciones, pedidos, estados e historial. | Verificado como contrato en `api/account.ts`, `api/orders.ts`. |
| Pago | SPA | C3LECT API → Mercado Pago | Items, envío, cookies de atribución y URL de checkout. | Verificado en `api/payments.ts`, `lib/checkout.ts`; webhook no inspeccionado. |
| Contacto comercial | SPA | WhatsApp | Mensaje prellenado desde producto o carrito. | Verificado en `config.ts`, `CartDrawer.tsx`, `ProductDetail.tsx`. |
| Carrito local | Navegador | `localStorage` | Items y cantidades bajo la clave `c3lect-cart`. | Verificado en `CartContext.tsx`. |

No se afirma aquí un esquema completo de base de datos, transacciones, retención, backups o consistencia del backend porque no forman parte del workspace.

## Stack observado

| Capa | Tecnología | Uso observado |
|---|---|---|
| UI | React 18 + TypeScript | Componentes, páginas, providers y consola. |
| Build | Vite 6 + plugin React | Desarrollo, build y particionado manual de chunks. |
| Estilos | Tailwind CSS 4 + CSS variables | Layout, responsive, tema negro/dorado y tipografías locales. |
| Navegación | React Router 7 | Rutas públicas, cuenta, checkout y admin; lazy loading de páginas. |
| Motion | Motion | Transiciones de rutas, drawer, cards y estados de UI. |
| Datos | Supabase JS + Axios | Catálogo/reseñas públicas y contratos HTTP del API. |
| Visualización | Recharts | Gráficas del dashboard administrativo. |
| Iconografía | Lucide React | Navegación, estados y acciones. |
| Entrega | Cloudflare Pages (README) | Hosting reportado para el frontend; no verificado en ejecución. |

## Seguridad y operación

### Controles observables

- El rol admin se valida en `AdminRoute` antes de mostrar la consola.
- El token de acceso se envía como `Bearer` y se intenta renovar con refresh token en `api/client.ts`.
- `public/_headers` configura CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` y restricciones de conexión.
- `public/_redirects` mantiene las rutas de la SPA en hosting estático.
- La regla de arquitectura limita el cliente Supabase a vistas públicas y evita importaciones directas de Axios fuera de `api/client.ts`.

### Evidencia faltante

No se verifican desde este repositorio las políticas RLS de Supabase, las validaciones del backend, la gestión de secretos en proveedores, el control de webhooks, el monitoreo, backups, objetivos de disponibilidad ni el plan de recuperación.

## Despliegue

### Actual: reportado/configurado

El README declara frontend en Cloudflare Pages, API en Render y PostgreSQL en Supabase. `public/_headers`, `public/_redirects` y las URLs permitidas en CSP son evidencia de configuración de entrega, no prueba de que los servicios estén activos en este momento. La vista editable está en [current-deployment.drawio](current-deployment.drawio).

### AWS: propuesta

Como no se indicó un proveedor objetivo, se incluye [aws-infrastructure.drawio](aws-infrastructure.drawio) como propuesta separada. Muestra CloudFront + S3 para la SPA y API Gateway + ECS como posible borde/runtime, con la persistencia e integraciones actuales fuera de AWS hasta que exista una decisión de migración. Todas las fronteras AWS están marcadas `PROPOSED`; región, cuenta, VPC, subredes y placement son `TBD`.

## Inventario de iconos

### AWS propuesto

| Etiqueta | Icono / stencil | Fuente y estado |
|---|---|---|
| Amazon CloudFront | `mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudfront` | Identificador listado en `references/aws4-icons.md`; validación estática de markup ejecutada. Inspección visual en diagrams.net no ejecutada. |
| Amazon S3 | `mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3` | Identificador listado en `references/aws4-icons.md`; validación estática de markup ejecutada. Inspección visual no ejecutada. |
| Amazon API Gateway | `mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway` | Identificador listado en `references/aws4-icons.md`; validación estática de markup ejecutada. Inspección visual no ejecutada. |
| Amazon ECS | `mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ecs` | Identificador listado en `references/aws4-icons.md`; validación estática de markup ejecutada. Inspección visual no ejecutada. |

Las cajas `Supabase`, `Mercado Pago` y `WhatsApp` de la vista actual/propuesta usan tarjetas editables con texto, no logotipos remotos. Se eligió ese fallback porque no se inspeccionó un catálogo portable de iconos de esos proveedores externos y un logo inventado sería menos trazable.

## Decisiones y vacíos

- El frontend separa lecturas públicas de catálogo/reseñas y operaciones transaccionales del API. **Verificado.**
- Los contratos HTTP están encapsulados en `src/app/api/`, con una regla automatizada que evita accesos dispersos. **Verificado.**
- El despliegue actual y la propuesta AWS se mantienen separados para no convertir una recomendación en evidencia de producción. **Decisión documental.**
- Pendiente: inspeccionar el repositorio de `c3lect-api` para confirmar persistencia, webhook de Mercado Pago, políticas de autorización, migraciones y operación.
- Pendiente: comprobar el despliegue real con una prueba de runtime autorizada y confirmar que las capturas representan la versión vigente.
- Pendiente: confirmar destino de Meta Conversions API, políticas RLS y manejo de secretos.

## Validación realizada

- XML, IDs y referencias de aristas: validado manualmente con el parser XML de PowerShell sobre los tres archivos Draw.io; los tres parsean, no tienen IDs duplicados y sus aristas apuntan a celdas existentes.
- `check_drawio.py` y `--require-provider-icons aws`: bloqueados porque no hay un intérprete Python instalado en el entorno.
- Mermaid: revisado por correspondencia manual de nodos y relaciones con el Draw.io lógico.
- Revisión visual Draw.io: no ejecutada; no se lanzó diagrams.net ni se generó preview.
- Blueprint y presentación: revisados por estructura, navegación, responsive CSS, `prefers-reduced-motion`, enlaces locales y límites de contenido; la inspección en navegador depende de abrir los archivos localmente.

