// Convierte todas las imágenes (.jpg, .jpeg, .png, .tiff, .bmp, .gif) de una carpeta a .webp.
//
// Uso:
//   node scripts/convert-to-webp.js <carpeta-origen> [carpeta-destino] [calidad 1-100]
//
// Ejemplos:
//   node scripts/convert-to-webp.js ./nuevas-fotos
//     → convierte in-place, deja los .webp junto a los originales en nuevas-fotos/
//
//   node scripts/convert-to-webp.js ./nuevas-fotos public/images/relojes
//     → convierte y guarda los .webp directo en la carpeta del catálogo
//
//   node scripts/convert-to-webp.js ./nuevas-fotos public/images/relojes 90
//     → misma idea, con calidad 90 en vez del default (82)

import { readdir, mkdir } from 'fs/promises';
import { extname, join, basename } from 'path';
import sharp from 'sharp';

const [, , inputDirArg, outputDirArg, qualityArg] = process.argv;

if (!inputDirArg) {
  console.error('Uso: node scripts/convert-to-webp.js <carpeta-origen> [carpeta-destino] [calidad 1-100]');
  process.exit(1);
}

const inputDir = inputDirArg;
const outputDir = outputDirArg ?? inputDirArg;
const quality = qualityArg ? Number(qualityArg) : 82;

const EXTENSIONES_VALIDAS = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.gif']);

async function main() {
  await mkdir(outputDir, { recursive: true });

  const archivos = await readdir(inputDir);
  const imagenes = archivos.filter((f) => EXTENSIONES_VALIDAS.has(extname(f).toLowerCase()));

  if (imagenes.length === 0) {
    console.log(`No se encontraron imágenes (.jpg, .jpeg, .png, .tiff, .bmp, .gif) en ${inputDir}`);
    return;
  }

  console.log(`Convirtiendo ${imagenes.length} imagen(es) a .webp (calidad ${quality})...\n`);

  for (const archivo of imagenes) {
    const nombreBase = basename(archivo, extname(archivo));
    const rutaOrigen = join(inputDir, archivo);
    const rutaDestino = join(outputDir, `${nombreBase}.webp`);

    await sharp(rutaOrigen).webp({ quality }).toFile(rutaDestino);
    console.log(`  ✓ ${archivo} → ${rutaDestino}`);
  }

  console.log('\nListo.');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
