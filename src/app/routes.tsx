import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "./components/Root";
import Home from "./pages/Home";
import AdminRoot from "./admin/AdminRoot";

const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminProductos = lazy(() => import("./admin/pages/AdminProductos"));
const AdminProductoForm = lazy(() => import("./admin/pages/AdminProductoForm"));
const AdminPedidos = lazy(() => import("./admin/pages/AdminPedidos"));
const AdminPedidoDetalle = lazy(() => import("./admin/pages/AdminPedidoDetalle"));
const AdminClientes = lazy(() => import("./admin/pages/AdminClientes"));
const AdminClienteDetalle = lazy(() => import("./admin/pages/AdminClienteDetalle"));
const AdminAuditoria = lazy(() => import("./admin/pages/AdminAuditoria"));

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
          ],
        },
      ],
    },
  ],
  { basename: "/boveda-c3lect-v2" }
);
