// src/components/Header.jsx
// 页面顶部标题栏和主题切换按钮

const Header = ({ darkMode, toggleTheme, openSettings, openNews }) => {
  return (
    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center relative">
      <i className="fas fa-fire-alt text-red-500 mr-3"></i>
      今日热榜
      {/* 新闻联播按钮 - 放在设置左侧 */}
      <button
        onClick={openNews}
        className="absolute right-28 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none"
        aria-label="新闻联播"
        title="新闻联播"
      >
        <i className="fas fa-tv text-xl"></i>
      </button>
      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className="absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none"
        aria-label="切换主题"
        title="切换主题"
      >
        {darkMode ? (
          <i className="fas fa-sun text-xl"></i>
        ) : (
          <i className="fas fa-moon text-xl"></i>
        )}
      </button>
      {/* 设置按钮 */}
      <button
        onClick={openSettings}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none"
        aria-label="设置"
        title="设置"
      >
        <i className="fas fa-cog text-xl"></i>
      </button>
    </h1>
  )
}

export default Header
