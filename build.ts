import { build } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { renameSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function stripCrossorigin(): import('vite').Plugin {
  return {
    name: 'strip-crossorigin',
    enforce: 'post',
    transform(code: string, id: string) {
      if (!id.endsWith('.html')) return
      return code.replace(/crossorigin\b[^>]*>/g, '>').replace(/rel="modulepreload"[^>]*>/g, '>')
    },
  }
}

const resolveAlias = {
  alias: { '@': resolve(__dirname, './src') },
}

const basePlugins = [react(), tailwindcss()]

async function main() {
  console.log('Building ESM entries (options, content-script, service-worker)...')
  await build({
    resolve: resolveAlias,
    plugins: [...basePlugins, stripCrossorigin()],
    build: {
      modulePreload: false,
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          options: resolve(__dirname, 'options.html'),
          'content-script': resolve(__dirname, 'src/content/content-script.ts'),
          'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
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
  } satisfies UserConfig)

  console.log('Building panel as IIFE...')
  await build({
    resolve: resolveAlias,
    plugins: basePlugins,
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          panel: resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name][extname]',
          format: 'iife',
        },
      },
      outDir: 'dist',
      emptyOutDir: false,
    },
  } satisfies UserConfig)

  const cssSource = resolve(__dirname, 'dist', 'assets', 'style.css')
  const cssTarget = resolve(__dirname, 'dist', 'assets', 'panel.css')
  if (existsSync(cssSource) && !existsSync(cssTarget)) {
    renameSync(cssSource, cssTarget)
    console.log('Renamed assets/style.css → assets/panel.css')
  }

  console.log('Build complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
