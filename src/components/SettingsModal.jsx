import React, { useState } from "react";

const SettingsModal = ({
  sources,
  onClose,
  sortedSources,
  setSortedSources,
  toggleVisibility,
}) => {
  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const [draggingIndex, setDraggingIndex] = useState(null);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
    setDraggingIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, dropIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    if (draggedIndex === dropIndex) return;
    const reordered = reorder(sortedSources, draggedIndex, dropIndex);
    setSortedSources(reordered);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <i className="fas fa-cog mr-3 text-4xl"></i>设置
        </h2>
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
                className="draggable-item bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 cursor-grab flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <span>{source.source}</span>
                <i className="fas fa-grip-lines text-gray-400"></i>
              </div>
            ))}
          </div>
        </div>
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
        <div className="flex justify-end space-x-3">
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
