import React, { useState, useEffect, useLayoutEffect } from 'react'
import { ChevronUp, Settings, Home } from 'lucide-react'
import Header from './components/Header'
import SettingsPage from './components/SettingsPage'
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

  const [openInNewTab, setOpenInNewTab] = useState(true) // 默认在新标签页打开
  const [autoRefresh, setAutoRefresh] = useState(true) // 自动刷新设置

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

    // 加载自动刷新设置
    if (settings.autoRefresh === undefined) {
      settings.autoRefresh = true // 默认开启
    }
    setAutoRefresh(settings.autoRefresh)

    // 加载新标签页设置
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
      openInNewTab,
      autoRefresh,
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
    // 获取当前所有可见的 sourceName 列表
    const visibleSources = filteredSources.filter((s) => s.isVisible).length

    // 如果只剩一个，且用户要隐藏它，则阻止操作
    if (visibleSources === 1 && !isVisible) {
      // 显示提示或不执行操作
      showNotification('至少需要保留一个平台可见！')
      return // 阻止隐藏
    }

    // 否则正常更新
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

  // 定时自动刷新已加载的榜单数据（每5分钟）
  useEffect(() => {
    if (!autoRefresh) return // 如果关闭自动刷新，则不启动定时器

    const interval = setInterval(
      () => {
        console.log('触发自动刷新')

        Object.keys(loadedSources).forEach((source) => {
          loadSingleHotData(source)
        })
      },

      10 * 60 * 1000
    ) // 每10分钟刷新一次

    return () => clearInterval(interval)
  }, [loadedSources, autoRefresh]) // 依赖 autoRefresh

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

  // 根据 sourceSettings 过滤出可见的榜单
  const filteredSources = hotData.map((source) => ({
    ...source,
    isVisible: sourceSettings[source.source]?.visible ?? true,
  }))

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
        <SettingsPage
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredSources={filteredSources}
          handleSourceVisibilityChange={handleSourceVisibilityChange}
          openInNewTab={openInNewTab}
          setOpenInNewTab={setOpenInNewTab}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          resetSettings={resetSettings}
          saveSettings={saveSettings}
          goBack={() => {
            window.location.hash = ''
            setIsSettingsPage(false)
          }}
          onOrderChange={(newOrder) => {
            // 根据新顺序重新排序 hotData
            const orderedList = [...hotData].sort(
              (a, b) => newOrder.indexOf(a.source) - newOrder.indexOf(b.source)
            )
            setHotData(orderedList)
          }}
        />
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
                      openInNewTab: openInNewTab,
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

      {/* 错误提示 */}
      <NotificationToast
        message={notification.message}
        isVisible={notification.show}
      />

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
