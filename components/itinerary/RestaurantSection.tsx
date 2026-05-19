'use client'

import { useState, useMemo } from 'react'
import { Star, MapPin, Clock, ChevronDown, Filter, Navigation } from 'lucide-react'
import { restaurants, type CuisineType } from '@/data/restaurants'
import { cn } from '@/lib/utils'

type SortKey = 'distance' | 'rating'

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
  '¥': '实惠 < ¥100',
  '¥¥': '中档 ¥100–300',
  '¥¥¥': '高档 > ¥300',
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
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = cuisine === 'all' ? restaurants : restaurants.filter(r => r.cuisine === cuisine)
    list = [...list].sort((a, b) =>
      sortKey === 'distance' ? a.distanceKm - b.distanceKm : b.googleRating - a.googleRating
    )
    return list
  }, [sortKey, cuisine])

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-ocean-600 font-semibold text-xs tracking-widest uppercase mb-1">Restaurant Guide</p>
          <h2 className="font-display text-3xl font-bold text-stone-900">当地 TOP 10 餐厅推荐</h2>
          <p className="text-stone-500 text-sm mt-1.5">
            精选距拉菲斯塔·希尔顿酒店最具代表性的 10 家餐厅 · 结合 Google 评分与距离
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sort toggle */}
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

          {/* Cuisine filter */}
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
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="bg-ocean-50 text-ocean-700 rounded-full px-2.5 py-0.5 text-xs font-medium">{r.cuisine}</span>
                  <span className="bg-stone-100 text-stone-500 rounded-full px-2.5 py-0.5 text-xs">{r.priceRange} {priceLabel[r.priceRange]}</span>
                  {r.tags.slice(0, 2).map(t => (
                    <span key={t} className="bg-stone-100 text-stone-500 rounded-full px-2.5 py-0.5 text-xs">{t}</span>
                  ))}
                </div>

                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{r.description}</p>
              </div>
            </div>

            {/* Expanded details */}
            {expanded === r.id && (
              <div className="border-t border-stone-50 px-4 py-4 bg-stone-50/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Signature dishes */}
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

                  {/* Practical info + tips */}
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
