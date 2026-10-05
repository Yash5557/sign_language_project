import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/process-video': 'http://localhost:8000',
      '/predict-angles': 'http://localhost:8000',
      '/synthesize-sentence': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
      '/model-info': 'http://localhost:8000',
      '/api': 'http://localhost:8000'
    }
  }
});
