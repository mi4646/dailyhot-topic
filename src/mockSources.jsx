export const mockSources = [
  {
    id: 1,
    name: "微博热搜",
    color: "from-orange-500 to-red-600",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M22 4H2v16h20V4zM8.5 10.5c0 1.4-1.1 2.5-2.5 2.5S3.5 11.9 3.5 10.5 4.6 8 6 8s2.5 1.1 2.5 2.5zm11.5 0c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5z"
        />
      </svg>
    ),
    items: Array(15)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        title: `微博热搜话题 ${i + 1}`,
        heat: Math.floor(Math.random() * 100000) + 1000, // 热度值范围：1000~101000
      })),
  },
  {
    id: 2,
    name: "知乎热榜",
    color: "from-blue-500 to-cyan-400",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5 3v-7z"
        />
      </svg>
    ),
    items: Array(15)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        title: `知乎热榜话题 ${i + 1}`,
        heat: Math.floor(Math.random() * 100000) + 1000,
      })),
  },
  {
    id: 3,
    name: "抖音热榜",
    color: "from-red-500 to-pink-500",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
        />
      </svg>
    ),
    items: Array(15)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        title: `抖音热门视频 ${i + 1}`,
        heat: Math.floor(Math.random() * 100000) + 1000,
      })),
  },
  {
    id: 4,
    name: "百度热搜",
    color: "from-indigo-600 to-purple-500",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99 5-.37-.28h-.79l-.28-.27H14v-2h2.49L19 19l-2.51-2.5h-.79l-.28-.27V14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        />
      </svg>
    ),
    items: Array(15)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        title: `百度热搜事件 ${i + 1}`,
        heat: Math.floor(Math.random() * 100000) + 1000,
      })),
  },
];