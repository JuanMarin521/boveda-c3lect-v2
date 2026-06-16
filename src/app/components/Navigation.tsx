// ============================================================
// COMPONENTE: NAVEGACIÓN PRINCIPAL
// Cambia los links → modifica el array "links" abajo
// Logo: texto C3LECT en dorado (Montserrat Light + tracking)
// ============================================================

import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Search, ShoppingBag, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProductos } from "../context/ProductosContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const NAV_HEIGHT = 64;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { productos } = useProductos();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const { totalItems, toggleCart } = useCart();
  const { user, autenticado, logout } = useAuth();
  const esAdmin = user?.rol === 'ADMIN';

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen && !isSearchOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideNav = menuRef.current?.contains(target);
      const insideSearch = searchPanelRef.current?.contains(target);
      if (!insideNav && !insideSearch) {
        setIsOpen(false);
        setIsSearchOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const precioFormateado = (precio: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio);

  const todosResultados = query.trim().length > 0
    ? productos.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.display.toLowerCase().includes(q) ||
          p.nombre.toLowerCase().includes(q) ||
          p.estilo.toLowerCase().includes(q) ||
          (p.cat === "reloj" ? "relojería" : p.cat === "perfume" ? "perfumería" : "accesorios").includes(q)
        );
      })
    : [];

  const resultados = todosResultados.slice(0, 6);

  function abrirProducto(id: string) {
    navigate(`/product/${id}`);
    setIsSearchOpen(false);
    setQuery("");
  }

  function irABusqueda() {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsSearchOpen(false);
    setQuery("");
  }

  function toggleSearch() {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setQuery("");
    } else {
      setIsOpen(false);
      setIsSearchOpen(true);
    }
  }

  const links = [
    { to: "/catalog", label: "Colecciones" },
    { to: "/about", label: "Manifiesto" },
    { to: "/contact", label: "Contacto" },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black"
        role="navigation"
        aria-label="Navegación principal"
        ref={menuRef}
      >
        <div
          className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between"
          style={{ height: `${NAV_HEIGHT}px` }}
        >
          <Link
            to="/"
            aria-label="C3LECT — inicio"
            className="text-xl tracking-[0.22em] shrink-0"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "#C9A84C" }}
          >
            C3LECT
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm tracking-wide uppercase transition-colors hover:text-[#C9A84C] cursor-pointer ${isActive(link.to) ? "text-[#C9A84C]" : "text-white"}`}
                aria-current={isActive(link.to) ? "page" : undefined}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#C9A84C]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            {esAdmin && (
              <Link
                to="/admin"
                className={`relative text-sm tracking-wide uppercase transition-colors hover:text-[#C9A84C] cursor-pointer ${isActive('/admin') ? "text-[#C9A84C]" : "text-white"}`}
              >
                Panel
                {isActive('/admin') && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#C9A84C]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )}
            <button
              onClick={toggleSearch}
              aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar productos"}
              className={`p-1 transition-colors hover:text-[#C9A84C] cursor-pointer ${isSearchOpen ? "text-[#C9A84C]" : "text-white"}`}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <button
              onClick={toggleCart}
              aria-label={`Abrir carrito${totalItems > 0 ? ` — ${totalItems} ítem${totalItems > 1 ? "s" : ""}` : ""}`}
              className="relative p-1 text-white transition-colors hover:text-[#C9A84C] cursor-pointer"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center tabular-nums" style={{ backgroundColor: "#C9A84C" }}>
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            {autenticado ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-sm tracking-wide"
                  style={{ color: "#C9A84C" }}
                >
                  {user?.nombre?.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  aria-label="Cerrar sesión"
                  className="p-1 text-white/50 transition-colors hover:text-[#C9A84C] cursor-pointer"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Iniciar sesión"
                className="p-1 text-white transition-colors hover:text-[#C9A84C]"
              >
                <User size={20} />
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleCart}
              aria-label={`Abrir carrito${totalItems > 0 ? ` — ${totalItems} ítem${totalItems > 1 ? "s" : ""}` : ""}`}
              className="relative p-2 text-white transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center tabular-nums" style={{ backgroundColor: "#C9A84C" }}>
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={toggleSearch}
              aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar productos"}
              className="p-2 transition-colors"
              style={{ color: isSearchOpen ? "#C9A84C" : "#FFFFFF" }}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            ref={searchPanelRef}
            className="fixed left-0 right-0 bg-black z-40 border-t border-white/10"
            style={{ top: `${NAV_HEIGHT}px` }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-5">
              <div className="flex items-center gap-3 border-b border-white/20 pb-3">
                <Search size={16} className="text-white/40 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && irABusqueda()}
                  placeholder="Buscar relojes, perfumes…"
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm tracking-wide outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-white/40 hover:text-white">
                    <X size={16} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {resultados.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex flex-col gap-1"
                  >
                    {resultados.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => abrirProducto(p.id)}
                        className="flex items-center gap-4 p-2 rounded hover:bg-white/5 transition-colors text-left w-full group"
                      >
                        <img
                          src={import.meta.env.BASE_URL + p.imgs[0]}
                          alt={p.display}
                          className="w-10 h-10 object-cover shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="min-w-0">
                          <p className="text-white text-sm tracking-wide truncate group-hover:text-[#C9A84C] transition-colors">
                            {p.display}
                          </p>
                          <p className="text-white/40 text-xs uppercase tracking-widest">
                            {p.cat === "reloj" ? "Relojería" : "Perfumería"} · {precioFormateado(p.precio as number)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
                {query.trim().length > 0 && resultados.length === 0 && (
                  <p className="mt-4 text-white/30 text-sm">
                    Sin resultados para "{query}"
                  </p>
                )}
              </AnimatePresence>

              {query.trim().length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={irABusqueda}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C9A84C] transition-colors tracking-wide w-full"
                  >
                    <Search size={14} className="shrink-0" />
                    <span>
                      Ver todos los resultados
                      {todosResultados.length > 0 && (
                        <span className="ml-1 text-white/40">({todosResultados.length})</span>
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 bg-black z-40 md:hidden"
            style={{ top: `${NAV_HEIGHT}px` }}
          >
            <div className="px-6 py-8 flex flex-col gap-6 border-t border-white/10">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-lg tracking-wide uppercase transition-colors hover:text-[#C9A84C] cursor-pointer ${isActive(link.to) ? "text-[#C9A84C]" : "text-white"}`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {link.label}
                </Link>
              ))}
              {esAdmin && (
                <Link
                  to="/admin"
                  className={`text-lg tracking-wide uppercase transition-colors hover:text-[#C9A84C] cursor-pointer ${isActive('/admin') ? "text-[#C9A84C]" : "text-white"}`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Panel
                </Link>
              )}
              <div className="border-t border-white/10 pt-6">
                {autenticado ? (
                  <>
                    <p className="text-sm text-white/40 mb-3">{user?.nombre}</p>
                    <button
                      onClick={logout}
                      className="text-lg tracking-wide uppercase text-white/50 hover:text-[#C9A84C] transition-colors text-left cursor-pointer"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-lg tracking-wide uppercase transition-colors hover:text-[#C9A84C]"
                    style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
                  >
                    Acceder
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: `${NAV_HEIGHT}px` }} />
    </>
  );
}