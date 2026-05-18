import { Calendar, Users, MapPin, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { TripOverview } from '@/types'

export default function HeroSection({ trip }: { trip: TripOverview }) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/40 via-ocean-900/30 to-ocean-900/70" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6 text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>越南 · 富国岛</span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-bold mb-4 leading-tight drop-shadow-lg">
          富国岛
          <br />
          <span className="text-sand-300">旅行指南</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
          翡翠色海水、洁白沙滩、热带雨林与新鲜海鲜 —— 我们团队的专属旅行记忆
        </p>

        {/* Trip stats */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
            <Calendar className="w-4 h-4 text-sand-300" />
            <span>{trip.startDate} — {trip.endDate}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
            <Users className="w-4 h-4 text-sand-300" />
            <span>{trip.groupSize} 人同行</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
            <Calendar className="w-4 h-4 text-sand-300" />
            <span>{trip.totalDays} 天 {trip.totalDays - 1} 晚</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {trip.highlights.map((h, i) => (
            <span
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs text-white/90"
            >
              ✦ {h}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/itinerary"
            className="px-8 py-3.5 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-full transition-colors shadow-lg"
          >
            查看完整行程
          </Link>
          <Link
            href="/destination"
            className="px-8 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full transition-colors"
          >
            了解目的地
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  )
}
