import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getProductos } from "../data/products";
import type { Producto } from "../data/types";

interface ProductosContextValue {
  productos: Producto[];
  cargando: boolean;
  error: Error | null;
  recargar: () => void;
}

const ProductosContext = createContext<ProductosContextValue | null>(null);

export function ProductosProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cargar = useCallback(() => {
    setCargando(true);
    setError(null);
    getProductos()
      .then(setProductos)
      .catch((e) => setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <ProductosContext.Provider value={{ productos, cargando, error, recargar: cargar }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  const ctx = useContext(ProductosContext);
  if (!ctx) throw new Error("useProductos must be used within ProductosProvider");
  return ctx;
}
