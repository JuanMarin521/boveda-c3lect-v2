import { useEffect } from 'react';

/**
 * Vuelve a ejecutar `callback` cuando la pestaña recupera foco o visibilidad.
 * Sin esto, una pestaña de admin que quedó abierta muestra datos obsoletos
 * si el cambio (venta, compra, edición de precio) se hizo en otra pestaña.
 */
export function useRefetchOnFocus(callback: () => void) {
  useEffect(() => {
    // 'focus' y 'visibilitychange' suelen dispararse juntos al volver a la
    // pestaña (duplicando el refetch), pero 'focus' también cubre el caso de
    // recuperar foco de la ventana sin cambiar de pestaña. Se mantienen ambos
    // pero se ignora el segundo si llega a menos de 500ms del primero.
    let lastRun = 0;
    function trigger() {
      const now = Date.now();
      if (now - lastRun < 500) return;
      lastRun = now;
      callback();
    }
    function onVisible() {
      if (document.visibilityState === 'visible') trigger();
    }
    window.addEventListener('focus', trigger);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', trigger);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [callback]);
}
