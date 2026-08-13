import { createBrowserRouter } from "react-router";
import { lazy, type ComponentType } from "react";
import Root from "./components/Root";
import AdminRoot from "./admin/AdminRoot";
// Home NO se carga con lazy(): es la ruta con la que aterriza casi todo el
// mundo, así que separarla en su propio chunk solo suma un round-trip extra
// antes del primer render Y deja el <Suspense fallback={null}> mostrando
// nav+footer vacíos durante ese tiempo, lo que generaba un CLS enorme
// (el contenido de Home se insertaba después, empujando el footer).
import Home from "./pages/Home";

// Las rutas públicas usan la API `lazy` del router (no `React.lazy` + Suspense):
// el router espera a que el chunk cargue ANTES de confirmar la navegación,
// así <ScrollRestoration> siempre actúa sobre el contenido final ya montado.
// Con React.lazy + Suspense fallback={null}, el router daba la navegación
// por completa mientras el fallback (vacío) aún colapsaba el layout, y el
// navegador recortaba el scroll al alto corto de esa página en blanco antes
// de que el contenido real apareciera — de ahí que el producto "abriera
// abajo" y el catálogo "perdiera" el scroll al volver.
const lazyPage = (loader: () => Promise<{ default: ComponentType }>) =>
  async () => ({ Component: (await loader()).default });

const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminProductos = lazy(() => import("./admin/pages/AdminProductos"));
const AdminProductoForm = lazy(() => import("./admin/pages/AdminProductoForm"));
const AdminPedidos = lazy(() => import("./admin/pages/AdminPedidos"));
const AdminPedidoDetalle = lazy(() => import("./admin/pages/AdminPedidoDetalle"));
const AdminClientes = lazy(() => import("./admin/pages/AdminClientes"));
const AdminClienteDetalle = lazy(() => import("./admin/pages/AdminClienteDetalle"));
const AdminAuditoria = lazy(() => import("./admin/pages/AdminAuditoria"));
const AdminVentas = lazy(() => import("./admin/pages/AdminVentas"));
const AdminCompras = lazy(() => import("./admin/pages/AdminCompras"));
const AdminGastos = lazy(() => import("./admin/pages/AdminGastos"));
const AdminInventario = lazy(() => import("./admin/pages/AdminInventario"));
const AdminPrecios = lazy(() => import("./admin/pages/AdminPrecios"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: Home },
        { path: "catalog", lazy: lazyPage(() => import("./pages/Catalog")) },
        { path: "catalog/:category", lazy: lazyPage(() => import("./pages/Catalog")) },
        { path: "search", lazy: lazyPage(() => import("./pages/SearchResults")) },
        { path: "product/:id", lazy: lazyPage(() => import("./pages/ProductDetail")) },
        { path: "about", lazy: lazyPage(() => import("./pages/About")) },
        { path: "contact", lazy: lazyPage(() => import("./pages/Contact")) },
        { path: "login", lazy: lazyPage(() => import("./pages/Login")) },
        { path: "register", lazy: lazyPage(() => import("./pages/Register")) },
        { path: "reset-password", lazy: lazyPage(() => import("./pages/ResetPassword")) },
        { path: "checkout", lazy: lazyPage(() => import("./pages/Checkout")) },
        { path: "checkout/success", lazy: lazyPage(() => import("./pages/CheckoutResult")) },
        { path: "checkout/failure", lazy: lazyPage(() => import("./pages/CheckoutResult")) },
        { path: "checkout/pending", lazy: lazyPage(() => import("./pages/CheckoutResult")) },
        { path: "*", lazy: lazyPage(() => import("./pages/NotFound")) },
      ],
    },
    {
      path: "/admin",
      Component: AdminRoot,
      children: [
        {
          Component: AdminLayout,
          children: [
            { index: true, Component: AdminDashboard },
            { path: "productos", Component: AdminProductos },
            { path: "productos/nuevo", Component: AdminProductoForm },
            { path: "productos/:id", Component: AdminProductoForm },
            { path: "pedidos", Component: AdminPedidos },
            { path: "pedidos/:id", Component: AdminPedidoDetalle },
            { path: "clientes", Component: AdminClientes },
            { path: "clientes/:id", Component: AdminClienteDetalle },
            { path: "auditoria", Component: AdminAuditoria },
            { path: "ventas", Component: AdminVentas },
            { path: "compras", Component: AdminCompras },
            { path: "gastos", Component: AdminGastos },
            { path: "inventario", Component: AdminInventario },
            { path: "precios", Component: AdminPrecios },
          ],
        },
      ],
    },
  ],
);
