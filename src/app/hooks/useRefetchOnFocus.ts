import { useEffect } from 'react';

/**
 * Vuelve a ejecutar `callback` cuando la pestaña recupera foco o visibilidad.
 * Sin esto, una pestaña de admin que quedó abierta muestra datos obsoletos
 * si el cambio (venta, compra, edición de precio) se hizo en otra pestaña.
 */
export function useRefetchOnFocus(callback: () => void) {
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') callback();
    }
    window.addEventListener('focus', callback);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', callback);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [callback]);
}
