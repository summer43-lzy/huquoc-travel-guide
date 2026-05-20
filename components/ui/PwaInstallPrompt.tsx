'use client'

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'pwa-install-dismissed'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed or installed
    if (localStorage.getItem(DISMISSED_KEY)) return
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setShow(false)
    localStorage.setItem(DISMISSED_KEY, '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[300] md:hidden">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-100 px-4 py-3.5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-ocean-600 flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 text-sm">添加到主屏幕</p>
          <p className="text-xs text-stone-400 mt-0.5">像 App 一样快速打开</p>
        </div>
        <button
          onClick={handleInstall}
          className="flex-shrink-0 bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
        >
          安装
        </button>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-stone-400 hover:text-stone-600"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
