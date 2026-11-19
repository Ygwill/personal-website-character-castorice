import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 用相对路径，便于部署到 /<角色名>/ 这类子路径下
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { host: '127.0.0.1', port: 5174 },
  // 构建时刻注入页脚，方便判断线上是不是旧包（不是运行时时间）
  define: { __BUILD_AT__: JSON.stringify(new Date().toISOString().replace('T', ' ').slice(0, 16)) },
  build: { outDir: 'dist', assetsDir: 'assets', sourcemap: false },
})
