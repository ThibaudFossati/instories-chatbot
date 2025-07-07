// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ⇢ toutes les requêtes commençant par /api iront vers le backend
      '/api': {
        target: 'http://localhost:10001',
        changeOrigin: true   // header Host ↦ backend
      }
    }
  }
});