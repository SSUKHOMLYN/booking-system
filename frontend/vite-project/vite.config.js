import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8081', // Backend URL
        changeOrigin: true,
        secure: false, // Use only if the backend uses HTTPS; otherwise, it can be omitted
      },
    },
  },
});
