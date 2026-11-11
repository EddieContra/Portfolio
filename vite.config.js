import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Portfolio/',
  plugins: [react()],
  server: { port: 5173, open: true },
  // three.js is lazy-loaded in its own chunk after first paint
  build: { chunkSizeWarningLimit: 900 },
});
