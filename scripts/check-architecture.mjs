// Reglas de arquitectura del frontend (equivalente a src/architecture.spec.ts
// de c3lect-api). Corre en `pnpm typecheck`; sale con código 1 si algo las rompe.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'app');
const toPosix = (p) => p.split(sep).join('/');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = join(dir, d.name);
    if (d.isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(d.name) ? [full] : [];
  });
}

const archivos = walk(root).map((full) => {
  const content = readFileSync(full, 'utf8');
  const imports = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) =>
    m[1].startsWith('.') ? toPosix(relative(root, resolve(dirname(full), m[1]))) : m[1],
  );
  return { path: toPosix(relative(root, full)), content, imports };
});

const reglas = [
  {
    nombre: 'El cliente HTTP (api/client) solo se usa dentro de src/app/api/',
    falla: (f) => !f.path.startsWith('api/') && f.imports.includes('api/client'),
  },
  {
    nombre: 'axios solo se importa en api/client.ts',
    falla: (f) => f.path !== 'api/client.ts' && f.imports.includes('axios'),
  },
  {
    nombre: 'El cliente de Supabase solo se usa en data/ (lectura del catálogo público)',
    falla: (f) => !f.path.startsWith('data/') && f.imports.includes('supabase'),
  },
  {
    nombre: 'Supabase solo lee la vista catalogo_publico, nunca tablas',
    falla: (f) =>
      [...f.content.matchAll(/\.from\(\s*['"]([^'"]+)['"]/g)].some(
        (m) => m[1] !== 'catalogo_publico',
      ),
  },
];

let fallas = 0;
for (const regla of reglas) {
  const malos = archivos.filter(regla.falla).map((f) => f.path);
  if (malos.length > 0) {
    fallas += malos.length;
    console.error(`✖ ${regla.nombre}\n${malos.map((p) => `    ${p}`).join('\n')}`);
  }
}

if (fallas > 0) process.exit(1);
console.log(`✓ Arquitectura: ${reglas.length} reglas, ${archivos.length} archivos`);
