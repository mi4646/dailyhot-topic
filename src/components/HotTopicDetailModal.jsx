// src/components/HotTopicDetailModal.jsx
// 详情页模态框组件

import DetailSkeleton from "./DetailSkeleton";
import { formatHot } from "../utils";

const HotTopicDetailModal = ({
  currentSource,
  currentPage,
  setCurrentPage,
  modalOpen,
  closeModal,
  loading,
}) => {
  const ITEMS_PER_PAGE = 10;

  if (!modalOpen) return null;

  const totalPages = Math.ceil(currentSource?.items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    currentSource?.items.length
  );

  const renderItems = () => {
    if (loading) {
      return <DetailSkeleton />;
    }

    return currentSource.items.slice(startIndex, endIndex).map((item, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
      >
        <div className="flex items-center mb-2">
          <span
            className={`font-extrabold text-2xl mr-4 w-8 text-center ${
              startIndex + idx < 3 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {startIndex + idx + 1}.
          </span>
          <a
            href={item.url}
            className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xl font-bold flex-grow"
          >
            {item.title}
          </a>
          <span className="ml-4 text-lg text-gray-600 dark:text-gray-300 flex-shrink-0">
            <i className="fas fa-fire text-orange-500 mr-1"></i>
            {formatHot(item.hot)}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-base ml-12 mt-2">
          {item.summary || "暂无摘要"}
        </p>
      </div>
    ));
  };

  return (
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

        {/* 显示骨架屏或真实内容 */}
        {renderItems()}

        <div className="flex justify-center items-center space-x-6 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> 上一页
          </button>
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            第 {currentPage} / {totalPages} 页
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
          >
            下一页 <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotTopicDetailModal;
