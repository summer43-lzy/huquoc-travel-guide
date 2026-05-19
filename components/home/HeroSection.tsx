import { Calendar, Users, Hotel, Waves } from 'lucide-react'
import Link from 'next/link'
import { TripOverview } from '@/types'

const dayColors = ['bg-ocean-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500']

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export default function HeroSection({ trip }: { trip: TripOverview }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/55 via-ocean-900/40 to-ocean-900/80" />

      {/* Content — compact on mobile */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-6 sm:pb-10">
        {/* Badge */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm text-white">
            <span className="text-sand-300 text-xs">📍</span>
            <span className="text-sm">越南 · 富国岛</span>
          </div>
        </div>

        {/* Title + English subtitle */}
        <div className="text-center mb-3 sm:mb-5">
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            富国岛<span className="text-sand-300"> 旅行指南</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1.5 tracking-widest font-light">
            Your Ultimate Guide to Phu Quoc, Vietnam
          </p>
        </div>

        {/* Core trip info */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-5">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5 text-xs sm:text-sm text-white">
            <Calendar className="w-3.5 h-3.5 text-sand-300 flex-shrink-0" />
            <span className="font-semibold">{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5 text-xs sm:text-sm text-white">
            <Waves className="w-3.5 h-3.5 text-sand-300 flex-shrink-0" />
            <span>{trip.totalDays} 天 {trip.totalDays - 1} 晚</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5 text-xs sm:text-sm text-white">
            <Users className="w-3.5 h-3.5 text-sand-300 flex-shrink-0" />
            <span>{trip.groupSize} 人同行</span>
          </div>
          {trip.hotel && (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5 text-xs sm:text-sm text-white">
              <Hotel className="w-3.5 h-3.5 text-sand-300 flex-shrink-0" />
              <span className="hidden sm:inline">{trip.hotel}</span>
              <span className="sm:hidden">拉菲斯塔·希尔顿</span>
            </div>
          )}
        </div>

        {/* Day-by-day strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 max-w-2xl mx-auto">
          {trip.days.map((day, i) => (
            <a
              key={day.day}
              href={`/itinerary#day-${day.day}`}
              className="group bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-xl px-2.5 py-2 text-white transition-all"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className={`w-5 h-5 rounded-full ${dayColors[i]} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[9px] font-bold">{day.day}</span>
                </div>
                <span className="text-[10px] text-white/60">{formatDate(day.date)}</span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2">
                {day.title.split('·').map(s => s.trim()).slice(0, 2).join(' · ')}
              </p>
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <Link
            href="/itinerary"
            className="w-full sm:w-auto text-center px-7 py-2.5 sm:py-3 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-full transition-colors shadow-lg text-sm"
          >
            查看完整行程
          </Link>
          <Link
            href="/destination"
            className="w-full sm:w-auto text-center px-7 py-2.5 sm:py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full transition-colors text-sm"
          >
            了解目的地
          </Link>
        </div>
      </div>
    </section>
  )
}
