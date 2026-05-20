'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react'
import QRCode from 'qrcode'

const BASE = 'https://summer43-lzy.github.io/huquoc-travel-guide'

const PAGES = [
  { href: `${BASE}/`,            label: '🏠 首页',       desc: '旅行总览' },
  { href: `${BASE}/itinerary`,   label: '📅 行程攻略',   desc: '景点·活动·每日安排' },
  { href: `${BASE}/booking`,     label: '✅ 预订状态',   desc: '实时追踪预订进度' },
  { href: `${BASE}/expense`,     label: '💰 团队记账',   desc: '消费流水·实时汇率' },
  { href: `${BASE}/practical`,   label: '🧳 出发前关注', desc: '签证·货币·实用信息' },
  { href: `${BASE}/destination`, label: '🏝️ 目的地介绍', desc: '富国岛全攻略' },
]

interface Props {
  onClose: () => void
}

function ModalContent({ onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [activeUrl, setActiveUrl] = useState(BASE + '/')
  const [copied, setCopied] = useState(false)
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  useEffect(() => {
    QRCode.toDataURL(activeUrl, {
      width: 180,
      margin: 2,
      color: { dark: '#0c4a6e', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {})
  }, [activeUrl])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(activeUrl)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = activeUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function nativeShare() {
    try {
      await navigator.share({
        title: '富国岛旅行指南',
        text: '2026年6月富国岛10人团旅行指南',
        url: activeUrl,
      })
    } catch {}
  }

  const shortUrl = activeUrl.replace('https://summer43-lzy.github.io', '')

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full sm:w-96 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-ocean-600" />
            <h3 className="font-display font-bold text-stone-900">分享给朋友</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="关闭"
          >
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="二维码"
                className="w-36 h-36 rounded-xl border border-stone-100 shadow-sm"
              />
            ) : (
              <div className="w-36 h-36 rounded-xl bg-stone-100 animate-pulse" />
            )}
            <p className="text-xs text-stone-400 mt-2">手机扫码直接打开</p>
          </div>

          {/* URL + copy */}
          <div className="flex items-center gap-2 bg-stone-50 rounded-xl border border-stone-200 px-3 py-2">
            <span className="flex-1 text-xs text-stone-600 font-mono truncate">{shortUrl}</span>
            <button
              onClick={copyLink}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
                copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-ocean-100 hover:bg-ocean-200 text-ocean-700'
              }`}
            >
              {copied
                ? <><Check className="w-3.5 h-3.5" />已复制</>
                : <><Copy className="w-3.5 h-3.5" />复制</>}
            </button>
          </div>

          {/* Native share */}
          {canNativeShare && (
            <button
              onClick={nativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              发送给朋友
            </button>
          )}

          {/* Page picker */}
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              分享特定页面
            </p>
            <div className="space-y-1.5">
              {PAGES.map(page => (
                <button
                  key={page.href}
                  onClick={() => setActiveUrl(page.href)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    activeUrl === page.href
                      ? 'bg-ocean-50 border border-ocean-200'
                      : 'bg-stone-50 hover:bg-stone-100 border border-transparent'
                  }`}
                >
                  <div>
                    <p className={`text-xs font-semibold ${activeUrl === page.href ? 'text-ocean-700' : 'text-stone-700'}`}>
                      {page.label}
                    </p>
                    <p className="text-xs text-stone-400">{page.desc}</p>
                  </div>
                  {activeUrl === page.href && (
                    <div className="w-1.5 h-1.5 rounded-full bg-ocean-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Open in browser */}
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-stone-400 hover:text-ocean-600 transition-colors pb-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            在浏览器中打开
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ShareModal({ onClose }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null
  return createPortal(<ModalContent onClose={onClose} />, document.body)
}
