import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "./components/Root";
import Home from "./pages/Home";

const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SearchResults = lazy(() => import("./pages/SearchResults"));

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
