import { useEffect, useRef, useState } from 'react'

const LazyLoadWrapper = ({ onVisible, children, rootMargin = '100px' }) => {
  const ref = useRef()
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    if (hasBeenVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true)
          onVisible()
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasBeenVisible, onVisible, rootMargin])

  return <div ref={ref}>{children}</div>
}

export default LazyLoadWrapper
