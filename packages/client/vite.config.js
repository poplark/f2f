import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003,
    open: true,
    http: true,
    ssr: false,
    // 设置代理
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/init-test': {
        target: 'http://127.0.0.1:3001/init-test',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/init-test/, '')
      },
    }
  },
  plugins: [vue()]
})
