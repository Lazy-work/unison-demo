import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { unisonVue } from 'unplugin-unisonjs/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [unisonVue(), react()],
})
