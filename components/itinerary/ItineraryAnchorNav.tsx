'use client'

import { useState } from 'react'
import { tripData } from '@/data/itinerary'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  ...tripData.days.map(day => ({
    id: `day-${day.day}`,
    label: `Day ${day.day}`,
  })),
  { id: 'restaurants', label: '推荐餐厅' },
]

export default function ItineraryAnchorNav() {
  const [activeId, setActiveId] = useState<string | null>(null)

  function handleClick(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setActiveId(id)
  }

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 py-2.5 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                activeId === item.id
                  ? 'bg-ocean-600 text-white border-ocean-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300 hover:text-ocean-700'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
