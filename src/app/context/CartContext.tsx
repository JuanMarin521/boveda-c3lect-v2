import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Producto } from "../data/types";

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD"; producto: Producto }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; cantidad: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const max = action.producto.stock;
      const existing = state.items.find((i) => i.producto.id === action.producto.id);
      if (existing) {
        const cantidad = max != null ? Math.min(existing.cantidad + 1, max) : existing.cantidad + 1;
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.producto.id === action.producto.id ? { ...i, cantidad } : i
          ),
        };
      }
      const cantidadInicial = max != null ? Math.min(1, max) : 1;
      if (cantidadInicial < 1) return { ...state, isOpen: true };
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { producto: action.producto, cantidad: cantidadInicial }],
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.producto.id !== action.id) };
    case "UPDATE_QTY": {
      if (action.cantidad < 1) {
        return { ...state, items: state.items.filter((i) => i.producto.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) => {
          if (i.producto.id !== action.id) return i;
          const max = i.producto.stock;
          const cantidad = max != null ? Math.min(action.cantidad, max) : action.cantidad;
          return { ...i, cantidad };
        }),
      };
    }
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (producto: Producto) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, cantidad: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem("c3lect-cart");
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: loadCart(), isOpen: false });

  useEffect(() => {
    try {
      localStorage.setItem("c3lect-cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const totalItems = state.items.reduce((acc, i) => acc + i.cantidad, 0);
  const totalPrice = state.items.reduce(
    (acc, i) => acc + (i.producto.precio as number) * i.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem: (p) => dispatch({ type: "ADD", producto: p }),
        removeItem: (id) => dispatch({ type: "REMOVE", id }),
        updateQty: (id, cantidad) => dispatch({ type: "UPDATE_QTY", id, cantidad }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        openCart: () => dispatch({ type: "OPEN" }),
        closeCart: () => dispatch({ type: "CLOSE" }),
        toggleCart: () => dispatch({ type: "TOGGLE" }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}