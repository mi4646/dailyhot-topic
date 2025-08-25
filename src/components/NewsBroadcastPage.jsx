// src/components/NewsBroadcastPage.jsx
import React, { useState, useEffect } from 'react'
import { cleanYouTubeIframe } from '../utils'

// 模拟 API：根据日期获取新闻数据（实际可替换为真实 API 调用）
const fetchNewsByDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  const pubDateStr = `${year}-${month}-${day}`

  return {
    title: `CCTV「新闻联播」${dateStr}`,
    description: `<iframe src="https://www.youtube-nocookie.com/embed/rDHWdnVquko" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; position:absolute; top:0; left:0;"></iframe>`,
    pubDate: pubDateStr,
    // image: '',
    image: `https://design.gemcoder.com/staticResource/echoAiSystemImages/e39a36d1176715e3d26529d7c4a173fa.png?date=${pubDateStr}`,
  }
}

export default function NewsBroadcastPage({ goBack }) {
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [videoHtml, setVideoHtml] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [newsList, setNewsList] = useState([])
  const [isLoading, setIsLoading] = useState(true) // 控制骨架屏显示

  // 骨架组件 - 今日焦点
  const SkeletonHero = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="relative">
        <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <div className="bg-red-600 w-20 h-6 rounded-full mb-3"></div>
          <div className="bg-white dark:bg-gray-300 w-3/4 h-8 rounded mb-2 animate-pulse"></div>
          <div className="bg-red-600 w-32 h-10 rounded-full mt-4 animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  // 骨架组件 - 往期新闻列表
  const SkeletonList = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="relative">
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-red-600 w-16 h-16 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-3 left-3">
              <div className="bg-red-600 w-16 h-6 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gray-200 dark:bg-gray-700 h-5 w-full rounded mb-2 animate-pulse"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-5 w-2/3 rounded mb-4 animate-pulse"></div>
            <div className="flex justify-between items-center">
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded animate-pulse"></div>
              <div className="bg-blue-600 w-12 h-4 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // 生成当前周的往期新闻（最近 7 天，不包括今天）
  useEffect(() => {
    setIsLoading(true) // 开始加载，显示骨架

    const generatePastWeek = () => {
      const list = []
      const d = new Date(currentDate)
      d.setDate(d.getDate() - 1) // 从昨天开始

      for (let i = 0; i < 7; i++) {
        list.push(fetchNewsByDate(d))
        d.setDate(d.getDate() - 1)
      }

      setNewsList(list)
    }

    generatePastWeek()
    setTimeout(() => {
      setIsLoading(false) // 数据准备完成，隐藏骨架
    }, 3000)
  }, [currentDate])

  const goToPreviousWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 7)
      return newDate
    })
  }

  const goToNextWeek = () => {
    if (currentDate < new Date()) {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        newDate.setDate(newDate.getDate() + 7)
        return newDate
      })
    }
  }

  const playVideo = (html) => {
    const cleanedHtml = cleanYouTubeIframe(html)
    setVideoHtml(cleanedHtml)
    setIsVideoLoading(true) // 显示 loading
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setVideoHtml('')
    document.body.style.overflow = ''
  }

  // 格式化显示的周范围
  const formatWeekRange = () => {
    const endDate = new Date(currentDate)
    const startDate = new Date(currentDate)
    startDate.setDate(endDate.getDate() - 6)

    const format = (d) => d.toISOString().split('T')[0]
    return `${format(startDate)} — ${format(endDate)}`
  }

  // 获取今日新闻（焦点）
  const todayNews = fetchNewsByDate(new Date())

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={goBack}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center mb-6"
        >
          <i className="fas fa-arrow-left mr-2"></i>返回主页
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
          <i className="fas fa-tv mr-3 text-red-500"></i>新闻联播
        </h2>

        {/* 今日焦点 */}
        <section className="mb-12">
          {isLoading ? (
            <SkeletonHero />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden news-card">
              <div className="relative">
                <img
                  src={todayNews.image}
                  alt={todayNews.title}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <span className="inline-block bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                    {todayNews.pubDate}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {todayNews.title}
                  </h2>
                  <button
                    onClick={() => playVideo(todayNews.description)}
                    className="play-button bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center mt-4 transition-all duration-300 w-fit"
                  >
                    <i className="fas fa-play-circle mr-2"></i>
                    观看完整新闻
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 往期新闻 + 分页 */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <i className="fas fa-history mr-3 text-blue-600 dark:text-blue-400"></i>
              往期新闻联播
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatWeekRange()}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousWeek}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="上一周"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={goToNextWeek}
                  disabled={currentDate >= new Date()}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="下一周"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <SkeletonList />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden news-card"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => playVideo(item.description)}
                        className="play-button bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300"
                      >
                        <i className="fas fa-play text-2xl"></i>
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {item.pubDate}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        央视新闻
                      </span>
                      <button
                        onClick={() => playVideo(item.description)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                      >
                        观看 <i className="fas fa-angle-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 视频模态框 */}
      {isModalOpen && (
        <div
          className="modal-overlay active"
          onClick={closeModal}
          style={{ zIndex: 1000 }}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="close-modal">
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* 视频容器 */}
            <div className="w-full h-full min-h-[70vh] relative">
              {/* 加载中 */}
              {isVideoLoading && (
                <div className="absolute inset-0 bg-white dark:bg-gray-800 flex flex-col items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    视频加载中...
                  </p>
                </div>
              )}

              {/* 视频 iframe */}
              {videoHtml && (
                <iframe
                  srcDoc={videoHtml}
                  title="新闻联播视频"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    opacity: isVideoLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                  onLoad={() => setIsVideoLoading(false)}
                  onError={() => setIsVideoLoading(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 全局样式 */}
      <style jsx>{`
        .news-card {
          transition: all 0.3s ease;
        }
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        .play-button {
          transition: all 0.3s ease;
        }
        .news-card:hover .play-button {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .video-modal-content {
          background-color: #ffffff;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }
        .dark .video-modal-content {
          background-color: #1f2937;
        }
        .modal-overlay.active .video-modal-content {
          transform: translateY(0);
        }
        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
        }
        .close-modal:hover {
          background: rgba(0, 0, 0, 0.7);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
