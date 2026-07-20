import { Outlet, ScrollRestoration } from "react-router";
import { Suspense } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "../context/CartContext";
import { ProductosProvider } from "../context/ProductosContext";

export default function Root() {
  return (
    <CartProvider>
      <ProductosProvider>
        <div className="min-h-screen flex flex-col bg-white">
          <ScrollRestoration />
          <Navigation />
          <main className="flex-1">
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </ProductosProvider>
    </CartProvider>
  );
}
