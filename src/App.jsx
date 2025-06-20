import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// 中文模拟数据 - 具体平台来源
const mockSources = [
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
      })),
  },
];

function useDarkMode() {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode !== null ? savedMode === "true" : prefersDarkMode;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return [darkMode, setDarkMode];
}

export default function App() {
  const [darkMode, setDarkMode] = useDarkMode(false);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 
       ${
         darkMode
           ? "dark-mode bg-gray-900 text-white"
           : "bg-gray-50 text-gray-900"
       }`}
    >
      {/* 头部 */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 mr-2">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                />
              </svg>
              今日热榜
            </h1>
            <p className="mt-2 text-indigo-100">查看来自各大平台的热门资讯</p>
          </div>

          {/* 主题切换按钮 */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={darkMode ? "切换到浅色模式" : "切换到深色模式"}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  fill="currentColor"
                  d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm9-3h2c0 1.65-1.35 3-3 3v-2c.55 0 1-.45 1-1h1zm-1-4h2c0-1.65-1.35-3-3-3v2c.55 0 1 .45 1 1h1zm-7 4h2c0 1.65-1.35 3-3 3v-2c.55 0 1-.45 1-1h1zm-7-4h2c0-1.65-1.35-3-3-3v2c.55 0 1 .45 1 1h1zM12 5c1.65 0 3 1.35 3 3h-2c0-.55-.45-1-1-1s-1 .45-1 1H9c0-1.65 1.35-3 3-3zm0 14c-1.65 0-3-1.35-3-3h2c0 .55 .45 1 1 1s1-.45 1-1h2c0 1.65-1.35 3-3 3zm-7-4c0 1.65 1.35 3 3 3v-2c-.55 0-1-.45-1-1h-2zm10-8c0-1.65-1.35-3-3-3v2c.55 0 1 .45 1 1h2z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  fill="currentColor"
                  d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"
                />
              </svg>
            )}
          </button>
        </div>
      </header>
      
      {/* 主体内容 */}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockSources.map((source) => (
            <SourceModule key={source.id} source={source} darkMode={darkMode} />
          ))}
        </div>
      </main>
    </div>
  );
}

function SourceModule({ source, darkMode }) {
  const [visibleItems, setVisibleItems] = useState(7);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isUpdating, setIsUpdating] = useState(false);
  const containerRef = useRef(null);

  const loadMore = () => {
    if (loading || visibleItems >= 10) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleItems((prev) => Math.min(prev + 3, 10));
      setLoading(false);
    }, 500);
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setVisibleItems(7);
      setLastUpdated(Date.now());
      setIsUpdating(false);
    }, 800);
  };

  const formatUpdateTime = useCallback((timestamp) => {
    const diffMinutes = Math.floor(Math.random() * 24);
    return `更新于 ${diffMinutes}分钟前`;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 10) {
        loadMore();
      }
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleItems, loading]);

  return (
    <div
      className={`rounded-xl shadow-lg overflow-hidden border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } transition-colors duration-300`}
    >
      {/* 模块头部 */}
      <div
        className={`bg-gradient-to-r ${source.color} p-4 flex items-center text-white`}
      >
        <div className="mr-3">{source.icon}</div>
        <h2 className="text-xl font-bold">{source.name}</h2>
      </div>

      {/* 内容区域 */}
      <div
        ref={containerRef}
        className="max-h-[500px] overflow-y-auto p-4 custom-scrollbar"
      >
        <div className="space-y-3">
          {source.items.slice(0, visibleItems).map((item) => (
            <HotTopicItem key={item.id} item={item} darkMode={darkMode} />
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
            </div>
          )}

          {visibleItems >= 10 && (
            <div className="text-center text-gray-500 py-2 text-sm">
              已加载全部内容
            </div>
          )}
        </div>
      </div>

      {/* 底部信息栏 */}
      <div
        className={`px-4 py-2 flex justify-between items-center border-t ${
          darkMode
            ? "border-gray-700 bg-gray-900 text-gray-300"
            : "border-gray-100 bg-gray-50 text-gray-500"
        } transition-colors duration-300`}
      >
        <div className="text-xs">{formatUpdateTime(lastUpdated)}</div>
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className={`p-1 rounded-full transition-colors duration-200 ${
            isUpdating
              ? "text-gray-400"
              : darkMode
              ? "text-gray-300 hover:text-indigo-400"
              : "text-gray-500 hover:text-indigo-600"
          }`}
          title="刷新数据"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            {isUpdating ? (
              <path
                fill="currentColor"
                d="M12 4v4l3 3m-3-7a9 9 0 109 9h-2a7 7 0 11-7-7z"
              />
            ) : (
              <path
                fill="currentColor"
                d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.77L12 11h8V3l-2.35 2.35z"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

function HotTopicItem({ item, darkMode }) {
  return (
    <div
      className={`group p-3 rounded-lg hover:${
        darkMode ? "bg-gray-700" : "bg-gray-50"
      } transition-colors duration-200 min-h-[72px]`}
    >
      <h3
        className={`font-semibold line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {item.title}
      </h3>
    </div>
  );
}
