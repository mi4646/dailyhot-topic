import React from "react";

const SettingsModal = ({
  sources,
  onClose,
  sortedSources,
  setSortedSources,
  toggleVisibility,
}) => {
  // 拖拽排序逻辑
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1); // 删除原位置元素
    result.splice(endIndex, 0, removed); // 插入新位置
    return result;
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const onDragOver = (e) => {
    e.preventDefault(); // 允许放置
  };

  const onDrop = (e, dropIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    if (draggedIndex === dropIndex) return;

    const reordered = reorder(sortedSources, draggedIndex, dropIndex);
    setSortedSources(reordered);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-fade-in">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          aria-label="关闭设置"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* 标题 */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <i className="fas fa-cog mr-3 text-4xl"></i> 设置
        </h2>

        {/* 排序设置 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            榜单排序
          </h3>
          <div className="space-y-2" id="sortable-list">
            {sortedSources.map((source, index) => (
              <div
                key={source.source}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, index)}
                className="draggable-item bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 cursor-grab flex items-center justify-between transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <span>{source.source}</span>
                <i className="fas fa-grip-lines text-gray-400"></i>
              </div>
            ))}
          </div>
        </div>

        {/* 显示设置 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            榜单显示
          </h3>
          <div className="space-y-2" id="visibility-list">
            {sources.map((source) => (
              <label
                key={source.source}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={source.visible}
                  onChange={() => toggleVisibility(source.source)}
                  className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span>{source.source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            保存设置
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
