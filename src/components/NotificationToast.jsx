// src/components/NotificationToast.jsx
// 通知 Toast 组件

const NotificationToast = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 transition-all duration-300 flex items-center space-x-2">
      <i className="fas fa-info-circle"></i>
      <span>{message}</span>
    </div>
  );
};

export default NotificationToast;
