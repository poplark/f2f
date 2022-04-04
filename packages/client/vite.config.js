import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@' : path.resolve(__dirname, './src')
    },
  },
  server: {
    port: 3003,
    open: true,
    http: true,
    ssr: false,
    // 设置代理
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:3001/api',
        // rewrite: path => path.replace(/^\/api/, '')
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/init-test': {
        // target: 'http://127.0.0.1:3001/init-test',
        // rewrite: path => path.replace(/^\/init-test/, '')
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'ws://127.0.0.1:3001',
        ws: true,
      }
    }
  },
  plugins: [vue()]
})
