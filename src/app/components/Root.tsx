import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import OfflineBanner from "./OfflineBanner";
import { CartProvider } from "../context/CartContext";
import { ProductosProvider } from "../context/ProductosContext";

export default function Root() {
  const location = useLocation();
  return (
    <CartProvider>
      <ProductosProvider>
        <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
          <OfflineBanner />
          <ScrollRestoration />
          <Navigation />
          <main className="flex-1 relative">
            <Suspense fallback={null}>
              <AnimatePresence mode="wait" initial={false}>
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
  );
}
