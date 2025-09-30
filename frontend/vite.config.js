import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/trabajo/', // 👈 nombre del repo
  build: {
    outDir: 'docs',   // la carpeta final para GitHub Pages
  },
  server: {
    open: true,
  },
})
