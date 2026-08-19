// ============================================================
// LAYOUT: MI CUENTA — /cuenta/*
//
// Guarda la sesión una sola vez acá (no en cada página hija) y arma el
// sidebar. Las páginas hijas (AccountOrders, AccountProfile,
// AccountAddresses) solo renderizan su columna de contenido.
// ============================================================

import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/cuenta", label: "Pedidos", end: true },
  { to: "/cuenta/datos", label: "Datos personales", end: false },
  { to: "/cuenta/direcciones", label: "Direcciones", end: false },
];

export default function AccountLayout() {
  const { user, autenticado, cargando, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cargando && !autenticado) navigate("/login");
  }, [cargando, autenticado, navigate]);

  if (cargando || !autenticado) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-12 md:pt-[140px] pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 md:gap-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:pt-1"
        >
          <p className="text-[10px] uppercase text-white/40 mb-6" style={{ letterSpacing: "0.28em" }}>
            {user?.nombre}
          </p>
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `py-3 text-sm border-b border-white/10 transition-colors ${
                    isActive ? "text-[#C9A84C]" : "text-white/70 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={async () => { await logout(); navigate("/"); }}
              className="py-3 text-sm text-white/40 hover:text-[#C9A84C] transition-colors text-left cursor-pointer"
            >
              Salir
            </button>
          </nav>
        </motion.aside>

        {/* Contenido */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
