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

export const cleanYouTubeIframe = (dirtyHtml) => {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return ''
  // 使用 DOMParser 解析 HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(dirtyHtml, 'text/html')
  const iframe = doc.querySelector('iframe[src]')
  if (!iframe) return '' // 没有 iframe，返回空
  const src = iframe.getAttribute('src')
  // 提取 YouTube 视频 ID（从 src 中）
  const videoIdMatch = src?.match(/embed\/([a-zA-Z0-9_-]+)/)
  const videoId = videoIdMatch ? videoIdMatch[1] : null
  if (!videoId) return '' // 无效视频 ID
  // 生成干净、响应式的 iframe HTML
  return `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${videoId}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      style="width:100%; height:100%; position:absolute; top:0; left:0;">
    </iframe>
  `.trim()
}
