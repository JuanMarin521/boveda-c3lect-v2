// ============================================================
// CATÁLOGO DE PRODUCTOS C3LECT
//
// PARA AÑADIR UN PRODUCTO:
//   1. Copia un bloque completo (entre llaves { ... })
//   2. Pégalo al final de la lista correspondiente (relojes o perfumes)
//   3. Cambia id, nombre, estilo, precio, disponible e imgs
//
// PARA CAMBIAR PRECIO:      modifica el campo "precio"
// PARA MARCAR AGOTADO:      cambia "disponible" a false
// PARA CAMBIAR FOTOS:       reemplaza las rutas en "imgs"
//
// Imágenes en:  public/images/relojes/   y   public/images/perfumes/
// ============================================================

// ─── INTERFAZ ───────────────────────────────────────────────

export interface NotasPerfume {
  descripcion: string;
  notas_top: string;
  notas_corazon: string;
  notas_base: string;
}

export interface Producto {
  id: string;
  nombre: string;       // Nombre del modelo, ej: "Curren 8467"
  estilo: string;       // Color o variante, ej: "Negro"
  display: string;      // Nombre completo para mostrar, ej: "Curren 8467 — Negro"
  precio: string;       // Precio formateado, ej: "$149.000"
  disponible: boolean;  // true = disponible | false = agotado
  cat: 'reloj' | 'perfume';
  imgs: string[];       // Rutas desde public/, ej: ["/images/relojes/..."]
  notas?: NotasPerfume; // Solo para perfumes
}

// ─── HELPERS ────────────────────────────────────────────────

export function getProductoById(id: string): Producto | undefined {
  return productos.find((p) => p.id === id);
}

export function getProductosPorCategoria(cat: 'reloj' | 'perfume'): Producto[] {
  return productos.filter((p) => p.cat === cat);
}

// ─── CATÁLOGO ───────────────────────────────────────────────

