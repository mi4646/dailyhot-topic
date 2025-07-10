// src/pages/HotTopicDetailPage.jsx

import React, { useState } from "react";
import DetailSkeleton from "../components/DetailSkeleton";
import { formatHot } from "../utils";

const HotTopicDetailPage = ({
  sourceName,
  hotData,
  sourceSettings,
  closePage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const source = hotData.find((s) => s.source === sourceName);

  if (!source) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
        无法找到来源：{sourceName}
      </div>
    );
  }

  const ITEMS_PER_PAGE = 10;
  const items = source.items || [];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, items.length);

  const renderItems = () => {
    if (!items.length) return <DetailSkeleton />;

    return items.slice(startIndex, endIndex).map((item, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition duration-200 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center mb-3">
          <span
            className={`text-2xl font-extrabold w-8 text-center mr-4 ${
              startIndex + idx < 3 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {startIndex + idx + 1}.
          </span>
          <a
            href={item.url}
            target={sourceSettings.openInNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 flex-grow transition-colors"
          >
            {item.title}
          </a>
          <span className="ml-4 flex-shrink-0 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            🔥 {formatHot(item.hot)}
          </span>
        </div>
        <p className="ml-12 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {item.summary || item.desc || "暂无摘要"}
        </p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={closePage}
          className="mb-8 flex items-center text-blue-600 dark:text-blue-400 hover:underline text-base font-medium"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          返回首页
        </button>

        {/* 标题 */}
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-white flex items-center justify-center">
          <i className={`${source.icon} text-4xl mr-3`}></i>
          {source.source} 热点详情
        </h2>

        {/* 内容 */}
        <div className="space-y-6">{renderItems()}</div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-6 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="fas fa-arrow-left mr-2"></i>上一页
            </button>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              第 {currentPage} / {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              下一页<i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotTopicDetailPage;
