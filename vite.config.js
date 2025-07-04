import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-hot': {
        target: 'https://api-hot.imsyy.top',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-hot/, ''),
      },
      // 添加如下代理规则
      '/zhihu': {
        // https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0
        target: 'https://api.zhihu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zhihu/, ''),
        secure: false, // 如果目标 API 使用 HTTPS，且有无效证书可设置为 false
      },
    },
  },
})

