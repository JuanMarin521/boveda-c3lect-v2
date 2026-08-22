// src/app/lib/metaPixel.ts
// Meta Pixel (navegador) para C3LECT — boveda-c3lect-v2
//
// Requiere la variable VITE_META_PIXEL_ID (Cloudflare Pages + .env local).
// Si no está definida, el pixel se desactiva solo y no rompe nada.
//
// IMPORTANTE: sin el cambio en public/_headers (CSP) este archivo NO funciona.
// La CSP actual tiene script-src 'self' e img-src 'self', que bloquean por
// completo el script de Facebook y su beacon de seguimiento.

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

let initialized = false;

/**
 * Rutas donde el pixel NO debe cargar.
 *
 * /admin es tráfico del dueño, no de clientes. Si el pixel corre ahí, Meta
 * registra esas visitas como si fueran de compradores: ensucia las métricas,
 * mete al propio dueño en las audiencias de retargeting, y le enseña al
 * algoritmo el perfil de un "cliente" que entra todos los días y nunca compra.
 *
 * admin.c3lect.com redirige a c3lect.com/admin, así que ese caso queda cubierto.
 * El PageView por cambio de ruta ya está a salvo por construcción: el hook vive
 * en Root.tsx (rama pública) y AdminRoot es una rama distinta del router. Esto
 * cubre el caso que faltaba: entrar directo a /admin desde el navegador.
 */
function esRutaExcluida(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/admin');
}

// ─────────────────────────────────────────────────────────────────────────────
// Deduplicación de eventos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Guarda cuándo se envió por última vez cada evento, por clave.
 *
 * POR QUÉ EXISTE ESTO. Root.tsx envuelve el <Outlet/> en <AnimatePresence>.
 * Durante los 0.22s del crossfade entre páginas, AnimatePresence mantiene
 * montado el motion.div saliente — y ese div contiene un <Outlet/> que ya
 * renderiza la ruta NUEVA, no la vieja. O sea: durante la transición la misma
 * página está montada dos veces, sus useEffect corren dos veces, y el evento
 * sale duplicado en el mismo milisegundo.
 *
 * Se comprobó en producción el 21/08/2026: dos ViewContent idénticos del mismo
 * producto con marca de tiempo 17:36:15.677 los dos.
 *
 * Se arregla aquí y no en Root.tsx a propósito. La lógica de animación está
 * afinada para evitar pantallas en blanco (ver el comentario largo en Root.tsx)
 * y no vale la pena arriesgarla por un problema de medición. Además, resolverlo
 * en esta capa protege de cualquier otra fuente de doble disparo: dobles clics,
 * re-renders del contexto de productos, o StrictMode en desarrollo.
 *
 * Sin esto, cada vista de producto cuenta doble: las métricas quedan infladas
 * al doble y los públicos de retargeting se llenan de eventos fantasma.
 */
const ultimoEnvio = new Map<string, number>();

function esRepetido(clave: string, ventanaMs: number): boolean {
  const ahora = Date.now();
  const previo = ultimoEnvio.get(clave);
  if (previo !== undefined && ahora - previo < ventanaMs) return true;
  ultimoEnvio.set(clave, ahora);
  return false;
}

/**
 * Carga el script base de Meta Pixel e inicializa fbq.
 * Se llama una sola vez desde src/main.tsx, ANTES de montar React.
 * Dispara el PageView de la carga inicial; los siguientes los envía
 * useMetaPixelRouteTracking en cada cambio de ruta.
 */
