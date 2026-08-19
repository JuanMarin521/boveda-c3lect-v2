import { Link } from "react-router";
import { Instagram } from "lucide-react";
import { CONFIG } from "../config";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
          {/* Marca — Montserrat Light con tracking, alineación perfecta con el párrafo */}
          <div>
            <p
              className="text-2xl tracking-[0.22em] text-white mb-4"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              C3LECT
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Curadurías excepcionales de relojes y perfumes de lujo. {CONFIG.ciudad}.
            </p>
          </div>

          {/* Links de navegación */}
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-6 text-white/60">Navegación</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-sm hover:text-[#C9A84C] transition-colors">
                Inicio
              </Link>
              <Link to="/catalog" className="text-sm hover:text-[#C9A84C] transition-colors">
                Catálogo
              </Link>
              <Link to="/about" className="text-sm hover:text-[#C9A84C] transition-colors">
                Manifiesto
              </Link>
              <Link to="/contact" className="text-sm hover:text-[#C9A84C] transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          {/* Redes sociales — enlace desde config.ts */}
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-6 text-white/60">Síguenos</h4>
            <a
              href={CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-[#C9A84C] transition-colors"
              aria-label="Instagram de C3LECT"
            >
              <Instagram size={18} aria-hidden="true" />
              {CONFIG.instagramHandle}
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/15 text-center text-xs text-white/60">
          © {new Date().getFullYear()} C3LECT. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
