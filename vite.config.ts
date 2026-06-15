import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        panel: path.resolve(__dirname, 'index.html'),
        options: path.resolve(__dirname, 'options.html'),
        'content-script': path.resolve(__dirname, 'src/content/content-script.ts'),
        'service-worker': path.resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
