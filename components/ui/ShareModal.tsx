'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react'
import QRCode from 'qrcode'

const BASE = 'https://summer43-lzy.github.io/huquoc-travel-guide'

const PAGES = [
  { href: `${BASE}/`,           label: '🏠 首页',       desc: '旅行总览' },
  { href: `${BASE}/itinerary`,  label: '📅 行程攻略',   desc: '景点·活动·每日安排' },
  { href: `${BASE}/booking`,    label: '✅ 预订状态',   desc: '实时追踪预订进度' },
  { href: `${BASE}/practical`,  label: '🧳 出发前关注', desc: '签证·货币·实用信息' },
  { href: `${BASE}/destination`,label: '🏝️ 目的地介绍', desc: '富国岛全攻略' },
]

interface Props {
  onClose: () => void
}

export default function ShareModal({ onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [activeUrl, setActiveUrl] = useState(BASE + '/')
  const [copied, setCopied] = useState(false)
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  useEffect(() => {
    QRCode.toDataURL(activeUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#0c4a6e', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {})
  }, [activeUrl])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
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
        text: '2026年6月富国岛10人团旅行指南 — 行程、景点、餐厅、预订状态一站查看',
        url: activeUrl,
      })
    } catch {
      // User cancelled or not supported
    }
  }

  const shortUrl = activeUrl.replace('https://summer43-lzy.github.io', '')

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-ocean-600" />
            <h3 className="font-display font-bold text-stone-900">分享给朋友</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* QR code */}
          <div className="flex flex-col items-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="二维码"
                className="w-40 h-40 rounded-xl border border-stone-100 shadow-sm"
              />
            ) : (
              <div className="w-40 h-40 rounded-xl bg-stone-100 animate-pulse" />
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
              {copied ? <><Check className="w-3.5 h-3.5" />已复制</> : <><Copy className="w-3.5 h-3.5" />复制</>}
            </button>
          </div>

          {/* Native share button */}
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
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">分享特定页面</p>
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
                    <p className="text-[10px] text-stone-400">{page.desc}</p>
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
            className="flex items-center justify-center gap-1.5 text-xs text-stone-400 hover:text-ocean-600 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            在浏览器中打开
          </a>
        </div>
      </div>
    </div>
  )
}
