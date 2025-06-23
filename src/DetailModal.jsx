import { useState } from "react";

const DetailModal = ({ source, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(source.items.length / ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <i className={`${source.icon} mr-3 text-3xl`}></i>
            {source.source} 详情
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* 列表内容 */}
        <div className="flex-grow overflow-y-auto pr-2 hot-list-scroll">
          <div className="space-y-4">
            {source.items
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
              )
              .map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center mb-2">
                    <span
                      className={`font-bold text-xl mr-3 w-8 text-center ${
                        idx < 3 ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </span>
                    <a
                      href={item.url}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold truncate flex-grow"
                    >
                      {item.title}
                    </a>
                    <span className="ml-4 text-sm text-gray-600 dark:text-gray-300 flex-shrink-0">
                      <i className="fas fa-fire text-orange-400 mr-1"></i>
                      {item.hot}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm ml-11">
                    {item.summary || "暂无摘要信息"}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* 分页控件 */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="text-lg font-medium">
            第 {currentPage} / {totalPages} 页
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
