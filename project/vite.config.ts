import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Wichtig für relative Pfade
  server: {
    host: true // Macht die Seite im Netzwerk erreichbar
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
