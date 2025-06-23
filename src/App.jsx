import { useState, useEffect, showDetailModal } from "react";
import DetailModal from "./DetailModal";

const App = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDetailSource, setCurrentDetailSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 模拟数据源
  const [hotData, setHotData] = useState([
    {
      source: "微博热搜",
      icon: "fab fa-weibo text-red-500",
      visible: true,
      items: [
        {
          title: "某明星新剧开播",
          hot: "987.6万",
          summary: "这部备受期待的电视剧终于开播，引发了观众热烈讨论。",
        },
        {
          title: "全国多地气温骤降",
          hot: "876.5万",
          summary: "一股强冷空气来袭，导致全国大部分地区气温骤降，请注意保暖。",
        },
        {
          title: "AI技术发展新突破",
          hot: "765.4万",
          summary: "人工智能领域取得重大进展，新的算法模型有望改变多个行业。",
        },
        {
          title: "国足世预赛表现",
          hot: "654.3万",
          summary: "中国国家足球队在世界杯预选赛中表现出色，球迷们充满期待。",
        },
        {
          title: "热门电影票房再创新高",
          hot: "543.2万",
          summary: "一部现象级电影上映后票房持续走高，打破多项纪录。",
        },
        {
          title: "大学生就业新趋势",
          hot: "432.1万",
          summary:
            "随着经济发展和产业结构调整，大学生就业呈现出新的趋势和挑战。",
        },
        {
          title: "新能源汽车降价潮",
          hot: "321.0万",
          summary: "多家新能源汽车品牌宣布降价，市场竞争日益激烈。",
        },
        {
          title: "冬季养生小常识",
          hot: "210.9万",
          summary: "专家分享冬季养生秘诀，帮助大家健康过冬。",
        },
        {
          title: "各地文旅局花式内卷",
          hot: "109.8万",
          summary: "为了吸引游客，各地文旅局纷纷推出创意宣传片和活动。",
        },
        {
          title: "年度流行语发布",
          hot: "98.7万",
          summary: "盘点年度最热门流行语，反映社会文化变迁。",
        },
        {
          title: "数字经济发展新机遇",
          hot: "90.0万",
          summary: "数字经济蓬勃发展，为各行各业带来新的增长机遇。",
        },
        {
          title: "全球气候变化应对",
          hot: "85.0万",
          summary: "国际社会共同探讨应对气候变化的策略和行动。",
        },
        {
          title: "文化遗产保护与传承",
          hot: "80.0万",
          summary: "加强文化遗产保护，传承优秀传统文化。",
        },
        {
          title: "乡村振兴战略实施",
          hot: "75.0万",
          summary: "乡村振兴战略深入推进，农村面貌焕然一新。",
        },
        {
          title: "科技创新驱动发展",
          hot: "70.0万",
          summary: "科技创新成为推动经济社会发展的重要引擎。",
        },
        {
          title: "健康生活新理念",
          hot: "65.0万",
          summary: "倡导健康生活方式，提升全民健康水平。",
        },
      ],
    },
    {
      source: "知乎热榜",
      icon: "fab fa-zhihu text-blue-600",
      visible: true,
      items: [
        {
          title: "如何看待年轻人“反向消费”？",
          hot: "1234万",
          summary: "年轻人开始追求性价比和实用性，形成“反向消费”趋势。",
        },
        {
          title: "你见过最离谱的职场内卷是什么？",
          hot: "1123万",
          summary: "网友分享职场内卷经历，引发广泛共鸣。",
        },
        {
          title: "有哪些你觉得是常识，但很多人不知道的知识？",
          hot: "1012万",
          summary: "盘点那些看似简单却不为人知的常识。",
        },
        {
          title: "为什么现在很多年轻人都不愿意生孩子了？",
          hot: "901万",
          summary: "探讨年轻人不愿生育的原因及社会影响。",
        },
        {
          title: "有哪些适合冬天吃的暖身食物？",
          hot: "890万",
          summary: "推荐冬季暖身美食，帮助大家抵御寒冷。",
        },
        {
          title: "如何评价电影《流浪地球2》？",
          hot: "789万",
          summary: "《流浪地球2》上映后口碑爆棚，引发科幻热潮。",
        },
        {
          title: "有哪些让你醍醐灌顶的人生建议？",
          hot: "678万",
          summary: "网友分享改变人生的建议，助你少走弯路。",
        },
        {
          title: "你有哪些相见恨晚的App？",
          hot: "567万",
          summary: "推荐实用App，提升生活效率和乐趣。",
        },
        {
          title: "如何有效提高学习效率？",
          hot: "456万",
          summary: "分享高效学习方法，助你事半功倍。",
        },
        {
          title: "有哪些你觉得很酷的科技产品？",
          hot: "345万",
          summary: "盘点最新科技产品，感受科技魅力。",
        },
        {
          title: "如何看待“特种兵式旅游”？",
          hot: "300万",
          summary: "“特种兵式旅游”成为新潮流，年轻人追求极致体验。",
        },
        {
          title: "有哪些让你受益匪浅的习惯？",
          hot: "280万",
          summary: "培养好习惯，成就更好的自己。",
        },
      ],
    },
    {
      source: "百度热搜",
      icon: "fas fa-search text-blue-500",
      visible: true,
      items: [
        {
          title: "春运火车票开售",
          hot: "1500万+",
          summary: "2024年春运火车票正式开售，抢票大战拉开序幕。",
        },
        {
          title: "南方多地将迎大雪",
          hot: "1400万+",
          summary: "气象部门预警，南方多地将迎来大范围降雪。",
        },
        {
          title: "新能源汽车补贴政策",
          hot: "1300万+",
          summary: "国家发布新能源汽车最新补贴政策，促进产业发展。",
        },
        {
          title: "全球经济形势分析",
          hot: "1200万+",
          summary: "专家分析当前全球经济形势及未来走势。",
        },
        {
          title: "热门电视剧大结局",
          hot: "1100万+",
          summary: "一部备受关注的电视剧迎来大结局，引发观众热议。",
        },
        {
          title: "健康生活方式指南",
          hot: "1000万+",
          summary: "权威机构发布健康生活方式指南，倡导全民健康。",
        },
        {
          title: "最新科技产品发布",
          hot: "900万+",
          summary: "各大科技公司纷纷发布最新产品，引领科技潮流。",
        },
        {
          title: "旅游目的地推荐",
          hot: "800万+",
          summary: "推荐国内外热门旅游目的地，开启美好旅程。",
        },
        {
          title: "教育改革新动向",
          hot: "700万+",
          summary: "教育领域迎来新一轮改革，关注学生全面发展。",
        },
        {
          title: "体育赛事最新战况",
          hot: "600万+",
          summary: "国内外体育赛事精彩纷呈，最新战况引人关注。",
        },
        {
          title: "全球变暖对生态的影响",
          hot: "550万+",
          summary: "全球变暖对生态系统造成严重影响，呼吁采取行动。",
        },
        {
          title: "人工智能伦理问题探讨",
          hot: "500万+",
          summary: "探讨人工智能发展中的伦理挑战及应对策略。",
        },
      ],
    },
    {
      source: "B站热门",
      icon: "fas fa-tv text-pink-500",
      visible: true,
      items: [
        {
          title: "年度动画盘点",
          hot: "500万+",
          summary: "B站UP主盘点年度最佳动画，引发动漫迷热议。",
        },
        {
          title: "游戏区UP主新作品",
          hot: "450万+",
          summary: "知名游戏UP主发布新作，粉丝期待值爆棚。",
        },
        {
          title: "生活区搞笑视频",
          hot: "400万+",
          summary: "生活区UP主分享搞笑日常，带来欢乐。",
        },
        {
          title: "知识区科普系列",
          hot: "350万+",
          summary: "知识区UP主推出科普系列视频，普及科学知识。",
        },
        {
          title: "音乐区翻唱合集",
          hot: "300万+",
          summary: "音乐区UP主翻唱热门歌曲，展现音乐才华。",
        },
        {
          title: "舞蹈区最新投稿",
          hot: "250万+",
          summary: "舞蹈区UP主发布最新舞蹈作品，引来围观。",
        },
        {
          title: "美食探店Vlog",
          hot: "200万+",
          summary: "美食UP主探店Vlog，带你品尝各地美食。",
        },
        {
          title: "鬼畜区新梗出炉",
          hot: "150万+",
          summary: "鬼畜区UP主创作新梗，引发网友模仿。",
        },
        {
          title: "时尚穿搭分享",
          hot: "100万+",
          summary: "时尚UP主分享穿搭技巧，助你成为时尚达人。",
        },
        {
          title: "萌宠日常记录",
          hot: "50万+",
          summary: "萌宠UP主记录宠物日常，治愈人心。",
        },
        {
          title: "虚拟偶像新单曲发布",
          hot: "45万+",
          summary: "虚拟偶像发布全新单曲，引发粉丝狂热。",
        },
        {
          title: "深度学习技术解析",
          hot: "40万+",
          summary: "技术UP主深入解析深度学习技术，干货满满。",
        },
      ],
    },
  ]);

  const [sortedSources, setSortedSources] = useState([...hotData]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const openSettingsModal = () => {
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const openDetailModal = (sourceName) => {
    setCurrentDetailSource(sourceName);
    setCurrentPage(1);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const toggleVisibility = (source) => {
    setHotData(
      hotData.map((d) =>
        d.source === source ? { ...d, visible: !d.visible } : d
      )
    );
  };

  const ITEMS_PER_PAGE = 5;

  const totalPages = currentDetailSource
    ? Math.ceil(
        hotData.find((d) => d.source === currentDetailSource).items.length /
          ITEMS_PER_PAGE
      )
    : 1;

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans antialiased transition-colors duration-300 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center relative dark:text-gray-100">
          <i className="fas fa-fire-alt text-red-500 mr-3"></i>
          今日热榜
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
          >
            {theme === "light" ? (
              <i className="fas fa-moon text-xl"></i>
            ) : (
              <i className="fas fa-sun text-xl"></i>
            )}
          </button>
          <button
            id="settings-button"
            onClick={openSettingsModal}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
          >
            <i className="fas fa-cog text-xl"></i>
          </button>
        </h1>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          id="hot-topics-container"
        >
          {hotData
            .filter((d) => d.visible)
            .map((sourceData, index) => (
              <HotTopicModule
                key={index}
                data={sourceData}
                onMoreClick={() => openDetailModal(sourceData.source)}
              />
            ))}
        </div>
      </div>

      {/* 设置模态框 */}
      {showSettingsModal && (
        <SettingsModal
          sources={hotData}
          onClose={closeSettingsModal}
          sortedSources={sortedSources}
          setSortedSources={setSortedSources}
          toggleVisibility={toggleVisibility}
        />
      )}

      {/* 详情模态框 */}
      {showDetailModal && currentDetailSource && (
        <DetailModal
          source={hotData.find((d) => d.source === currentDetailSource)}
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

// 单个热榜模块组件
const HotTopicModule = ({ data, onMoreClick }) => {
  const [itemsToShow, setItemsToShow] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [updateTime, setUpdateTime] = useState(new Date().toLocaleTimeString());

  const handleScroll = (e) => {
    const listDiv = e.target;
    const { scrollTop, scrollHeight, clientHeight } = listDiv;

    if (
      !isLoading &&
      scrollTop + clientHeight >= scrollHeight - 50 &&
      itemsToShow < data.items.length
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setItemsToShow((prev) => Math.min(data.items.length, prev + 10));
        setIsLoading(false);
      }, 500);
    }
  };

  const refreshList = () => {
    setUpdateTime(new Date().toLocaleTimeString());
    setItemsToShow(15);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <i className={`${data.icon} mr-3 text-3xl`}></i>
          {data.source}
        </h2>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onMoreClick();
          }}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium flex items-center"
        >
          更多 <i className="fas fa-arrow-right ml-1 text-xs"></i>
        </a>
      </div>

      <div
        onScroll={handleScroll}
        className="flex-grow overflow-y-auto pr-2 hot-list-scroll"
        style={{ maxHeight: "400px" }}
      >
        <ol className="space-y-3">
          {data.items.slice(0, itemsToShow).map((item, idx) => (
            <li key={idx} className="flex items-center group">
              <span
                className={`font-bold text-lg mr-3 w-6 text-center ${
                  idx < 3 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {idx + 1}
              </span>
              <span className="flex-grow text-gray-700 dark:text-gray-300 text-base truncate">
                {item.title}
              </span>
              <span className="ml-3 text-sm text-gray-500 flex-shrink-0">
                <i className="fas fa-fire text-orange-400 mr-1"></i>
                {item.hot}
              </span>
            </li>
          ))}
        </ol>
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <p className="text-gray-500 text-sm mt-2">加载中...</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
        <span>更新于: {updateTime}</span>
        <button
          onClick={refreshList}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 flex items-center"
        >
          <i className="fas fa-sync-alt mr-2"></i>刷新
        </button>
      </div>
    </div>
  );
};

// 设置模态框组件
const SettingsModal = ({
  sources,
  onClose,
  sortedSources,
  setSortedSources,
  toggleVisibility,
}) => {
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, dropIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    const reordered = reorder(sortedSources, draggedIndex, dropIndex);
    setSortedSources(reordered);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <i className="fas fa-cog mr-3 text-4xl"></i>设置
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            榜单排序
          </h3>
          <div className="space-y-2" id="sortable-list">
            {sortedSources.map((source, index) => (
              <div
                key={source.source}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, index)}
                className="draggable-item"
              >
                <span>{source.source}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            榜单显示
          </h3>
          <div className="space-y-2" id="visibility-list">
            {sources.map((source) => (
              <label
                key={source.source}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={source.visible}
                  onChange={() => toggleVisibility(source.source)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{source.source}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            onClick={onClose}
          >
            保存设置
          </button>
          <button
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
            onClick={onClose}
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
};

// 详情模态框组件
{
  showDetailModal && currentDetailSource && (
    <DetailModal
      source={hotData.find((d) => d.source === currentDetailSource)}
      currentPage={currentPage}
      totalPages={totalPages}
      onNextPage={goToNextPage}
      onPrevPage={goToPrevPage}
      onClose={() => setShowDetailModal(false)} // 这是关键
    />
  );
}

export default App;
