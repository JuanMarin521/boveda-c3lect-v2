import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Solo se inyecta en build (no en dev): el preámbulo de Fast Refresh de
// @vitejs/plugin-react agrega un <script type="module"> inline en modo dev,
// que una CSP script-src 'self' bloquearía y rompería el HMR local.
function cspMeta() {
  const CSP = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self'",
    "connect-src 'self' https://c3lect-api.onrender.com https://afefampklagfcvtxtqxv.supabase.co",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ') + ';'

  return {
    name: 'csp-meta',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      // Debe ir lo más temprano posible en <head>: una CSP vía <meta> solo
      // rige los recursos que el parser encuentra DESPUÉS de ella en el
      // documento — si quedara al final del <head>, no cubriría el script
      // de módulo ni el stylesheet que Vite inyecta antes.
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n      <!--\n` +
        `        CSP vía <meta> porque GitHub Pages no permite configurar headers HTTP.\n` +
        `        Limitación conocida: frame-ancestors (y report-uri/sandbox) son ignorados\n` +
        `        por los navegadores cuando la CSP viene de <meta> — esta política no da\n` +
        `        protección contra clickjacking. Resolverlo requeriría mover el hosting a\n` +
        `        algo que sí controle headers (p.ej. un Worker de Cloudflare delante de\n` +
        `        GitHub Pages), fuera de alcance aquí.\n` +
        `      -->\n` +
        `      <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      )
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    cspMeta(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        // Sin esto, todas las dependencias (React, react-router, Supabase,
        // motion, recharts, etc.) caen en un solo chunk de ~680 KiB que se
        // descarga incluso en páginas que no las usan (ej. la home no
        // necesita el cliente de Supabase ni recharts). Separarlas en
        // chunks por librería permite que el navegador solo baje lo que
        // cada ruta realmente usa, y cachea cada vendor por separado.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('recharts')) return 'vendor-charts'
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('motion')) return 'vendor-motion'
          if (id.includes('react-router')) return 'vendor-router'
          // react/react-dom no van en su propio chunk: varias libs del bucket
          // 'vendor' (lucide-react, axios) las requieren en tiempo de módulo,
          // y separarlas generaba un chunk circular (vendor <-> vendor-react).
          return 'vendor'
        },
      },
    },
  },
})
