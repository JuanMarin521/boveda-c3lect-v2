import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { getPromociones } from "../data/promotions";
import { mejorDescuento, calcularPrecioFinal, type Promocion } from "../lib/promotions";
import { useAuth } from "./AuthContext";
import type { Producto } from "../data/types";

interface PromocionesContextValue {
  promociones: Promocion[];
  cargando: boolean;
  recargar: () => void;
}

const PromocionesContext = createContext<PromocionesContextValue | null>(null);

export function PromocionesProvider({ children }: { children: ReactNode }) {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    setCargando(true);
    getPromociones()
      .then(setPromociones)
      .catch(() => setPromociones([]))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <PromocionesContext.Provider value={{ promociones, cargando, recargar: cargar }}>
      {children}
    </PromocionesContext.Provider>
  );
}

export function usePromociones() {
  const ctx = useContext(PromocionesContext);
  if (!ctx) throw new Error("usePromociones must be used within PromocionesProvider");
  return ctx;
}

export interface PrecioEfectivo {
  precioOriginal: number;
  precioFinal: number;
  descuentoPorcentaje: number;
  enPromocion: boolean;
}

// Precio a mostrar en el catálogo, considerando la mejor promoción vigente
// para el producto y si el visitante tiene sesión iniciada. Solo para
// display — el cobro real siempre se recalcula server-side en el backend.
export function usePrecioEfectivo(producto: Producto): PrecioEfectivo {
  const { promociones } = usePromociones();
  const { autenticado } = useAuth();

  return useMemo(() => {
    const descuentoPorcentaje = mejorDescuento(promociones, producto, autenticado);
    const precioOriginal = producto.precio;
    return {
      precioOriginal,
      precioFinal: calcularPrecioFinal(precioOriginal, descuentoPorcentaje),
      descuentoPorcentaje,
      enPromocion: descuentoPorcentaje > 0,
    };
  }, [promociones, producto, autenticado]);
}
