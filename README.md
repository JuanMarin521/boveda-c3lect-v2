# Bóveda C3LECT

Catálogo digital de alta relojería y perfumería de autor. Desarrollado para [C3LECT](https://instagram.com/c3lect.co) — Medellín, Colombia.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Estilos | Tailwind CSS 4 |
| Enrutamiento | React Router 7 |
| Componentes UI | Radix UI + shadcn/ui |
| Animaciones | Motion (Framer Motion) |
| Iconos | Lucide React |
| Deploy | GitHub Pages |

---

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

El servidor de desarrollo corre en `http://localhost:5173`.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── config.ts          # Configuración global (WhatsApp, Instagram, textos)
│   ├── routes.tsx          # Definición de rutas
│   ├── data/
│   │   └── products.ts     # Catálogo completo de productos
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Catalog.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   └── components/
│       ├── Navigation.tsx
│       ├── Footer.tsx
│       └── Root.tsx
public/
└── images/
    ├── relojes/            # Fotografías de relojes
    └── perfumes/           # Fotografías de perfumes
```

---

## Gestión del catálogo

Todo el catálogo vive en [`src/app/data/products.ts`](src/app/data/products.ts). Para añadir un producto nuevo, copia un bloque existente y edita los campos:

```ts
{
  id: "r-modelo-variante",          // Identificador único
  nombre: "Marca Modelo",
  estilo: "Color o variante",
  display: "Marca Modelo — Variante",
  precio: "$149.000",
  disponible: true,                 // false = muestra badge "Agotado"
  cat: "reloj",                     // "reloj" | "perfume"
  imgs: [
    "images/relojes/foto-1.jpg",    // Rutas relativas desde public/
    "images/relojes/foto-2.jpg",
  ],
}
```

> Las imágenes van en `public/images/relojes/` o `public/images/perfumes/`. Las rutas **no** llevan barra inicial.

---

## Configuración global

En [`src/app/config.ts`](src/app/config.ts) se centralizan los datos de contacto y textos del sitio:

```ts
export const CONFIG = {
  whatsapp: "573178598407",
  instagram: "https://instagram.com/c3lect.co",
  ciudad: "Medellín, Colombia",
  tagline: "...",
  quote: "...",
}
```

Un cambio aquí se propaga automáticamente a todos los componentes.

---

## Rutas

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/catalog` | Catálogo completo |
| `/catalog/watches` | Solo relojes |
| `/catalog/perfumes` | Solo perfumes |
| `/product/:id` | Detalle de producto |
| `/about` | Manifiesto |
| `/contact` | Contacto |

---

## Deploy en GitHub Pages

El sitio se publica en `cetremore26.github.io/boveda-c3lect-v2`.

### Configuración aplicada

- **`vite.config.ts`** — `base: '/boveda-c3lect-v2/'` para que los assets resuelvan correctamente desde el subdirectorio.
- **`routes.tsx`** — `basename: '/boveda-c3lect-v2'` para que React Router ignore el prefijo del repositorio.
- **`public/404.html`** — Captura rutas directas (ej. `/catalog`) y redirige al SPA conservando la URL. Necesario porque GitHub Pages no soporta rutas dinámicas de React Router de forma nativa.

### Pasos para publicar

```bash
npm run build
# Subir el contenido de dist/ a la rama gh-pages
```

---

## Contacto

**Instagram:** [@c3lect.co](https://instagram.com/c3lect.co)  
**WhatsApp:** +57 317 859 8407  
**Ciudad:** Medellín, Colombia
