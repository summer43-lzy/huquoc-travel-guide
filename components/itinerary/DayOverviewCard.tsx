import { MapPin, Clock, DollarSign, Navigation } from 'lucide-react'

interface Attraction {
  id: string
  name: string
  price?: string
  distanceFromHotel?: string
  location?: { lat: number; lng: number }
  tags: string[]
}

interface DayData {
  day: number
  title: string
  date: string
  description: string
  attractions: Attraction[]
}

function mapsUrl(a: Attraction) {
  if (a.location) return `https://maps.google.com/?q=${a.location.lat},${a.location.lng}`
  return null
}

function isPaid(price?: string) {
  if (!price) return false
  if (price.includes('免费') || price.includes('酒店') || price.includes('含早')) return false
  return true
}

export default function DayOverviewCard({ day }: { day: DayData }) {
  const paidCount = day.attractions.filter(a => isPaid(a.price)).length
  const freeCount = day.attractions.length - paidCount

  // Find furthest attraction (non-hotel)
  const distances = day.attractions
    .map(a => a.distanceFromHotel)
    .filter(d => d && d !== '酒店内' && d !== '酒店私人海滩')
  const furthest = distances[distances.length - 1] ?? '酒店附近'

  return (
    <div className="bg-gradient-to-r from-ocean-50 via-blue-50 to-cyan-50 border border-ocean-100 rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        {/* Stats */}
        <div className="flex gap-5">
          <div className="text-center">
            <div className="text-xl font-bold text-ocean-600">{day.attractions.length}</div>
            <div className="text-[11px] text-stone-500">个景点</div>
          </div>
          {paidCount > 0 && (
            <div className="text-center">
              <div className="text-xl font-bold text-amber-600">{paidCount}</div>
              <div className="text-[11px] text-stone-500">付费项目</div>
            </div>
          )}
          {freeCount > 0 && (
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-600">{freeCount}</div>
              <div className="text-[11px] text-stone-500">免费项目</div>
            </div>
          )}
        </div>

        {/* Furthest point */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-white/70 rounded-xl px-3 py-1.5">
          <Navigation className="w-3.5 h-3.5 text-ocean-500 flex-shrink-0" />
          <span>最远：{furthest}</span>
        </div>
      </div>

      {/* Quick nav to each stop */}
      <div className="mt-3 flex flex-wrap gap-2">
        {day.attractions.map((a, i) => {
          const url = mapsUrl(a)
          const label = a.name.split('·')[0].split('(')[0].trim()
          return url ? (
            <a
              key={a.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-ocean-50 border border-ocean-100 hover:border-ocean-300 text-ocean-700 rounded-full px-3 py-1 text-xs font-medium transition-colors"
            >
              <span className="text-stone-400 text-[10px]">{i + 1}</span>
              {label}
              <MapPin className="w-3 h-3 opacity-60" />
            </a>
          ) : (
            <span
              key={a.id}
              className="inline-flex items-center gap-1 bg-white/60 border border-stone-100 text-stone-500 rounded-full px-3 py-1 text-xs"
            >
              <span className="text-stone-300 text-[10px]">{i + 1}</span>
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
