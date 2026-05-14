export interface NotasPerfume {
  descripcion: string;
  notas_top: string;
  notas_corazon: string;
  notas_base: string;
}

export interface EspecificacionesReloj {
  movimiento: string;
  dimensiones?: string;
  caja?: string;
  correa?: string;
  cristal?: string;
  funciones?: string;
  resistenciaAgua: string;
  peso?: string;
  bateria?: string;
  reservaMarcha?: string;
  observaciones?: string;
}

export interface Producto {
  id: string;
  nombre: string;       // Nombre del modelo, ej: "Curren 8467"
  estilo: string;       // Color o variante, ej: "Negro"
  display: string;      // Nombre completo para mostrar, ej: "Curren 8467 — Negro"
  precio: number;       // Precio en pesos colombianos, ej: 149000
  disponible: boolean;  // true = disponible | false = agotado
  cat: 'reloj' | 'perfume' | 'accesorio';
  imgs: string[];       // Rutas relativas desde public/, ej: ["images/relojes/..."]
  notas?: NotasPerfume;          // Solo para perfumes
  specs?: EspecificacionesReloj; // Solo para relojes
}
