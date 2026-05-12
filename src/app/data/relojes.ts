// ============================================================
// RELOJES — Máquinas y Joyas
//
// PARA AÑADIR UN RELOJ:
//   1. Copia un bloque completo (entre llaves { ... })
//   2. Pégalo al final de la lista
//   3. Cambia id, nombre, estilo, precio, disponible, imgs y specs
//
// PARA CAMBIAR PRECIO:   modifica el campo "precio"
// PARA MARCAR AGOTADO:   cambia "disponible" a false
// PARA CAMBIAR FOTOS:    reemplaza las rutas en "imgs"
//
// Imágenes en: public/images/relojes/
// Rutas sin barra inicial, ej: "images/relojes/foto.jpg"  (NO "/images/...")
// ============================================================

import type { Producto } from "./types";

export const relojes: Producto[] = [

  // ── FOSSIL ─────────────────────────────────────────────────

  {
    id: "r-fossil-oro-rosa",
    nombre: "Fossil BQ1420",
    estilo: "Oro Rosa",
    display: "Fossil BQ1420 — Oro Rosa",
    precio: "$749.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/fossil-BQ1420-1.PNG",
      "images/relojes/fossil-BQ1420-2.PNG",
      "images/relojes/fossil-BQ1420-3.PNG",
      "images/relojes/fossil-BQ1420-4.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico japonés",
      dimensiones: "38 mm diámetro · 9 mm grosor",
      caja: "Acero inoxidable sólido con acabado Oro Rosa y bisel engastado con micro-cristales",
      correa: "Brazalete de eslabones en acero inoxidable con cierre de doble pulsador",
      cristal: "Mineral endurecido resistente a rayaduras",
      funciones: "Hora analógica de 3 manecillas · Dial con textura circular (Guilloché)",
      resistenciaAgua: "5 ATM / 50 metros · Resistente a salpicaduras, lluvia y nado superficial",
      peso: "Aprox. 110 g",
      observaciones: "Una pieza icónica de la marca Fossil que combina la precisión relojera con la elegancia de la joyería. El acabado en Oro Rosa es de alta durabilidad gracias a su proceso de recubrimiento iónico, ideal para uso formal o diario sofisticado.",
    },
  },

  // ── NAVIFORCE ──────────────────────────────────────────────

  {
    id: "r-naviforce-7105-cafe",
    nombre: "Naviforce NF 7105",
    estilo: "Café",
    display: "Naviforce NF 7105 — Café",
    precio: "$169.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/naviforce-nf7105-cafe-1.PNG",
      "images/relojes/naviforce-nf7105-cafe-2.PNG",
      "images/relojes/naviforce-nf7105-cafe-3.PNG",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Seiko Instruments Inc.)",
      dimensiones: "45 mm ancho · 14.5 mm grosor (Caja tipo Tonneau)",
      caja: "Policarbonato translúcido tono Ámbar de alta resistencia con tornillería expuesta en Oro Rosa",
      correa: "Silicona premium con canales de ventilación (Café) y hebilla de acero",
      cristal: "Mineral endurecido con recubrimiento anti-reflectante",
      funciones: "Cronógrafo funcional completo (24h, segundos y minutos) · Calendario automático · Dial con textura de Fibra de Carbono",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "85 g (Ligereza superior gracias al uso de polímeros avanzados)",
      observaciones: "Una pieza vanguardista que destaca por su transparencia en tono cálido. El uso de policarbonato no solo ofrece una estética única de 'corazón abierto', sino que reduce significativamente el peso, ofreciendo una comodidad excepcional sin sacrificar la robustez visual.",
    },
  },

  {
    id: "r-naviforce-7105-negro",
    nombre: "Naviforce NF 7105",
    estilo: "Negro",
    display: "Naviforce NF 7105 — Negro",
    precio: "$169.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/naviforce-nf7105-negro-1.PNG",
      "images/relojes/naviforce-nf7105-negro-2.PNG",
      "images/relojes/naviforce-nf7105-negro-3.PNG",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Seiko Instruments Inc.)",
      dimensiones: "45 mm ancho · 14.5 mm grosor (Diseño Tonneau)",
      caja: "Aleación de zinc de alta resistencia con revestimiento iónico negro mate y tornillería en Oro Rosa",
      correa: "Silicona premium de alta densidad con canales de ventilación (Negra)",
      cristal: "Mineral endurecido con recubrimiento contra reflejos",
      funciones: "Cronógrafo funcional completo (24h, min, seg) · Calendario lateral · Dial con patrón de Fibra de Carbono",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 115 g (Sensación de solidez metálica)",
      observaciones: "Este modelo destaca por su imponente caja tipo barril y su dial multicapa. A diferencia de las versiones translúcidas, el acabado negro mate sólido le otorga un carácter más robusto y ejecutivo, ideal para quienes buscan un accesorio con fuerte presencia visual.",
    },
  },

  {
    id: "r-naviforce-7105-gris",
    nombre: "Naviforce NF 7105",
    estilo: "Gris",
    display: "Naviforce NF 7105 — Gris",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/naviforce-nf7105-gris-1.jpg",
      "images/relojes/naviforce-nf7105-gris-2.jpg",
      "images/relojes/naviforce-nf7105-gris-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Seiko Instruments Inc.)",
      dimensiones: "45 mm ancho · 14.5 mm grosor (Caja tipo Tonneau)",
      caja: "Policarbonato translúcido de alta resistencia con tornillería expuesta en tono Oro Rosa",
      correa: "Silicona premium con diseño de canales ventilados (Gris) y hebilla de acero",
      cristal: "Mineral endurecido con recubrimiento anti-reflectante",
      funciones: "Cronógrafo funcional (Subesferas de 24h, segundos y minutos) · Calendario automático · Dial con textura de Fibra de Carbono",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "85 g (Ligereza extrema por su caja de policarbonato)",
      observaciones: "Diseño vanguardista inspirado en la alta relojería contemporánea. La caja transparente ofrece una profundidad visual única, resaltando los componentes internos y el contraste con los detalles metálicos en oro rosa.",
    },
  },

  {
    id: "r-naviforce-8051t-gris",
    nombre: "Naviforce NF 8051T",
    estilo: "Gris",
    display: "Naviforce NF 8051T — Gris",
    precio: "$169.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/naviforce-nf851t-1.PNG",
      "images/relojes/naviforce-nf851t-2.PNG",
      "images/relojes/naviforce-nf851t-3.PNG",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Seiko Instruments Inc.)",
      dimensiones: "45 mm diámetro · 14 mm grosor",
      caja: "Aleación de zinc con revestimiento de iones al vacío (Vacuum Plating) y cuatro tornillos estructurales en el bisel",
      correa: "Silicona premium de alta flexibilidad con hebilla de acero inoxidable",
      cristal: "Cristal mineral endurecido de alta resistencia",
      funciones: "Cronógrafo funcional (Subesferas de 1/10 seg, segundos y minutos) · Calendario con ventana de fecha de arco expuesto",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "98 g",
      observaciones: "El dial presenta un diseño industrial multicapa con textura de panal de abeja (Honeycomb). El tratamiento de la caja garantiza una mayor resistencia al desgaste y pérdida de color frente al uso cotidiano y la sudoración.",
    },
  },

  // ── SKELETON ───────────────────────────────────────────────

  {
    id: "r-skeleton-negro",
    nombre: "Skeleton Kosmo 644-6",
    estilo: "Negro",
    display: "Skeleton Kosmo 644-6 — Negro",
    precio: "$550.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/skeleton-kosmo-644-6-negro-1.jpg",
      "images/relojes/skeleton-kosmo-644-6-negro-2.jpg",
      "images/relojes/skeleton-kosmo-644-6-negro-3.jpg",
    ],
    specs: {
      movimiento: "Mecánico Automático (Calibre de 21 rubíes)",
      reservaMarcha: "36 - 40 horas aprox. (Tras carga completa)",
      dimensiones: "42 mm diámetro · 14 mm grosor",
      caja: "Acero inoxidable con acabado negro mate, bisel estriado dorado y tapa trasera de exhibición (Cristal)",
      correa: "Brazalete de eslabones en acero inoxidable (Negro) con cierre de seguridad",
      cristal: "Mineral endurecido de alta transparencia",
      funciones: "Diseño Skeleton (Corazón abierto) · Indicador de Fase Lunar (Día/Noche)",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "140 g aprox.",
      observaciones: "Reloj de funcionamiento mecánico autónomo. Se activa con el movimiento natural del brazo. Para un rendimiento óptimo después de un periodo de inactividad, se recomienda dar cuerda manual girando la corona 15-20 veces.",
    },
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
      "images/relojes/skeleton-kosmo-644-6-plateado-1.jpg",
    ],
    specs: {
      movimiento: "Mecánico Automático (Calibre de 21 rubíes)",
      reservaMarcha: "36 - 40 horas aprox. (Tras carga completa)",
      dimensiones: "42 mm diámetro · 14 mm grosor",
      caja: "Acero inoxidable con bisel estriado en tono bronce y tapa trasera de exhibición (Cristal)",
      correa: "Brazalete de eslabones en acero inoxidable con acabado cepillado",
      cristal: "Mineral endurecido de alta transparencia",
      funciones: "Diseño Skeleton (Maquinaria a la vista) · Indicador de Fase Lunar (Día/Noche) · Manecillas clásicas",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "140 g aprox.",
      observaciones: "Este reloj es una pieza de ingeniería mecánica. No requiere pilas, funciona con el movimiento natural de la muñeca. Se recomienda dar cuerda manual (giro de corona) si el reloj ha estado sin uso por más de 24 horas para garantizar precisión.",
    },
  },

  // ── CURREN 8329 ────────────────────────────────────────────

  {
    id: "r-8329-azul-bronce",
    nombre: "Curren 8329 (Metálico)",
    estilo: "Azul Bronce",
    display: "Curren 8329 (Metálico) — Azul Bronce",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8329-metalico-azul-bronce-1.jpg",
      "images/relojes/curren-8329-metalico-azul-bronce-2.jpg",
      "images/relojes/curren-8329-metalico-azul-bronce-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Cronógrafo)",
      dimensiones: "48 mm diámetro · 14 mm grosor",
      caja: "Aleación de metales con acabado azul noche y detalles en tono Bronce / Oro Rosa",
      correa: "Correa robusta de alta resistencia con placa metálica 'Curren' incrustada (Negra)",
      cristal: "Mineral endurecido (Hardlex) de alta resistencia",
      funciones: "Cronógrafo funcional completo (3 subesferas) · Calendario automático · Esfera con textura especial y detalles en bronce · Taquímetro",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 100 g",
      observaciones: "Destaca por su esfera multicapa de diseño tridimensional y bisel interno con taquímetro funcional. Es una pieza robusta con estética industrial, ideal para quienes buscan un reloj con presencia mecánica y detalles técnicos a la vista.",
    },
  },

  {
    id: "r-8329-black-y-gold",
    nombre: "Curren 8329 (Metálico)",
    estilo: "Black & Gold",
    display: "Curren 8329 (Metálico) — Black & Gold",
    precio: "$169.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8329-metalico-black-y-gold-1.jpg",
      "images/relojes/curren-8329-metalico-black-y-gold-2.jpg",
      "images/relojes/curren-8329-metalico-black-y-gold-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Cronógrafo)",
      dimensiones: "48 mm diámetro · 14 mm grosor",
      caja: "Aleación de metales con acabado negro mate, pulsador deportivo en rojo y detalles en Oro Dorado",
      correa: "Correa robusta de alta resistencia con placa metálica 'Curren' incrustada (Negra)",
      cristal: "Mineral endurecido (Hardlex) de alta resistencia",
      funciones: "Cronógrafo funcional completo (3 subesferas) · Calendario automático · Esfera tridimensional multicapa · Taquímetro",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 100 g",
      observaciones: "Destaca por su esfera multicapa de diseño tridimensional y bisel interno con taquímetro funcional. Es una pieza robusta con estética industrial, ideal para quienes buscan un reloj con presencia mecánica y detalles técnicos a la vista.",
    },
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
      "images/relojes/curren-8329-metalico-cafe-1.jpg",
      "images/relojes/curren-8329-metalico-cafe-2.jpg",
      "images/relojes/curren-8329-metalico-cafe-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Cronógrafo)",
      dimensiones: "48 mm diámetro · 14 mm grosor",
      caja: "Aleación de metales con acabado negro mate, pulsador deportivo en rojo y detalles de tornillería frontal",
      correa: "Correa robusta de alta resistencia con placa metálica 'Curren' incrustada",
      cristal: "Mineral endurecido (Hardlex) de alta resistencia",
      funciones: "Cronógrafo funcional completo (3 subesferas) · Calendario automático · Esfera tridimensional multicapa · Bisel interior con Taquímetro",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 100 g (Sensación de solidez y peso premium)",
      observaciones: "Destaca por su esfera multicapa de diseño tridimensional y bisel interno con taquímetro funcional. Es una pieza robusta con estética industrial, ideal para quienes buscan un reloj con presencia mecánica y detalles técnicos a la vista.",
    },
  },

  // ── CURREN 8291 ────────────────────────────────────────────

  {
    id: "r-8291-cafe",
    nombre: "Curren 8291 (Deportivo)",
    estilo: "Café",
    display: "Curren 8291 (Deportivo) — Café",
    precio: "$159.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8291-deportivo-cafe-1.jpg",
      "images/relojes/curren-8291-deportivo-cafe-2.jpg",
      "images/relojes/curren-8291-deportivo-cafe-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Cronógrafo)",
      dimensiones: "46 mm diámetro · 12 mm grosor",
      caja: "Aleación de metales con acabado en tono Oro Rosa / Bronce y pulsador deportivo",
      correa: "Cuero sintético PU de alta calidad (24 mm) con placa metálica 'Curren' y remaches decorativos",
      cristal: "Mineral endurecido (Hardlex) de alta resistencia",
      funciones: "Cronógrafo funcional completo (3 subesferas) · Calendario automático · Esfera texturizada en tono café con acentos dorados",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "95 g (Sensación de solidez y robustez)",
      observaciones: "Diseño inspirado en el automovilismo deportivo con cronógrafos de alta precisión. La correa incluye una placa metálica distintiva de la marca, reforzando su carácter rudo y duradero.",
    },
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
      "images/relojes/curren-8291-deportivo-azul-1.jpg",
      "images/relojes/curren-8291-deportivo-azul-2.jpg",
      "images/relojes/curren-8291-deportivo-azul-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Cronógrafo)",
      dimensiones: "46 mm diámetro · 12 mm grosor",
      caja: "Aleación de metales con acabado plateado brillante y pulsador deportivo en naranja anodizado",
      correa: "Cuero sintético PU de alta calidad (24 mm) con placa metálica 'Curren' y remaches decorativos",
      cristal: "Mineral endurecido (Hardlex) de alta resistencia",
      funciones: "Cronógrafo funcional completo (3 subesferas) · Calendario automático · Diseño de esfera texturizada en azul con acentos naranjas",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "95 g (Sensación de solidez y robustez)",
      observaciones: "Diseño inspirado en el automovilismo deportivo con cronógrafos de alta precisión. La correa incluye una placa metálica distintiva de la marca, reforzando su carácter rudo y duradero.",
    },
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
      "images/relojes/curren-8291-deportivo-azul-bronce-1.jpg",
      "images/relojes/curren-8291-deportivo-azul-bronce-2.jpg",
      "images/relojes/curren-8291-deportivo-azul-bronce-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Cronógrafo)",
      dimensiones: "46 mm diámetro · 12 mm grosor",
      caja: "Aleación de metales con acabado oscuro y pulsador deportivo en tono bronce",
      correa: "Cuero sintético PU de alta calidad (24 mm) con placa metálica 'Curren' y remaches decorativos",
      cristal: "Mineral endurecido (Hardlex) de alta resistencia",
      funciones: "Cronógrafo funcional completo (3 subesferas) · Calendario automático · Diseño de esfera con acentos en bronce",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "95 g (Sensación de solidez y robustez)",
      observaciones: "Diseño inspirado en el automovilismo deportivo con cronógrafos de alta precisión. La correa incluye una placa metálica distintiva de la marca, reforzando su carácter rudo y duradero.",
    },
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
      "images/relojes/curren-8291-deportivo-negro-rojo-1.jpg",
      "images/relojes/curren-8291-deportivo-negro-rojo-2.jpg",
      "images/relojes/curren-8291-deportivo-negro-rojo-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Cronógrafo)",
      dimensiones: "46 mm diámetro · 12 mm grosor",
      caja: "Aleación de metales con acabado Gunmetal y pulsador deportivo en rojo anodizado",
      correa: "Cuero sintético PU de alta calidad (24 mm) con placa metálica 'Curren' y remaches decorativos",
      cristal: "Mineral endurecido (Hardlex) de alta resistencia",
      funciones: "Cronógrafo funcional completo (3 subesferas) · Calendario automático · Diseño de esfera estilo Racing",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "95 g (Sensación de solidez y robustez)",
      observaciones: "Diseño inspirado en el automovilismo deportivo con cronógrafos de alta precisión. La correa incluye una placa metálica distintiva de la marca, reforzando su carácter rudo y duradero.",
    },
  },

  // ── CURREN 8365 ────────────────────────────────────────────

  {
    id: "r-8365-black-silver",
    nombre: "Curren 8365 (Elegante)",
    estilo: "Black Silver",
    display: "Curren 8365 (Elegante) — Black Silver",
    precio: "$139.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8365-elegante-black-silver-1.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "45 mm diámetro · 10 mm grosor",
      caja: "Aleación de metales con acabado plateado pulido brillante",
      correa: "Cuero sintético con patrón texturizado tipo cocodrilo (Negro)",
      funciones: "Hora analógica de 3 manecillas con apliques luminiscentes · Esfera texturizada con diseño simétrico · Fechador automático a las 6",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 80 g",
      observaciones: "Un diseño clásico y sofisticado donde la simetría es la protagonista, ubicando el fechador a las 6 en punto. Su perfil delgado y correa con textura tipo cocodrilo lo convierten en el accesorio ideal para vestimenta formal o de negocios.",
    },
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
      "images/relojes/curren-8365-elegante-black-gold-1.jpeg",
      "images/relojes/curren-8365-elegante-black-gold-2.jpeg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "45 mm diámetro · 10 mm grosor",
      caja: "Aleación de metales con acabado dorado pulido brillante",
      correa: "Cuero sintético con patrón texturizado tipo cocodrilo (Negro)",
      funciones: "Hora analógica de 3 manecillas con apliques luminiscentes · Esfera texturizada con diseño simétrico · Fechador automático a las 6",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 80 g",
      observaciones: "Un diseño clásico y sofisticado donde la simetría es la protagonista, ubicando el fechador a las 6 en punto. Su perfil delgado y correa con textura tipo cocodrilo lo convierten en el accesorio ideal para vestimenta formal o de negocios.",
    },
  },

  // ───────── CURREN 8411 ──────────────

  {
    id: "r-8411-verde",
    nombre: "Curren 8411",
    estilo: "Verde",
    display: "Curren 8411 — Verde",
    precio: "$149.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8411-verde-1.jpg",
      "images/relojes/curren-8411-verde-2.jpg",
      "images/relojes/curren-8411-verde-3.jpg",
      "images/relojes/curren-8411-verde-4.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "45 mm diámetro · 11 mm grosor",
      caja: "Aleación de metales con acabado plateado brillante",
      correa: "Brazalete de eslabones en aleación / acero con cierre desplegable (Plateado)",
      funciones: "Hora analógica de 3 manecillas · Esfera con formato militar de 24 horas y segundero en contraste rojo · Fechador automático",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 130 g",
      observaciones: "Esfera con formato de 24 horas y estilo de aviación. El contraste del dial verde con el segundero rojo ofrece una legibilidad superior en un diseño de inspiración militar contemporánea.",
    },
  },

  // / ─────── CURREN 8467 ──────────────────────────────────

  {
    id: "r-8467-negro",
    nombre: "Curren 8467",
    estilo: "Negro",
    display: "Curren 8467 — Negro",
    precio: "$149.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8467-negro-1.jpg",
      "images/relojes/curren-8467-negro-2.jpg",
      "images/relojes/curren-8467-negro-3.jpg",
      "images/relojes/curren-8467-negro-4.jpg",
      "images/relojes/curren-8467-negro-5.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "45 mm diámetro · 12 mm grosor",
      caja: "Aleación de metales con acabado plateado, bisel negro mate y detalles industriales en las asas",
      correa: "Silicona deportiva texturizada de alta resistencia (Negra)",
      funciones: "Hora analógica de 3 manecillas · Fechador automático",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 130 g",
      observaciones: "Caja con detalles de tornillería expuesta y bisel mate. Su correa de silicona de alta resistencia lo hace sumamente cómodo para el uso diario intenso sin perder el estilo industrial.",
    },
  },

  // ── CURREN 8457 ────────────────────────────────────────────

  {
    id: "r-8457-silver-black",
    nombre: "Curren 8457 (Cuadrado)",
    estilo: "Silver Black",
    display: "Curren 8457 (Cuadrado) — Silver Black",
    precio: "$129.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8457-cuadrado-silver-black-1.jpg",
      "images/relojes/curren-8457-cuadrado-silver-black-2.jpg",
      "images/relojes/curren-8457-cuadrado-silver-black-3.jpg",
      "images/relojes/curren-8457-cuadrado-silver-black-4.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "35 mm ancho · 10 mm grosor",
      caja: "Cuadrada / Octogonal con cortes angulares y acabado plateado cepillado (Silver). Fabricada en aleación de metales",
      funciones: "Hora analógica de 3 manecillas",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
    },
  },

  // ── CURREN 8488 ────────────────────────────────────────────

  {
    id: "r-8488-blue-gold",
    nombre: "Curren 8488 (Rectangular)",
    estilo: "Blue Gold",
    display: "Curren 8488 (Rectangular) — Blue Gold",
    precio: "$169.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8488-rectangular-blue-gold-1.jpg",
      "images/relojes/curren-8488-rectangular-blue-gold-2.jpg",
      "images/relojes/curren-8488-rectangular-blue-gold-3.jpg",
      "images/relojes/curren-8488-rectangular-blue-gold-4.jpg",
    ],
    specs: {
      movimiento: "Cuarzo (Cronógrafo)",
      dimensiones: "44 mm de ancho · 12 mm grosor (Caja forma Tonneau)",
      caja: "Aleación de metales con acabado Dorado mate y detalles industriales",
      correa: "Silicona deportiva texturizada de alta resistencia (Blanca)",
      funciones: "Hora analógica · Cronógrafo funcional (minutos, segundos, 24h) · Fechador automático · Manecillas luminiscentes",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      observaciones: "Caja vanguardista tipo Tonneau (barril) con una arquitectura de dial compleja. Combina la deportividad de la silicona con una estructura metálica imponente, logrando un equilibrio perfecto entre modernidad y robustez.",
    },
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
      "images/relojes/curren-8488-rectangular-negro-1.jpg",
      "images/relojes/curren-8488-rectangular-negro-2.jpg",
      "images/relojes/curren-8488-rectangular-negro-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo (Cronógrafo)",
      dimensiones: "44 mm de ancho · 12 mm grosor (Caja forma Tonneau)",
      caja: "Aleación de metales con acabado negro mate y detalles industriales",
      correa: "Silicona deportiva texturizada de alta resistencia (Negra)",
      funciones: "Hora analógica · Cronógrafo funcional (minutos, segundos, 24h) · Fechador automático · Manecillas luminiscentes",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      observaciones: "Caja vanguardista tipo Tonneau (barril) con una arquitectura de dial compleja. Combina la deportividad de la silicona con una estructura metálica imponente, logrando un equilibrio perfecto entre modernidad y robustez.",
    },
  },

  // ── CURREN 8225 ────────────────────────────────────────────

  {
    id: "r-8225-cafe",
    nombre: "Curren 8225",
    estilo: "Café",
    display: "Curren 8225 — Café",
    precio: "$159.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-8225-cafe-1.jpg",
      "images/relojes/curren-8225-cafe-2.jpg",
      "images/relojes/curren-8225-cafe-3.jpg",
      "images/relojes/curren-8225-cafe-4.jpg",
    ],
    specs: {
      movimiento: "Cuarzo (Cronógrafo)",
      dimensiones: "47 mm diámetro · 14 mm grosor (Caja grande y robusta)",
      caja: "Aleación de metales con acabado mate oscuro (Gunmetal)",
      correa: "Cuero marrón estilo 'Cuff' o Aviador (con base ancha bajo la caja)",
      funciones: "Hora analógica · Cronógrafo totalmente funcional · Fechador automático",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
    },
  },

  // ── CURREN DAMA ────────────────────────────────────────────

  {
    id: "r-9015-negro-cobre",
    nombre: "Curren 9015 (Dama)",
    estilo: "Negro Cobre",
    display: "Curren 9015 (Dama) — Negro Cobre",
    precio: "$129.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-9015-dama-negro-cobre-1.jpg",
      "images/relojes/curren-9015-dama-negro-cobre-2.jpg",
      "images/relojes/curren-9015-dama-negro-cobre-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "34 mm diámetro · 10 mm grosor",
      caja: "Aleación de metales con detalles y bisel en Oro Rosa / Cobre",
      correa: "Brazalete de eslabones en aleación / acero (Acabado negro brillante)",
      funciones: "Hora analógica de 3 manecillas · Diseño minimalista",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "Aprox. 50 g",
      observaciones: "Relojería femenina que fusiona la precisión del cuarzo con acabados de joyería fina. El baño iónico garantiza la permanencia del color, mientras que su diseño ultra-delgado asegura comodidad durante todo el día.",
    },
  },

  {
    id: "r-9093-dorado",
    nombre: "Curren 9093 (Dama)",
    estilo: "Dorado",
    display: "Curren 9093 (Dama) — Dorado",
    precio: "$109.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/curren-9093-dama-dorado-1.jpg",
      "images/relojes/curren-9093-dama-dorado-2.jpg",
      "images/relojes/curren-9093-dama-dorado-3.jpg",
      "images/relojes/curren-9093-dama-dorado-4.jpg",
      "images/relojes/curren-9093-dama-dorado-5.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "24 mm ancho · 9 mm grosor (Diseño cuadrado con bordes redondeados)",
      caja: "Aleación de metales con baño IP Dorado pulido",
      correa: "Brazalete de eslabones en aleación / acero con cierre de joyería (Dorado)",
      funciones: "Hora analógica de 3 manecillas · Esfera texturizada con cristal a las 12",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "52 g",
      observaciones: "Relojería femenina que fusiona la precisión del cuarzo con acabados de joyería fina. El baño iónico garantiza la permanencia del color, mientras que su diseño ultra-delgado asegura comodidad durante todo el día.",
    },
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
      "images/relojes/curren-9094-dama-silver-1.jpg",
      "images/relojes/curren-9094-dama-silver-2.jpg",
      "images/relojes/curren-9094-dama-silver-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "30 mm diámetro · 8 mm grosor (Perfil ultra delgado)",
      caja: "Aleación de metales con acabado plateado pulido (brillante)",
      correa: "Brazalete de eslabones en acero inoxidable / aleación con cierre desplegable (Color plata)",
      funciones: "Hora analógica de 3 manecillas",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "50 g",
      observaciones: "Relojería femenina que fusiona la precisión del cuarzo con acabados de joyería fina. El baño iónico garantiza la permanencia del color, mientras que su diseño ultra-delgado asegura comodidad durante todo el día.",
    },
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
      "images/relojes/curren-9094-dama-silver-green-1.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "30 mm diámetro · 8 mm grosor (Perfil ultra delgado)",
      caja: "Aleación de metales con acabado plateado pulido (brillante)",
      correa: "Brazalete de eslabones en acero inoxidable / aleación con cierre desplegable",
      funciones: "Hora analógica de 3 manecillas",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      peso: "50 g",
      observaciones: "Relojería femenina que fusiona la precisión del cuarzo con acabados de joyería fina. El baño iónico garantiza la permanencia del color, mientras que su diseño ultra-delgado asegura comodidad durante todo el día.",
    },
  },

  // ── CASIO COLLECTION ───────────────────────────────────────

  {
    id: "r-casio-f91-plata",
    nombre: "Casio F-91WM-7A",
    estilo: "Plata",
    display: "Casio F-91WM-7A — Plata",
    precio: "$129.000",
    disponible: true,
    cat: "reloj",
    imgs: [
      "images/relojes/casio-f-91wm-7a-plata-1.jpg",
      "images/relojes/casio-f-91wm-7a-plata-2.jpg",
      "images/relojes/casio-f-91wm-7a-plata-3.jpg",
    ],
    specs: {
      movimiento: "Digital de precisión (Módulo 593)",
      dimensiones: "38.2 × 35.2 × 8.5 mm",
      caja: "Resina con acabado cromado metálico (Color Plata)",
      correa: "Resina sintética negra de alta durabilidad",
      funciones: "Cronómetro 1/100 seg · Alarma · Señal horaria · Calendario · Luz LED verde",
      bateria: "CR2016 (Duración aproximada de 7 años)",
      resistenciaAgua: "Water Resistant (ISO 22810). Soporta salpicaduras, lluvia y lavado de manos",
      peso: "21 g",
      observaciones: "La evolución metálica del legendario F-91. Conserva la fiabilidad japonesa de Casio con un acabado cromado que eleva su estatus de un reloj básico a un icono retro-futurista de alta durabilidad.",
    },
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
      "images/relojes/casio-f-91wm-3a-verde-1.jpg",
      "images/relojes/casio-f-91wm-3a-verde-2.jpg",
      "images/relojes/casio-f-91wm-3a-verde-3.jpg",
    ],
    specs: {
      movimiento: "Digital de precisión (Módulo 593)",
      dimensiones: "38.2 × 35.2 × 8.5 mm",
      caja: "Resina con acabado metálico color Verde Oliva / Militar",
      correa: "Resina sintética negra de alta resistencia",
      funciones: "Cronómetro · Alarma · Calendario automático · Formato de 12/24 horas · Luz LED",
      bateria: "CR2016 (Duración aproximada de 7 años)",
      resistenciaAgua: "Water Resistant (ISO 22810). Soporta salpicaduras, lluvia y lavado de manos",
      peso: "21 g",
      observaciones: "La evolución metálica del legendario F-91. Conserva la fiabilidad japonesa de Casio con un acabado cromado que eleva su estatus de un reloj básico a un icono retro-futurista de alta durabilidad.",
    },
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
      "images/relojes/casio-ltp-v007d-4e-dama-rose-gold-1.jpg",
      "images/relojes/casio-ltp-v007d-4e-dama-rose-gold-2.jpg",
      "images/relojes/casio-ltp-v007d-4e-dama-rose-gold-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico (Precisión ±20 seg/mes)",
      dimensiones: "31 × 22 × 7.5 mm (Forma Tank rectangular)",
      caja: "Latón con acabado cromado",
      correa: "Acero inoxidable · Broche de triple pliegue",
      cristal: "Cristal mineral resistente a rayaduras menores",
      bateria: "SR626SW (Duración aproximada de 3 años)",
      resistenciaAgua: "Water Resistant (Resistente a salpicaduras accidentales, lavado de manos y lluvia ligera)",
      peso: "51 g",
      observaciones: "Diseño tipo 'Tank' inspirado en la alta relojería clásica. Su forma rectangular y brazalete de acero ofrecen una elegancia atemporal y minimalista, ideal para muñecas delgadas que buscan sobriedad.",
    },
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
      "images/relojes/casio-mq-24-7b-clasico-negro-1.jpg",
      "images/relojes/casio-mq-24-7b-clasico-negro-2.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "38.8 × 34.9 × 7.8 mm",
      caja: "Resina negra de alta resistencia",
      correa: "Resina sintética negra con cierre de hebilla",
      bateria: "SR626SW (Duración aproximada de 3 años)",
      funciones: "Hora analógica con 3 manecillas (Horas, minutos y segundos)",
      resistenciaAgua: "Water Resistant (Soporta salpicaduras accidentales y lluvia ligera)",
      peso: "20 g · Diseño ultraligero",
    },
  },

  // ── POEDAGAR ───────────────────────────────────────────────

  {
    id: "r-poedagar-793-silver-white",
    nombre: "Poedagar 793 (Cuadrado)",
    estilo: "Silver White",
    display: "Poedagar 793 (Cuadrado) — Silver White",
    precio: "$119.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/poedagar-793-cuadrado-silver-white-1.jpg",
      "images/relojes/poedagar-793-cuadrado-silver-white-2.jpg",
      "images/relojes/poedagar-793-cuadrado-silver-white-3.jpg",
      "images/relojes/poedagar-793-cuadrado-silver-white-4.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "32 mm x 32 mm · Grosor: 9 mm",
      caja: "Acero inoxidable pulido con acabado plateado de alta calidad",
      correa: "Malla metálica (Milanesa) de acero inoxidable con cierre de gancho ajustable",
      funciones: "Hora analógica (Diseño minimalista de 3 manecillas)",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      observaciones: "Reloj de estética minimalista europea con dial efecto 'Sunray' que refleja la luz de forma dinámica. La combinación de materiales ligeros y diseño limpio lo hace una pieza versátil para cualquier ocasión casual.",
    },
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
      "images/relojes/poedagar-826-silver-blue-1.jpg",
      "images/relojes/poedagar-826-silver-blue-2.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "40 mm diámetro · 11 mm grosor",
      caja: "Acero inoxidable pulido (Plateado)",
      correa: "Cuero negro con textura de cocodrilo",
      funciones: "Hora analógica · Calendario (Fecha) a las 3 · Dial con efecto Sunray",
      resistenciaAgua: "3 ATM / 30 metros · Resistente al agua (Uso diario)",
      observaciones: "Reloj de estética minimalista europea con dial efecto 'Sunray' que refleja la luz de forma dinámica. La combinación de materiales ligeros y diseño limpio lo hace una pieza versátil para cualquier ocasión casual.",
    },
  },

  // ── GENEVA ─────────────────────────────────────────────────

  {
    id: "r-geneva-cuadrado-oro",
    nombre: "Geneva (Set Dama)",
    estilo: "Cuadrado Oro",
    display: "Geneva (Set Dama) — Cuadrado Oro",
    precio: "$129.000",
    disponible: false,
    cat: "reloj",
    imgs: [
      "images/relojes/geneva-set-dama-cuadrado-oro-1.jpg",
      "images/relojes/geneva-set-dama-cuadrado-oro-2.jpg",
      "images/relojes/geneva-set-dama-cuadrado-oro-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "24 mm ancho · 8 mm grosor",
      caja: "Aleación básica con cristalería de fantasía",
      funciones: "Hora análoga de 3 manecillas (Diseño limpio, sin subdiales)",
      resistenciaAgua: "Sin resistencia al agua",
      observaciones: "Incluye set de pulseras a juego · Evitar cualquier contacto con líquidos y perfumes",
    },
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
      "images/relojes/geneva-set-dama-cuadrado-plata-1.jpg",
      "images/relojes/geneva-set-dama-cuadrado-plata-2.jpg",
      "images/relojes/geneva-set-dama-cuadrado-plata-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "24 mm ancho · 8 mm grosor",
      caja: "Aleación básica con cristalería de fantasía",
      funciones: "Hora análoga de 3 manecillas (Diseño limpio, sin subdiales)",
      resistenciaAgua: "Sin resistencia al agua",
      observaciones: "Incluye set de pulseras a juego · Evitar cualquier contacto con líquidos y perfumes",
    },
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
      "images/relojes/geneva-set-dama-rectangular-plata-1.jpg",
      "images/relojes/geneva-set-dama-rectangular-plata-2.jpg",
      "images/relojes/geneva-set-dama-rectangular-plata-3.jpg",
    ],
    specs: {
      movimiento: "Cuarzo analógico",
      dimensiones: "20 mm ancho · 32 mm largo",
      caja: "Aleación básica con cristalería de fantasía",
      funciones: "Hora análoga de 3 manecillas (Diseño limpio, sin subdiales)",
      resistenciaAgua: "Sin resistencia al agua",
      observaciones: "Incluye set de pulseras a juego · Evitar cualquier contacto con líquidos y perfumes",
    },
  },

];
