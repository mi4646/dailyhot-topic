# 🔥 Hot Topics Aggregator

一个聚合多个平台热榜数据的 React + Tauri 桌面应用，支持深色模式、详情页浏览、自定义设置等功能，帮助你快速了解全网热点趋势。

---

## ✨ 功能特色

- 🚀 支持多个平台的热榜数据
- 🎨 深色 / 浅色主题切换
- 🔍 平台可见性设置、顺序自定义
- 🔗 设置链接是否新标签页打开
- 🧠 智能懒加载，仅加载进入视图的卡片数据
- 📱 响应式设计，适配桌面与移动端
- 📄 详情页支持分页浏览，更清晰的热点摘要
- 📦 本地缓存设置，自动恢复用户配置
- 🖥️ 原生桌面支持：集成 Tauri 打包为 Windows/macOS/Linux 应用（目前仅支持Windows）

---

## 🔥 热榜聚合平台支持
| 平台名称 | 数据来源 |
|---------|--------|
| douyin | 抖音热点 |
| zhihu | 知乎热榜 |
| baidu | 百度热搜 |
| juejin | 稀土掘金 |
| weibo | 微博热搜 |
| github | GitHub |
| toutiao | 今日头条 |
| v2ex | V2EX |
| hellogithub | HelloGitHub |
| thepaper | 澎湃新闻 |
| qq-news | 腾讯新闻 |
| netease-news | 网易新闻 |
| 36kr | 36氪 |
| sspai | 少数派 |
| ithome | IT之家 |
| tieba | 百度贴吧 |
| douban-movie | 豆瓣电影 |
| genshin | 原神 |
| starrail | 崩坏：星穹铁道 |
| lol | 英雄联盟 |
| weread | 微信读书 |
| zhihu-daily | 知乎日报 |
| ngabbs | NGA |
| jianshu | 简书 |
| xinwenlianbo | 新闻联播 |
---


## 🛠️ 技术栈

- **React** + **Hooks**（状态与生命周期管理）
- **Vite**（快速构建工具）
- **Tailwind CSS**（快速环境格式系统）
- **Axios**（请求 API 接口）
- **Font Awesome**（图标系统）
- **Tauri**（轻量跨平台桌面应用框架）

---

## 📦 安装与运行

```bash
# 克隆项目
git clone https://github.com/your-username/hot-topics-aggregator.git
cd hot-topics-aggregator

# 安装依赖
npm install

# 本地开发启动
npm run dev

# 构建生产环境
npm run build

# 本地预览构建结果
npm run preview

# 本地tauri开发
npm run tauri
```

---

## 🧪 桌面端打包（Tauri2）

本项目已集成 [Tauri](https://tauri.app/)，支持构建为原生桌面应用，具备更小体积、更好性能与原生系统集成能力。

- 官方网站: https://tauri.app/
- GitHub: https://github.com/tauri-apps/tauri
- 中文社区: https://tauri.app/zh-cn/

```bash
# 安装 Tauri 所需依赖（仅需一次）
# 参考：https://tauri.app/zh-cn/start/prerequisites/#_top

# 初始化 tauri（首次）
npx tauri init

# 构建桌面应用（Release）
npm run tauri build

# 或构建开发版（Debug）
npm run tauri

# 打包 Windows 桌面应用（生成.exe）
npm run build:win

# 启动开发服务器（前端）
npm run dev

# 构建前端资源
npm run build

# 启动 Tauri 开发环境（带桌面窗口）
npm run tauri
```

构建产物默认输出在 `src-tauri/target` 与 `src-tauri/target/release/bundle/` 目录下。

---

## 📁 项目结构

```
.
├── src/                              # 源代码目录 (Web 前端)
│   ├── App.jsx                       # 应用程序的根组件
│   ├── assets/                       # 静态资源 (如图片、图标等)
│   │   └── favicon.png
│   ├── components/                   # 可复用的 React UI 组件
│   │   ├── DetailSkeleton.jsx       # 详情页的骨架屏组件
│   │   ├── ErrorPage.jsx            # 错误页面组件
│   │   ├── Header.jsx               # 网站或应用的头部导航组件
│   │   ├── HotTopicCard.jsx         # 热门话题卡片组件
│   │   ├── HotTopicDetailPage.jsx   # 热门话题详情页组件
│   │   ├── LazyLoadWrapper.jsx      # 图片或组件的懒加载包装器
│   │   └── NotificationToast.jsx    # 通知提示框组件
│   ├── index.css                    # 全局样式文件
│   ├── main.jsx                     # 应用程序的入口文件
│   ├── mock.jsx                     # 本地数据模拟 (用于开发测试)
│   └── utils.jsx                    # 工具函数库
│
├── src-tauri/                       # Tauri 后端 Rust 代码目录
│   ├── build.rs                     # Tauri 构建脚本
│   ├── capabilities/                # Tauri 权限配置
│   │   └── default.json
│   ├── Cargo.toml                   # Rust 项目依赖与配置文件
│   ├── icons/                       # 应用图标
│   │   └── favicon.svg
│   ├── packages/                    # 平台特定构建资源
│   │   └── windows/                 # Windows 平台安装脚本
│   │       └── installer.nsi
│   ├── src/                         # Rust 源代码
│   │   ├── lib.rs                   # Tauri 命令定义库
│   │   └── main.rs                  # Tauri 应用入口点
│   └── tauri.conf.json              # Tauri 主配置文件 (应用信息、构建选项等)
│
├── eslint.config.js                  # ESLint 代码规范配置
├── index.html                       # HTML 模板文件
├── package.json                     # Node.js 项目依赖与脚本
├── package-lock.json                # 依赖版本锁定文件
├── postcss.config.js                # PostCSS 配置 (通常用于 Tailwind CSS)
├── README.md                        # 项目说明文档 (本文件)
├── tailwind.config.js               # Tailwind CSS 配置文件
└── vite.config.js                   # Vite 构建工具配置文件

```

---

## ⚙️ 设置说明

点击右上角的 **设置按钮** 可以进入设置页面：

- ✅ 显示/隐藏平台：控制是否展示特定榜单
- 🔃 自定义榜单顺序（手动控制顺序，支持后续拖拽）
- 🌐 控制链接是否在新标签页打开
- 🧹 一键恢复默认设置

设置项会保存在 `localStorage` 中，刷新页面或重启浏览器后仍能保留。

---

## 🌐 路由说明（基于 Hash）

| 路径              | 说明           |
| ----------------- | -------------- |
| `/`               | 首页热榜聚合   |
| `#/settings`      | 设置页面       |
| `#/detail/平台名` | 某个平台详情页 |

---

## 📌 注意事项

- 本项目不依赖任何第三方 UI 库（如 Ant Design、MUI）；
- 所有图标使用 Font Awesome SVG 版；
- 所有样式基于 TailwindCSS 编写；
- 滑动条样式通过 CSS 伪类实现，不使用插件；
- 暗黑模式通过添加 `dark` 类实现，无需 JS 控制；
- Tauri 打包构建需安装 Rust 环境及目标平台构建工具。

---

## 📬 贡献指南

欢迎贡献代码！你可以提交 PR 或 Issue 来帮助我们改进这个项目
---

## 📜 许可证

MIT License © 2025 [Your Name or Team]

---

## 🙌 致谢

感谢你选择本项目！如果你觉得它对你有帮助，请给一个 Star 或分享给朋友！

如有问题或建议，请随时提 Issues 或联系作者。

本项目仅作学习与交流用途，如需商用请确保数据来源合法合规。
