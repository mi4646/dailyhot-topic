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
