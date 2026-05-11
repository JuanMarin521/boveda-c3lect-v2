// ============================================================
// RELOJES — Máquinas y Joyas
//
// PARA AÑADIR UN RELOJ:
//   1. Copia un bloque completo (entre llaves { ... })
//   2. Pégalo al final de la lista
//   3. Cambia id, nombre, estilo, precio, disponible e imgs
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
  },

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
  },

  {
    id: "r-naviforce-8051t-gris2",
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
  },

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
      "images/relojes/curren-8329-metalico-azul-bronce-1.jpg",
      "images/relojes/curren-8329-metalico-azul-bronce-2.jpg",
      "images/relojes/curren-8329-metalico-azul-bronce-3.jpg",
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
      "images/relojes/curren-8291-deportivo-cafe-1.jpg",
      "images/relojes/curren-8291-deportivo-cafe-2.jpg",
      "images/relojes/curren-8291-deportivo-cafe-3.jpg",
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
      "images/relojes/curren-8291-deportivo-azul-1.jpg",
      "images/relojes/curren-8291-deportivo-azul-2.jpg",
      "images/relojes/curren-8291-deportivo-azul-3.jpg",
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
      "images/relojes/curren-8291-deportivo-azul-bronce-1.jpg",
      "images/relojes/curren-8291-deportivo-azul-bronce-2.jpg",
      "images/relojes/curren-8291-deportivo-azul-bronce-3.jpg",
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
      "images/relojes/curren-8329-metalico-black-y-gold-1.jpg",
      "images/relojes/curren-8329-metalico-black-y-gold-2.jpg",
      "images/relojes/curren-8329-metalico-black-y-gold-3.jpg",
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
      "images/relojes/curren-8329-metalico-cafe-1.jpg",
      "images/relojes/curren-8329-metalico-cafe-2.jpg",
      "images/relojes/curren-8329-metalico-cafe-3.jpg",
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
      "images/relojes/curren-8291-deportivo-negro-rojo-1.jpg",
      "images/relojes/curren-8291-deportivo-negro-rojo-2.jpg",
      "images/relojes/curren-8291-deportivo-negro-rojo-3.jpg",
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
      "images/relojes/curren-8365-elegante-black-silver-1.jpg",
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
      "images/relojes/curren-8365-elegante-black-gold-1.jpeg",
      "images/relojes/curren-8365-elegante-black-gold-2.jpeg",
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
      "images/relojes/curren-8411-verde-1.jpg",
      "images/relojes/curren-8411-verde-2.jpg",
      "images/relojes/curren-8411-verde-3.jpg",
      "images/relojes/curren-8411-verde-4.jpg",
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
      "images/relojes/curren-8457-cuadrado-silver-black-1.jpg",
      "images/relojes/curren-8457-cuadrado-silver-black-2.jpg",
      "images/relojes/curren-8457-cuadrado-silver-black-3.jpg",
      "images/relojes/curren-8457-cuadrado-silver-black-4.jpg",
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
      "images/relojes/curren-8467-negro-1.jpg",
      "images/relojes/curren-8467-negro-2.jpg",
      "images/relojes/curren-8467-negro-3.jpg",
      "images/relojes/curren-8467-negro-4.jpg",
      "images/relojes/curren-8467-negro-5.jpg",
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
      "images/relojes/curren-8488-rectangular-blue-gold-1.jpg",
      "images/relojes/curren-8488-rectangular-blue-gold-2.jpg",
      "images/relojes/curren-8488-rectangular-blue-gold-3.jpg",
      "images/relojes/curren-8488-rectangular-blue-gold-4.jpg",
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
      "images/relojes/curren-8488-rectangular-negro-1.jpg",
      "images/relojes/curren-8488-rectangular-negro-2.jpg",
      "images/relojes/curren-8488-rectangular-negro-3.jpg",
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
      "images/relojes/curren-8225-cafe-1.jpg",
      "images/relojes/curren-8225-cafe-2.jpg",
      "images/relojes/curren-8225-cafe-3.jpg",
      "images/relojes/curren-8225-cafe-4.jpg",
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
      "images/relojes/curren-9015-dama-negro-cobre-1.jpg",
      "images/relojes/curren-9015-dama-negro-cobre-2.jpg",
      "images/relojes/curren-9015-dama-negro-cobre-3.jpg",
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
      "images/relojes/curren-9093-dama-dorado-1.jpg",
      "images/relojes/curren-9093-dama-dorado-2.jpg",
      "images/relojes/curren-9093-dama-dorado-3.jpg",
      "images/relojes/curren-9093-dama-dorado-4.jpg",
      "images/relojes/curren-9093-dama-dorado-5.jpg",
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
      "images/relojes/curren-9094-dama-silver-1.jpg",
      "images/relojes/curren-9094-dama-silver-2.jpg",
      "images/relojes/curren-9094-dama-silver-3.jpg",
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
      "images/relojes/curren-9094-dama-silver-green-1.jpg",
    ],
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
      "images/relojes/geneva-set-dama-cuadrado-oro-1.jpg",
      "images/relojes/geneva-set-dama-cuadrado-oro-2.jpg",
      "images/relojes/geneva-set-dama-cuadrado-oro-3.jpg",
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
      "images/relojes/geneva-set-dama-cuadrado-plata-1.jpg",
      "images/relojes/geneva-set-dama-cuadrado-plata-2.jpg",
      "images/relojes/geneva-set-dama-cuadrado-plata-3.jpg",
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
      "images/relojes/geneva-set-dama-rectangular-plata-1.jpg",
      "images/relojes/geneva-set-dama-rectangular-plata-2.jpg",
      "images/relojes/geneva-set-dama-rectangular-plata-3.jpg",
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
      "images/relojes/poedagar-793-cuadrado-silver-white-1.jpg",
      "images/relojes/poedagar-793-cuadrado-silver-white-2.jpg",
      "images/relojes/poedagar-793-cuadrado-silver-white-3.jpg",
      "images/relojes/poedagar-793-cuadrado-silver-white-4.jpg",
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
      "images/relojes/poedagar-826-silver-blue-1.jpg",
      "images/relojes/poedagar-826-silver-blue-2.jpg",
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
      "images/relojes/casio-f-91wm-3-plata-1.jpg",
      "images/relojes/casio-f-91wm-3-plata-2.jpg",
      "images/relojes/casio-f-91wm-3-plata-3.jpg",
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
      "images/relojes/casio-f-91wm-3a-verde-1.jpg",
      "images/relojes/casio-f-91wm-3a-verde-2.jpg",
      "images/relojes/casio-f-91wm-3a-verde-3.jpg",
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
      "images/relojes/casio-ltp-v007d-4e-dama-rose-gold-1.jpg",
      "images/relojes/casio-ltp-v007d-4e-dama-rose-gold-2.jpg",
      "images/relojes/casio-ltp-v007d-4e-dama-rose-gold-3.jpg",
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
      "images/relojes/casio-mq-24-7b-clasico-negro-1.jpg",
      "images/relojes/casio-mq-24-7b-clasico-negro-2.jpg",
    ],
  },

];
