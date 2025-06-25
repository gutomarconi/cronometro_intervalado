import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cronometro-intervalado/', // use o nome do repositório
  plugins: [react()],
})