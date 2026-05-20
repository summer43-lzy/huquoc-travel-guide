import { useEffect, useRef, useState } from 'react'

const THRESHOLD = 70

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullY, setPullY] = useState(0)
  const startYRef = useRef(0)
  const pullingRef = useRef(false)
  const pullYRef = useRef(0)
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (window.scrollY <= 0) {
        startYRef.current = e.touches[0].clientY
        pullingRef.current = true
      }
    }
    function onTouchMove(e: TouchEvent) {
      if (!pullingRef.current) return
      const delta = e.touches[0].clientY - startYRef.current
      if (delta > 0) {
        const clamped = Math.min(delta, THRESHOLD + 20)
        pullYRef.current = clamped
        setPullY(clamped)
      } else {
        pullingRef.current = false
        pullYRef.current = 0
        setPullY(0)
      }
    }
    async function onTouchEnd() {
      if (!pullingRef.current) return
      pullingRef.current = false
      const y = pullYRef.current
      pullYRef.current = 0
      setPullY(0)
      if (y >= THRESHOLD) {
        setRefreshing(true)
        try {
          await onRefreshRef.current()
        } finally {
          setRefreshing(false)
        }
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return { refreshing, pullY }
}
