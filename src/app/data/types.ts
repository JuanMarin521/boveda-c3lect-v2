export interface NotasPerfume {
  descripcion: string;
  notas_top: string;
  notas_corazon: string;
  notas_base: string;
}

export interface Producto {
  id: string;
  nombre: string;       // Nombre del modelo, ej: "Curren 8467"
  estilo: string;       // Color o variante, ej: "Negro"
  display: string;      // Nombre completo para mostrar, ej: "Curren 8467 — Negro"
  precio: string;       // Precio formateado, ej: "$149.000"
  disponible: boolean;  // true = disponible | false = agotado
  cat: 'reloj' | 'perfume' | 'accesorio';
  imgs: string[];       // Rutas relativas desde public/, ej: ["images/relojes/..."]
  notas?: NotasPerfume; // Solo para perfumes
}
