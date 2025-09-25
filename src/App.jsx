import React, { useState, useEffect, useLayoutEffect } from 'react'
import { ChevronUp, Settings, Home } from 'lucide-react'
import Header from './components/Header'
import HotTopicCard from './components/HotTopicCard'
import LazyLoadWrapper from './components/LazyLoadWrapper'
import NotificationToast from './components/NotificationToast'
import HotTopicDetailPage from './components/HotTopicDetailPage'
import { originalSources as originalHotData } from './mock'
import { fetchDataForSource } from './api/fetcher'

function App() {
  const [hotData, setHotData] = useState([...originalHotData])
  const [loadingSources, setLoadingSources] = useState({})
  const [hotDataErrors, setHotDataErrors] = useState({})
  const [loadedSources, setLoadedSources] = useState({})
  const [darkMode, setDarkMode] = useState(false)
  const [notification, setNotification] = useState({
    message: '',
    show: false,
  })
  const [currentDetailSourceName, setCurrentDetailSourceName] = useState(null)
  const [sourceSettings, setSourceSettings] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isSettingsPage, setIsSettingsPage] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0) // 用于记录滚动位置

  // 初始化时加载用户设置和主题
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark'
    setDarkMode(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme)

    const savedSettings = localStorage.getItem('hotTopicSettings')
    let settings = {}

    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings)
      } catch {
        settings = {}
      }
    } else {
      hotData.forEach((source) => {
        settings[source.source] = { visible: true }
      })
      settings.order = hotData.map((s) => s.source)
    }

    if (settings.openInNewTab === undefined) {
      settings.openInNewTab = true
    }

    setSourceSettings(settings)

    if (settings.order && settings.order.length > 0) {
      const ordered = [...hotData].sort(
        (a, b) =>
          settings.order.indexOf(a.source) - settings.order.indexOf(b.source)
      )
      setHotData(ordered)
    }

    const initialLoading = {}
    const initialErrors = {}
    hotData.forEach((source) => {
      initialLoading[source.source] = false
      initialErrors[source.source] = null
    })

    setLoadingSources(initialLoading)
    setHotDataErrors(initialErrors)
    setIsSettingsPage(window.location.hash === '#/settings')
  }, [])

  // 切换主题
  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  // 显示通知
  const showNotification = (message) => {
    setNotification({ message, show: true })
    setTimeout(() => setNotification({ message: '', show: false }), 2000)
  }

  // 保存设置
  const saveSettings = () => {
    const newSettings = {
      ...sourceSettings,
      openInNewTab: sourceSettings.openInNewTab ?? true,
    }
    localStorage.setItem('hotTopicSettings', JSON.stringify(newSettings))
    showNotification('设置已保存！')
    window.location.hash = ''
    setIsSettingsPage(false)
  }

  // 重置设置
  const resetSettings = () => {
    localStorage.removeItem('hotTopicSettings')
    const defaultSettings = {}
    originalHotData.forEach((source) => {
      defaultSettings[source.source] = { visible: true }
    })
    defaultSettings.order = originalHotData.map((s) => s.source)
    setSourceSettings(defaultSettings)

    const orderedList = [...hotData].sort(
      (a, b) =>
        defaultSettings.order.indexOf(a.source) -
        defaultSettings.order.indexOf(b.source)
    )
    setHotData(orderedList)
    showNotification('设置已恢复为默认值！')
    window.location.hash = ''
  }

  // 控制单个榜单的显示/隐藏
  const handleSourceVisibilityChange = (sourceName, isVisible) => {
    setSourceSettings((prev) => ({
      ...prev,
      [sourceName]: {
        ...prev[sourceName],
        visible: isVisible,
      },
    }))
  }

  // 加载单个榜单数据
  const loadSingleHotData = async (sourceName) => {
    const source = hotData.find((s) => s.source === sourceName)
    if (!source) return

    const isVisible = sourceSettings[sourceName]?.visible ?? true
    if (!isVisible) return

    setLoadingSources((prev) => ({ ...prev, [sourceName]: true }))
    setHotDataErrors((prev) => ({ ...prev, [sourceName]: null }))

    try {
      const data = await fetchDataForSource(source.name)

      if (!data || data.length === 0) {
        setHotDataErrors((prev) => ({
          ...prev,
          [sourceName]: '暂无数据，请稍后重试',
        }))
      } else {
        setHotData((prev) =>
          prev.map((item) =>
            item.source === sourceName ? { ...item, items: data } : item
          )
        )
        setLoadedSources((prev) => ({ ...prev, [sourceName]: true }))
      }
    } catch (err) {
      const errorMsg =
        err.message.includes('timeout') || err.message.includes('network')
          ? '网络连接异常，请检查后重试'
          : `加载失败：${err.message}`

      setHotDataErrors((prev) => ({
        ...prev,
        [sourceName]: errorMsg,
      }))
    } finally {
      setLoadingSources((prev) => ({ ...prev, [sourceName]: false }))
    }
  }

  // 重试加载单个榜单
  const handleRetry = async (sourceName) => {
    setLoadedSources((prev) => {
      const copy = { ...prev }
      delete copy[sourceName]
      return copy
    })
    await loadSingleHotData(sourceName)
  }

  // 打开详情页
  const openDetailPage = (sourceName) => {
    // 进入详情页前记录当前位置
    setScrollPosition(window.scrollY)
    window.location.hash = `#/detail/${sourceName}`
    // 进入详情页时滚动到顶部
    window.scrollTo(0, 0)
  }

  // 关闭详情页
  const closeDetailPage = () => {
    window.location.hash = ''
    // 恢复滚动位置
    setTimeout(() => {
      window.scrollTo(0, scrollPosition)
    }, 0)
  }

  // 定时刷新已加载的榜单数据（每5分钟）
  useEffect(() => {
    const interval = setInterval(
      () => {
        console.log('⏰ 定时刷新已加载的榜单数据')
        Object.keys(loadedSources).forEach((source) => {
          loadSingleHotData(source)
        })
      },
      5 * 60 * 1000
    )

    return () => clearInterval(interval)
  }, [loadedSources])

  // 初始化时加载所有可见榜单数据
  useEffect(() => {
    const newOrder = hotData.map((item) => item.source)
    if (
      !sourceSettings.order ||
      JSON.stringify(sourceSettings.order) !== JSON.stringify(newOrder)
    ) {
      setSourceSettings((prev) => ({
        ...prev,
        order: newOrder,
      }))
    }
  }, [])

  // 初始加载
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash

      if (hash === '#/settings') {
        setIsSettingsPage(true)
        setCurrentDetailSourceName(null)
      } else if (hash.startsWith('#/detail/')) {
        const sourceName = decodeURIComponent(hash.replace('#/detail/', ''))
        setIsSettingsPage(false)
        setCurrentDetailSourceName(sourceName)
        // 进入详情页时滚动到顶部
        window.scrollTo(0, 0)
      } else {
        setIsSettingsPage(false)
        setCurrentDetailSourceName(null)
        // 返回首页时恢复滚动位置
        setTimeout(() => {
          window.scrollTo(0, scrollPosition)
        }, 0)
      }
    }

    handleHashChange() // 初始化触发一次
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [scrollPosition])

  // 监听滚动事件，控制按钮显示/隐藏
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 滚动到顶部功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // 设置页渲染
  const renderSettingsPage = () => {
    const filteredSources = hotData
      .filter((source) =>
        source.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((source) => ({
        ...source,
        isVisible: sourceSettings[source.source]?.visible ?? true,
      }))

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => {
              window.location.hash = ''
              setIsSettingsPage(false)
            }}
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

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              榜单排序 & 可见性
            </h3>
            <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {filteredSources.map((sourceData, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => {
                    e.currentTarget.style.opacity = '0.4'
                    e.dataTransfer.setData('draggedIndex', idx)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const draggedIndex = parseInt(
                      e.dataTransfer.getData('draggedIndex'),
                      10
                    )
                    const newList = [...hotData]
                    const draggedItem = newList[draggedIndex]
                    newList.splice(draggedIndex, 1)
                    newList.splice(idx, 0, draggedItem)
                    setHotData(newList)
                  }}
                  onDragEnd={(e) => (e.currentTarget.style.opacity = '1')}
                  onDragOver={(e) => e.preventDefault()}
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
                  checked={sourceSettings.openInNewTab ?? true}
                  onChange={(e) =>
                    setSourceSettings((prev) => ({
                      ...prev,
                      openInNewTab: e.target.checked,
                    }))
                  }
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

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${
        darkMode ? 'dark' : ''
      }`}
    >
      {currentDetailSourceName ? (
        <HotTopicDetailPage
          sourceName={currentDetailSourceName}
          hotData={hotData}
          sourceSettings={sourceSettings}
          closePage={closeDetailPage}
        />
      ) : isSettingsPage ? (
        // 设置页
        renderSettingsPage()
      ) : (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Header
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            openSettings={() => {
              window.location.hash = '#/settings'
              setIsSettingsPage(true)
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotData
              .filter(
                (source) => sourceSettings[source.source]?.visible ?? true
              )
              .map((sourceData) => (
                <LazyLoadWrapper
                  key={sourceData.source}
                  onVisible={() => {
                    if (!loadedSources[sourceData.source]) {
                      loadSingleHotData(sourceData.source)
                    }
                  }}
                >
                  <HotTopicCard
                    sourceData={{
                      ...sourceData,
                      openInNewTab: sourceSettings.openInNewTab ?? true,
                    }}
                    openModal={openDetailPage}
                    error={hotDataErrors[sourceData.source]}
                    loading={loadingSources[sourceData.source]}
                    handleRetry={() => handleRetry(sourceData.source)}
                  />
                </LazyLoadWrapper>
              ))}
          </div>
        </div>
      )}

      <NotificationToast
        message={notification.message}
        isVisible={notification.show}
      />

      {/* 一键到顶按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 z-20"
          aria-label="回到顶部"
        >
          <ChevronUp className="w-6 h-6 mx-auto text-gray-600" />
        </button>
      )}
    </div>
  )
}

export default App
