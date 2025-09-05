import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 与 Tauri 初始化时输入的 dev URL 一致
    // open: true, // 启动时自动打开浏览器
    host: '0.0.0.0', // 允许外部访问
    strictPort: true, // 如果端口被占用则退出
    // 设置代理
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
      // https://www.v2ex.com/api/topics/hot.json
      '/v2ex': {
        target: 'https://www.v2ex.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v2ex/, ''),
        secure: false,
      },
      '/github': {
        target: 'https://trend.doforce.dpdns.org/repo',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/github/, ''),
        secure: false,
      },
      // https://api.cntv.cn/NewVideo/getVideoListByColumn?id=TOPC1451528971114112&n=10&sort=desc&p=1&mode=0&serviceId=tvcctv
      '/xinwenlianbo': {
        target: 'https://api.cntv.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xinwenlianbo/, ''),
        secure: false,
      },
      // https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items?type=movie&start=0&count=10&for_mobile=1
      '/douban-movie': {
        target: 'https://m.douban.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/douban-movie/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Referer',
              'https://m.douban.com/subject_collection/movie_real_time_hotest'
            )
          })
        },
        secure: false,
      },
      // Vite代理配置豆瓣源封面图片，避免CORS/403问题
      '/img-proxy': {
        target: 'https://doubanio.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://m.douban.com/')
          })
        },
      },
    },
    build: {
      outDir: 'dist', // 与 Tauri 初始化时设置的一致
    },
  },
})
