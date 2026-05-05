// ============================================================
// COMPONENTE: NAVEGACIÓN PRINCIPAL
// Cambia los links → modifica el array "links" abajo
// Logo: texto C3LECT en dorado (Montserrat Light + tracking)
// ============================================================

import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { productos } from "../data/products";

// Altura del nav en px — ajusta si cambias py-* del contenedor
const NAV_HEIGHT = 64;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cierra todo al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setQuery("");
  }, [location.pathname]);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    if (!isOpen && !isSearchOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsSearchOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isSearchOpen]);

  // Cierra búsqueda con Escape
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

  // Foco automático al abrir búsqueda
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const resultados = query.trim().length > 0
    ? productos.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.display.toLowerCase().includes(q) ||
          p.nombre.toLowerCase().includes(q) ||
          p.estilo.toLowerCase().includes(q) ||
          (p.cat === "reloj" ? "relojería" : "perfumería").includes(q)
        );
      }).slice(0, 6)
    : [];

  function abrirProducto(id: string) {
    navigate(`/product/${id}`);
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

  // SECCIÓN: LINKS DE NAVEGACIÓN — edita aquí para añadir o quitar páginas
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
          {/* LOGO — Montserrat Light dorado */}
          <Link
            to="/"
            aria-label="C3LECT — inicio"
            className="text-xl tracking-[0.22em] shrink-0"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "#C9A84C" }}
          >
            C3LECT
          </Link>

          {/* Navegación escritorio + lupa */}
          <div className="hidden md:flex items-center gap-12">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm tracking-wide uppercase transition-colors hover:text-[#C9A84C]"
                style={{ color: isActive(link.to) ? "#C9A84C" : "#FFFFFF" }}
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
            <button
              onClick={toggleSearch}
              aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar productos"}
              className="p-1 transition-colors hover:text-[#C9A84C]"
              style={{ color: isSearchOpen ? "#C9A84C" : "#FFFFFF" }}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Lupa móvil + botón menú */}
          <div className="flex md:hidden items-center gap-2">
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

      {/* Panel de búsqueda */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed left-0 right-0 bg-black z-40 border-t border-white/10"
            style={{ top: `${NAV_HEIGHT}px` }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-5">
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-white/20 pb-3">
                <Search size={16} className="text-white/40 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar relojes, perfumes…"
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm tracking-wide outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-white/40 hover:text-white">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Resultados */}
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
                          src={p.imgs[0]}
                          alt={p.display}
                          className="w-10 h-10 object-cover shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="min-w-0">
                          <p className="text-white text-sm tracking-wide truncate group-hover:text-[#C9A84C] transition-colors">
                            {p.display}
                          </p>
                          <p className="text-white/40 text-xs uppercase tracking-widest">
                            {p.cat === "reloj" ? "Relojería" : "Perfumería"} · {p.precio}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú móvil desplegable */}
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
                  className="text-lg tracking-wide uppercase transition-colors hover:text-[#C9A84C]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: isActive(link.to) ? "#C9A84C" : "#FFFFFF",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Espaciador — empuja el contenido debajo del nav fijo */}
      <div style={{ height: `${NAV_HEIGHT}px` }} />
    </>
  );
}
