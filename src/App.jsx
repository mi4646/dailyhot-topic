import React, { useState, useEffect, useLayoutEffect } from "react";
import Header from "./components/Header";
import HotTopicCard from "./components/HotTopicCard";
import HotTopicDetailModal from "./components/HotTopicDetailModal";
import NotificationToast from "./components/NotificationToast";
import axios from "axios";

// 所有支持的平台列表
const originalHotData = [
  { source: "微博热搜", icon: "fab fa-weibo text-red-500", items: [] },
  { source: "知乎热榜", icon: "fab fa-zhihu text-blue-600", items: [] },
  { source: "百度热搜", icon: "fas fa-search text-orange-500", items: [] },
  { source: "B站热门", icon: "fas fa-tv text-pink-500", items: [] },
];

// 假设你有 30+ 来源
for (let i = 1; i <= 30; i++) {
  originalHotData.push({
    source: `平台 ${i}`,
    icon: "fas fa-globe text-gray-500",
    items: [],
  });
}

function App() {
  // 状态管理
  const [hotData, setHotData] = useState([...originalHotData]);
  const [loadingSources, setLoadingSources] = useState({});
  const [hotDataErrors, setHotDataErrors] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    show: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceSettings, setSourceSettings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsPage, setIsSettingsPage] = useState(false);

  // 判断是否是设置页面
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);

    if (savedTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const savedSettings = localStorage.getItem("hotTopicSettings");
    let settings = {};

    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error("解析 hotTopicSettings 失败", e);
        settings = {};
      }
    } else {
      hotData.forEach((source) => {
        settings[source.source] = { visible: true };
      });
      settings.order = hotData.map((s) => s.source);
    }

    setSourceSettings(settings);

    if (settings.order && settings.order.length > 0) {
      const ordered = [...hotData].sort(
        (a, b) =>
          settings.order.indexOf(a.source) - settings.order.indexOf(b.source)
      );

      setHotData(ordered);
    } else {
      setHotData(hotData);
    }

    // 初始化 loadingSources & errors
    const initialLoading = {};
    const initialErrors = {};
    hotData.forEach((source) => {
      initialLoading[source.source] = false;
      initialErrors[source.source] = null;
    });

    setLoadingSources(initialLoading);
    setHotDataErrors(initialErrors);

    // 判断是否打开设置页
    setIsSettingsPage(window.location.hash === "#/settings");
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 显示通知
  const showNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => setNotification({ message: "", show: false }), 2000);
  };

  // 保存设置
  const saveSettings = () => {
    localStorage.setItem("hotTopicSettings", JSON.stringify(sourceSettings));
    showNotification("设置已保存！");
    window.location.hash = ""; // 返回主页
    setIsSettingsPage(false);
  };

  // 重置设置
  const resetSettings = () => {
    // 清除本地存储
    localStorage.removeItem("hotTopicSettings");

    // 构建默认设置
    const defaultSettings = {};
    originalHotData.forEach((source) => {
      defaultSettings[source.source] = { visible: true };
    });
    defaultSettings.order = originalHotData.map((s) => s.source);

    // 更新状态
    setSourceSettings(defaultSettings);

    // 重新排序 hotData
    const orderedList = [...hotData].sort((a, b) => {
      return (
        defaultSettings.order.indexOf(a.source) -
        defaultSettings.order.indexOf(b.source)
      );
    });

    setHotData(orderedList);

    // 显示提示
    showNotification("设置已恢复为默认值！");
    window.location.hash = ""; // 返回主页
  };

  // 处理平台可见性变更
  const handleSourceVisibilityChange = (sourceName, isVisible) => {
    setSourceSettings((prev) => ({
      ...prev,
      [sourceName]: {
        ...prev[sourceName],
        visible: isVisible,
      },
    }));
  };

  // 请求真实榜单数据
  const fetchDataForSource = async (sourceName) => {
    let url;
    switch (sourceName) {
      case "微博热搜":
        url = "/api-hot/weibo?cache=true";
        break;
      case "知乎热榜":
        url = "/api-hot/zhihu?cache=true";
        break;
      case "百度热搜":
        url = "/api-hot/baidu?cache=true";
        break;
      case "B站热门":
        url = "/api-hot/bilibili?cache=true";
        break;
      default:
        return [];
    }

    try {
      const response = await axios.get(url);
      return response.data.data || [];
    } catch {
      throw new Error(`无法获取 ${sourceName} 数据`);
    }
  };

  // 加载所有榜单数据
  const loadAllHotData = () => {
    hotData.forEach(async (source) => {
      const sourceName = source.source;

      setLoadingSources((prev) => ({ ...prev, [sourceName]: true }));
      setHotDataErrors((prev) => ({ ...prev, [sourceName]: null }));

      const isVisible = sourceSettings[sourceName]?.visible ?? true;
      if (!isVisible) {
        setLoadingSources((prev) => ({ ...prev, [sourceName]: false }));
        return;
      }

      try {
        const data = await fetchDataForSource(sourceName);
        setHotData((prev) =>
          prev.map((item) =>
            item.source === sourceName ? { ...item, items: data } : item
          )
        );
      } catch (err) {
        setHotDataErrors((prev) => ({
          ...prev,
          [sourceName]: "加载失败，请检查网络连接",
        }));
      } finally {
        setLoadingSources((prev) => ({ ...prev, [sourceName]: false }));
      }
    });
  };

  // 打开详情页
  const openModal = (sourceName) => {
    const source = hotData.find((data) => data.source === sourceName);
    setCurrentSource(source);
    setCurrentPage(1);
    setModalOpen(true);
  };

  // 关闭详情页
  const closeModal = () => {
    setCurrentSource(null);
    setModalOpen(false);
  };

  // 刷新单个榜单
  const handleRetry = async (sourceName) => {
    const source = hotData.find((s) => s.source === sourceName);
    if (!source) return;

    setLoadingSources((prev) => ({ ...prev, [sourceName]: true }));
    setHotDataErrors((prev) => ({ ...prev, [sourceName]: null }));

    try {
      const data = await fetchDataForSource(sourceName);
      setHotData((prev) =>
        prev.map((item) =>
          item.source === sourceName ? { ...item, items: data } : item
        )
      );
    } catch {
      setHotDataErrors((prev) => ({
        ...prev,
        [sourceName]: "刷新失败，请稍后再试。",
      }));
    } finally {
      setLoadingSources((prev) => ({ ...prev, [sourceName]: false }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 拖拽开始
  const handleDragStart = (e, index) => {
    e.currentTarget.style.opacity = "0.4";
    e.dataTransfer.setData("draggedIndex", index);
  };

  // 拖拽释放
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"), 10);

    const newList = [...hotData];
    const draggedItem = newList[draggedIndex];

    newList.splice(draggedIndex, 1);
    newList.splice(dropIndex, 0, draggedItem);

    setHotData(newList);
  };

  // 拖拽结束
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };

  useEffect(() => {
    if (!hotData.length) return;

    const newOrder = hotData.map((item) => item.source);

    if (
      !sourceSettings.order ||
      JSON.stringify(sourceSettings.order) !== JSON.stringify(newOrder)
    ) {
      setSourceSettings((prev) => ({
        ...prev,
        order: newOrder,
      }));
    }
  }, []);

  // 渲染设置页 UI（新增部分）
  const renderSettingsPage = () => {
    // 根据搜索词过滤榜单源
    const filteredSources = hotData
      .filter((source) =>
        source.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((source) => ({
        ...source,
        isVisible: sourceSettings[source.source]?.visible ?? true,
      }));

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          {/* 返回主页 */}
          <button
            onClick={() => {
              window.location.hash = "";
              setIsSettingsPage(false);
            }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center mb-6"
          >
            <i className="fas fa-arrow-left mr-2"></i>返回主页
          </button>

          {/* 页面标题 */}
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
            <i className="fas fa-cog mr-3 text-4xl text-blue-500"></i>
            设置中心
          </h2>

          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索平台..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 横向榜单管理区域 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">榜单排序 & 可见性</h3>
            <div
              onDragOver={handleDragOver}
              className="flex flex-wrap gap-4 overflow-x-auto pb-4 hide-scrollbar"
            >
              {filteredSources.map((sourceData, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  data-source={sourceData.source}
                  className="draggable-item min-w-[180px] max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3 space-x-12">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {sourceData.source}
                    </span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sourceData.isVisible}
                        onChange={(e) =>
                          handleSourceVisibilityChange(
                            sourceData.source,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors">
                        <div className="absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full top-0.5 left-0.5 peer-checked:left-6 transition-transform duration-200"></div>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={resetSettings}
              className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              重置为默认值
            </button>
            <button
              onClick={saveSettings}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 监听 hash 改变
  useEffect(() => {
    const handleHashChange = () => {
      setIsSettingsPage(window.location.hash === "#/settings");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 组件挂载时加载榜单数据
  useEffect(() => {
    loadAllHotData();

    const interval = setInterval(loadAllHotData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {isSettingsPage ? (
        // 设置页
        renderSettingsPage()
      ) : (
        // 主页内容
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* 页面头部 */}
          <Header
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            openSettings={() => {
              window.location.hash = "#/settings";
              setIsSettingsPage(true);
            }}
          />

          {/* 卡片区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotData
              .filter(
                (source) => sourceSettings[source.source]?.visible ?? true
              )
              .map((sourceData, idx) => (
                <HotTopicCard
                  key={idx}
                  sourceData={sourceData}
                  openModal={openModal}
                  error={hotDataErrors[sourceData.source]}
                  loading={loadingSources[sourceData.source]}
                  handleRetry={() => handleRetry(sourceData.source)}
                />
              ))}
          </div>
        </div>
      )}

      {/* 模态框 */}
      {modalOpen && currentSource && (
        <HotTopicDetailModal
          currentSource={currentSource}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          modalOpen={modalOpen}
          closeModal={closeModal}
          loading={false}
        />
      )}

      {/* Toast 提示 */}
      <NotificationToast
        message={notification.message}
        isVisible={notification.show}
      />
    </div>
  );
}

export default App;
