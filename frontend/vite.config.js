import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/trabajo/', // 👈 el nombre de tu repo en GitHub
  build: {
    outDir: 'dist', // se generará la carpeta dist
  },
})
