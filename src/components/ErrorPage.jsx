// src/components/ErrorPage.jsx

// 错误页面
export const ErrorPage = ({ message, onRetry, darkMode }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center pt-8 pb-12 px-4 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* 错误图标 */}
      <div
        className={`rounded-full p-4 mb-4 flex items-center justify-center ${
          darkMode ? "bg-red-700" : "bg-red-500"
        }`}
      >
        <i className="fas fa-exclamation-circle text-white text-3xl"></i>
      </div>

      {/* 错误标题 */}
      <h1
        className={`text-2xl font-bold text-center mb-4 ${
          darkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        数据加载失败
      </h1>

      {/* 错误信息 */}
      <p
        className={`text-sm text-center max-w-md mb-6 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {message}
      </p>

      {/* 刷新按钮 */}
      <button
        onClick={onRetry}
        className={`px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        <i className="fas fa-sync-alt mr-2"></i>
        <span>刷新页面</span>
      </button>
    </div>
  );
};

// 错误卡片
export const ErrorCard = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <i className="fas fa-exclamation-triangle text-red-500 dark:text-red-400 text-2xl mb-3 animate-pulse"></i>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors duration-200 text-xs font-medium inline-flex items-center space-x-1"
      >
        <i className="fas fa-sync-alt text-xs"></i>
        <span>重试</span>
      </button>
    </div>
  );
};

