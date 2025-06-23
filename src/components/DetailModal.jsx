import React from "react";

const DetailModal = ({
  source,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onClose,
}) => {
  const ITEMS_PER_PAGE = 5;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedItems = source.items.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <i className={`${source.icon} mr-3 text-4xl`}></i>
          {source.source} 详情
        </h2>
        <div id="modal-list-container" className="space-y-4 mb-6">
          {displayedItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex flex-col"
            >
              <div className="flex items-center mb-2">
                <span className="font-bold text-xl mr-3 w-8 text-center text-red-500">
                  {start + idx + 1}
                </span>
                <span className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-semibold flex-grow truncate">
                  {item.title}
                </span>
                <span className="ml-4 text-base text-gray-600 dark:text-gray-300 flex-shrink-0">
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
        <div
          id="pagination-controls"
          className="flex justify-center items-center space-x-4"
        >
          <button
            disabled={currentPage === 1}
            onClick={onPrevPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span id="page-info" className="text-lg font-medium">
            第 {currentPage} / {totalPages} 页
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={onNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
