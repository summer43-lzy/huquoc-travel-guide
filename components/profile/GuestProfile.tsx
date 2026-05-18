'use client'

import { useState, useEffect } from 'react'
import { Heart, Calendar } from 'lucide-react'
import { getFavorites } from '@/lib/localStorage'
import { attractions } from '@/data/attractions'
import { Attraction } from '@/types'
import CategoryBadge from '@/components/ui/CategoryBadge'
import StarRating from '@/components/ui/StarRating'
import FavoriteButton from '@/components/ui/FavoriteButton'
import TripCalendar from '@/components/profile/TripCalendar'

export default function GuestProfile() {
  const [favoriteAttractions, setFavoriteAttractions] = useState<Attraction[]>([])

  useEffect(() => {
    const ids = getFavorites()
    setFavoriteAttractions(attractions.filter(a => ids.includes(a.id)))
  }, [])

  // Re-sync when storage changes (e.g. user removes a favorite)
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              🏖️
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">我的旅行空间</h1>
              <p className="text-ocean-200 text-sm mt-0.5">收藏景点 · 规划日程 · 游客模式</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {favoriteAttractions.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
