import type { DatosVenta, Venta } from '../../api/ventas';

// Estado, constantes y conversiones del formulario de ventas, sin React.

export const ESTADO_VENTA: Record<string, { label: string; color: string }> = {
  Pagado:         { label: 'Pagado',        color: '#22C55E' },
  Abonado:        { label: 'Abonado',       color: '#EAB308' },
  Pendiente:      { label: 'Pendiente',     color: '#EF4444' },
  'Uso Personal': { label: 'Uso Personal',  color: '#6B7280' },
};

export const ESTADOS = ['Pagado', 'Abonado', 'Pendiente', 'Uso Personal'];
export const FUENTES = ['WhatsApp', 'Presencial', 'Referido', 'Instagram', 'Uso Personal'];
export const CATEGORIAS_FILTRO = [
  { value: 'reloj', label: 'Relojes' },
  { value: 'perfume', label: 'Perfumes' },
  { value: 'accesorio', label: 'Accesorios' },
];

export const EMPTY_FORM = {
  fecha: new Date().toISOString().split('T')[0],
  cliente: '', celular: '', marca: '', modelo: '', estilo: '',
  precioVenta: '', costoProducto: '', costoEnvio: '0',
  abono: '', fuente: '', estado: 'Pagado',
};
export type FormState = typeof EMPTY_FORM;

// Sugerencia de estado mientras se llena el formulario. El backend tiene la
// regla autoritativa (planVentaUpdate cierra en "Pagado" al completar el abono).
export function recalcEstado(f: FormState): FormState {
  const pv = Number(f.precioVenta);
  const ab = Number(f.abono);
  if (pv > 0) {
    if (ab >= pv) return { ...f, estado: 'Pagado' };
    if (ab > 0)   return { ...f, estado: 'Abonado' };
    return { ...f, estado: 'Pendiente' };
  }
  return f;
}

export function datosDesdeForm(f: FormState): DatosVenta {
  return {
    fecha: f.fecha,
    cliente: f.cliente,
    celular: f.celular || undefined,
    marca: f.marca,
    modelo: f.modelo,
    estilo: f.estilo || undefined,
    precioVenta: Number(f.precioVenta),
    costoProducto: Number(f.costoProducto),
    costoEnvio: Number(f.costoEnvio),
    abono: Number(f.abono),
    fuente: f.fuente || undefined,
    estado: f.estado,
  };
}

export function formDesdeVenta(v: Venta): FormState {
  return {
    fecha: v.fecha.split('T')[0],
    cliente: v.cliente,
    celular: v.celular ?? '',
    marca: v.marca,
    modelo: v.modelo,
    estilo: v.estilo ?? '',
    precioVenta: String(v.precioVenta),
    costoProducto: String(v.costoProducto),
    costoEnvio: String(v.costoEnvio),
    abono: String(v.abono),
    fuente: v.fuente ?? '',
    estado: v.estado,
  };
}
