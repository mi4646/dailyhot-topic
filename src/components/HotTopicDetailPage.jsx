import React, { useState, useEffect } from 'react'
import { DetailSkeleton } from './Skeleton'
import { formatHot } from '../utils'

const HotTopicDetailPage = ({
  sourceName,
  hotData,
  sourceSettings,
  closePage,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(true)

  // 缓存键名
  const CACHE_KEY = 'hotTopicDetail'
  const CACHE_EXPIRY = 5 * 60 * 1000 // 5分钟过期

  // 从缓存获取数据
  const getCachedData = () => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)
      // 检查缓存是否过期
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        sessionStorage.removeItem(CACHE_KEY)
        return null
      }
      return data
    } catch (error) {
      console.error('缓存读取失败:', error)
      return null
    }
  }

  // 保存数据到缓存
  const setCachedData = (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      }
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('缓存保存失败:', error)
    }
  }

  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      // 尝试从缓存获取数据
      const cachedSource = getCachedData()

      if (cachedSource && (!hotData || !sourceName)) {
        // 如果有缓存且没有传入新数据，使用缓存
        setSource(cachedSource)
        setLoading(false)
        return
      }

      // 查找新数据
      const foundSource = hotData.find((s) => s.source === sourceName)
      setSource(foundSource)

      if (foundSource && foundSource.items && foundSource.items.length > 0) {
        // 保存到缓存
        setCachedData(foundSource)
      } else if (cachedSource) {
        // 如果新数据没找到但有缓存，使用缓存
        setSource(cachedSource)
      }

      // 重置当前页码
      setCurrentPage(1)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [sourceName, hotData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮骨架屏 */}
          <div className="mb-10 w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

          {/* 标题骨架屏 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>

          {/* 内容骨架屏 */}
          <div className="space-y-6 mb-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <DetailSkeleton key={index} />
            ))}
          </div>

          {/* 分页骨架屏 */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-12">
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!source) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-2xl font-medium">
        无法找到来源：{sourceName}
      </div>
    )
  }

  const ITEMS_PER_PAGE = source.source === '豆瓣电影' ? 10 : 8
  const items = source.items || []
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, items.length)

  // 豆瓣源的特殊渲染
  const renderDoubanItem = (item, index) => {
    const displayIndex = startIndex + index + 1

    return (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* 封面图片 */}
          <div className="md:w-32 flex-shrink-0">
            <img
              src={
                item.cover
                  ? item.cover.replace(
                      /^https?:\/\/img\d+\.doubanio\.com/,
                      '/img-proxy'
                    )
                  : 'https://placehold.co/128x192/ddd/999?text=No+Cover'
              }
              alt={item.title}
              className="w-full h-48 md:h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://placehold.co/128x192/ddd/999?text=No+Cover'
              }}
            />
          </div>

          {/* 内容区域 */}
          <div className="p-6 flex-grow">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <span
                    className={`text-2xl font-extrabold w-8 text-center mr-4 ${
                      displayIndex <= 3
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {displayIndex}.
                  </span>
                  <a
                    href={item.url}
                    target={sourceSettings?.openInNewTab ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 leading-tight"
                  >
                    {item.title}
                  </a>
                </div>

                <div className="ml-12 space-y-2">
                  {item.card_subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.card_subtitle}
                    </p>
                  )}

                  {item.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.rating.value} / 10
                      </span>
                      {item.score && (
                        <span className="ml-4 text-gray-500 dark:text-gray-400 text-sm">
                          热度: {item.score}
                        </span>
                      )}
                    </div>
                  )}

                  {item.year && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                      {item.year}年
                    </span>
                  )}

                  {item.type_name && (
                    <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded ml-2">
                      {item.type_name}
                    </span>
                  )}
                </div>
              </div>

              {item.score && (
                <div className="flex-shrink-0">
                  <span className="text-lg text-gray-700 dark:text-gray-300 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 px-3 py-1 rounded-full font-semibold border border-orange-200 dark:border-orange-800">
                    🔥 {formatHot(item.score)}
                  </span>
                </div>
              )}
            </div>

            {item.summary && (
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {item.summary}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 默认渲染
  const renderDefaultItem = (item, index) => {
    const displayIndex = startIndex + index + 1

    return (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
      >
        <div className="flex items-center mb-4">
          <span
            className={`text-3xl font-extrabold w-12 text-center mr-6 ${
              displayIndex <= 3
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {displayIndex}.
          </span>
          <a
            href={item.url}
            target={sourceSettings?.openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex-grow transition-colors duration-200 leading-tight"
          >
            {item.title}
          </a>
          <span className="ml-6 flex-shrink-0 text-base md:text-lg text-gray-700 dark:text-gray-300 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 px-4 py-2 rounded-full font-semibold border border-orange-200 dark:border-orange-800">
            🔥 {formatHot(item.hot) || 'N/A'}
          </span>
        </div>
        <p className="ml-18 text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap min-h-12">
          {item.summary || item.desc || '暂无摘要信息'}
        </p>
      </div>
    )
  }

  const renderItems = () => {
    if (!items.length) {
      return (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            暂无热点数据
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            当前来源暂未获取到热点信息
          </p>
        </div>
      )
    }

    return items.slice(startIndex, endIndex).map((item, idx) => {
      // 如果是豆瓣电影源，使用特殊渲染
      if (source.source === '豆瓣电影') {
        return renderDoubanItem(item, idx)
      }
      // 否则使用默认渲染
      return renderDefaultItem(item, idx)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* 固定在顶部的返回按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={closePage}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回首页
          </button>
        </div>

        {/* 标题 */}
        <div className="text-center mb-12 pt-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-full text-white text-4xl mb-6 shadow-lg">
            {source.icon ? (
              <i className={source.icon}></i>
            ) : (
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-8 8"
                />
              </svg>
            )}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {source.source} 热点详情
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            实时追踪最新热点，掌握全网热门话题动态
          </p>
        </div>

        {/* 内容 */}
        <div className="space-y-6 mb-12">{renderItems()}</div>

        {/* 分页 */}
        {items.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              上一页
            </button>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200 px-6 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
              第{' '}
              <span className="text-blue-600 dark:text-blue-400">
                {currentPage}
              </span>{' '}
              / {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:transform hover:scale-105"
            >
              下一页
              <svg
                className="w-5 h-5 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* 统计信息 */}
        {items.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              共 {items.length} 个热点话题，每页显示 {ITEMS_PER_PAGE} 条
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotTopicDetailPage
