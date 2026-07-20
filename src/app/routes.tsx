import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "./components/Root";
import AdminRoot from "./admin/AdminRoot";

const Home = lazy(() => import("./pages/Home"));
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutResult = lazy(() => import("./pages/CheckoutResult"));

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
        { path: "catalog", Component: Catalog },
        { path: "catalog/:category", Component: Catalog },
        { path: "search", Component: SearchResults },
        { path: "product/:id", Component: ProductDetail },
        { path: "about", Component: About },
        { path: "contact", Component: Contact },
        { path: "login", Component: Login },
        { path: "register", Component: Register },
        { path: "reset-password", Component: ResetPassword },
        { path: "checkout", Component: Checkout },
        { path: "checkout/success", Component: CheckoutResult },
        { path: "checkout/failure", Component: CheckoutResult },
        { path: "checkout/pending", Component: CheckoutResult },
        { path: "*", Component: NotFound },
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
  { basename: "/boveda-c3lect-v2" }
);
