'use client'

import { useEffect, useState } from 'react'

function parseOpenHours(openHours: string): { open: boolean; label: string } {
  if (!openHours || openHours.includes('全天')) return { open: true, label: '全天营业' }

  // Vietnam is UTC+7
  const now = new Date()
  const vnMinutes = (now.getUTCHours() * 60 + now.getUTCMinutes() + 7 * 60) % (24 * 60)

  const match = openHours.match(/(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})/)
  if (!match) return { open: true, label: openHours }

  const openMin = parseInt(match[1]) * 60 + parseInt(match[2])
  const closeMin = parseInt(match[3]) * 60 + parseInt(match[4])
  const isOpen = vnMinutes >= openMin && vnMinutes < closeMin

  return {
    open: isOpen,
    label: isOpen ? `营业中 · 至 ${match[3]}:${match[4]}` : `已打烊 · 开门 ${match[1]}:${match[2]}`,
  }
}

export default function OpenStatus({ openHours }: { openHours: string }) {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null)

  useEffect(() => {
    setStatus(parseOpenHours(openHours))
  }, [openHours])

  if (!status) return null

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
        status.open
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-stone-100 text-stone-500'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status.open ? 'bg-emerald-500' : 'bg-stone-400'}`} />
      {status.label}
    </span>
  )
}
