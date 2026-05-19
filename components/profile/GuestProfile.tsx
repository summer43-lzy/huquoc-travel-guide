'use client'

import { useState, useEffect } from 'react'
import { Heart, Calendar, Share2, Check, Clock, Plane, MapPin, CheckCircle } from 'lucide-react'
import { getFavorites } from '@/lib/localStorage'
import { attractions } from '@/data/attractions'
import { tripData } from '@/data/itinerary'
import { Attraction } from '@/types'
import CategoryBadge from '@/components/ui/CategoryBadge'
import StarRating from '@/components/ui/StarRating'
import FavoriteButton from '@/components/ui/FavoriteButton'
import TripCalendar from '@/components/profile/TripCalendar'

function useTripPhase() {
  const start = new Date('2026-06-05')
  const end = new Date('2026-06-08')
  const now = new Date()
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (nowDate < start) {
    const diff = Math.ceil((start.getTime() - nowDate.getTime()) / 86400000)
    return { phase: 'before' as const, daysUntil: diff }
  }
  if (nowDate <= end) {
    const day = Math.floor((nowDate.getTime() - start.getTime()) / 86400000) + 1
    return { phase: 'during' as const, currentDay: Math.min(day, tripData.totalDays) }
  }
  return { phase: 'after' as const, daysAgo: Math.floor((nowDate.getTime() - end.getTime()) / 86400000) }
}

function TripStatusBanner({ favCount }: { favCount: number }) {
  const trip = useTripPhase()

  if (trip.phase === 'before') {
    return (
      <div className="bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-2xl p-5 text-white mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-ocean-200 text-xs font-semibold uppercase tracking-wider mb-2">出发倒计时</p>
            <div className="flex items-end gap-2 mb-1">
              <span className="font-display text-5xl font-bold">{trip.daysUntil}</span>
              <span className="text-ocean-200 text-lg mb-1">天</span>
            </div>
            <p className="text-ocean-100 text-sm">距 2026年6月5日 富国岛出发</p>
          </div>
          <div className="text-right">
            <Plane className="w-10 h-10 text-white/30 mb-2" />
            <p className="text-ocean-200 text-xs">已收藏 {favCount} 个景点</p>
            <p className="text-ocean-200 text-xs mt-0.5">拉菲斯塔·希尔顿 · 4天3晚</p>
          </div>
        </div>
        {/* Prep checklist */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-ocean-100 text-xs font-semibold mb-2">出发前准备</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: '查看行李清单', href: '/practical#tools' },
              { label: '了解签证信息', href: '/practical#visa' },
              { label: '收藏心仪景点', href: '/itinerary' },
              { label: '安排日程规划', href: '#calendar' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-ocean-300 flex-shrink-0" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (trip.phase === 'during') {
    const today = tripData.days[trip.currentDay - 1]
    return (
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">现在正在旅行中！</p>
            <p className="font-display text-2xl font-bold">Day {trip.currentDay} · {today?.title?.split('·')[0].trim()}</p>
          </div>
          <div className="text-4xl">🏖️</div>
        </div>
        {today && (
          <div>
            <p className="text-emerald-100 text-sm mb-2">{today.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {today.attractions.map(a => (
                <span key={a.id} className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{a.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // After trip
  return (
    <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 text-white mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-1">旅行结束 · 美好回忆</p>
          <p className="font-display text-2xl font-bold">富国岛 · 完美结束 🎉</p>
          <p className="text-violet-200 text-sm mt-1">{trip.daysAgo} 天前 · 4天3晚 · 10人同行</p>
        </div>
        <div className="text-4xl">✈️</div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {[
          { label: '出行天数', value: '4天' },
          { label: '收藏景点', value: `${favCount}个` },
          { label: '同行人数', value: '10人' },
        ].map(s => (
          <div key={s.label} className="text-center bg-white/15 rounded-xl py-2">
            <p className="font-bold text-lg">{s.value}</p>
            <p className="text-violet-200 text-xs">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShareButton() {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.origin
    const shareData = {
      title: '富国岛旅行指南',
      text: '2026年6月5–8日 富国拉菲斯塔·希尔顿 10人专属旅行指南',
      url,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        throw new Error('no share api')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    }
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:border-ocean-400 hover:text-ocean-700 transition-colors text-sm font-medium"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
      {copied ? '链接已复制！' : '分享给朋友'}
    </button>
  )
}

export default function GuestProfile() {
  const [favoriteAttractions, setFavoriteAttractions] = useState<Attraction[]>([])

  useEffect(() => {
    const ids = getFavorites()
    setFavoriteAttractions(attractions.filter(a => ids.includes(a.id)))
  }, [])

  useEffect(() => {
    function onStorage() {
      const ids = getFavorites()
      setFavoriteAttractions(attractions.filter(a => ids.includes(a.id)))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-ocean-700 to-ocean-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🏖️
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">我的旅行空间</h1>
                <p className="text-ocean-200 text-sm mt-0.5">富国岛 · 2026年6月5–8日 · 拉菲斯塔·希尔顿</p>
              </div>
            </div>
            <ShareButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip status banner */}
        <TripStatusBanner favCount={favoriteAttractions.length} />

        {favoriteAttractions.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">还没有收藏</h2>
            <p className="text-stone-400 mb-6">
              去行程攻略页面，点击景点卡片上的 ❤️ 按钮即可收藏
            </p>
            <a
              href="/itinerary"
              className="inline-flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              去看行程攻略
            </a>
          </div>
        ) : (
          <div id="calendar" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Favorites list */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-rose-500" />
                <h2 className="font-display font-bold text-xl text-stone-900">我的收藏</h2>
                <span className="ml-auto text-sm bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full font-medium">
                  {favoriteAttractions.length}
                </span>
              </div>

              <div className="space-y-3">
                {favoriteAttractions.map(attraction => (
                  <div
                    key={attraction.id}
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-stone-800 text-sm leading-tight">{attraction.name}</h3>
                          <FavoriteButton attractionId={attraction.id} className="flex-shrink-0 w-7 h-7 bg-rose-50 text-rose-400 hover:bg-rose-100" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryBadge category={attraction.category} />
                          <StarRating rating={attraction.rating} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-ocean-500" />
                <h2 className="font-display font-bold text-xl text-stone-900">我的日程</h2>
                <span className="text-stone-400 text-sm ml-2">拖拽收藏排入日历</span>
              </div>
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
                <TripCalendar favorites={favoriteAttractions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
