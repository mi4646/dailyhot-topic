import { ErrorCard } from './ErrorPage'
import { CardSkeleton } from './Skeleton'
import { formatHot } from '../utils'

const HotTopicCard = ({
  sourceData,
  openModal,
  error = null,
  loading = false,
  handleRetry,
}) => {
  const { source, icon, items } = sourceData

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full min-h-[500px] transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* 卡片头部 */}
      {loading ? (
        <div className="animate-pulse flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </div>
          <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <i className={`${icon} mr-3 text-3xl`}></i>
            {source}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation() // 避免卡片整体点击逻辑
              openModal(source)
            }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium flex items-center"
          >
            更多 <i className="fas fa-arrow-right ml-1 text-xs"></i>
          </button>
        </div>
      )}

      {/* 内容区域 */}
      <div
        className="flex-grow overflow-y-auto pr-2 hot-list-scroll"
        style={{ maxHeight: '400px' }}
      >
        {loading ? (
          // 显示骨架屏
          <CardSkeleton />
        ) : error ? (
          // 显示错误提示
          <div className="flex items-center justify-center h-full">
            <ErrorCard message={error} onRetry={() => handleRetry(source)} />
          </div>
        ) : (
          // 正常榜单内容
          <ol className="space-y-3">
            {(items || []).slice(0, 15).map((item, i) => (
              <li key={i} className="flex items-center group">
                <span
                  className={`font-bold text-lg mr-3 w-6 text-center ${
                    i < 3 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {i + 1}.
                </span>

                {/* 文章链接 */}
                <a
                  href={item.url}
                  title={item.title}
                  className="flex-grow truncate text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  target={sourceData.openInNewTab ? '_blank' : '_self'}
                  rel={sourceData.openInNewTab ? 'noopener noreferrer' : ''}
                >
                  {item.title}
                </a>

                <span className="ml-3 text-sm text-gray-500 flex-shrink-0">
                  <i className="fas fa-fire text-orange-400 mr-1"></i>
                  {item.prevHot !== undefined ? (
                    item.hot > item.prevHot ? (
                      <span className="text-green-600 dark:text-green-400 text-xs">
                        ▲{' '}
                      </span>
                    ) : item.hot < item.prevHot ? (
                      <span className="text-red-500 dark:text-red-400 text-xs">
                        ▼{' '}
                      </span>
                    ) : null // ← 不显示 •，直接空
                  ) : null}{' '}
                  {/* ← 无历史数据时，不显示任何图标 */}
                  <span
                    className={
                      item.prevHot !== undefined && item.hot > item.prevHot
                        ? 'text-green-600 dark:text-green-400'
                        : item.prevHot !== undefined && item.hot < item.prevHot
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-gray-500'
                    }
                    title={
                      item.prevHot !== undefined
                        ? `从 ${formatHot(item.prevHot)} → ${formatHot(item.hot)}`
                        : undefined
                    }
                    style={{ cursor: 'default' }} // 👈 关键：禁止 I 形光标
                  >
                    {formatHot(item.hot)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* 底部刷新按钮 */}
      {loading ? (
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-full w-28 h-8"></div>
        </div>
      ) : (
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>更新于: {new Date().toLocaleTimeString()}</span>
          <button
            onClick={() => handleRetry(source)}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full transition-colors duration-200 flex items-center"
          >
            <i className="fas fa-sync-alt mr-2"></i>刷新本榜
          </button>
        </div>
      )}
    </div>
  )
}

export default HotTopicCard
