'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, MapPin, Clock, DollarSign, Star, Heart } from 'lucide-react'
import { TripOverview } from '@/types'
import CategoryBadge from '@/components/ui/CategoryBadge'
import { cn } from '@/lib/utils'

const dayAccentColors = [
  'border-ocean-400 text-ocean-700 bg-ocean-50',
  'border-violet-400 text-violet-700 bg-violet-50',
  'border-emerald-400 text-emerald-700 bg-emerald-50',
  'border-amber-400 text-amber-700 bg-amber-50',
  'border-rose-400 text-rose-700 bg-rose-50',
]

export default function DailyItinerary({ trip }: { trip: TripOverview }) {
  const [expanded, setExpanded] = useState<number | null>(1)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="text-center mb-12">
        <p className="text-ocean-600 font-semibold text-sm tracking-widest uppercase mb-3">Daily Plan</p>
        <h2 className="font-display text-4xl font-bold text-stone-900 mb-4">每日详细安排</h2>
        <p className="text-stone-500 max-w-xl mx-auto">点击每一天查看详细行程和打卡地点</p>
      </div>

      <div className="space-y-4">
        {trip.days.map((day, i) => {
          const isOpen = expanded === day.day
          const accent = dayAccentColors[i % dayAccentColors.length]

          return (
            <div
              key={day.day}
              className={cn(
                'bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200',
                isOpen ? 'shadow-md' : 'hover:shadow-md'
              )}
            >
              {/* Accordion header */}
              <button
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                onClick={() => setExpanded(isOpen ? null : day.day)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center flex-shrink-0', accent)}>
                    <span className="text-xs font-bold leading-none">Day</span>
                    <span className="text-lg font-bold leading-none">{day.day}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-stone-900">{day.title}</h3>
                    <p className="text-sm text-stone-400 mt-0.5">{day.date} · {day.attractions.length} 个地点</p>
                  </div>
                </div>
                <ChevronDown
                  className={cn('w-5 h-5 text-stone-400 transition-transform flex-shrink-0', isOpen && 'rotate-180')}
                />
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 border-t border-stone-50">
                  <p className="text-stone-500 text-sm py-4">{day.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {day.attractions.map(attraction => (
                      <div
                        key={attraction.id}
                        className="group rounded-xl overflow-hidden border border-stone-100 card-hover bg-white"
                      >
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 image-overlay" />
                          <div className="absolute top-3 left-3">
                            <CategoryBadge category={attraction.category} />
                          </div>
                          <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors">
                            <Heart className="w-3.5 h-3.5 text-white" />
                          </button>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="font-display font-bold text-white text-base leading-tight">{attraction.name}</h4>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3.5">
                          <p className="text-stone-500 text-xs leading-relaxed mb-3 line-clamp-2">
                            {attraction.description}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                            {attraction.price && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-emerald-500" />
                                {attraction.price}
                              </span>
                            )}
                            {attraction.openHours && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-ocean-500" />
                                {attraction.openHours}
                              </span>
                            )}
                          </div>
                          {attraction.tips && attraction.tips.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-stone-50">
                              <p className="text-xs text-stone-400 font-medium mb-1">💡 小贴士</p>
                              <p className="text-xs text-stone-500">{attraction.tips[0]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/itinerary"
          className="inline-flex items-center gap-2 px-8 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold rounded-full transition-colors shadow-md"
        >
          查看完整攻略详情
          <MapPin className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
