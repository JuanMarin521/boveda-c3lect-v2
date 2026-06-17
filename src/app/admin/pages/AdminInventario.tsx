import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

interface Item {
  id: string; modelo: string; stock: number; costoUnitario: number;
  categoria: string; capitalItem: number;
  productos: { id: string; nombre: string; disponible: boolean }[];
}
interface Producto { id: string; nombre: string; cat: string; inventarioId: string | null }

export default function AdminInventario() {
  const [items, setItems]   = useState<Item[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [linkingId, setLinkingId] = useState<string | null>(null);

  const cargar = () => {
    setCargando(true);
    api.get<Item[]>('/inventario').then(({ data }) => setItems(data)).finally(() => setCargando(false));
  };
  const cargarProductos = () => {
    api.get<Producto[]>('/products').then(({ data }) => setProductos(data)).catch(() => {});
  };

  useEffect(() => { cargar(); }, []);
  useEffect(() => { cargarProductos(); }, []);
  useRefetchOnFocus(() => { cargar(); cargarProductos(); });

  const setProductosVinculados = async (itemId: string, productIds: string[]) => {
    setLinkingId(itemId);
    try {
      await api.patch(`/inventario/${itemId}/link`, { productIds });
      cargar();
      cargarProductos();
    } finally {
      setLinkingId(null);
    }
  };

  const handleAgregar = (item: Item, productId: string) => {
    if (!productId) return;
    setProductosVinculados(item.id, [...item.productos.map(p => p.id), productId]);
  };

  const handleQuitar = (item: Item, productId: string) => {
    setProductosVinculados(item.id, item.productos.filter(p => p.id !== productId).map(p => p.id));
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg('');
    try {
      const { data } = await api.post<{ seeded: number }>('/inventario/seed');
      setSeedMsg(`${data.seeded} modelos importados desde compras históricas.`);
      cargar();
    } catch {
      setSeedMsg('Error al poblar el inventario.');
    } finally {
      setSeeding(false);
    }
  };

  const filtrados = filtro
    ? items.filter(i => i.categoria === filtro)
    : items;

  const totalCapital = filtrados.reduce((s, i) => s + i.capitalItem, 0);
  const totalUnidades = filtrados.reduce((s, i) => s + i.stock, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Inventario Maestro</h1>
          <p className="text-sm text-white/40">
            <span className="text-[#C9A84C]">{filtrados.length}</span> modelos
            {' · '}{totalUnidades} unidades
            {' · '}Capital: <span className="text-[#C9A84C]">{COP(totalCapital)}</span>
          </p>
          {seedMsg && <p className="text-xs text-green-400 mt-1">{seedMsg}</p>}
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
          style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <RefreshCw size={15} className={seeding ? 'animate-spin' : ''} />
          {seeding ? 'Recalculando…' : 'Recalcular inventario'}
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        {['', 'Reloj', 'Perfume', 'Accesorio'].map(c => (
          <button key={c} onClick={() => setFiltro(c)}
            className="px-3 py-1.5 rounded text-sm transition-colors"
            style={{
              background: filtro === c ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
              color: filtro === c ? '#C9A84C' : 'rgba(255,255,255,0.5)',
              border: `1px solid ${filtro === c ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.1)'}`,
            }}>
            {c || 'Todos'}
          </button>
        ))}
      </div>

      <div className="rounded-lg border overflow-x-auto" style={{ background: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
        {cargando ? (
          <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 border-white/20 border-t-[#C9A84C] rounded-full animate-spin" /></div>
        ) : filtrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-white/30 mb-2">Sin datos de inventario</p>
            <p className="text-xs text-white/20">El inventario se actualiza automáticamente al registrar compras y ventas</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {['Modelo','Categoría','Stock','Costo Unitario','Capital','Producto vinculado'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {filtrados.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white">{item.modelo}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>{item.categoria}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${item.stock === 0 ? 'text-red-400' : item.stock <= 2 ? 'text-yellow-400' : 'text-white'}`}>
                      {item.stock} ud{item.stock !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{COP(item.costoUnitario)}</td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{COP(item.capitalItem)}</td>
                  <td className="px-4 py-3 min-w-[220px]">
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {item.productos.length === 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}>
                          Sin vincular
                        </span>
                      ) : item.productos.map(p => (
                        <span key={p.id} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.06)', color: p.disponible ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
                          {p.nombre}
                          <button onClick={() => handleQuitar(item, p.id)} disabled={linkingId === item.id} className="hover:text-red-400">
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <select
                      value=""
                      disabled={linkingId === item.id}
                      onChange={e => handleAgregar(item, e.target.value)}
                      className="bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-xs text-white/60 focus:outline-none focus:border-[#C9A84C]/60 cursor-pointer max-w-[200px]"
                    >
                      <option value="">+ vincular variante…</option>
                      {productos
                        .filter(p => p.inventarioId === null || p.inventarioId === item.id)
                        .filter(p => !item.productos.some(linked => linked.id === p.id))
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <td colSpan={2} className="px-4 py-3 text-xs text-white/40 uppercase tracking-wider">Total</td>
                <td className="px-4 py-3 text-white font-medium">{totalUnidades} uds</td>
                <td />
                <td className="px-4 py-3 text-[#C9A84C] font-semibold whitespace-nowrap">{COP(totalCapital)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <p className="text-xs text-white/25 mt-4">El inventario se actualiza automáticamente al registrar compras y ventas.</p>
    </div>
  );
}
