// src/components/HotTopicCard.jsx
// 单个热榜平台卡片组件

const HotTopicCard = ({ sourceData, openModal }) => {
  const handleClick = () => {
    openModal(sourceData.source);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <i className={`${sourceData.icon} mr-3 text-3xl`}></i>
          {sourceData.source}
        </h2>
        <a
          href="#"
          onClick={handleClick}
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
  );
};

export default HotTopicCard;
