import { useState } from 'react';

export const NUEVA_MARCA = '__nueva__';
export const NUEVO_MODELO = '__nuevo__';

export function useMarcaModeloToggle(
  marcaInicial: string,
  modeloInicial: string,
  marcasDisponibles: string[],
  modelosDisponibles: string[],
) {
  const [modoMarcaNueva, setModoMarcaNueva] = useState(
    () => marcaInicial !== '' && !marcasDisponibles.includes(marcaInicial),
  );
  const [modoModeloNuevo, setModoModeloNuevo] = useState(
    () => modeloInicial !== '' && !modelosDisponibles.includes(modeloInicial),
  );
  return { modoMarcaNueva, setModoMarcaNueva, modoModeloNuevo, setModoModeloNuevo };
}
