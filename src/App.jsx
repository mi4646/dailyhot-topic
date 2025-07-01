import React, { useState, useEffect, useLayoutEffect } from "react";
import Header from "./components/Header";
import HotTopicCard from "./components/HotTopicCard";
import HotTopicDetailModal from "./components/HotTopicDetailModal";
import SettingsModal from "./components/SettingsModal";
import NotificationToast from "./components/NotificationToast";
import axios from "axios";

function App() {
  // 状态管理
  const [hotData, setHotData] = useState([
    { source: "微博热搜", icon: "fab fa-weibo text-red-500", items: [] },
    { source: "知乎热榜", icon: "fab fa-zhihu text-blue-600", items: [] },
    { source: "百度热搜", icon: "fas fa-search text-orange-500", items: [] },
    { source: "哔哩哔哩", icon: "fas fa-tv text-pink-500", items: [] },
  ]);
  const [loadingSources, setLoadingSources] = useState({});
  const [hotDataErrors, setHotDataErrors] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    show: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceSettings, setSourceSettings] = useState({});

  // 初始化加载状态
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
      settings = JSON.parse(savedSettings);
    } else {
      hotData.forEach((source) => {
        settings[source.source] = { visible: true };
      });
      settings.order = hotData.map((s) => s.source);
      localStorage.setItem("hotTopicSettings", JSON.stringify(settings));
    }

    setSourceSettings(settings);
    setHotData((prev) =>
      prev.map((item) =>
        settings.order.includes(item.source)
          ? { ...item, visible: settings[item.source]?.visible ?? true }
          : item
      )
    );
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

  // 更新热榜顺序
  const updateOrder = () => {
    const order = Array.from(document.querySelectorAll(".draggable-item")).map(
      (item) => item.dataset.source
    );
    setSourceSettings((prev) => ({ ...prev, order }));
  };

  // 保存设置
  const saveSettings = () => {
    const orderedHotData = sourceSettings.order
      .map((sourceName) => hotData.find((data) => data.source === sourceName))
      .filter(Boolean);

    setHotData(orderedHotData);
    localStorage.setItem("hotTopicSettings", JSON.stringify(sourceSettings));
    showNotification("设置已保存！");
    setSettingsModalOpen(false);
  };

  // 重置设置
  const resetSettings = () => {
    localStorage.removeItem("hotTopicSettings");
    const defaultSettings = {};
    hotData.forEach((source) => {
      defaultSettings[source.source] = { visible: true };
    });
    defaultSettings.order = hotData.map((s) => s.source);
    setSourceSettings(defaultSettings);
    setHotData(hotData);
    showNotification("设置已恢复为默认值！");
  };

  // 打开详情页
  const openModal = (sourceName) => {
    setModalLoading(true);
    const source = hotData.find((data) => data.source === sourceName);
    setCurrentSource(source);
    setCurrentPage(1);
    setModalOpen(true);

    setTimeout(() => {
      setModalLoading(false);
    }, 600);
  };

  // 关闭详情页
  const closeModal = () => {
    setCurrentSource(null);
    setModalOpen(false);
  };

  // 处理热源可见性变更
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
      case "哔哩哔哩":
        url = "/api-hot/bilibili?cache=true";
        break;
      default:
        return [];
    }

    try {
      const response = await axios.get(url);
      return response.data.data || []; // 根据接口结构调整
    } catch (err) {
      console.error(`获取 ${sourceName} 数据失败`, err);
      throw new Error(`无法获取 ${sourceName} 数据`);
    }
  };

  // 加载所有榜单数据
  const loadAllHotData = () => {
    const savedSettings = localStorage.getItem("hotTopicSettings");
    let settings = {};

    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error("localStorage 解析失败", e);
        settings = {};
      }
    } else {
      originalHotData.forEach((source) => {
        settings[source.source] = { visible: true };
      });
      settings.order = originalHotData.map((s) => s.source);
    }

    hotData.forEach(async (source) => {
      const sourceName = source.source;

      setLoadingSources((prev) => ({ ...prev, [sourceName]: true }));
      setHotDataErrors((prev) => ({ ...prev, [sourceName]: null }));

      // 判断是否可见
      const isVisible = settings[sourceName]?.visible ?? true;

      if (!isVisible) {
        console.log(`${sourceName} 不可见，跳过加载`);
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
          [sourceName]: "加载失败，请检查网络连接或稍后重试",
        }));
      } finally {
        setLoadingSources((prev) => ({ ...prev, [sourceName]: false }));
      }
    });
  };
  // 刷新单个榜单
  const handleRetry = async (sourceName) => {
    setLoadingSources((prev) => ({ ...prev, [sourceName]: true }));
    setHotDataErrors((prev) => ({ ...prev, [sourceName]: null }));

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
        [sourceName]: "刷新失败，请稍后再试。",
      }));
    } finally {
      setLoadingSources((prev) => ({ ...prev, [sourceName]: false }));
    }
  };

  // 初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAllHotData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* 页面头部 */}
        <Header
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          openSettings={() => setSettingsModalOpen(true)}
        />

        {hotData.filter(
          (source) => sourceSettings[source.source]?.visible ?? true
        ).length === 0 ? (
          /* 没有可见榜单时显示提示 */
          <div className="text-center py-12">
            <i className="fas fa-info-circle text-gray-500 dark:text-gray-400 text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              暂无可见榜单
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              请前往设置页面开启至少一个平台榜单。
            </p>
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              打开设置
            </button>
          </div>
        ) : (
          /* 正常渲染榜单卡片 */
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
        )}

        {/* 模态框 */}
        <HotTopicDetailModal
          currentSource={currentSource}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          modalOpen={modalOpen}
          closeModal={closeModal}
          loading={modalLoading}
        />

        {/* 设置模态框 */}
        <SettingsModal
          settingsModalOpen={settingsModalOpen}
          closeModal={() => setSettingsModalOpen(false)}
          sourceSettings={sourceSettings}
          updateOrder={updateOrder}
          saveSettings={saveSettings}
          resetSettings={resetSettings}
          onSourceVisibilityChange={handleSourceVisibilityChange}
        />

        {/* 通知 Toast */}
        <NotificationToast
          message={notification.message}
          isVisible={notification.show}
        />
      </div>
    </div>
  );
}

export default App;
