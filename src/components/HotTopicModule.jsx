import React, { useState } from "react";

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
        setItemsToShow(Math.min(data.items.length, itemsToShow + 10));
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
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
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
              <span className="flex-grow text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-base truncate">
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

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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

export default HotTopicModule;
