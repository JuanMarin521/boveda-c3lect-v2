// ============================================================
// CONFIGURACIÓN GLOBAL DE C3LECT
//
// EDITA AQUÍ para cambiar:
//   whatsapp  → número con código de país, sin + ni espacios
//   instagram → URL completa de Instagram
//   ciudad    → ciudad de la tienda
//
// Una vez cambiado aquí, el cambio aplica en TODA la página.
// ============================================================

export const CONFIG = {
  // SECCIÓN: CONTACTO — cambia solo el número si cambia tu línea
  whatsapp: "573178598407",
  whatsappDisplay: "+57 317 859 8407",

  // SECCIÓN: REDES SOCIALES
  instagram: "https://instagram.com/c3lect.co",
  instagramHandle: "@c3lect.co",

  // SECCIÓN: UBICACIÓN
  ciudad: "Medellín, Colombia",

  // SECCIÓN: TEXTOS DEL SITIO (edita aquí para cambiar sin tocar componentes)
  tagline: "Cinco piezas por temporada. Cada reloj y cada frasco entra a C3LECT solo si sobrevive a la mesa de curaduría en Medellín.",
  quote: '"El lujo verdadero no grita. Susurra con precisión, perdura en el tiempo, y se manifiesta en los detalles invisibles."',
} as const;

// La selección de temporada del Home (carrusel del hero) ya no se edita acá:
// se marca por producto con el check "Destacado en Home" en el panel de
// administración (máx. 5 piezas). Ver Home.tsx → piezasTemporada.

// Genera el link de WhatsApp con mensaje pre-escrito para un producto
export function whatsappLink(nombreProducto: string): string {
  const mensaje = `Hola, me interesa el ${nombreProducto}. ¿Está disponible?`;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

// Genera el link de WhatsApp para pedir aviso de reingreso de un producto agotado
export function whatsappAvisarLink(nombreProducto: string): string {
  const mensaje = `Hola, quiero que me avisen cuando el ${nombreProducto} vuelva a estar disponible.`;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

// Genera el link de WhatsApp genérico para la página de Contacto
export function whatsappContactLink(): string {
  return `https://wa.me/${CONFIG.whatsapp}`;
}
