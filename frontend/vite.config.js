import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('/node_modules/')) {
            if (normalizedId.includes('/react/') || normalizedId.includes('/react-dom/') || normalizedId.includes('/scheduler/')) {
              return 'react-vendor';
            }
            if (normalizedId.includes('/react-router/') || normalizedId.includes('/react-router-dom/') || normalizedId.includes('/@remix-run/')) {
              return 'router-vendor';
            }
            if (normalizedId.includes('/lucide-react/')) return 'icons-vendor';
          }

          const pagePath = normalizedId.match(/\/src\/pages\/([^/]+)\.(jsx?|tsx?)$/);
          if (pagePath) {
            return `page-${pagePath[1].replace(/[^a-zA-Z0-9_-]/g, '-')}`;
          }

          return undefined;
        },
      },
    },
  },
});
