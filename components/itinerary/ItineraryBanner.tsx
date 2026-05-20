'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tripData } from '@/data/itinerary'

const dayColors = ['bg-ocean-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500']

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const STORAGE_KEY = 'itinerary-last-day'

const NAV_ITEMS = [
  ...tripData.days.map((day, i) => ({
    id: `day-${day.day}`,
    label: `Day ${day.day}`,
    sub: formatShortDate(day.date),
    color: dayColors[i],
    isDay: true,
  })),
  {
    id: 'restaurants',
    label: '推荐餐厅',
    sub: '美食精选',
    color: 'bg-amber-500',
    isDay: false,
  },
]

export default function ItineraryBanner() {
  const [activeId, setActiveId] = useState<string>('day-1')
  const router = useRouter()
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Restore last-visited day on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const el = document.getElementById(saved)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
        setActiveId(saved)
      }
    }
  }, [])

  // Intersection Observer to track active section
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            localStorage.setItem(STORAGE_KEY, entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      localStorage.setItem(STORAGE_KEY, id)
    }
  }

  return (
    <div className="relative h-52 sm:h-72 overflow-hidden">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80"
        alt="富国岛海滩"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/40 via-ocean-900/50 to-ocean-900/80" />

      {/* Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 pb-14 sm:pb-16">
        <p className="text-ocean-200 text-xs font-medium tracking-widest uppercase mb-2">Itinerary & Attractions</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold mb-1">行程攻略</h1>
        <p className="text-white/70 text-xs sm:text-sm">精选景点、餐厅、活动，每一处都值得期待</p>
      </div>

      {/* Day nav tabs — pinned to bottom of banner */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center sm:justify-center">
          {NAV_ITEMS.map(item => {
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-white transition-all ${
                  isActive
                    ? 'bg-white/30 backdrop-blur-sm border border-white/50 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                {item.isDay && (
                  <span className={`w-5 h-5 rounded-full ${item.color} flex items-center justify-center text-xs font-bold mb-0.5`}>
                    {item.id.replace('day-', '')}
                  </span>
                )}
                {!item.isDay && <span className="text-sm mb-0.5">🍽️</span>}
                <span className={`text-xs font-semibold leading-none ${isActive ? 'text-white' : 'text-white/90'}`}>
                  {item.label}
                </span>
                <span className="text-xs text-white/60 mt-0.5">{item.sub}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
