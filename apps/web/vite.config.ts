import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  optimizeDeps: { include: ['@ncc/shared'] },
  build: { commonjsOptions: { include: [/@ncc\/shared/, /node_modules/] } },
  server: { proxy: { '/api': 'http://localhost:3000' } },
})
