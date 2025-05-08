import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // oder './' je nach Setup – '/' ist meist robuster bei Dev-Server
  server: {
    host: true,       // macht die App im Netzwerk erreichbar
    port: 5173,       // standardmäßiger Vite-Port
    strictPort: true  // wirft Fehler, wenn Port besetzt ist
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
