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

export default defineConfig({
  base: '/boveda-c3lect-v2/',
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
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
        manualChunks(id) {
          const matches = [...id.matchAll(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/g)]
          if (matches.length === 0) return
          const pkg = matches[matches.length - 1][1]
          if (pkg.includes('react-router')) return 'vendor-router'
          if (pkg === 'react' || pkg === 'react-dom' || pkg === 'scheduler') return 'vendor-react'
          if (pkg.startsWith('@supabase')) return 'vendor-supabase'
          if (pkg.startsWith('motion')) return 'vendor-motion'
          if (pkg.startsWith('@mui') || pkg.startsWith('@emotion') || pkg.startsWith('@radix-ui')) return 'vendor-ui'
          if (pkg === 'recharts') return 'vendor-charts'
          return 'vendor'
        },
      },
    },
  },
})
