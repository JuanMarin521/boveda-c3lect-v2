import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../lib/api';
import { formatPrecio as COP } from '../../lib/format';


interface Cliente {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  createdAt: string;
  totalPedidos: number;
  totalGastado: number;
}

interface Paginado { data: Cliente[]; meta: { total: number; page: number; totalPages: number } }

export default function AdminClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function fetchClientes(q: string, p: number) {
    setCargando(true);
    const params: Record<string, string> = { page: String(p), limit: '20' };
    if (q) params.search = q;
    api.get<Paginado>('/users', { params })
      .then(({ data }) => {
        setClientes(data.data);
        setMeta(data.meta);
      })
      .catch(() => setClientes([]))
      .finally(() => setCargando(false));
  }

  useEffect(() => { fetchClientes(query, page); }, [query, page]);

  function handleSearch(val: string) {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      setPage(1);
    }, 400);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Clientes</h1>
        <p className="text-sm text-white/40 mt-0.5">{meta.total} clientes registrados</p>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-2 mb-5 max-w-xs">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded border outline-none"
            style={{ background: '#1A1A1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {['Nombre', 'Email', 'Registro', 'Pedidos', 'Total gastado'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {clientes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-white/30">Sin clientes</td>
                  </tr>
                )}
                {clientes.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/admin/clientes/${c.id}`)}
                    className="hover:bg-white/3 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white">{c.nombre}</p>
                      {c.rol === 'ADMIN' && (
                        <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider">Admin</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/60">{c.email}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {format(new Date(c.createdAt), 'd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-4 py-3 text-white/70">{c.totalPedidos}</td>
                    <td className="px-4 py-3 text-white/70">{COP(c.totalGastado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/40">Página {page} de {meta.totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 text-white/40 hover:text-white disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 text-white/40 hover:text-white disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
