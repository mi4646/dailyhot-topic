import { useEffect, useState } from 'react'

export default function ProxyImage({ url, alt, className }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let disposed = false

    async function load() {
      if (!url) {
        setSrc('https://placehold.co/128x192/ddd/999?text=No+Cover')
        return
      }

      if (import.meta.env.DEV) {
        // 开发：走 Vite proxy
        const proxyUrl = url.replace(
          /^https?:\/\/img\d+\.doubanio\.com/,
          '/img-proxy'
        )
        if (!disposed) setSrc(proxyUrl)
        return
      }

      // tauri 打包：走 Rust command
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        const dataUrl = await invoke('fetch_image_data_url', { url })
        if (!disposed) setSrc(dataUrl)
      } catch (e) {
        console.error('[ProxyImage Error]', e)
        if (!disposed) {
          setSrc('https://placehold.co/128x192/ddd/999?text=No+Cover')
        }
      }
    }

    load()
    return () => {
      disposed = true
    }
  }, [url])

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        console.log(`[Error] ${alt}: ${e.currentTarget.src}`)
        e.currentTarget.src =
          'https://placehold.co/128x192/ddd/999?text=No+Cover'
      }}
    />
  )
}
