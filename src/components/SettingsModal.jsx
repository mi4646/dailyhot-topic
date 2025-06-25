// src/components/SettingsModal.jsx
// 设置模态框组件
import React from "react";

const SettingsModal = ({
  settingsModalOpen,
  closeModal,
  sourceSettings,
  updateOrder,
  saveSettings,
  resetSettings,
  onSourceVisibilityChange,
}) => {
  // 去除order属性，只保留热点源的设置
  const { order, ...rest } = sourceSettings;
  const sortableListRef = React.useRef(null);

  const addDragAndDropListeners = () => {
    const draggableItems = document.querySelectorAll(".draggable-item");
    let draggingItem = null;

    draggableItems.forEach((item) => {
      item.addEventListener("dragstart", () => {
        draggingItem = item;
        setTimeout(() => item.classList.add("dragging"), 0);
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        draggingItem = null;
        updateOrder();
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(
          sortableListRef.current,
          e.clientY
        );
        const currentElement = e.target.closest(".draggable-item");
        if (currentElement && currentElement !== draggingItem) {
          if (afterElement == null) {
            sortableListRef.current.appendChild(draggingItem);
          } else {
            sortableListRef.current.insertBefore(draggingItem, afterElement);
          }
        }
      });
    });
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".draggable-item:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: -Infinity }
    ).element;
  };

  React.useEffect(() => {
    if (settingsModalOpen) {
      addDragAndDropListeners();
    }
  }, [settingsModalOpen]);

  // 处理热点源可见性变更,调用父组件的回调
  const handleVisibilityChange = (sourceName) => (e) => {
    const isVisible = e.target.checked;
    onSourceVisibilityChange(sourceName, isVisible);
  };

  return (
    settingsModalOpen && (
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="settings-modal-content bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            <i className="fas fa-times"></i>
          </button>

          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
            <i className="fas fa-cog mr-3 text-4xl"></i>
            设置
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              榜单排序
            </h3>
            <div ref={sortableListRef} className="space-y-2">
              {Object.keys(rest).map((sourceName) => (
                <div
                  key={sourceName}
                  className="draggable-item draggable-item"
                  draggable="true"
                  data-source={sourceName}
                >
                  <i className="fas fa-grip-vertical text-gray-400 mr-3"></i>
                  <span>{sourceName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              榜单显示
            </h3>
            <div className="space-y-2">
              {Object.keys(rest).map((sourceName) => (
                <div
                  key={sourceName}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {sourceName}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={rest[sourceName]?.visible ?? true}
                      onChange={handleVisibilityChange(sourceName)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={saveSettings}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              保存设置
            </button>
            <button
              onClick={resetSettings}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsModal;
