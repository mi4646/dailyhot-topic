import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [notification, setNotification] = useState({
    message: "",
    show: false,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotData, setHotData] = useState([]);
  const [sourceSettings, setSourceSettings] = useState({});
  const sortableListRef = useRef(null);

  // 模拟原始 hotData 数据
  const originalHotData = [
    {
      source: "微博热搜",
      icon: "fab fa-weibo text-red-500",
      items: [
        {
          title: "某明星新剧开播",
          hot: "987.6万",
          url: "#",
          summary: "这部备受期待的电视剧终于开播，引发了观众热烈讨论。",
        },
        {
          title: "全国多地气温骤降",
          hot: "876.5万",
          url: "#",
          summary: "一股强冷空气来袭，导致全国大部分地区气温骤降，请注意保暖。",
        },
        {
          title: "AI技术发展新突破",
          hot: "765.4万",
          url: "#",
          summary: "人工智能领域取得重大进展，新的算法模型有望改变多个行业。",
        },
        {
          title: "国足世预赛表现",
          hot: "654.3万",
          url: "#",
          summary: "中国国家足球队在世界杯预选赛中表现出色，球迷们充满期待。",
        },
        {
          title: "热门电影票房再创新高",
          hot: "543.2万",
          url: "#",
          summary: "一部现象级电影上映后票房持续走高，打破多项纪录。",
        },
        {
          title: "大学生就业新趋势",
          hot: "432.1万",
          url: "#",
          summary:
            "随着经济发展和产业结构调整，大学生就业呈现出新的趋势和挑战。",
        },
        {
          title: "新能源汽车降价潮",
          hot: "321.0万",
          url: "#",
          summary: "多家新能源汽车品牌宣布降价，市场竞争日益激烈。",
        },
        {
          title: "冬季养生小常识",
          hot: "210.9万",
          url: "#",
          summary: "专家分享冬季养生秘诀，帮助大家健康过冬。",
        },
        {
          title: "各地文旅局花式内卷",
          hot: "109.8万",
          url: "#",
          summary: "为了吸引游客，各地文旅局纷纷推出创意宣传片和活动。",
        },
        {
          title: "年度流行语发布",
          hot: "98.7万",
          url: "#",
          summary: "盘点年度最热门流行语，反映社会文化变迁。",
        },
        {
          title: "如何看待年轻人“反向消费”？",
          hot: "1234万",
          url: "#",
          summary: "年轻人开始追求性价比和实用性，形成“反向消费”趋势。",
        },
        {
          title: "你见过最离谱的职场内卷是什么？",
          hot: "1123万",
          url: "#",
          summary: "网友分享职场内卷经历，引发广泛共鸣。",
        },
        {
          title: "有哪些你觉得是常识，但很多人不知道的知识？",
          hot: "1012万",
          url: "#",
          summary: "盘点那些看似简单却不为人知的常识。",
        },
        {
          title: "为什么现在很多年轻人都不愿意生孩子了？",
          hot: "901万",
          url: "#",
          summary: "探讨年轻人不愿生育的原因及社会影响。",
        },
        {
          title: "有哪些适合冬天吃的暖身食物？",
          hot: "890万",
          url: "#",
          summary: "推荐冬季暖身美食，帮助大家抵御寒冷。",
        },
        {
          title: "如何评价电影《流浪地球2》？",
          hot: "789万",
          url: "#",
          summary: "《流浪地球2》上映后口碑爆棚，引发科幻热潮。",
        },
        {
          title: "有哪些让你醍醐灌顶的人生建议？",
          hot: "678万",
          url: "#",
          summary: "网友分享改变人生的建议，助你少走弯路。",
        },
        {
          title: "你有哪些相见恨晚的App？",
          hot: "567万",
          url: "#",
          summary: "推荐实用App，提升生活效率和乐趣。",
        },
        {
          title: "如何有效提高学习效率？",
          hot: "456万",
          url: "#",
          summary: "分享高效学习方法，助你事半功倍。",
        },
        {
          title: "有哪些你觉得很酷的科技产品？",
          hot: "345万",
          url: "#",
          summary: "盘点最新科技产品，感受科技魅力。",
        },
        {
          title: "如何看待“特种兵式旅游”？",
          hot: "300万",
          url: "#",
          summary: "“特种兵式旅游”成为新潮流，年轻人追求极致体验。",
        },
        {
          title: "有哪些让你受益匪浅的习惯？",
          hot: "280万",
          url: "#",
          summary: "培养好习惯，成就更好的自己。",
        },
      ],
    },
    {
      source: "知乎热榜",
      icon: "fab fa-zhihu text-blue-600",
      items: [
        {
          title: "如何看待年轻人“反向消费”？",
          hot: "1234万",
          url: "#",
          summary: "年轻人开始追求性价比和实用性，形成“反向消费”趋势。",
        },
        {
          title: "你见过最离谱的职场内卷是什么？",
          hot: "1123万",
          url: "#",
          summary: "网友分享职场内卷经历，引发广泛共鸣。",
        },
        {
          title: "有哪些你觉得是常识，但很多人不知道的知识？",
          hot: "1012万",
          url: "#",
          summary: "盘点那些看似简单却不为人知的常识。",
        },
        {
          title: "为什么现在很多年轻人都不愿意生孩子了？",
          hot: "901万",
          url: "#",
          summary: "探讨年轻人不愿生育的原因及社会影响。",
        },
        {
          title: "有哪些适合冬天吃的暖身食物？",
          hot: "890万",
          url: "#",
          summary: "推荐冬季暖身美食，帮助大家抵御寒冷。",
        },
        {
          title: "如何评价电影《流浪地球2》？",
          hot: "789万",
          url: "#",
          summary: "《流浪地球2》上映后口碑爆棚，引发科幻热潮。",
        },
        {
          title: "有哪些让你醍醐灌顶的人生建议？",
          hot: "678万",
          url: "#",
          summary: "网友分享改变人生的建议，助你少走弯路。",
        },
        {
          title: "你有哪些相见恨晚的App？",
          hot: "567万",
          url: "#",
          summary: "推荐实用App，提升生活效率和乐趣。",
        },
        {
          title: "如何有效提高学习效率？",
          hot: "456万",
          url: "#",
          summary: "分享高效学习方法，助你事半功倍。",
        },
        {
          title: "有哪些你觉得很酷的科技产品？",
          hot: "345万",
          url: "#",
          summary: "盘点最新科技产品，感受科技魅力。",
        },
      ],
    },
    {
      source: "百度热搜",
      icon: "fas fa-search text-blue-500",
      items: [
        {
          title: "春运火车票开售",
          hot: "1500万+",
          url: "#",
          summary: "2024年春运火车票正式开售，抢票大战拉开序幕。",
        },
        {
          title: "南方多地将迎大雪",
          hot: "1400万+",
          url: "#",
          summary: "气象部门预警，南方多地将迎来大范围降雪。",
        },
        {
          title: "新能源汽车补贴政策",
          hot: "1300万+",
          url: "#",
          summary: "国家发布新能源汽车最新补贴政策，促进产业发展。",
        },
        {
          title: "全球经济形势分析",
          hot: "1200万+",
          url: "#",
          summary: "专家分析当前全球经济形势及未来走势。",
        },
        {
          title: "热门电视剧大结局",
          hot: "1100万+",
          url: "#",
          summary: "一部备受关注的电视剧迎来大结局，引发观众热议。",
        },
        {
          title: "健康生活方式指南",
          hot: "1000万+",
          url: "#",
          summary: "权威机构发布健康生活方式指南，倡导全民健康。",
        },
        {
          title: "最新科技产品发布",
          hot: "900万+",
          url: "#",
          summary: "各大科技公司纷纷发布最新产品，引领科技潮流。",
        },
        {
          title: "旅游目的地推荐",
          hot: "800万+",
          url: "#",
          summary: "推荐国内外热门旅游目的地，开启美好旅程。",
        },
        {
          title: "教育改革新动向",
          hot: "700万+",
          url: "#",
          summary: "教育领域迎来新一轮改革，关注学生全面发展。",
        },
        {
          title: "体育赛事最新战况",
          hot: "600万+",
          url: "#",
          summary: "国内外体育赛事精彩纷呈，最新战况引人关注。",
        },
      ],
    },
    {
      source: "B站热门",
      icon: "fas fa-tv text-pink-500",
      items: [
        {
          title: "年度动画盘点",
          hot: "500万+",
          url: "#",
          summary: "B站UP主盘点年度最佳动画，引发动漫迷热议。",
        },
        {
          title: "游戏区UP主新作品",
          hot: "450万+",
          url: "#",
          summary: "知名游戏UP主发布新作，粉丝期待值爆棚。",
        },
        {
          title: "生活区搞笑视频",
          hot: "400万+",
          url: "#",
          summary: "生活区UP主分享搞笑日常，带来欢乐。",
        },
        {
          title: "知识区科普系列",
          hot: "350万+",
          url: "#",
          summary: "知识区UP主推出科普系列视频，普及科学知识。",
        },
        {
          title: "音乐区翻唱合集",
          hot: "300万+",
          url: "#",
          summary: "音乐区UP主翻唱热门歌曲，展现音乐才华。",
        },
        {
          title: "舞蹈区最新投稿",
          hot: "250万+",
          url: "#",
          summary: "舞蹈区UP主发布最新舞蹈作品，引来围观。",
        },
        {
          title: "美食探店Vlog",
          hot: "200万+",
          url: "#",
          summary: "美食UP主探店Vlog，带你品尝各地美食。",
        },
        {
          title: "鬼畜区新梗出炉",
          hot: "150万+",
          url: "#",
          summary: "鬼畜区UP主创作新梗，引发网友模仿。",
        },
        {
          title: "时尚穿搭分享",
          hot: "100万+",
          url: "#",
          summary: "时尚UP主分享穿搭技巧，助你成为时尚达人。",
        },
        {
          title: "萌宠日常记录",
          hot: "50万+",
          url: "#",
          summary: "萌宠UP主记录宠物日常，治愈人心。",
        },
      ],
    },
  ];

  const ITEMS_PER_PAGE = 10;

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
      originalHotData.sort((a, b) => {
        return (
          settings.order.indexOf(a.source) - settings.order.indexOf(b.source)
        );
      })
    );
    // 设置初始主题到 html 标签
    if (savedTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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

  // 打开详情模态框
  const openModal = (sourceName) => {
    const source = originalHotData.find((data) => data.source === sourceName);
    setCurrentSource(source);
    setCurrentPage(1);
    setModalOpen(true);
  };

  // 关闭详情模态框
  const closeModal = () => {
    setModalOpen(false);
  };

  // 打开设置模态框
  const openSettingsModal = () => {
    setSettingsModalOpen(true);
  };

  // 关闭设置模态框
  const closeSettingsModal = () => {
    setSettingsModalOpen(false);
  };

  // 渲染详情列表
  const renderModalItems = () => {
    const totalPages = Math.ceil(currentSource.items.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(
      startIndex + ITEMS_PER_PAGE,
      currentSource.items.length
    );
    return currentSource.items
      .slice(startIndex, endIndex)
      .map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
        >
          <div className="flex items-center mb-2">
            <span
              className={`font-extrabold text-2xl mr-4 w-8 text-center ${
                startIndex + index < 3 ? "text-red-600" : "text-gray-500"
              }`}
            >
              {startIndex + index + 1}.
            </span>
            <a
              href={item.url}
              className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xl font-bold flex-grow"
            >
              {item.title}
            </a>
            <span className="ml-4 text-lg text-gray-600 dark:text-gray-300 flex-shrink-0">
              <i className="fas fa-fire text-orange-500 mr-1"></i>
              {item.hot}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base ml-12 mt-2">
            {item.summary || "暂无摘要"}
          </p>
        </div>
      ));
  };

  // 更新排序顺序
  const updateSourceOrder = () => {
    const order = Array.from(
      sortableListRef.current.querySelectorAll(".draggable-item")
    ).map((item) => item.dataset.source);
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

  const showNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => {
      setNotification({ message: "", show: false });
    }, 2000);
  };

  const NotificationModal = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-[9999] flex items-center space-x-2">
        <i className="fas fa-info-circle"></i>
        <span>{message}</span>
      </div>
    );
  };

  // 拖拽事件处理
  const addDragAndDropListeners = () => {
    const draggableItems = document.querySelectorAll(".draggable-item");
    let draggingItem = null;

    draggableItems.forEach((item) => {
      item.addEventListener("dragstart", () => {
        draggingItem = item;
        setTimeout(() => item.classList.add("dragging"), 0);
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        draggingItem = null;
        updateSourceOrder();
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(
          sortableListRef.current,
          e.clientY
        );
        const currentElement = e.target.closest(".draggable-item");
        if (currentElement && currentElement !== draggingItem) {
          if (afterElement == null) {
            sortableListRef.current.appendChild(draggingItem);
          } else {
            sortableListRef.current.insertBefore(draggingItem, afterElement);
          }
        }
      });
    });
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".draggable-item:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: -Infinity }
    ).element;
  };

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 font-sans antialiased transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center relative">
          <i className="fas fa-fire-alt text-red-500 mr-3"></i>
          今日热榜
          <button
            onClick={toggleTheme}
            className="absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
          >
            {darkMode ? (
              <i className="fas fa-sun text-xl"></i>
            ) : (
              <i className="fas fa-moon text-xl"></i>
            )}
          </button>
          <button
            onClick={openSettingsModal}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
          >
            <i className="fas fa-cog text-xl"></i>
          </button>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotData
            .filter((source) => sourceSettings[source.source]?.visible ?? true)
            .map((sourceData, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    <i className={`${sourceData.icon} mr-3 text-3xl`}></i>
                    {sourceData.source}
                  </h2>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal(sourceData.source);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium flex items-center"
                  >
                    更多 <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </a>
                </div>
                <div
                  className="flex-grow overflow-y-auto pr-2 hot-list-scroll"
                  style={{ maxHeight: "400px" }}
                >
                  <ol className="space-y-3">
                    {sourceData.items.slice(0, 15).map((item, i) => (
                      <li key={i} className="flex items-center group">
                        <span
                          className={`font-bold text-lg mr-3 w-6 text-center ${
                            i < 3 ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <a
                          href={item.url}
                          className="flex-grow text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-base truncate"
                        >
                          {item.title}
                        </a>
                        <span className="ml-3 text-sm text-gray-500 flex-shrink-0">
                          <i className="fas fa-fire text-orange-400 mr-1"></i>
                          {item.hot}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <span>更新于: {new Date().toLocaleTimeString()}</span>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 flex items-center">
                    <i className="fas fa-sync-alt mr-2"></i>刷新
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 详情模态框 */}
      {modalOpen && currentSource && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 flex items-center justify-center">
              <i className={`${currentSource.icon} mr-4 text-5xl`}></i>
              {currentSource.source} 详情
            </h2>
            <div className="space-y-4 mb-6">
              {renderModalItems()}
            </div>
            <div className="flex justify-center items-center space-x-6 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i> 上一页
              </button>
              <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                第 {currentPage} /{" "}
                {Math.ceil(currentSource.items.length / ITEMS_PER_PAGE)} 页
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(currentSource.items.length / ITEMS_PER_PAGE),
                      p + 1
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(currentSource.items.length / ITEMS_PER_PAGE)
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
              >
                下一页 <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 设置模态框 */}
      {settingsModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="settings-modal-content bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeSettingsModal}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
              <i className="fas fa-cog mr-3 text-4xl"></i>
              设置
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                榜单排序
              </h3>
              <div
                ref={sortableListRef}
                className="space-y-2"
                onDragStart={addDragAndDropListeners}
              >
                {hotData.map((source, idx) => (
                  <div
                    key={idx}
                    className="draggable-item draggable-item"
                    draggable="true"
                    data-source={source.source}
                  >
                    <i className="fas fa-grip-vertical text-gray-400 mr-3"></i>
                    <span className="flex-grow text-gray-700 dark:text-gray-300">
                      {source.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                榜单显示
              </h3>
              <div className="space-y-2">
                {hotData.map((source, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {source.source}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={sourceSettings[source.source]?.visible ?? true}
                        onChange={(e) => {
                          setSourceSettings((prev) => ({
                            ...prev,
                            [source.source]: { visible: e.target.checked },
                          }));
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={saveSettings}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                保存设置
              </button>
              <button
                onClick={resetSettings}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NotificationModal 通知 */}
      <NotificationModal
        message={notification.message}
        isVisible={notification.show}
      />
    </div>
  );
};

export default App;
