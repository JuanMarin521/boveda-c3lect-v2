// ============================================================
// PERFUMES — Firmas y Elixires
//
// PARA AÑADIR UN PERFUME:
//   1. Copia un bloque completo (entre llaves { ... })
//   2. Pégalo al final de la lista
//   3. Cambia id, nombre, estilo, precio, disponible, imgs y notas
//
// PARA CAMBIAR PRECIO:   modifica el campo "precio"
// PARA MARCAR AGOTADO:   cambia "disponible" a false
// PARA CAMBIAR FOTOS:    reemplaza las rutas en "imgs"
//
// Imágenes en: public/images/perfumes/
// Rutas sin barra inicial, ej: "images/perfumes/foto.jpg"  (NO "/images/...")
// ============================================================

import type { Producto } from "./types";

export const perfumes: Producto[] = [

  {
    id: "p-lattafa-al-qiam-gold",
    nombre: "Lattafa Al Qiam Gold",
    estilo: "",
    display: "Lattafa Al Qiam Gold",
    precio: "$260.000",
    disponible: false,
    cat: "perfume",
    imgs: [
      "images/perfumes/lattafa-al-qiam-gold-1.jpg",
      "images/perfumes/lattafa-al-qiam-gold-2.jpg",
      "images/perfumes/lattafa-al-qiam-gold-3.jpg",
      "images/perfumes/lattafa-al-qiam-gold-4.jpg",
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
      "images/perfumes/afnan-9-pm-rebel-roja-1.jpg",
      "images/perfumes/afnan-9-pm-rebel-roja-2.jpg",
      "images/perfumes/afnan-9-pm-rebel-roja-3.jpg",
      "images/perfumes/afnan-9-pm-rebel-roja-4.jpg",
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
      "images/perfumes/afnan-9-pm-negra-1.jpg",
      "images/perfumes/afnan-9-pm-negra-2.jpg",
      "images/perfumes/afnan-9-pm-negra-3.jpg",
      "images/perfumes/afnan-9-pm-negra-4.jpg",
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
      "images/perfumes/lattafa-amethyst-1.jpg",
      "images/perfumes/lattafa-amethyst-2.jpg",
      "images/perfumes/lattafa-amethyst-3.jpg",
      "images/perfumes/lattafa-amethyst-4.jpg",
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
      "images/perfumes/lattafa-sublime-1.jpg",
      "images/perfumes/lattafa-sublime-2.jpg",
      "images/perfumes/lattafa-sublime-3.jpg",
      "images/perfumes/lattafa-sublime-4.jpg",
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
      "images/perfumes/grandeur-dakota-1.jpg",
      "images/perfumes/grandeur-dakota-2.jpg",
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
      "images/perfumes/zakat-royale-rubina-1.jpg",
      "images/perfumes/zakat-royale-rubina-2.jpg",
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
      "images/perfumes/sahari-crystal-rose-1.jpg",
      "images/perfumes/sahari-crystal-rose-2.jpg",
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
      "images/perfumes/sahari-ahwak-1.jpg",
      "images/perfumes/sahari-ahwak-2.jpg",
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
      "images/perfumes/amaran-sunrise-madame-1.jpg",
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
      "images/perfumes/zakat-al-awwal-1.jpg",
      "images/perfumes/zakat-al-awwal-2.jpg",
    ],
    notas: {
      descripcion: "Una fragancia oriental de apertura especiada y cálida. Con notas de canela y bergamota que dan paso a un corazón de dátiles y tuberosa, terminando en una base rica de vainilla y ámbar.",
      notas_top: "Canela · Bergamota",
      notas_corazon: "Dátiles · Tuberosa",
      notas_base: "Vainilla · Ámbar · Madera",
    },
  },

];
