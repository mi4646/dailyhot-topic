import React, { useState, useEffect } from "react";
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

  // 初始化状态
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);

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
    setHotData(
      originalHotData.sort(
        (a, b) =>
          settings.order.indexOf(a.source) - settings.order.indexOf(b.source)
      )
    );

    if (modalOpen && currentSource) {
      setModalLoading(true);
      const timer = setTimeout(() => {
        setModalLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
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
    const orderedHotData = sourceSettings.order
      .map((sourceName) =>
        originalHotData.find((data) => data.source === sourceName)
      )
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
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 font-sans antialiased transition-colors duration-300 ${
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

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotData
            .filter((source) => sourceSettings[source.source]?.visible ?? true)
            .map((sourceData, idx) => (
              <HotTopicCard
                key={idx}
                sourceData={sourceData}
                openModal={openModal}
              />
            ))}
        </div> */}

        {/* 首页热榜 */}
        {loading ? (
          <SkeletonLoader />
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
