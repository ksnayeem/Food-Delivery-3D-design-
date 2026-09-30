import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Food-Delivery-3D-design-/',
  plugins: [react(), tailwindcss()],
})
