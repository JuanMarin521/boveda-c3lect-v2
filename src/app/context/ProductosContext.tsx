import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getProductos } from "../data/products";
import type { Producto } from "../data/types";

interface ProductosContextValue {
  productos: Producto[];
  cargando: boolean;
  error: Error | null;
}

const ProductosContext = createContext<ProductosContextValue | null>(null);

export function ProductosProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch((e) => setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => setCargando(false));
  }, []);

  return (
    <ProductosContext.Provider value={{ productos, cargando, error }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  const ctx = useContext(ProductosContext);
  if (!ctx) throw new Error("useProductos must be used within ProductosProvider");
  return ctx;
}
