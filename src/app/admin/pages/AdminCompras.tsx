import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const fmtFecha = (s: string) =>
  format(new Date(s), 'd MMM yyyy', { locale: es });

const CATEGORIAS = ['', 'Reloj', 'Perfume', 'Accesorio'];

interface Compra {
  id: string;
  fecha: string;
  modelo: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  categoria: string;
}

interface Paginado { data: Compra[]; total: number; page: number; limit: number; pages: number }

export default function AdminCompras() {
  const [data, setData]     = useState<Compra[]>([]);
  const [meta, setMeta]     = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage]     = useState(1);
  const [categoria, setCategoria] = useState('');
  const [desde, setDesde]   = useState('');
  const [hasta, setHasta]   = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback((p: number) => {
    setCargando(true);
    const params: Record<string, string> = { page: String(p), limit: '20' };
    if (categoria) params.categoria = categoria;
    if (desde)     params.desde     = desde;
    if (hasta)     params.hasta     = hasta;

    api.get<Paginado>('/metrics/purchases', { params })
      .then(({ data: res }) => {
        setData(res.data);
        setMeta({ total: res.total, page: res.page, pages: res.pages });
      })
      .finally(() => setCargando(false));
  }, [categoria, desde, hasta]);

  useEffect(() => {
    setPage(1);
    cargar(1);
  }, [categoria, desde, hasta, cargar]);

  const handlePage = (p: number) => {
    setPage(p);
    cargar(p);
  };

  const totalPagina = data.reduce((s, c) => s + c.costoTotal, 0);

  const inputCls = "bg-[#111] border border-white/10 rounded px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-[#C9A84C]/50";
  const selectCls = inputCls + " cursor-pointer";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Compras de Inventario</h1>
        <p className="text-sm text-white/40">{meta.total} registros totales</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={selectCls}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className={inputCls} />
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className={inputCls} />
        {(categoria || desde || hasta) && (
          <button
            onClick={() => { setCategoria(''); setDesde(''); setHasta(''); }}
            className="text-xs text-white/40 hover:text-white/70 px-2"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-lg border overflow-x-auto" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-16">Sin resultados</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {['Fecha', 'Modelo', 'Cantidad', 'Costo Unitario', 'Costo Total', 'Categoría'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {data.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{fmtFecha(c.fecha)}</td>
                  <td className="px-4 py-3 text-white max-w-[220px] truncate">{c.modelo}</td>
                  <td className="px-4 py-3 text-white/80 text-center">{c.cantidad}</td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{COP(c.costoUnitario)}</td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{COP(c.costoTotal)}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}
                    >
                      {c.categoria}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <td colSpan={4} className="px-4 py-3 text-xs text-white/40 uppercase tracking-wider">
                  Total página
                </td>
                <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">
                  {COP(totalPagina)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Paginación */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-white/40">
            Página {meta.page} de {meta.pages} — {meta.total} registros
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => handlePage(page - 1)}
              className="p-1.5 rounded border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= meta.pages}
              onClick={() => handlePage(page + 1)}
              className="p-1.5 rounded border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
