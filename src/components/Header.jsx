// src/components/Header.jsx
// 页面顶部标题栏和主题切换按钮

const Header = ({ darkMode, toggleTheme, openSettings }) => {
  return (
    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center relative">
      <i className="fas fa-fire-alt text-red-500 mr-3"></i>
      今日热榜
      <button
        onClick={toggleTheme}
        className="absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
        aria-label="切换主题"
      >
        {darkMode ? (
          <i className="fas fa-sun text-xl"></i>
        ) : (
          <i className="fas fa-moon text-xl"></i>
        )}
      </button>
      <button
        onClick={openSettings}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
        aria-label="设置"
      >
        <i className="fas fa-cog text-xl"></i>
      </button>
    </h1>
  );
};

export default Header;
