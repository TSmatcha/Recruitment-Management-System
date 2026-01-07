import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve( './src'), 
    },
  },
  server: {
    open: true,
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true,
  },
  envPrefix: 'VITE_',
  clearScreen: true,
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
