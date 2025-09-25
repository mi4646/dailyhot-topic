import { Home, Settings } from 'lucide-react'

const SettingsPage = ({
  searchTerm,
  setSearchTerm,
  filteredSources,
  handleSourceVisibilityChange,
  sourceSettings,
  openInNewTab,
  setOpenInNewTab,
  autoRefresh,
  setAutoRefresh,
  resetSettings,
  saveSettings,
  goBack,
  onOrderChange,
}) => {
  // 处理拖拽排序
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
  }

  const handleDragStart = (e, idx) => {
    e.currentTarget.style.opacity = '0.4'
    e.dataTransfer.setData('draggedIndex', idx)
  }

  const handleDrop = (e, targetIdx) => {
    e.preventDefault()
    const draggedIndex = parseInt(e.dataTransfer.getData('draggedIndex'), 10)

    // 创建新数组，避免直接修改原数组
    const newList = [...filteredSources]
    const draggedItem = newList[draggedIndex]
    newList.splice(draggedIndex, 1)
    newList.splice(targetIdx, 0, draggedItem)

    // 更新顺序
    if (onOrderChange) {
      const newOrder = newList.map((item) => item.source)
      onOrderChange(newOrder)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={goBack}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center mb-6"
        >
          <Home className="mr-2" size={16} /> 返回主页
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
          <Settings className="mr-3 text-blue-500" size={32} /> 设置中心
        </h2>

        <input
          type="text"
          placeholder="搜索平台..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 榜单排序 & 可见性 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            榜单排序 & 可见性
          </h3>
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {filteredSources.map((sourceData, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
                className="draggable-item min-w-[180px] max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3 space-x-12">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {sourceData.source}
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sourceData.isVisible}
                      onChange={(e) =>
                        handleSourceVisibilityChange(
                          sourceData.source,
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors">
                      <div className="absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full top-0.5 left-0.5 peer-checked:left-6 transition-transform duration-200"></div>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 链接打开方式 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            链接打开方式
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              是否在新标签页中打开链接？
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={openInNewTab ?? true}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors">
                <div className="absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full top-0.5 left-0.5 peer-checked:left-6 transition-transform duration-200"></div>
              </div>
            </label>
          </div>
        </div>

        {/* 自动刷新 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            刷新设置
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              是否开启自动刷新？
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors">
                <div className="absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full top-0.5 left-0.5 peer-checked:left-6 transition-transform duration-200"></div>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={resetSettings}
            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            重置为默认值
          </button>
          <button
            onClick={saveSettings}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