export const productos: Producto[] = [

  // ============================================================
  // SECCIÓN: RELOJES — Máquinas y Joyas
  // ============================================================

  {
    id: "r-skeleton-negro",
    nombre: "Skeleton Kosmo 644-6",
    estilo: "Negro",
    display: "Skeleton Kosmo 644-6 — Negro",
    precio: "$550.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/skeleton-kosmo-644-6-negro-1.jpg",
      "/images/relojes/skeleton-kosmo-644-6-negro-2.jpg",
      "/images/relojes/skeleton-kosmo-644-6-negro-3.jpg",
    ],
  },
  {
    id: "r-skeleton-plateado",
    nombre: "Skeleton Kosmo 644-6",
    estilo: "Plateado",
    display: "Skeleton Kosmo 644-6 — Plateado",
    precio: "$550.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/skeleton-kosmo-644-6-plateado-1.jpg",
    ],
  },
  {
    id: "r-8329-azul-bronce",
    nombre: "Curren 8329 (Metálico)",
    estilo: "Azul Bronce",
    display: "Curren 8329 (Metálico) — Azul Bronce",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8329-metalico-azul-bronce-1.jpg",
      "/images/relojes/curren-8329-metalico-azul-bronce-2.jpg",
      "/images/relojes/curren-8329-metalico-azul-bronce-3.jpg",
    ],
  },
  {
    id: "r-8291-cafe",
    nombre: "Curren 8291 (Deportivo)",
    estilo: "Café",
    display: "Curren 8291 (Deportivo) — Café",
    precio: "$159.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8291-deportivo-cafe-1.jpg",
      "/images/relojes/curren-8291-deportivo-cafe-2.jpg",
      "/images/relojes/curren-8291-deportivo-cafe-3.jpg",
    ],
  },
  {
    id: "r-8291-azul",
    nombre: "Curren 8291 (Deportivo)",
    estilo: "Azul",
    display: "Curren 8291 (Deportivo) — Azul",
    precio: "$159.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8291-deportivo-azul-1.jpg",
      "/images/relojes/curren-8291-deportivo-azul-2.jpg",
      "/images/relojes/curren-8291-deportivo-azul-3.jpg",
    ],
  },
  {
    id: "r-8291-azul-bronce",
    nombre: "Curren 8291 (Deportivo)",
    estilo: "Azul Bronce",
    display: "Curren 8291 (Deportivo) — Azul Bronce",
    precio: "$159.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8291-deportivo-azul-bronce-1.jpg",
      "/images/relojes/curren-8291-deportivo-azul-bronce-2.jpg",
      "/images/relojes/curren-8291-deportivo-azul-bronce-3.jpg",
    ],
  },
  {
    id: "r-8329-black-gold",
    nombre: "Curren 8329 (Metálico)",
    estilo: "Black & Gold",
    display: "Curren 8329 (Metálico) — Black & Gold",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8329-metalico-black-y-gold-1.jpg",
      "/images/relojes/curren-8329-metalico-black-y-gold-2.jpg",
      "/images/relojes/curren-8329-metalico-black-y-gold-3.jpg",
    ],
  },
  {
    id: "r-8329-cafe",
    nombre: "Curren 8329 (Metálico)",
    estilo: "Café",
    display: "Curren 8329 (Metálico) — Café",
    precio: "$169.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8329-metalico-cafe-1.jpg",
      "/images/relojes/curren-8329-metalico-cafe-2.jpg",
      "/images/relojes/curren-8329-metalico-cafe-3.jpg",
    ],
  },
  {
    id: "r-8291-negro-rojo",
    nombre: "Curren 8291 (Deportivo)",
    estilo: "Negro Rojo",
    display: "Curren 8291 (Deportivo) — Negro Rojo",
    precio: "$159.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8291-deportivo-negro-rojo-1.jpg",
      "/images/relojes/curren-8291-deportivo-negro-rojo-2.jpg",
      "/images/relojes/curren-8291-deportivo-negro-rojo-3.jpg",
    ],
  },
  {
    id: "r-8365-black-silver",
    nombre: "Curren 8365 (Elegante)",
    estilo: "Black Silver",
    display: "Curren 8365 (Elegante) — Black Silver",
    precio: "$139.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8365-elegante-black-silver-1.jpg",
    ],
  },

  {
    id: "r-8365-black-gold",
    nombre: "Curren 8365 (Elegante)",
    estilo: "Black Gold",
    display: "Curren 8365 (Elegante) — Black Gold",
    precio: "$139.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8365-elegante-black-gold-1.jpeg",
      "/images/relojes/curren-8365-elegante-black-gold-2.jpeg",
    ],
  },

  {
    id: "r-8411-verde",
    nombre: "Curren 8411",
    estilo: "Verde",
    display: "Curren 8411 — Verde",
    precio: "$149.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8411-verde-1.jpg",
      "/images/relojes/curren-8411-verde-2.jpg",
      "/images/relojes/curren-8411-verde-3.jpg",
      "/images/relojes/curren-8411-verde-4.jpg",
    ],
  },
  {
    id: "r-8457-silver-black",
    nombre: "Curren 8457 (Cuadrado)",
    estilo: "Silver Black",
    display: "Curren 8457 (Cuadrado) — Silver Black",
    precio: "$129.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8457-cuadrado-silver-black-1.jpg",
      "/images/relojes/curren-8457-cuadrado-silver-black-2.jpg",
      "/images/relojes/curren-8457-cuadrado-silver-black-3.jpg",
      "/images/relojes/curren-8457-cuadrado-silver-black-4.jpg",
    ],
  },
  {
    id: "r-8467-negro",
    nombre: "Curren 8467",
    estilo: "Negro",
    display: "Curren 8467 — Negro",
    precio: "$149.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8467-negro-1.jpg",
      "/images/relojes/curren-8467-negro-2.jpg",
      "/images/relojes/curren-8467-negro-3.jpg",
      "/images/relojes/curren-8467-negro-4.jpg",
      "/images/relojes/curren-8467-negro-5.jpg",
    ],
  },
  {
    id: "r-8488-blue-gold",
    nombre: "Curren 8488 (Rectangular)",
    estilo: "Blue Gold",
    display: "Curren 8488 (Rectangular) — Blue Gold",
    precio: "$169.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8488-rectangular-blue-gold-1.jpg",
      "/images/relojes/curren-8488-rectangular-blue-gold-2.jpg",
      "/images/relojes/curren-8488-rectangular-blue-gold-3.jpg",
      "/images/relojes/curren-8488-rectangular-blue-gold-4.jpg",
    ],
  },
  {
    id: "r-8488-negro",
    nombre: "Curren 8488 (Rectangular)",
    estilo: "Negro",
    display: "Curren 8488 (Rectangular) — Negro",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8488-rectangular-negro-1.jpg",
      "/images/relojes/curren-8488-rectangular-negro-2.jpg",
      "/images/relojes/curren-8488-rectangular-negro-3.jpg",
    ],
  },
  {
    id: "r-8225-cafe",
    nombre: "Curren 8225",
    estilo: "Café",
    display: "Curren 8225 — Café",
    precio: "$159.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-8225-cafe-1.jpg",
      "/images/relojes/curren-8225-cafe-2.jpg",
      "/images/relojes/curren-8225-cafe-3.jpg",
      "/images/relojes/curren-8225-cafe-4.jpg",
    ],
  },
  {
    id: "r-9015-negro-cobre",
    nombre: "Curren 9015 (Dama)",
    estilo: "Negro Cobre",
    display: "Curren 9015 (Dama) — Negro Cobre",
    precio: "$129.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-9015-dama-negro-cobre-1.jpg",
      "/images/relojes/curren-9015-dama-negro-cobre-2.jpg",
      "/images/relojes/curren-9015-dama-negro-cobre-3.jpg",
    ],
  },
  {
    id: "r-9093-dorado",
    nombre: "Curren 9093 (Dama)",
    estilo: "Dorado",
    display: "Curren 9093 (Dama) — Dorado",
    precio: "$109.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-9093-dama-dorado-1.jpg",
      "/images/relojes/curren-9093-dama-dorado-2.jpg",
      "/images/relojes/curren-9093-dama-dorado-3.jpg",
      "/images/relojes/curren-9093-dama-dorado-4.jpg",
      "/images/relojes/curren-9093-dama-dorado-5.jpg",
    ],
  },
  {
    id: "r-9094-silver",
    nombre: "Curren 9094 (Dama)",
    estilo: "Silver",
    display: "Curren 9094 (Dama) — Silver",
    precio: "$119.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-9094-dama-silver-1.jpg",
      "/images/relojes/curren-9094-dama-silver-2.jpg",
      "/images/relojes/curren-9094-dama-silver-3.jpg",
    ],
  },
  {
    id: "r-9094-silver-green",
    nombre: "Curren 9094 (Dama)",
    estilo: "Silver Green",
    display: "Curren 9094 (Dama) — Silver Green",
    precio: "$129.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/curren-9094-dama-silver-green-1.jpg",
    ],
  },
  {
    id: "r-naviforce-gris",
    nombre: "Naviforce NF7105",
    estilo: "Gris",
    display: "Naviforce NF7105 — Gris",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/naviforce-nf7105-gris-1.jpg",
      "/images/relojes/naviforce-nf7105-gris-2.jpg",
      "/images/relojes/naviforce-nf7105-gris-3.jpg",
    ],
  },
  {
    id: "r-geneva-cuadrado-oro",
    nombre: "Geneva (Set Dama)",
    estilo: "Cuadrado Oro",
    display: "Geneva (Set Dama) — Cuadrado Oro",
    precio: "$129.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/geneva-set-dama-cuadrado-oro-1.jpg",
      "/images/relojes/geneva-set-dama-cuadrado-oro-2.jpg",
      "/images/relojes/geneva-set-dama-cuadrado-oro-3.jpg",
    ],
  },
  {
    id: "r-geneva-cuadrado-plata",
    nombre: "Geneva (Set Dama)",
    estilo: "Cuadrado Plata",
    display: "Geneva (Set Dama) — Cuadrado Plata",
    precio: "$129.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/geneva-set-dama-cuadrado-plata-1.jpg",
      "/images/relojes/geneva-set-dama-cuadrado-plata-2.jpg",
      "/images/relojes/geneva-set-dama-cuadrado-plata-3.jpg",
    ],
  },
  {
    id: "r-geneva-rectangular-plata",
    nombre: "Geneva (Set Dama)",
    estilo: "Rectangular Plata",
    display: "Geneva (Set Dama) — Rectangular Plata",
    precio: "$129.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/geneva-set-dama-rectangular-plata-1.jpg",
      "/images/relojes/geneva-set-dama-rectangular-plata-2.jpg",
      "/images/relojes/geneva-set-dama-rectangular-plata-3.jpg",
    ],
  },
  {
    id: "r-poedagar-793-silver-white",
    nombre: "Poedagar 793 (Cuadrado)",
    estilo: "Silver White",
    display: "Poedagar 793 (Cuadrado) — Silver White",
    precio: "$119.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/poedagar-793-cuadrado-silver-white-1.jpg",
      "/images/relojes/poedagar-793-cuadrado-silver-white-2.jpg",
      "/images/relojes/poedagar-793-cuadrado-silver-white-3.jpg",
      "/images/relojes/poedagar-793-cuadrado-silver-white-4.jpg",
    ],
  },
  {
    id: "r-poedagar-826-silver-blue",
    nombre: "Poedagar 826",
    estilo: "Silver Blue",
    display: "Poedagar 826 — Silver Blue",
    precio: "$129.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/poedagar-826-silver-blue-1.jpg",
      "/images/relojes/poedagar-826-silver-blue-2.jpg",
    ],
  },
  {
    id: "r-casio-f91-plata",
    nombre: "Casio F-91WM-3",
    estilo: "Plata",
    display: "Casio F-91WM-3 — Plata",
    precio: "$129.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/casio-f-91wm-3-plata-1.jpg",
      "/images/relojes/casio-f-91wm-3-plata-2.jpg",
      "/images/relojes/casio-f-91wm-3-plata-3.jpg",
    ],
  },
  {
    id: "r-casio-f91a-verde",
    nombre: "Casio F-91WM-3A",
    estilo: "Verde",
    display: "Casio F-91WM-3A — Verde",
    precio: "$139.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/casio-f-91wm-3a-verde-1.jpg",
      "/images/relojes/casio-f-91wm-3a-verde-2.jpg",
      "/images/relojes/casio-f-91wm-3a-verde-3.jpg",
    ],
  },
  {
    id: "r-casio-ltp-rose-gold",
    nombre: "Casio LTP-V007D-4E (Dama)",
    estilo: "Rose Gold",
    display: "Casio LTP-V007D-4E (Dama) — Rose Gold",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "/images/relojes/casio-ltp-v007d-4e-dama-rose-gold-1.jpg",
      "/images/relojes/casio-ltp-v007d-4e-dama-rose-gold-2.jpg",
      "/images/relojes/casio-ltp-v007d-4e-dama-rose-gold-3.jpg",
    ],
  },
  {
    id: "r-casio-mq-negro",
    nombre: "Casio MQ-24-7B (Clásico)",
    estilo: "Negro",
    display: "Casio MQ-24-7B (Clásico) — Negro",
    precio: "$115.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "/images/relojes/casio-mq-24-7b-clasico-negro-1.jpg",
      "/images/relojes/casio-mq-24-7b-clasico-negro-2.jpg",
    ],
  },

  // ============================================================
  // SECCIÓN: PERFUMES — Firmas y Elixires
  // ============================================================

  {
    id: "p-lattafa-al-qiam-gold",
    nombre: "Lattafa Al Qiam Gold",
    estilo: "",
    display: "Lattafa Al Qiam Gold",
    precio: "$260.000",
    disponible: false,
    cat: "perfume",
    imgs: [
      "/images/perfumes/lattafa-al-qiam-gold-1.jpg",
      "/images/perfumes/lattafa-al-qiam-gold-2.jpg",
      "/images/perfumes/lattafa-al-qiam-gold-3.jpg",
      "/images/perfumes/lattafa-al-qiam-gold-4.jpg",
    ],
    notas: {
      descripcion: "Una fragancia oriental de lujo que abre con azafrán y frambuesa. El corazón revela cuero y pachulí, mientras la base funde oud, ámbar dorado y vetiver en un sillage intenso y perdurable.",
      notas_top: "Azafrán · Frambuesa",
      notas_corazon: "Cuero · Pachulí",
      notas_base: "Oud · Ámbar · Vetiver · Benzoin",
    },
  },
  {
    id: "p-afnan-rebel-roja",
    nombre: "Afnan 9 PM REBEL",
    estilo: "Roja",
    display: "Afnan 9 PM REBEL — Roja",
    precio: "$270.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/afnan-9-pm-rebel-roja-1.jpg",
      "/images/perfumes/afnan-9-pm-rebel-roja-2.jpg",
      "/images/perfumes/afnan-9-pm-rebel-roja-3.jpg",
      "/images/perfumes/afnan-9-pm-rebel-roja-4.jpg",
    ],
    notas: {
      descripcion: "Una fragancia frutal y audaz que irrumpe con piña jugosa, manzana verde y mandarina. El corazón se vuelve cálido con cedro y vainilla, cerrando con un sillage de caramelo, ámbar y musgo.",
      notas_top: "Piña · Manzana Verde · Mandarina",
      notas_corazon: "Cedro · Vainilla · Musgo de Roble",
      notas_base: "Caramelo · Ambergris · Almizcle · Maderas Secas",
    },
  },
  {
    id: "p-afnan-9pm-negra",
    nombre: "Afnan 9 PM",
    estilo: "Negra",
    display: "Afnan 9 PM — Negra",
    precio: "$250.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/afnan-9-pm-negra-1.jpg",
      "/images/perfumes/afnan-9-pm-negra-2.jpg",
      "/images/perfumes/afnan-9-pm-negra-3.jpg",
      "/images/perfumes/afnan-9-pm-negra-4.jpg",
    ],
    notas: {
      descripcion: "Una fragancia oriental y sensual pensada para la noche. Abre con manzana, canela y lavanda; florece en azahar y lirio del valle, y reposa en una base cálida de vainilla, tonka y ámbar.",
      notas_top: "Manzana · Canela · Lavanda",
      notas_corazon: "Azahar · Lirio del Valle",
      notas_base: "Vainilla · Tonka · Ámbar · Pachulí",
    },
  },
  {
    id: "p-lattafa-amethyst",
    nombre: "Lattafa Amethyst",
    estilo: "",
    display: "Lattafa Amethyst",
    precio: "$240.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/lattafa-amethyst-1.jpg",
      "/images/perfumes/lattafa-amethyst-2.jpg",
      "/images/perfumes/lattafa-amethyst-3.jpg",
      "/images/perfumes/lattafa-amethyst-4.jpg",
    ],
    notas: {
      descripcion: "Una fragancia ámbar y floral de carácter íntimo. Abre con pimienta rosa y bergamota, despliega un corazón de rosas turcas y jazmín, y concluye con oud, ámbar y vainilla.",
      notas_top: "Pimienta Rosa · Bergamota",
      notas_corazon: "Rosa Turca · Rosa Bulgaria · Jazmín",
      notas_base: "Oud · Ámbar · Vainilla",
    },
  },
  {
    id: "p-lattafa-sublime",
    nombre: "Lattafa Sublime",
    estilo: "",
    display: "Lattafa Sublime",
    precio: "$240.000",
    disponible: false,
    cat: "perfume",
    imgs: [
      "/images/perfumes/lattafa-sublime-1.jpg",
      "/images/perfumes/lattafa-sublime-2.jpg",
      "/images/perfumes/lattafa-sublime-3.jpg",
      "/images/perfumes/lattafa-sublime-4.jpg",
    ],
    notas: {
      descripcion: "Una fragancia frutal y aromática de elegancia natural. La apertura combina manzana, lichi y rosa; el corazón trae ciruela y jazmín, y la base reposa en vainilla, musgo y pachulí.",
      notas_top: "Manzana · Lichi · Rosa",
      notas_corazon: "Ciruela · Jazmín",
      notas_base: "Vainilla · Musgo · Pachulí",
    },
  },
  {
    id: "p-grandeur-dakota",
    nombre: "Grandeur Dakota",
    estilo: "",
    display: "Grandeur Dakota",
    precio: "$190.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/grandeur-dakota-1.jpg",
      "/images/perfumes/grandeur-dakota-2.jpg",
    ],
    notas: {
      descripcion: "Una fragancia femenina y refinada con apertura de ruibarbo, lichi y bergamota. El corazón florece en rosa turca y peonía, cerrando con cashmeran, almizcle y vetiver.",
      notas_top: "Ruibarbo · Lichi · Bergamota",
      notas_corazon: "Rosa Turca · Peonía · Vainilla",
      notas_base: "Cashmeran · Almizcle · Vetiver",
    },
  },
  {
    id: "p-zakat-royale-rubina",
    nombre: "Zakat Royale Rubina",
    estilo: "",
    display: "Zakat Royale Rubina",
    precio: "$190.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/zakat-royale-rubina-1.jpg",
      "/images/perfumes/zakat-royale-rubina-2.jpg",
    ],
    notas: {
      descripcion: "Una fragancia oriental y especiada de carácter real. Abre con canela y bergamota, el corazón presenta dátiles y tuberosa, y la base despliega vainilla, ámbar y madera.",
      notas_top: "Canela · Bergamota",
      notas_corazon: "Dátiles · Tuberosa · Praline",
      notas_base: "Vainilla · Ámbar · Tonka · Madera",
    },
  },
  {
    id: "p-sahari-crystal-rose",
    nombre: "Sahari Crystal Rose",
    estilo: "",
    display: "Sahari Crystal Rose",
    precio: "$180.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/sahari-crystal-rose-1.jpg",
      "/images/perfumes/sahari-crystal-rose-2.jpg",
    ],
    notas: {
      descripcion: "Una fragancia floral y fresca de espíritu libre. Combina frambuesa y azahar con el corazón de tuberosa, cerrando con almizcle blanco en un aroma suave y delicado.",
      notas_top: "Frambuesa · Azahar",
      notas_corazon: "Tuberosa",
      notas_base: "Almizcle Blanco",
    },
  },
  {
    id: "p-sahari-ahwak",
    nombre: "Sahari Ahwak",
    estilo: "",
    display: "Sahari Ahwak",
    precio: "$180.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/sahari-ahwak-1.jpg",
      "/images/perfumes/sahari-ahwak-2.jpg",
    ],
    notas: {
      descripcion: "Una fragancia unisex vibrante y romántica. Cítricos frescos y aloe vera abren paso a un corazón de jazmín, todo reposando en una base de almizcle blanco limpio y persistente.",
      notas_top: "Cítricos · Aloe Vera",
      notas_corazon: "Jazmín",
      notas_base: "Almizcle Blanco",
    },
  },
  {
    id: "p-amaran-sunrise-madame",
    nombre: "Amaran Sunrise (Madame)",
    estilo: "",
    display: "Amaran Sunrise (Madame)",
    precio: "$200.000",
    disponible: false,
    cat: "perfume",
    imgs: [
      "/images/perfumes/amaran-sunrise-madame-1.jpg",
    ],
    notas: {
      descripcion: "Una fragancia femenina y luminosa que evoca el amanecer. Floral y cálida, con notas de rosa, jazmín y ámbar dorado que crean una estela elegante y seductora.",
      notas_top: "Floral · Rosa",
      notas_corazon: "Jazmín · Notas Doradas",
      notas_base: "Ámbar · Almizcle",
    },
  },
  {
    id: "p-zakat-al-awwal",
    nombre: "Zakat Al Awwal",
    estilo: "",
    display: "Zakat Al Awwal",
    precio: "$200.000",
    disponible: true,
    cat: "perfume",
    imgs: [
      "/images/perfumes/zakat-al-awwal-1.jpg",
      "/images/perfumes/zakat-al-awwal-2.jpg",
    ],
    notas: {
      descripcion: "Una fragancia oriental de apertura especiada y cálida. Con notas de canela y bergamota que dan paso a un corazón de dátiles y tuberosa, terminando en una base rica de vainilla y ámbar.",
      notas_top: "Canela · Bergamota",
      notas_corazon: "Dátiles · Tuberosa",
      notas_base: "Vainilla · Ámbar · Madera",
    },
  },
];
