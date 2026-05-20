'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/huquoc-travel-guide/sw.js', {
        scope: '/huquoc-travel-guide/',
      })
      .catch(() => {
        // SW registration failed silently — offline features unavailable
      })
  }, [])

  return null
}
