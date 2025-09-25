import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 与 Tauri 初始化时输入的 dev URL 一致
    // open: true, // 启动时自动打开浏览器
    host: '0.0.0.0', // 允许外部访问
    // strictPort: true, // 如果端口被占用则退出
    // 设置代理
    proxy: {
      // https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot&title=%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C&extparam=filter_type%3Drealtimehot%26mi_cid%3D100103%26pos%3D0_0%26c_type%3D30%26display_time%3D1540538388&luicode=10000011&lfid=231583
      '/weibo-hot-api': {
        target: 'https://m.weibo.cn/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weibo-hot-api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Referer',
              'https://s.weibo.com/top/summary?cate=realtimehot'
            )
            proxyReq.setHeader('mweibo-pwa', '1')
            proxyReq.setHeader('x-requested-with', 'XMLHttpRequest')
          })
        },
      },
      '/news-hot-api': {
        target: 'https://news.zpa666.top/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/news-hot-api/, ''),
      },
      '/60s-api': {
        target: 'https://60s.viki.moe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/60s-api/, ''),
      },
      '/api-hot': {
        target: 'https://api-hot.imsyy.top',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-hot/, ''),
      },
      // https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0
      '/zhihu': {
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
