import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Combine all chunks into a single file
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle these dependencies
  },
  server: {
    proxy: {
      '/api': 'https://coursify-g9dk.onrender.com', // Proxy API requests to your backend
    },
  },
});
