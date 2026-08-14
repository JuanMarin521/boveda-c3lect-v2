import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
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
