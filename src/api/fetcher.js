import axios from 'axios'
import { isTauri } from '../utils'
import { originalSources as originalHotData } from '../mock'

/**
 * 通用 fallback parser（用于兜底）
 */
const universalParser = (data) => {
  const list = data?.data || data?.list || data || []
  if (!Array.isArray(list)) return []

  return list.map((item, index) => ({
    id: item.id || item.objectId || item.aweme_id || index,
    title:
      item.title ||
      item.name ||
      item.subject ||
      item.desc ||
      item.topic ||
      `No Title`,
    url: item.url || item.link || item.href || `#no-url-${index}`,
    hot:
      Number(item.hot) ||
      Number(item.score) ||
      Number(item.views) ||
      Number(item.count) ||
      Number(item.reply_count) ||
      0,
    time:
      item.time ||
      item.created_at ||
      item.publish_time ||
      item.active_time ||
      null,
    summary: item.summary || item.brief || item.desc || item.content || '',
  }))
}

/**
 * 主函数：根据 source name 获取热点数据
 * 支持多 API failover + 自定义 parser
 */
export async function fetchDataForSource(name) {
  // 查找对应的数据源配置
  const source = originalHotData.find((s) => s.name === name)
  if (!source) throw new Error(`Unknown data source: ${name}`)
  if (!source.apis || source.apis.length === 0)
    throw new Error(`No APIs configured for ${name}`)
  //如果apis只有1个，timeout设置为15s
  const timeout = source.apis.length === 1 ? 15000 : 10000

  try {
    const rawData = isTauri()
      ? await fetchFromTauri(name)
      : await fetchFromWebWithFallback(source, timeout)

    // 使用该 source 自带的 parser 解析数据
    let parsedData
    if (typeof source.parser === 'function') {
      try {
        parsedData = source.parser(rawData)
      } catch (parseErr) {
        console.warn(`[Parser] ${name} 专用解析器出错:`, parseErr.message)
        parsedData = universalParser(rawData) // fallback 到通用 parser
      }
    } else {
      console.warn(`[Parser] ${name} 未定义 parser，使用通用 parser`)
      parsedData = universalParser(rawData)
    }

    return Array.isArray(parsedData) ? parsedData : []
  } catch (err) {
    console.error(
      `[fetchDataForSource] 所有 API 均失败或解析异常 (${name}):`,
      err.message
    )
    throw err
  }
}

/**
 * 根据 URL 获取请求优先级
 * @param {*} url
 * @returns
 */
function getPriorityFromUrl(url) {
  if (url.startsWith('/60s-api/')) {
    return 1 // 高质量
  }
  if (url.startsWith('/news-hot-api/')) {
    return 2 // 中等
  }
  if (url.startsWith('/api-hot/')) {
    return 10 // 低质量兜底
  }
  // 其他路径（如官方 API）设为最低优先级
  return 99
}

/**
 * Web 环境下：对一个 source 的多个 API 地址进行 fallback 请求
 * @params source {Object} 数据源配置对象，包含 apis 数组和 name
 * @params timeout {Number} 每个请求的超时时间，单位毫秒，默认 10000ms
 * @returns {Promise<Object>} 成功返回数据对象，失败抛出错误
 */
async function fetchFromWebWithFallback(source, timeout = 10000) {
  const { apis, name } = source

  if (!Array.isArray(apis) || apis.length === 0) {
    throw new Error(`[${name}] apis 配置错误`)
  }

  // === 自动为每个 URL 分配优先级并排序 ===
  const apisWithPriority = apis.map((url) => ({
    url,
    priority: getPriorityFromUrl(url),
  }))

  apisWithPriority.sort((a, b) => a.priority - b.priority)

  for (const { url, priority } of apisWithPriority) {
    try {
      console.log(`📡 [${name}] 尝试请求 (${priority}) ${url}`)
      const response = await axios.get(url, {
        timeout,
        headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
        withCredentials: true,
      })

      const data = response.data
      if (data && (Array.isArray(data) || typeof data === 'object')) {
        console.log(`✅ [${name}] 成功从 ${url} 获取数据`)
        return data
      } else {
        console.warn(`⚠️ [${name}] ${url} 返回无效数据`, data)
      }
    } catch (error) {
      const msg = error.response
        ? `HTTP ${error.response.status}`
        : error.code === 'ECONNABORTED'
          ? '超时'
          : error.message
      console.error(`❌ [${name}] 请求失败 (${priority}) ${url}: ${msg}`)
    }
  }

  throw new Error(`[${name}] 所有 API 均失败`)
}
// async function fetchFromWebWithFallback(source, timeout = 10000) {
//   const { apis, name } = source

//   for (const url of apis) {
//     try {
//       console.log(`📡 尝试请求 ${source.source} -> ${url}`)
//       const headers = {
//         Accept: 'application/json',
//         'Cache-Control': 'no-cache',
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': 'true',
//       }

//       const response = await axios.get(url, {
//         timeout: timeout, // 使用自定义超时
//         headers: headers,
//         // 可选：跨域时携带凭证
//         withCredentials: true,
//       })

//       const data = response.data

//       if (data && (Array.isArray(data) || typeof data === 'object')) {
//         console.log(`✅ 成功从 ${url} 获取数据`)
//         return data
//       } else {
//         console.warn(`⚠️  ${url} 返回空或无效数据`, data)
//         continue
//       }
//     } catch (error) {
//       const msg = error.response
//         ? `HTTP ${error.response.status}: ${error.response.statusText}`
//         : error.code === 'ECONNABORTED'
//           ? '请求超时'
//           : error.message

//       console.error(`❌ 请求失败 ${url} (${name}): ${error.message} - ${msg}`)
//       continue // 继续下一个 API
//     }
//   }

//   throw new Error(`所有 API 请求均失败：${source.source} (${name})`)
// }

/**
 * Tauri 环境专用请求
 */
async function fetchFromTauri(name) {
  try {
    const { invoke } = await import('@tauri-apps/api/core')
    const raw = await invoke('fetch_hot_data', { name })
    return JSON.parse(raw)
  } catch (err) {
    console.error(`[Tauri] 调用 fetch_hot_data 失败 (${name}):`, err)
    throw err
  }
}
