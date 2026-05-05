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
  tagline: "Curadurías excepcionales de alta relojería y perfumería de autor",
  quote: '"El lujo verdadero no grita. Susurra con precisión, perdura en el tiempo, y se manifiesta en los detalles invisibles."',
} as const;

// Genera el link de WhatsApp con mensaje pre-escrito para un producto
export function whatsappLink(nombreProducto: string): string {
  const mensaje = `Hola, me interesa el ${nombreProducto}. ¿Está disponible?`;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

// Genera el link de WhatsApp genérico para la página de Contacto
export function whatsappContactLink(): string {
  return `https://wa.me/${CONFIG.whatsapp}`;
}
