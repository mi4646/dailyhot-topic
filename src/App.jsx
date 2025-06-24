import React, { useState, useEffect, useLayoutEffect } from "react";
import Header from "./components/Header";
import HotTopicCard from "./components/HotTopicCard";
import HotTopicDetailModal from "./components/HotTopicDetailModal";
import SettingsModal from "./components/SettingsModal";
import NotificationToast from "./components/NotificationToast";
import SkeletonLoader from "./components/SkeletonLoader";
import originalHotData from "./mock";

function App() {
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [hotData, setHotData] = useState([]);
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

  // 初始化主题
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);

    if (savedTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 初始化状态
  useEffect(() => {
    const savedSettings = localStorage.getItem("hotTopicSettings");
    let settings = {};
    if (savedSettings) {
      settings = JSON.parse(savedSettings);
    } else {
      originalHotData.forEach((source) => {
        settings[source.source] = { visible: true };
      });
      settings.order = originalHotData.map((s) => s.source);
      localStorage.setItem("hotTopicSettings", JSON.stringify(settings));
    }

    setSourceSettings(settings);

    // 初始化热榜数据
    setHotData(
      originalHotData.sort(
        (a, b) =>
          settings.order.indexOf(a.source) - settings.order.indexOf(b.source)
      )
    );

    // 初始化详情页加载状态
    if (modalOpen && currentSource) {
      setModalLoading(true);
      const timer = setTimeout(() => {
        setModalLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }

    // 初始化骨架屏加载状态
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentPage, modalOpen, currentSource]);

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
    setLoading(true); // 显示骨架屏
    showNotification("设置已保存！"); // 显示通知

    // 模拟保存和数据处理延迟
    const orderedHotData = sourceSettings.order
      .map((sourceName) =>
        originalHotData.find((data) => data.source === sourceName)
      )
      .filter(Boolean);

    setHotData(orderedHotData);

    localStorage.setItem("hotTopicSettings", JSON.stringify(sourceSettings));

    setTimeout(() => {
      setLoading(false); // 数据加载完成，隐藏骨架屏
    }, 600);

    setSettingsModalOpen(false);
  };

  // 重置设置
  const resetSettings = () => {
    localStorage.removeItem("hotTopicSettings");
    const defaultSettings = {};
    originalHotData.forEach((source) => {
      defaultSettings[source.source] = { visible: true };
    });
    defaultSettings.order = originalHotData.map((s) => s.source);
    setSourceSettings(defaultSettings);
    setHotData(originalHotData);
    showNotification("设置已恢复为默认值！");
  };

  // 打开详情页
  const openModal = (sourceName) => {
    setModalLoading(true); // 打开模态框时显示骨架屏
    const source = originalHotData.find((data) => data.source === sourceName);
    setCurrentSource(source);
    setCurrentPage(1);
    setModalOpen(true);

    // 模拟数据加载延迟（可选）
    setTimeout(() => {
      setModalLoading(false);
    }, 600); // 可根据实际情况调整时间
  };

  // 关闭详情页
  const closeModal = () => {
    setCurrentSource(null);
    setModalOpen(false);
  };

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* 头部 */}
        <Header
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          openSettings={() => setSettingsModalOpen(true)}
        />

        {/* 首页热榜 */}
        {loading ? (
          <SkeletonLoader count={hotData.length} />
        ) : hotData.filter(
            (source) => sourceSettings[source.source]?.visible ?? true
          ).length === 0 ? (
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
