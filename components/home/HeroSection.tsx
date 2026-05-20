import Link from 'next/link'
import { TripOverview } from '@/types'
import ShareButton from '@/components/ui/ShareButton'

export default function HeroSection({ trip }: { trip: TripOverview }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/55 via-ocean-900/40 to-ocean-900/80" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-4 sm:pb-8">
        {/* Badge */}
        <div className="flex justify-center mb-2 sm:mb-3">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-white">
            <span className="text-xs">📍</span>
            <span className="text-xs">越南 · 富国岛</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-2">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            富国岛<span className="text-sand-300"> 旅行指南</span>
          </h1>
        </div>

        {/* Trip summary — single line, no box */}
        <p className="text-center text-white/75 text-sm mb-4 sm:mb-6">
          6月5–8日 · 4天3晚 · {trip.groupSize}人 · 拉菲斯塔希尔顿
        </p>

        {/* CTAs */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <Link
            href="/itinerary"
            className="flex-1 sm:flex-none text-center px-5 sm:px-7 py-2.5 sm:py-3 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-full transition-colors shadow-lg text-sm"
          >
            查看行程
          </Link>
          <Link
            href="/destination"
            className="flex-1 sm:flex-none text-center px-5 sm:px-7 py-2.5 sm:py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full transition-colors text-sm"
          >
            目的地介绍
          </Link>
          <ShareButton
            label="邀请朋友"
            className="flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full transition-colors text-sm"
          />
        </div>
      </div>
    </section>
  )
}
