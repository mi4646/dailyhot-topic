# 📄 今日热榜

这是一个使用 **React + TailwindCSS** 构建的“今日热榜”聚合展示平台，支持以下功能：

- 多个平台热榜展示（微博热搜、知乎热榜、百度热搜、B站热门等）；
- 点击「更多」查看完整榜单详情；
- 支持分页浏览；
- 暗黑/亮色主题切换；
- 自定义榜单排序与显示设置；
- 响应式布局，适配移动端与桌面端；
- 使用 `localStorage` 保存用户偏好。

---

## 🔧 技术栈

| 技术 | 描述 |
|------|------|
| React | 构建组件化结构 |
| TailwindCSS | 快速构建现代响应式 UI 样式 |
| Font Awesome | 图标库支持 |
| localStorage | 用户设置本地持久化存储 |
| 原生 JavaScript 拖拽 API | 实现榜单拖拽排序 |

---

## 📁 项目结构

```
src/
├── App.jsx                 # 主入口组件
├── index.css               # 全局样式文件
├── tailwind.config.js      # TailwindCSS 配置
└── components/
    ├── HotTopicCard.jsx        # 单个热榜卡片组件
    ├── HotTopicDetailModal.jsx # 详情页模态框
    ├── SettingsModal.jsx       # 设置模态框
    └── Toast.jsx              # 提示信息组件
```

---

## 🚀 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看页面。

---

## 📦 第三方依赖

确保你已安装以下依赖：

```bash
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/react-fontawesome
```

## 📌 注意事项

- 本项目不依赖任何第三方 UI 库（如 Ant Design、MUI）；
- 所有图标使用 Font Awesome SVG 版；
- 所有样式基于 TailwindCSS 编写；
- 滚动条样式通过 CSS 伪类实现，不使用插件；
- 暗黑模式通过添加 `dark` 类实现，无需 JS 控制。

---

## 📬 贡献指南

欢迎贡献代码！你可以提交 PR 或 Issue 来帮助我们改进这个项目：

- 新增平台榜单；
- 优化交互体验；
- 修复样式问题；
- 添加单元测试；
- 支持更多浏览器特性。

---

## 📜 许可证

MIT License

---

## 🙌 致谢

感谢你选择本项目！如果你觉得它对你有帮助，请给一个 Star 或分享给朋友！

如有问题或建议，请随时提 Issues 或联系作者。