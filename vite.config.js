import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 与 Tauri 初始化时输入的 dev URL 一致
    // open: true, // 启动时自动打开浏览器
    host: "0.0.0.0", // 允许外部访问
    // strictPort: true, // 如果端口被占用则退出
    // 设置代理
    proxy: {
      "/api-hot": {
        target: "https://api-hot.imsyy.top",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-hot/, ""),
      },
      // 添加如下代理规则
      "/zhihu": {
        // https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0
        target: "https://api.zhihu.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zhihu/, ""),
        secure: false, // 如果目标 API 使用 HTTPS，且有无效证书可设置为 false
      },
    },
    build: {
      outDir: "dist", // 与 Tauri 初始化时设置的一致
    },
  },
});
