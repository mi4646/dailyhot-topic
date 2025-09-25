export const originalSources = [
  {
    name: 'douyin',
    source: '抖音热点',
    icon: 'fab fa-tiktok text-pink-500',
    items: [],
    apis: [
      '/api-hot/douyin?cache=true',
      '/news-hot-api/douyin?cache=true',
      '/60s-api/v2/douyin',
    ],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title || item.desc,
        url: item?.target?.url || item.link || item.mobileUrl,
        hot: item.hot_value || item.hot || '',
        summary: item.brief || item.desc || item.brief || '',
        time: item.createTime || item.create_time || item.active_time || '',
      }))
    },
  },
  {
    name: 'weibo',
    source: '微博热搜',
    icon: 'fab fa-weibo text-red-500',
    items: [],
    apis: [
      '/api-hot/weibo?cache=true',
      '/news-hot-api/weibo?cache=true',
      '/60s-api/v2/weibo',
      '/weibo-hot-api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot&title=%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C&extparam=filter_type%3Drealtimehot%26mi_cid%3D100103%26pos%3D0_0%26c_type%3D30%26display_time%3D1540538388&luicode=10000011&lfid=231583',
    ],
    parser: (rawData) => {
      // ===== 情况1：微博官方 m.weibo.cn 结构 =====
      // data.cards[0].card_group
      if (Array.isArray(rawData?.data?.cards?.[0]?.card_group)) {
        console.log('[Weibo] 使用官方 API 解析模式')
        return rawData.data.cards[0].card_group.map((item, index) => ({
          id: item.itemid || index,
          title: item.desc || 'No Title',
          url:
            item.scheme ||
            `https://s.weibo.com/weibo?q=${encodeURIComponent(item.desc)}`,
          hot: item.hotword?.num || item.num || '',
        }))
      }

      // ===== 情况2：DailyHot 风格结构 =====
      if (Array.isArray(rawData)) {
        console.log('[Weibo] 使用 DailyHot 兼容模式')
        return rawData.map((item, index) => ({
          id: item.id || item.mid || index,
          title: item.word || item.title || 'No Title',
          url:
            item.url ||
            `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word || item.title)}`,
          hot: item.num || item.hot || item.hot_value || '',
        }))
      }

      // ===== 情况3：标准 { data: [...] } 结构 =====
      if (Array.isArray(rawData?.data)) {
        console.log('[Weibo] 使用标准 data 数组模式')
        return rawData.data.map((item, index) => ({
          id: item.id || item.mid || index,
          title: item.word || item.title || item.desc || 'No Title',
          url:
            item.url ||
            item.link ||
            `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word || item.title)}`,
          hot: item.num || item.hot || item.hot_value || '',
        }))
      }

      // ===== 兜底 =====
      console.warn('[Weibo] 无法识别的数据结构', rawData)
      return []
    },
  },
  {
    name: 'xinwenlianbo',
    source: '新闻联播',
    icon: 'fas fa-newspaper text-red-600',
    items: [],
    apis: [
      '/xinwenlianbo/NewVideo/getVideoListByColumn?id=TOPC1451528971114112&n=10&sort=desc&p=1&mode=0&serviceId=tvcctv',
    ],
    parser: (data) => {
      return (data.data.list || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        summary: item.brief,
        hot: item.hot,
        url: item.url,
      }))
    },
  },
  {
    name: 'zhihu',
    source: '知乎热榜',
    icon: 'fab fa-zhihu text-blue-600',
    items: [],
    apis: ['/zhihu/topstory/hot-lists/total?limit=10&reverse_order=0'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.target.title,
        summary: item.target.excerpt,
        hot: item.detail_text,
        url: `https://www.zhihu.com/question/${item.card_id.replace(/^Q_/, '')}`,
        time: item.target.created,
      }))
    },
  },
  {
    name: 'rednote',
    source: '小红书',
    icon: 'fas fa-newspaper text-red-600',
    items: [],
    apis: ['/60s-api/v2/rednote'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title || item.desc,
        url: item.target?.url || item.link || item.mobileUrl,
        hot: item.hot_value || item.hot || '',
        summary: item.brief || item.desc || item.brief || '',
        time: item.createTime || item.create_time || item.active_time || '',
      }))
    },
  },
  {
    name: 'baidu',
    source: '百度热搜',
    icon: 'fas fa-search text-blue-500',
    items: [],
    apis: [
      '/api-hot/baidu?cache=true',
      '/news-hot-api/baidu?cache=true',
      '/60s-api/v2/baidu/hot',
    ],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        summary: item.desc || '',
        url: item.url || item.mobileUrl,
        hot: item.hot || item.score || '',
        time: item.time || item.timestamp || '',
      }))
    },
  },
  {
    name: 'juejin',
    source: '稀土掘金',
    icon: 'fas fa-code text-green-600',
    items: [],
    apis: ['/api-hot/juejin?cache=true', '/news-hot-api/juejin?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.originalUrl || item.link || item.url,
        hot: item.hot || item.views || '',
        summary: item.brief || '',
        time: item.createdAt || item.created_at || '',
      }))
    },
  },
  {
    name: 'bilibili',
    source: '哔哩哔哩',
    icon: 'fab fa-bilibili text-blue-400',
    items: [],
    apis: ['/60s-api/v2/bili'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title || item.desc,
        url: item.target?.url || item.link || item.mobileUrl,
        hot: item.hot_value || item.hot || '',
        summary: item.brief || item.desc || item.brief || '',
        time: item.createTime || item.create_time || item.active_time || '',
      }))
    },
  },
  {
    name: 'github',
    source: 'GitHub',
    icon: 'fab fa-github text-gray-800',
    items: [],
    apis: ['/github'],
    parser: (data) => {
      return (data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.repo,
        url: `https://github.com/${item.repo}`,
        hot: item.currentPeriodStars || item.stars || '',
        summary: item.desc || '',
        time: item.createdAt || item.created_at || '',
      }))
    },
  },
  {
    name: 'toutiao',
    source: '今日头条',
    icon: 'fas fa-newspaper text-red-500',
    items: [],
    apis: [
      '/api-hot/toutiao?cache=true',
      '/news-hot-api/toutiao?cache=true',
      '/60s-api/v2/toutiao',
    ],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'v2ex',
    source: 'V2EX',
    icon: 'fab fa-vuejs text-green-500',
    items: [],
    apis: ['/v2ex/api/topics/hot.json'],
    parser: (data) => {
      return (data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        summary: item.content || '',
        hot: item.reply_count || item.replies || '',
        url: `https://www.v2ex.com/t/${item.id}`,
        time: item.created || '',
      }))
    },
  },
  {
    name: 'douban-movie',
    source: '豆瓣电影',
    icon: 'fas fa-film text-brown-500',
    items: [],
    apis: [
      '/douban-movie/rexxar/api/v2/subject_collection/movie_real_time_hotest/items?type=movie&start=0&count=10&for_mobile=1',
    ],
    parser: (data) => {
      return (data?.subject_collection_items || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        url: item.url,
        hot: item.score,
        year: item.year,
        title: item.title,
        cover: item.cover.url,
        rating: item.rating,
        summary: item.summary,
        type_name: item.type_name,
        card_subtitle: item.card_subtitle,
      }))
    },
  },
  {
    name: 'csdn',
    source: 'CSDN',
    icon: 'fas fa-code text-blue-500',
    items: [],
    apis: ['/news-hot-api/csdn?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'hellogithub',
    source: 'HelloGitHub',
    icon: 'fab fa-github text-gray-800',
    items: [],
    apis: [
      '/api-hot/hellogithub?cache=true',
      '/news-hot-api/hellogithub?cache=true',
    ],
    parser: (data) => {
      return (data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title || item.desc,
        url: item?.target?.url || item.link || item.mobileUrl,
        hot: item.hot_value || item.hot || '',
        summary: item.brief || item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'thepaper',
    source: '澎湃新闻',
    icon: 'fas fa-newspaper text-red-600',
    items: [],
    apis: ['/api-hot/thepaper?cache=true', '/news-hot-api/thepaper?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'sina-news',
    source: '新浪新闻',
    icon: 'fas fa-newspaper text-red-400',
    items: [],
    apis: ['/news-hot-api/sina-news?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'qq-news',
    source: '腾讯新闻',
    icon: 'fab fa-qq text-blue-700',
    items: [],
    apis: ['/api-hot/qq-news?cache=true', '/news-hot-api/qq-news?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'netease-news',
    source: '网易新闻',
    icon: 'fas fa-newspaper text-red-400',
    items: [],
    apis: [
      '/api-hot/netease-news?cache=true',
      '/news-hot-api/netease-news?cache=true',
    ],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'dongchedi',
    source: '懂车帝',
    icon: 'fas fa-car text-red-500',
    items: [],
    apis: ['/60s-api/v2/dongchedi'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item.rank || index,
        title: item.title,
        url: item.url || item.link || item.mobileUrl,
        hot: item.hot || item.score || item.score_desc || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: '36kr',
    source: '36氪',
    icon: 'fas fa-briefcase text-orange-500',
    items: [],
    apis: ['/api-hot/36kr?cache=true', '/news-hot-api/36kr?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: '果壳',
    source: 'Guokr',
    icon: 'fas fa-leaf text-green-500',
    items: [],
    apis: ['/news-hot-api/guokr?cache=true'],
    parser: (data) => {
      return (data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title || item.desc,
        url: item?.target?.url || item.link || item.mobileUrl,
        hot: item.hot_value || item.hot || '',
        summary: item.brief || item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'coolapk',
    source: '酷安',
    icon: 'fas fa-mobile-alt text-green-500',
    items: [],
    apis: ['/news-hot-api/coolapk?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'smzdm',
    source: '什么值得买',
    icon: 'fas fa-tags text-yellow-500',
    items: [],
    apis: ['/news-hot-api/smzdm?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'sspai',
    source: '少数派',
    icon: 'fas fa-pencil-alt text-green-500',
    items: [],
    apis: ['/api-hot/sspai?cache=true', '/news-hot-api/sspai?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'ithome',
    source: 'IT之家',
    icon: 'fas fa-desktop text-purple-500',
    items: [],
    apis: ['/api-hot/ithome?cache=true', '/news-hot-api/ithome?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'tieba',
    source: '百度贴吧',
    icon: 'fas fa-comments text-yellow-500',
    items: [],
    apis: ['/api-hot/tieba?cache=true', '/news-hot-api/tieba?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'genshin',
    source: '原神',
    icon: 'fas fa-mountain text-teal-500',
    items: [],
    apis: ['/api-hot/genshin?cache=true', '/news-hot-api/genshin?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'starrail',
    source: '崩坏：星穹铁道',
    icon: 'fas fa-space-shuttle text-cyan-500',
    items: [],
    apis: ['/api-hot/starrail?cache=true', '/news-hot-api/starrail?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'lol',
    source: '英雄联盟',
    icon: 'fas fa-dice-d20 text-red-600',
    items: [],
    apis: ['/api-hot/lol?cache=true', '/news-hot-api/lol?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'weread',
    source: '微信读书',
    icon: 'fab fa-weixin text-green-800',
    items: [],
    apis: ['/api-hot/weread?cache=true', '/news-hot-api/weread?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'zhihu-daily',
    source: '知乎日报',
    icon: 'fas fa-calendar text-blue-400',
    items: [],
    apis: [
      '/api-hot/zhihu-daily?cache=true',
      '/news-hot-api/zhihu-daily?cache=true',
    ],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'ngabbs',
    source: 'NGA',
    icon: 'fas fa-comment text-green-700',
    items: [],
    apis: ['/api-hot/ngabbs?cache=true', '/news-hot-api/ngabbs?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'history',
    source: '历史上的今天',
    icon: 'fas fa-history text-yellow-800',
    items: [],
    apis: ['/60s-api/v2/today-in-history', '/news-hot-api/history?cache=true'],
    parser: (data) => {
      console.log('History Data:', data)
      return (data?.data?.items || data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.description || '',
        time: item.timestamp || '',
      }))
    },
  },
  {
    name: 'jianshu',
    source: '简书',
    icon: 'fas fa-journal-whills text-orange-600',
    items: [],
    apis: ['/api-hot/jianshu?cache=true', '/news-hot-api/jianshu?cache=true'],
    parser: (data) => {
      return (data?.data || []).map((item, index) => ({
        id: item.id || item?.target?.id || index,
        title: item.title,
        url: item.source_url || item.link || item.mobileUrl,
        hot: item.hot || item.hot_value || '',
        summary: item.desc || item.brief || '',
        time: item.timestamp || '',
      }))
    },
  },
]