export function initMetaPixel(): void {
  if (initialized) return;
  if (!PIXEL_ID) {
    if (import.meta.env.DEV) {
      console.warn('[MetaPixel] VITE_META_PIXEL_ID no está configurado. Pixel desactivado.');
    }
    return;
  }
  if (typeof window === 'undefined') return;
  if (esRutaExcluida()) return;

  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: any[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
  initialized = true;
}

/**
 * Advanced Matching manual. Llamar cuando ya conoces al usuario
 * (después de iniciar sesión, registrarse o llenar el formulario de checkout).
 * Meta hashea estos datos en el navegador antes de enviarlos — no viajan en claro.
 * Sube bastante el Event Match Quality, que es lo que decide si Meta puede
 * atribuir la venta al anuncio.
 */
export interface UserDataForPixel {
  email?: string;
  phone?: string; // en cualquier formato; se normaliza a E.164 sin '+'
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
}

/**
 * Normaliza ciudad y departamento como exige Meta:
 * "lowercase only with no punctuation, no special characters, and no spaces".
 *
 * El acento importa mucho aquí. "Medellín" y "medellin" producen hashes
 * distintos, así que si el cliente escribe con tilde el dato se pierde: Meta
 * no encuentra a nadie con ese hash y la ciudad deja de sumar al match quality.
 * Como en Colombia media base de clientes escribe "Medellín" y la otra media
 * "Medellin", sin esto la mitad del dato se iría a la basura.
 *
 * normalize('NFD') separa cada letra de su tilde ("í" → "i" + ´) y el replace
 * borra las tildes sueltas. La ñ pasa a n, que es justo lo que Meta espera.
 */
export function normalizarLugar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Normaliza nombres y apellidos: "lowercase only with no punctuation".
 *
 * OJO — aquí los acentos SÍ se conservan, al revés que en la ciudad. Meta
 * acepta caracteres especiales en fn y ln siempre que vayan en UTF-8, así que
 * "José" debe viajar como "josé", no como "jose". Quitarle la tilde sería
 * romper el dato, no arreglarlo.
 */
export function normalizarNombre(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function setMetaUserData(user: UserDataForPixel): void {
  if (!initialized || !window.fbq || !PIXEL_ID) return;

  const data: Record<string, string> = {};
  if (user.email) data.em = user.email.trim().toLowerCase();
  if (user.phone) data.ph = normalizePhoneCO(user.phone);
  if (user.firstName) data.fn = normalizarNombre(user.firstName);
  if (user.lastName) data.ln = normalizarNombre(user.lastName);
  if (user.city) data.ct = normalizarLugar(user.city);
  if (user.state) data.st = normalizarLugar(user.state);
  data.country = 'co';

  window.fbq('init', PIXEL_ID, data);
}

/**
 * Normaliza un teléfono colombiano a E.164 sin el '+', que es lo que Meta espera.
 * "317 859 8407" → "573178598407"
 * "+57 317 859 8407" → "573178598407"
 * Sin esto, el hash no coincide con ningún usuario de Meta y el dato se pierde.
 */
export function normalizePhoneCO(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('57') && digits.length >= 12) return digits;
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

/** PageView en cada cambio de ruta (obligatorio en una SPA — Meta no lo detecta solo). */
export function trackPageView(): void {
  if (!initialized || !window.fbq) return;
  // Por ruta: dos PageView de rutas distintas seguidos son legítimos; dos de
  // la misma ruta en menos de un segundo son un doble montaje.
  if (esRepetido(`PageView:${window.location.pathname}`, 1000)) return;
  window.fbq('track', 'PageView');
}

// ─────────────────────────────────────────────────────────────────────────────
// Eventos del catálogo
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductForPixel {
  id: string;
  display: string;
  precio: number;
  cat: 'reloj' | 'perfume' | 'accesorio';
}

const CATEGORIA_META: Record<string, string> = {
  reloj: 'Máquinas y Joyas',
  perfume: 'Firmas y Elixires',
  accesorio: 'Accesorios',
};

/** Ficha de producto vista — /product/:id */
export function trackViewContent(producto: ProductForPixel): void {
  if (!initialized || !window.fbq) return;
  // El caso que motivó toda la deduplicación: el crossfade entre páginas monta
  // la ficha de producto dos veces y disparaba dos ViewContent idénticos.
  if (esRepetido(`ViewContent:${producto.id}`, 2000)) return;
  window.fbq('track', 'ViewContent', {
    content_ids: [producto.id],
    content_name: producto.display,
    content_type: 'product',
    content_category: CATEGORIA_META[producto.cat] ?? producto.cat,
    value: producto.precio,
    currency: 'COP',
  });
}

export interface CartItemForPixel {
  producto: ProductForPixel;
  cantidad: number;
}

/** Producto añadido al carrito */
export function trackAddToCart(producto: ProductForPixel, cantidad = 1): void {
  if (!initialized || !window.fbq) return;
  // Ventana corta: protege del doble clic accidental, pero deja que el cliente
  // añada dos unidades a propósito si hace una pausa mínima entre clics.
  if (esRepetido(`AddToCart:${producto.id}`, 700)) return;
  window.fbq('track', 'AddToCart', {
    content_ids: [producto.id],
    content_name: producto.display,
    content_type: 'product',
    contents: [{ id: producto.id, quantity: cantidad }],
    value: producto.precio * cantidad,
    currency: 'COP',
  });
}

/** Inicio de checkout — al enviar el formulario de /checkout */
export function trackInitiateCheckout(items: CartItemForPixel[], total: number): void {
  if (!initialized || !window.fbq) return;
  if (esRepetido('InitiateCheckout', 1500)) return;
  window.fbq('track', 'InitiateCheckout', {
    content_ids: items.map((i) => i.producto.id),
    content_type: 'product',
    contents: items.map((i) => ({ id: i.producto.id, quantity: i.cantidad })),
    num_items: items.reduce((n, i) => n + i.cantidad, 0),
    value: total,
    currency: 'COP',
  });
}

export interface PurchaseForPixel {
  /**
   * DEBE ser el orderNumber del pedido — el mismo valor que el backend usa
   * como event_id al enviar el evento por Conversions API, y el mismo que
   * MercadoPago recibe como external_reference. Si no coinciden, Meta cuenta
   * la compra dos veces y tus métricas quedan infladas.
   */
  orderNumber: string;
  items: CartItemForPixel[];
  total: number;
}

/**
 * Compra confirmada, disparada desde el navegador.
 * Es un respaldo: la fuente de verdad es el Purchase que envía el backend
 * por Conversions API. El eventID compartido evita el doble conteo.
 */
export function trackPurchase(purchase: PurchaseForPixel): void {
  if (!initialized || !window.fbq) return;
  window.fbq(
    'track',
    'Purchase',
    {
      content_ids: purchase.items.map((i) => i.producto.id),
      content_type: 'product',
      contents: purchase.items.map((i) => ({ id: i.producto.id, quantity: i.cantidad })),
      num_items: purchase.items.reduce((n, i) => n + i.cantidad, 0),
      value: purchase.total,
      currency: 'COP',
    },
    { eventID: purchase.orderNumber },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Eventos del canal real de venta: WhatsApp y registro
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clic en cualquier botón de WhatsApp. Este es el evento más importante del
 * sitio: es la conversión que de verdad ocurre, porque la mayoría de las
 * ventas se cierran por chat y no por el checkout web.
 * Es el evento al que deben optimizar las campañas mientras el volumen de
 * compras online siga siendo bajo.
 */
export function trackContactWhatsApp(contexto: {
  origen: 'ficha_producto' | 'carrito' | 'contacto' | 'aviso_reingreso';
  productoId?: string;
  productoNombre?: string;
  valor?: number;
}): void {
  if (!initialized || !window.fbq) return;
  // Este es el evento al que van a optimizar las campañas: un Contact inflado
  // le enseña al algoritmo que consigue el doble de conversiones de las reales.
  if (esRepetido(`Contact:${contexto.origen}:${contexto.productoId ?? ''}`, 1500)) return;
  window.fbq('track', 'Contact', {
    content_category: contexto.origen,
    content_ids: contexto.productoId ? [contexto.productoId] : undefined,
    content_name: contexto.productoNombre,
    value: contexto.valor,
    currency: 'COP',
  });
}

/** Registro completado en /register — el evento de la campaña de lanzamiento. */
export function trackCompleteRegistration(valor?: number): void {
  if (!initialized || !window.fbq) return;
  if (esRepetido('CompleteRegistration', 3000)) return;
  window.fbq('track', 'CompleteRegistration', {
    content_name: 'Cuenta C3LECT',
    status: true,
    value: valor,
    currency: 'COP',
  });
}

/** Búsqueda en el catálogo — señal útil de intención. */
export function trackSearch(termino: string): void {
  if (!initialized || !window.fbq) return;
  window.fbq('track', 'Search', { search_string: termino });
}

// ─────────────────────────────────────────────────────────────────────────────
// Cookies de atribución — se envían al backend para la Conversions API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lee las cookies _fbp y _fbc que el pixel deja en el navegador.
 * Sin estos dos valores, el evento que manda el servidor pierde casi toda su
 * capacidad de atribución: Meta no sabe qué clic de anuncio produjo la venta.
 * Mándalos al backend en el body del pedido y reenvíalos en el evento de CAPI.
 */
export function getFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};

  const leer = (nombre: string): string | undefined => {
    const match = document.cookie.match(new RegExp('(^| )' + nombre + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : undefined;
  };

  const fbp = leer('_fbp');
  let fbc = leer('_fbc');

  // Si el usuario acaba de llegar desde un anuncio, la URL trae ?fbclid=...
  // y la cookie _fbc puede no existir todavía. La construimos a mano con el
  // formato que exige Meta: fb.1.<timestamp>.<fbclid>
  if (!fbc) {
    const fbclid = new URLSearchParams(window.location.search).get('fbclid');
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp, fbc };
}
