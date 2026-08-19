// ============================================================
// PÁGINA: MI CUENTA — PEDIDOS — /cuenta
//
// Lista los pedidos del usuario autenticado vía GET /orders (el backend
// ya scopea automáticamente a `userId` para rol CLIENTE — no existe un
// endpoint separado "/orders/my"). No hay concepto de "reserva": el
// backend solo modela PENDIENTE/CONFIRMADO/EN_CAMINO/ENTREGADO/CANCELADO.
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useProductos } from "../context/ProductosContext";
import { api } from "../lib/api";
import { formatPrecio, formatFecha } from "../lib/format";
import { AvisoError } from "../components/AvisoError";
import { Button } from "../components/ds/Button";

type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "EN_CAMINO" | "ENTREGADO" | "CANCELADO";

interface OrderItem {
  id: string;
  productId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: EstadoPedido;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  data: Order[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const ESTADO: Record<EstadoPedido, { label: string; dorado: boolean }> = {
  PENDIENTE:  { label: "Pendiente",  dorado: false },
  CONFIRMADO: { label: "Confirmado", dorado: true },
  EN_CAMINO:  { label: "En camino",  dorado: true },
  ENTREGADO:  { label: "Entregado",  dorado: false },
  CANCELADO:  { label: "Cancelado",  dorado: false },
};

const LIMIT = 10;

export default function AccountOrders() {
  const { productos } = useProductos();

  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrdersResponse["meta"] | null>(null);
  const [page, setPage] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const cargarPedidos = useCallback(() => {
    setCargando(true);
    setError(false);
    api
      .get<OrdersResponse>("/orders", { params: { page, limit: LIMIT } })
      .then(({ data }) => {
        setPedidos(data.data);
        setMeta(data.meta);
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, [page]);

  useEffect(() => { cargarPedidos(); }, [cargarPedidos]);

  // Miniatura por producto — no viene en OrderItem (solo guarda nombre/precio),
  // así que se resuelve del catálogo ya cargado en memoria (sin pedir de más).
  const imagenPorProducto = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of productos) if (p.imgs[0]) m.set(p.id, p.imgs[0]);
    return m;
  }, [productos]);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl mb-12 pb-7 border-b border-white/10 tracking-wide text-white"
        style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
      >
        Mis pedidos
      </motion.h1>

      {error ? (
        <AvisoError
          titulo="No pudimos cargar tus pedidos"
          detalle="Revisá tu conexión y volvé a intentarlo en un momento."
          onRetry={cargarPedidos}
        />
      ) : cargando ? (
        <p className="text-white/40 text-center py-20">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-20">
          <Package size={28} className="mx-auto mb-6 text-white/30" aria-hidden="true" />
          <p className="text-white/60 mb-6">Todavía no has hecho ningún pedido.</p>
          <Button as={Link} to="/catalog" variant="outline" className="w-auto inline-flex">
            Explorar colecciones
          </Button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-white/10">
            {pedidos.map((pedido, i) => (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-6 py-8"
              >
                <div className="w-16 h-20 md:w-24 md:h-[124px] shrink-0 bg-[#141414] overflow-hidden">
                  {pedido.items[0] && imagenPorProducto.get(pedido.items[0].productId) && (
                    <img
                      src={import.meta.env.BASE_URL + imagenPorProducto.get(pedido.items[0].productId)}
                      alt={pedido.items[0].nombre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase text-white/35 mb-1" style={{ letterSpacing: "0.24em" }}>
                    {pedido.orderNumber} · {formatFecha(pedido.createdAt)}
                  </p>
                  <h3
                    className="text-xl md:text-3xl mb-1 text-white truncate"
                    style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
                  >
                    {pedido.items[0]?.nombre}
                    {pedido.items.length > 1 && (
                      <span className="text-white/40 text-base md:text-lg ml-2">
                        + {pedido.items.length - 1} más
                      </span>
                    )}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {pedido.items.reduce((n, i) => n + i.cantidad, 0)} artículo(s)
                  </p>
                </div>

                <div className="shrink-0 text-right flex flex-col items-end gap-3">
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "#C9A84C" }}>
                    {formatPrecio(pedido.total)}
                  </p>
                  <span
                    className="text-[10px] uppercase px-3 py-1 border whitespace-nowrap"
                    style={{
                      letterSpacing: "0.2em",
                      color: ESTADO[pedido.status].dorado ? "#C9A84C" : "rgba(255,255,255,0.5)",
                      borderColor: ESTADO[pedido.status].dorado ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.15)",
                    }}
                  >
                    {ESTADO[pedido.status].label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-[#C9A84C] transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={14} /> Anterior
              </button>
              <p className="text-xs text-white/40">
                Página {meta.page} de {meta.totalPages}
              </p>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-[#C9A84C] transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Siguiente <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
