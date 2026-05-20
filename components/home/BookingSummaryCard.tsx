'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ClipboardCheck } from 'lucide-react'

const bookingItems = [
  { id: 'hotel-lafesta',  status: 'confirmed' },
  { id: 'flight-arrive',  status: 'confirmed' },
  { id: 'flight-sz',      status: 'confirmed' },
  { id: 'flight-sg',      status: 'confirmed' },
  { id: 'hotel-pickup',   status: 'pending' },
  { id: 'fishing',        status: 'pending' },
  { id: 'cable-car',      status: 'pending' },
  { id: 'chez-carole',    status: 'pending' },
  { id: 'seasense',       status: 'pending' },
  { id: 'cash',           status: 'pending' },
  { id: 'sim',            status: 'pending' },
  { id: 'insurance',      status: 'pending' },
]

const STORAGE_KEY = 'booking-status-v1'
const TOTAL = bookingItems.length
const DEFAULT_CONFIRMED = bookingItems.filter(i => i.status === 'confirmed').length

type Status = 'confirmed' | 'pending' | 'issue'

function loadConfirmedCount(): number {
  if (typeof window === 'undefined') return DEFAULT_CONFIRMED
  try {
    const overrides: Record<string, Status> = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return bookingItems.filter(i => (overrides[i.id] ?? i.status) === 'confirmed').length
  } catch {
    return DEFAULT_CONFIRMED
  }
}

export default function BookingSummaryCard({ className }: { className?: string }) {
  const [confirmed, setConfirmed] = useState(DEFAULT_CONFIRMED)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setConfirmed(loadConfirmedCount())
    setMounted(true)
  }, [])

  const display = mounted ? confirmed : DEFAULT_CONFIRMED
  const pct = Math.round((display / TOTAL) * 100)

  return (
    <div className={className ?? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8'}>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-3.5 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <ClipboardCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-semibold text-stone-800 text-sm">预订进度</p>
            <p className="text-xs text-stone-500">{display} / {TOTAL} 已确认</p>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Link
          href="/booking"
          className="flex-shrink-0 inline-flex items-center gap-1 bg-ocean-50 hover:bg-ocean-100 border border-ocean-100 text-ocean-700 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          查看详情 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
