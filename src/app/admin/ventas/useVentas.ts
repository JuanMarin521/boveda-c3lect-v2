import { useCallback, useEffect, useState } from 'react';
import { inventarioApi, type ItemInventario } from '../../api/inventario';
import { marcasApi } from '../../api/marcas';
import { metricsApi, type VentasPaginadas } from '../../api/metrics';
import { preciosApi, type Precio } from '../../api/precios';
import { productsApi, type ProductoAdmin } from '../../api/products';
import { ventasApi, type Venta } from '../../api/ventas';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';
import { exportCSV } from './exportar-csv';
import {
  datosDesdeForm,
  EMPTY_FORM,
  formDesdeVenta,
  type FormState,
} from './venta-form';

// Datos y acciones de la página de ventas: listado con filtros, opciones del
// formulario y alta/edición/borrado. La página solo dibuja.
export function useVentas() {
  const [data, setData]         = useState<Venta[]>([]);
  const [meta, setMeta]         = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage]         = useState(1);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFuente, setFiltroFuente] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [desde, setDesde]       = useState('');
  const [hasta, setHasta]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [guardando, setGuardando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [formError, setFormError] = useState('');
  const [resumen, setResumen] = useState({ totalVendido: 0, pendienteCobro: 0 });
  const [editId, setEditId]     = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [editError, setEditError] = useState('');
  const [eliminando, setEliminando] = useState<string | null>(null);

  const ventasQuery = useApiQuery<VentasPaginadas>(
    async (signal) => {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (filtroEstado) params.estado = filtroEstado;
      if (filtroFuente) params.fuente = filtroFuente;
      if (filtroCategoria) params.categoria = filtroCategoria;
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      return metricsApi.ventas(params, signal);
    },
    [page, filtroEstado, filtroFuente, filtroCategoria, desde, hasta],
  );
  const cargando = ventasQuery.loading;

  useEffect(() => {
    if (ventasQuery.data) {
      setData(ventasQuery.data.data);
      setMeta({
        total: ventasQuery.data.meta.total,
        page: ventasQuery.data.meta.page,
        pages: ventasQuery.data.meta.totalPages,
      });
      setResumen(ventasQuery.data.agregados);
    }
  }, [ventasQuery.data]);

  // Volver a página 1 cuando cambian los filtros — igual criterio que en AdminCompras.
  useEffect(() => { setPage(1); }, [filtroEstado, filtroFuente, filtroCategoria, desde, hasta]);

  useRefetchOnFocus(useCallback(() => ventasQuery.refetch(), [ventasQuery.refetch]));

  const inventarioQuery = useApiQuery<ItemInventario[]>(async (signal) => {
    return inventarioApi.listar(signal);
  }, []);
  const inventario = inventarioQuery.data ?? [];

  const preciosQuery = useApiQuery<Precio[]>(async (signal) => {
    return preciosApi.listar(signal);
  }, []);
  const precios = preciosQuery.data ?? [];

  const productosQuery = useApiQuery<ProductoAdmin[]>(async (signal) => {
    return productsApi.listar({}, signal);
  }, []);
  const productos = productosQuery.data ?? [];

  const marcasQuery = useApiQuery<string[]>(async (signal) => {
    return marcasApi.listar(signal);
  }, []);
  const marcas = marcasQuery.data ?? [];

  const errorOpciones =
    !!inventarioQuery.error || !!preciosQuery.error || !!productosQuery.error || !!marcasQuery.error;

  const handlePage = (p: number) => { setPage(p); };

  const handleExport = async () => {
    setExportando(true);
    try {
      const res = await metricsApi.ventas({ page: 1, limit: 1000 });
      exportCSV(res.data);
    } finally { setExportando(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setGuardando(true);
    try {
      await ventasApi.crear(datosDesdeForm(form));
      setShowForm(false);
      setForm(EMPTY_FORM);
      setPage(1);
      ventasQuery.refetch();
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Error al guardar la venta');
    } finally { setGuardando(false); }
  };

  const handleEdit = (v: Venta) => {
    setEditId(v.id);
    setEditError('');
    setShowForm(false);
    setEditForm(formDesdeVenta(v));
  };

  const handleEditSave = async () => {
    if (!editId) return;
    setGuardando(true);
    setEditError('');
    try {
      await ventasApi.actualizar(editId, datosDesdeForm(editForm));
      setEditId(null);
      ventasQuery.refetch();
    } catch (err: any) {
      setEditError(err?.response?.data?.message ?? 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta venta? Se revertirá el descuento de inventario.')) return;
    setEliminando(id);
    try {
      await ventasApi.eliminar(id);
      ventasQuery.refetch();
    } finally { setEliminando(null); }
  };

  return {
    data, meta, page, cargando, resumen, handlePage,
    filtroEstado, setFiltroEstado, filtroFuente, setFiltroFuente,
    filtroCategoria, setFiltroCategoria, desde, setDesde, hasta, setHasta,
    marcas, inventario, precios, productos, errorOpciones,
    showForm, setShowForm, form, setForm, formError, handleSubmit,
    editId, setEditId, editForm, setEditForm, editError, setEditError,
    handleEdit, handleEditSave,
    guardando, exportando, handleExport, eliminando, handleDelete,
  };
}
