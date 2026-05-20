'use client'

import { useState, useMemo } from 'react'
import { Star, MapPin, Clock, ChevronDown, Filter, Navigation, Quote, ExternalLink, Utensils } from 'lucide-react'
import { restaurants, type CuisineType } from '@/data/restaurants'
import { tripData } from '@/data/itinerary'
import OpenStatus from '@/components/ui/OpenStatus'
import { cn } from '@/lib/utils'

type SortKey = 'distance' | 'rating'
type GroupFilter = 'all' | 'group'

const cuisineOptions: { value: CuisineType | 'all'; label: string }[] = [
  { value: 'all', label: '全部菜式' },
  { value: '海鲜', label: '🦞 海鲜' },
  { value: '越南菜', label: '🍜 越南菜' },
  { value: '融合料理', label: '🍽️ 融合料理' },
  { value: '西餐', label: '🥩 西餐' },
  { value: '印度菜', label: '🍛 印度菜' },
  { value: '街头小吃', label: '🌮 街头小吃' },
]

const priceLabel: Record<string, string> = {
  '¥': '人均 < ¥100',
  '¥¥': '人均 ¥100–300',
  '¥¥¥': '人均 > ¥300',
}

// Map each trip day to recommended restaurant IDs based on that day's ending area
const dayRecommendations: Record<number, { ids: string[]; reason: string }> = {
  1: { ids: ['chez-carole', 'ganesh-indian', 'duong-dong-seafood'], reason: '今天结束于迪淘夜市周边，这几家就在附近' },
  2: { ids: ['seasense-hilton', 'the-shack', 'chill-restaurant'], reason: '今天安泰夜市已涵盖晚餐，或回酒店附近放松用餐' },
  3: { ids: ['chez-carole', 'ganesh-indian', 'chill-restaurant'], reason: '今天行程已安排 Chez Carole，也可选附近餐厅' },
  4: { ids: ['seasense-hilton', 'the-shack'], reason: '出发日，在酒店或附近轻松用完最后一餐' },
}

