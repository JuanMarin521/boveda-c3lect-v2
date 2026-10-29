import type { Venta } from '../../api/ventas';
import { formatFecha as fmtFecha } from '../../lib/format';

export function exportCSV(data: Venta[]) {
  const headers = ['Fecha','Cliente','Celular','Marca','Modelo','Estilo','Precio Venta','Costo','Envío','Abono','Saldo Pendiente','Ganancia','Fuente','Estado'];
  const rows = data.map((v) => [
    fmtFecha(v.fecha), v.cliente, v.celular ?? '', v.marca, v.modelo, v.estilo ?? '',
    v.precioVenta, v.costoProducto, v.costoEnvio, v.abono, v.saldoPendiente,
    v.gananciaNeta ?? '', v.fuente ?? '', v.estado,
  ]);
  const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `ventas-c3lect-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}
