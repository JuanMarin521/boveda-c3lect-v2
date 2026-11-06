// "Volver a donde estaba" después de iniciar sesión o registrarse.
//
// Quien manda al login pasa la ruta actual en ?volver=; Login y Register la
// leen y navegan ahí al terminar (antes iban siempre a /catalog). El valor
// llega por la URL, así que cualquiera puede armar un enlace con él: solo se
// aceptan rutas internas de la tienda, nunca otro dominio.

export const PARAM_VOLVER = "volver";

const DESTINO_POR_DEFECTO = "/catalog";

// Volver a una pantalla de acceso después de entrar no tiene sentido.
const RUTAS_DE_ACCESO = ["/login", "/register", "/reset-password"];

/** Devuelve `valor` si es una ruta interna aceptable; si no, el destino por defecto. */
export function destinoSeguro(valor: string | null | undefined): string {
  if (!valor) return DESTINO_POR_DEFECTO;
  // "/x" sí; "//evil.com", "/\evil.com" o "https://evil.com" no.
  if (!valor.startsWith("/") || valor.startsWith("//") || valor.startsWith("/\\")) {
    return DESTINO_POR_DEFECTO;
  }
  const ruta = valor.split(/[?#]/)[0];
  if (RUTAS_DE_ACCESO.includes(ruta)) return DESTINO_POR_DEFECTO;
  return valor;
}

/** `/login` (o `/register`) recordando a dónde volver después. */
export function rutaDeAcceso(destino: string, pantalla: "/login" | "/register" = "/login"): string {
  const seguro = destinoSeguro(destino);
  return seguro === DESTINO_POR_DEFECTO
    ? pantalla
    : `${pantalla}?${PARAM_VOLVER}=${encodeURIComponent(seguro)}`;
}
