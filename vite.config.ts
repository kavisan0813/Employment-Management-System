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
    minify: 'esbuild', // Faster and uses less memory than terser
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group the core React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-core';
            }
            // Group heavy UI components
            if (id.includes('@mui') || id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // Group data visualization
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Group icons and animations
            if (id.includes('lucide-react') || id.includes('motion')) {
              return 'vendor-utils';
            }
            // Let everything else be handled naturally to avoid circular dependencies
          }
        },
      },
    },
  },
})