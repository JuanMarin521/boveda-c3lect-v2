import { Outlet, ScrollRestoration } from "react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "../context/CartContext";

export default function Root() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <ScrollRestoration />
        <Navigation />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
