'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ClipboardCheck, CircleDollarSign } from 'lucide-react'

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

const TOTAL = bookingItems.length
const DEFAULT_CONFIRMED = bookingItems.filter(i => i.status === 'confirmed').length
const STORAGE_KEY = 'booking-status-v1'

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

export default function TripStatusBar() {
  const [confirmed, setConfirmed] = useState(DEFAULT_CONFIRMED)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setConfirmed(loadConfirmedCount())
    setMounted(true)
  }, [])

  const display = mounted ? confirmed : DEFAULT_CONFIRMED
  const pct = Math.round((display / TOTAL) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
      <div className="grid grid-cols-2 gap-3">
        {/* Booking progress */}
        <Link
          href="/booking"
          className="group bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-3.5 flex flex-col gap-2 hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-stone-600">预订进度</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 mb-1.5">
              <span className="font-display font-bold text-xl text-stone-900">{pct}%</span>
              <span className="text-xs text-stone-400">{display}/{TOTAL} 已确认</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </Link>

        {/* Expense quick link */}
        <Link
          href="/expense"
          className="group bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-3.5 flex flex-col gap-2 hover:border-ocean-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-ocean-50 flex items-center justify-center flex-shrink-0">
                <CircleDollarSign className="w-3.5 h-3.5 text-ocean-600" />
              </div>
              <span className="text-xs font-semibold text-stone-600">团队记账</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-ocean-500 transition-colors" />
          </div>
          <div>
            <p className="font-display font-bold text-xl text-stone-900">记账</p>
            <p className="text-xs text-stone-400 mt-0.5">记录每一笔花费</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
