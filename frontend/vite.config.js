import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "docs", // GitHub Pages sirve desde /docs
  },
  base: "/trabajo/", // 👈 nombre de tu repo
})
