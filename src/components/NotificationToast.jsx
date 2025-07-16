// src/components/NotificationToast.jsx
// 通知 Toast 组件

const Toast = ({ message, type = 'default', isVisible }) => {
  if (!isVisible) return null

  const bgColor = {
    default: 'bg-gray-800',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
  }

  const icon = {
    default: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-exclamation-circle',
  }

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] ${bgColor[type]} text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-3 transition-all duration-300 ease-in-out animate-fade-in`}
    >
      <i className={`${icon[type]} mr-2`}></i>
      <span>{message}</span>
    </div>
  )
}

export default Toast
