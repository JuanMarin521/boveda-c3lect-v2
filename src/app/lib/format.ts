import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}

export function formatFecha(s: string): string {
  const [y, m, d] = s.split('T')[0].split('-').map(Number);
  return format(new Date(y, m - 1, d), 'd MMM yyyy', { locale: es });
}
