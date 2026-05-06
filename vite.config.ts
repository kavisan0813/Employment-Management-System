import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700,

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }

            if (id.includes('recharts')) {
              return 'charts-vendor'
            }

            if (id.includes('@radix-ui')) {
              return 'radix-vendor'
            }

            if (id.includes('@mui')) {
              return 'mui-vendor'
            }

            if (id.includes('lucide-react') || id.includes('motion')) {
              return 'ui-vendor'
            }

            return 'vendor'
          }
        },
      },
    },
  },
})