import { NavLink, Outlet, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Users, ClipboardList,
  ArrowLeft, Menu, X, TrendingUp, ShoppingCart, Wallet, Archive, Tag,
} from 'lucide-react';
import AdminRoute from '../components/AdminRoute';

const NAV_ITEMS = [
  { to: '/admin',          label: 'Dashboard',         icon: LayoutDashboard, end: true },
  { to: '/admin/productos',label: 'Productos',          icon: Package,         end: false },
  { to: '/admin/pedidos',  label: 'Pedidos',            icon: ShoppingBag,     end: false },
  { to: '/admin/clientes', label: 'Clientes',           icon: Users,           end: false },
  { to: '/admin/ventas',   label: 'Ventas',             icon: TrendingUp,      end: false },
  { to: '/admin/compras',  label: 'Compras',            icon: ShoppingCart,    end: false },
  { to: '/admin/gastos',   label: 'Gastos',             icon: Wallet,          end: false },
  { to: '/admin/inventario',label: 'Inventario',        icon: Archive,         end: false },
  { to: '/admin/precios',  label: 'Precios',            icon: Tag,             end: false },
  { to: '/admin/auditoria',label: 'Auditoria',          icon: ClipboardList,   end: false },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full" style={{ background: '#111111' }}>
      <div className="flex items-center justify-between px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <span className="text-xl tracking-[0.22em]" style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: '#C9A84C' }}>
          C3LECT
        </span>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={20} /></button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded text-sm tracking-wide transition-colors border-l-2 ${
                isActive
                  ? 'border-[#C9A84C] text-[#C9A84C] bg-white/5'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
            onClick={onClose}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/40 hover:text-white/80 transition-colors w-full rounded hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminRoute>
      <div className="min-h-screen flex" style={{ background: '#0A0A0A' }}>
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r fixed top-0 bottom-0 left-0 z-30" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Sidebar />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <aside className={`fixed top-0 bottom-0 left-0 z-50 w-56 lg:hidden transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar onClose={() => setMobileOpen(false)} />
        </aside>

        <div className="flex-1 lg:ml-56 min-w-0">
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-0 z-20" style={{ background: '#111111', borderColor: 'rgba(255,255,255,0.1)' }}>
            <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white"><Menu size={20} /></button>
            <span className="text-base tracking-[0.22em]" style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: '#C9A84C' }}>C3LECT</span>
          </div>

          <main className="p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}