function TonightRecommendation() {
  const today = new Date()
  const matchingDay = tripData.days.find(d => {
    const dayDate = new Date(d.date)
    return dayDate.toDateString() === today.toDateString()
  })

  if (!matchingDay) return null

  const rec = dayRecommendations[matchingDay.day]
  if (!rec) return null

  const recRestaurants = rec.ids.map(id => restaurants.find(r => r.id === id)).filter(Boolean) as typeof restaurants

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Utensils className="w-4 h-4 text-amber-600" />
        <p className="font-semibold text-amber-800 text-sm">今晚去哪吃？</p>
        <span className="text-xs text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">Day {matchingDay.day}</span>
      </div>
      <p className="text-xs text-stone-500 mb-3">{rec.reason}</p>
      <div className="flex flex-wrap gap-2">
        {recRestaurants.map(r => (
          <a
            key={r.id}
            href={`https://maps.google.com/?q=${encodeURIComponent(r.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 border border-amber-100 hover:border-amber-300 rounded-xl px-3 py-2 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-stone-800 leading-tight">{r.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-amber-500 text-[10px]">★ {r.googleRating}</span>
                <span className="text-stone-400 text-[10px]">{priceLabel[r.priceRange]}</span>
                <OpenStatus openHours={r.openHours} />
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-stone-300 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
    </span>
  )
}

export default function RestaurantSection() {
  const [sortKey, setSortKey] = useState<SortKey>('rating')
  const [cuisine, setCuisine] = useState<CuisineType | 'all'>('all')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = cuisine === 'all' ? restaurants : restaurants.filter(r => r.cuisine === cuisine)
    if (groupFilter === 'group') list = list.filter(r => r.groupFriendly)
    list = [...list].sort((a, b) =>
      sortKey === 'distance' ? a.distanceKm - b.distanceKm : b.googleRating - a.googleRating
    )
    return list
  }, [sortKey, cuisine, groupFilter])

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-ocean-600 font-semibold text-xs tracking-widest uppercase mb-1">Restaurant Guide</p>
          <h2 className="font-display text-3xl font-bold text-stone-900">当地 TOP 10 餐厅推荐</h2>
          <p className="text-stone-500 text-sm mt-1.5">
            精选距拉菲斯塔·希尔顿酒店最具代表性的 10 家餐厅 · 结合 Google 评分与距离
          </p>
        </div>
      </div>

      {/* Tonight recommendation */}
      <TonightRecommendation />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> 排序方式
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSortKey('rating')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                  sortKey === 'rating'
                    ? 'bg-ocean-600 text-white border-ocean-600'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300'
                )}
              >
                ⭐ 按评分
              </button>
              <button
                onClick={() => setSortKey('distance')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                  sortKey === 'distance'
                    ? 'bg-ocean-600 text-white border-ocean-600'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300'
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" /> 按距离（从拉菲斯塔）
                </span>
              </button>
            </div>
          </div>

          {/* Group friendly filter */}
          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2">10人团队</p>
            <button
              onClick={() => setGroupFilter(groupFilter === 'group' ? 'all' : 'group')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                groupFilter === 'group'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
              )}
            >
              👨‍👩‍👧‍👦 适合10人团
            </button>
          </div>

          <div className="sm:ml-auto">
            <p className="text-xs font-semibold text-stone-500 mb-2">按菜式筛选</p>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setCuisine(opt.value as CuisineType | 'all')}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                    cuisine === opt.value
                      ? 'bg-ocean-600 text-white border-ocean-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-stone-400 mb-4">
        共 <span className="font-semibold text-stone-700">{filtered.length}</span> 家餐厅
        {cuisine !== 'all' && <span> · {cuisine}</span>}
        {sortKey === 'distance' ? ' · 按距离从近到远' : ' · 按 Google 评分从高到低'}
      </p>

      {/* Restaurant cards */}
      <div className="space-y-4">
        {filtered.map((r, idx) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
          >
            {/* Card top */}
            <div className="flex gap-0 sm:gap-0">
              {/* Image */}
              <div className="relative w-28 sm:w-44 flex-shrink-0 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover"
                  style={{ minHeight: '120px' }}
                />
                {r.mustTry && (
                  <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    必去
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  #{idx + 1}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-stone-900 text-base leading-tight">{r.name}</h3>
                    <p className="text-stone-400 text-xs mt-0.5">{r.nameEn}</p>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="flex-shrink-0 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                  >
                    <ChevronDown className={cn('w-4 h-4 text-stone-400 transition-transform', expanded === r.id && 'rotate-180')} />
                  </button>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <StarRatingDisplay rating={r.googleRating} />
                  <span className="text-stone-400 text-xs">({r.googleReviews.toLocaleString()} 条评价)</span>
                  <span className="flex items-center gap-1 text-xs text-stone-500">
                    <Navigation className="w-3 h-3 text-ocean-500" />
                    {r.distanceKm === 0 ? '酒店内' : `距酒店 ${r.distanceKm} km`}
                  </span>
                  <OpenStatus openHours={r.openHours} />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="bg-ocean-50 text-ocean-700 rounded-full px-2.5 py-0.5 text-xs font-medium">{r.cuisine}</span>
                  <span className="bg-stone-100 text-stone-500 rounded-full px-2.5 py-0.5 text-xs">{priceLabel[r.priceRange]}</span>
                  {r.tags.slice(0, 2).map(t => (
                    <span key={t} className="bg-stone-100 text-stone-500 rounded-full px-2.5 py-0.5 text-xs">{t}</span>
                  ))}
                </div>

                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{r.description}</p>

                {/* Maps button */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(r.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 bg-ocean-50 hover:bg-ocean-100 text-ocean-700 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  Google Maps 导航
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Inline reviews (always visible) */}
            {r.reviews && r.reviews.length > 0 && (
              <div className="border-t border-stone-50 px-4 pb-3 pt-3 bg-stone-50/40">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">热门评价</p>
                <div className="space-y-2">
                  {r.reviews.slice(0, 2).map((rv, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Quote className="w-3 h-3 text-ocean-300 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">{rv.text}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                          <span className="text-amber-400">{'★'.repeat(rv.rating)}</span>
                          <span>{rv.author}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded details */}
            {expanded === r.id && (
              <div className="border-t border-stone-50 px-4 py-4 bg-stone-50/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-stone-700 mb-2">🍴 招牌菜</p>
                    <ul className="space-y-1">
                      {r.specialty.map(s => (
                        <li key={s} className="text-xs text-stone-600 flex items-start gap-1.5">
                          <span className="text-ocean-400 flex-shrink-0 mt-0.5">·</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-stone-700 mb-2">📋 实用信息</p>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-1.5 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{r.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-ocean-400 flex-shrink-0" />
                        <span>{r.openHours}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-stone-700 mb-1.5">💡 小贴士</p>
                    <ul className="space-y-1">
                      {r.tips.map(t => (
                        <li key={t} className="text-xs text-stone-600 flex items-start gap-1.5">
                          <span className="text-amber-400 flex-shrink-0 mt-0.5">·</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
