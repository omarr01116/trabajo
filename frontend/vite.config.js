import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/trabajo/', // 👈 asegúrate que sea el nombre EXACTO de tu repo en GitHub
  build: {
    outDir: 'dist',
  },
})
