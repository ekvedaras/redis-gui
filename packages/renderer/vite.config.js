/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json'
import { join } from 'path'
import { builtinModules } from 'module'
import vue from '@vitejs/plugin-vue'

const PACKAGE_ROOT = __dirname
const _builtinModules = [...builtinModules]
_builtinModules.splice(_builtinModules.indexOf('fs'), 1)
_builtinModules.splice(_builtinModules.indexOf('path'), 1)
// _builtinModules.splice(_builtinModules.indexOf('os'), 1)

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [vue()],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
      external: [
        ..._builtinModules.flatMap(p => [p, `node:${p}`]),
      ],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  test: {
    environment: 'happy-dom',
  },
};

export default config;
