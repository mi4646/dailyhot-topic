// 热度单位转换
export const formatHot = (value) => {
  if (!value) return 'N/A'
  if (value >= 1000000) return `${(value / 10000).toFixed(1)}万`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value
}

// 检测是否在 Tauri 环境中运行
// 通过检查 window 对象中是否存在 __TAURI_INTERNALS__
// 确保在 `tauri.conf.json` 中设置 `app.withGlobalTauri` 为 true
export const isTauri = () => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

// 获取和保存历史热度数据到 localStorage
export const getHistoricalHotData = () => {
  try {
    return JSON.parse(localStorage.getItem('historicalHotData')) || {}
  } catch {
    return {}
  }
}

export const saveHistoricalHotData = (data) => {
  localStorage.setItem('historicalHotData', JSON.stringify(data))
}
