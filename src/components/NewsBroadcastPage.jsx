// src/components/NewsBroadcastPage.jsx
import React, { useState } from 'react'

export default function NewsBroadcastPage({ goBack }) {
  const [videoHtml, setVideoHtml] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 模拟新闻数据
  const newsData = [
    {
      title: 'CCTV「新闻联播」20250511',
      description: ` '\n' +
        '<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube-nocookie.com/embed/zegsq_Vk5dQ" frameborder="0" allowfullscreen></iframe>\n' +
        '\n' +
        '<br>\n' +
        '\n'`,
      pubDate: '2025-05-11',
      image:
        'https://design.gemcoder.com/staticResource/echoAiSystemImages/e39a36d1176715e3d26529d7c4a173fa.png',
      isFeatured: true,
    },
    {
      title: 'CCTV「新闻联播」20250510',
      description:
        '<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/abcdef12345" frameborder="0" allowfullscreen></iframe>',
      pubDate: '2025-05-10',
      image:
        'https://design.gemcoder.com/staticResource/echoAiSystemImages/b1303cbd5bc03944a204d8955497c5da.png',
    },
    {
      title: 'CCTV「新闻联播」20250509',
      description:
        '<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/ghijkl67890" frameborder="0" allowfullscreen></iframe>',
      pubDate: '2025-05-09',
      image:
        'https://design.gemcoder.com/staticResource/echoAiSystemImages/66c5e6ef74d1d8d21260f47dbcf6f664.png',
    },
    {
      title: 'CCTV「新闻联播」20250508',
      description:
        '<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/mnopqr12345" frameborder="0" allowfullscreen></iframe>',
      pubDate: '2025-05-08',
      image:
        'https://design.gemcoder.com/staticResource/echoAiSystemImages/06dd0ef3520360033e9410026cf36e9a.png',
    },
  ]

  const featured = newsData[0]
  const pastNews = newsData.slice(1)

  const playVideo = (html) => {
    setVideoHtml(html)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setVideoHtml('')
    document.body.style.overflow = ''
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 - 与设置页完全一致 */}
        <button
          onClick={goBack}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center mb-6"
        >
          <i className="fas fa-arrow-left mr-2"></i>返回主页
        </button>

        {/* 页面标题 */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
          <i className="fas fa-tv mr-3 text-red-500"></i>新闻联播
        </h2>

        {/* 今日焦点 */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden news-card">
            <div className="relative">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                  {featured.pubDate}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {featured.title}
                </h2>
                <button
                  onClick={() => playVideo(featured.description)}
                  className="play-button bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center mt-4 transition-all duration-300 w-fit"
                >
                  <i className="fas fa-play-circle mr-2"></i>
                  观看完整新闻
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 往期新闻 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center mb-6">
            <i className="fas fa-history mr-3 text-blue-600 dark:text-blue-400"></i>
            往期新闻联播
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastNews.map((item, idx) => (
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
            <div
              className="w-full h-full min-h-[70vh]"
              dangerouslySetInnerHTML={{ __html: videoHtml }}
            />
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
