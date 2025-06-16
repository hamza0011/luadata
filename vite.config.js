import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'abbf9c85-c90b-4ace-a912-1b53e0efa159-00-17c0ldj7w86xz.pike.replit.dev',
      '.replit.dev',
      '.pike.replit.dev'
    ],
    hmr: {
      port: 3000,
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
})