import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import OfflineBanner from "./OfflineBanner";
import { useMetaPixelRouteTracking } from "../hooks/useMetaPixelRouteTracking";
import { CartProvider } from "../context/CartContext";
import { ProductosProvider } from "../context/ProductosContext";
import { PromocionesProvider } from "../context/PromocionesContext";

export default function Root() {
  const location = useLocation();
  // PageView del pixel en cada cambio de ruta. Meta no detecta por su cuenta
  // la navegación de una SPA.
  useMetaPixelRouteTracking();
  return (
    <PromocionesProvider>
    <CartProvider>
      <ProductosProvider>
        <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
          <OfflineBanner />
          <ScrollRestoration />
          <Navigation />
          <main className="flex-1 relative">
            <Suspense fallback={null}>
              {/* mode="popLayout" (no "wait"): "wait" NO monta la pagina entrante
                  hasta que Framer Motion confirme que la saliente termino su
                  animacion de salida. Si esa confirmacion se pierde (tab en
                  background, un frame de animacion que no dispara en el
                  dispositivo real), el area de contenido queda vacia
                  indefinidamente sin ningun error en consola — el router ya
                  cargo la pagina nueva, pero AnimatePresence nunca la monta.
                  El router.lazy en routes.tsx ya garantiza que el contenido
                  este listo antes del swap, asi que no hace falta secuenciar
                  salida-antes-que-entrada aca. popLayout saca la pagina
                  saliente del flujo (position absolute mientras se desvanece)
                  para que no se amontone con la entrante durante el crossfade. */}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </ProductosProvider>
    </CartProvider>
    </PromocionesProvider>
  );
}
