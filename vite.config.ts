import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 可选：重写路径
      }
    },
    open: true // 可选：启动时自动打开浏览器
  },
  // 添加构建配置
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境关闭 sourcemap
    rollupOptions: {
      output: {
        // 代码分割配置
        manualChunks: {
          'tdesign': ['tdesign-vue-next'],
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  // 预编译依赖
  optimizeDeps: {
    include: ['tdesign-vue-next', 'tdesign-icons-vue-next']
  }
})
