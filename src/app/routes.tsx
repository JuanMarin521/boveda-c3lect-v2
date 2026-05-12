import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";

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
        { path: "*", Component: NotFound },
      ],
    },
  ],
  { basename: "/boveda-c3lect-v2" }
);
