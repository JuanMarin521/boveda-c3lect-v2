// src/app/hooks/useMetaPixelRouteTracking.ts
//
// Dispara PageView del pixel en cada cambio de ruta (SPA).
//
// OJO: importa de "react-router", NO de "react-router-dom".
// Este proyecto usa react-router v7 y NO tiene react-router-dom instalado
// (revisa package.json). El archivo original que te entregaron importaba
// de "react-router-dom" y por eso no compilaba.
//
// Se usa dentro de src/app/components/Root.tsx, que ya es hijo del router
// y ya llama a useLocation().

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from '../lib/metaPixel';

export function useMetaPixelRouteTracking(): void {
  const location = useLocation();
  const primeraCarga = useRef(true);

  useEffect(() => {
    // initMetaPixel() ya envió el PageView de la carga inicial desde main.tsx.
    // Sin este guard mandaríamos dos PageView por cada visita nueva, lo que
    // infla las métricas de tráfico y ensucia las audiencias de retargeting.
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    trackPageView();
  }, [location.pathname]);
}
