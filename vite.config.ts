import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Solo se inyecta en build (no en dev): el preámbulo de Fast Refresh de
// @vitejs/plugin-react agrega un <script type="module"> inline en modo dev,
// que una CSP script-src 'self' bloquearía y rompería el HMR local.
function cspMeta() {
  const CSP = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
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
  base: '/boveda-c3lect-v2/',
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
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
})
