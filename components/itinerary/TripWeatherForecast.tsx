'use client'

import { useEffect, useState } from 'react'

const TRIP_DATES = ['2026-06-05', '2026-06-06', '2026-06-07', '2026-06-08']
const TRIP_END = new Date('2026-06-08T23:59:59+08:00')
// Show from 5 days before departure
const SHOW_FROM = new Date('2026-05-31T00:00:00+08:00')

const DAY_LABELS = ['Day 1 · 抵达', 'Day 2 · 出海', 'Day 3 · 探岛', 'Day 4 · 返程']

interface DayForecast {
  date: string
  maxC: string
  minC: string
  desc: string
  icon: string
}

function iconForWeather(desc: string, maxC: number): string {
  const d = desc.toLowerCase()
  if (d.includes('thunder')) return '⛈️'
  if (d.includes('rain') || d.includes('shower') || d.includes('drizzle')) return '🌧️'
  if (d.includes('overcast')) return '☁️'
  if (d.includes('cloud') || d.includes('mist') || d.includes('fog')) return '⛅'
  if (maxC >= 30) return '☀️'
  return '🌤️'
}

function todayVietnam(): string {
  // Vietnam is UTC+7
  const now = new Date()
  const vn = new Date(now.getTime() + 7 * 3_600_000)
  return vn.toISOString().slice(0, 10)
}

export default function TripWeatherForecast() {
  const [forecasts, setForecasts] = useState<DayForecast[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const visible = now >= SHOW_FROM && now <= TRIP_END

  useEffect(() => {
    if (!visible) { setLoading(false); return }

    fetch('https://wttr.in/Phu+Quoc?format=j1')
      .then(r => r.json())
      .then((json: { weather?: { date: string; maxtempC: string; mintempC: string; hourly?: { weatherDesc?: { value: string }[] }[] }[] }) => {
        const weatherArr = json.weather ?? []
        const parsed: DayForecast[] = TRIP_DATES.flatMap(date => {
          const match = weatherArr.find(w => w.date === date)
          if (!match) return []
          const maxC = match.maxtempC
          const minC = match.mintempC
          // noon slot (index 4 = 12:00)
          const desc = match.hourly?.[4]?.weatherDesc?.[0]?.value ?? ''
          return [{ date, maxC, minC, desc, icon: iconForWeather(desc, parseInt(maxC)) }]
        })
        setForecasts(parsed)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [visible])

  if (!visible) return null

  const today = todayVietnam()

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-stone-700">📅 行程天气预报</span>
        <span className="text-xs text-stone-400">富国岛 · wttr.in 实时数据</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-3">
          {TRIP_DATES.map(d => (
            <div key={d} className="h-28 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {TRIP_DATES.map((date, i) => {
            const fc = forecasts.find(f => f.date === date)
            const isToday = date === today
            return (
              <div
                key={date}
                className={`rounded-2xl p-3 text-center transition-all ${
                  isToday
                    ? 'bg-ocean-600 text-white shadow-md ring-2 ring-ocean-400'
                    : 'bg-white border border-stone-100 shadow-sm'
                }`}
              >
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${
                  isToday ? 'text-ocean-200' : 'text-stone-400'
                }`}>
                  {DAY_LABELS[i]}
                </p>
                {fc ? (
                  <>
                    <p className="text-2xl mb-1.5">{fc.icon}</p>
                    <p className={`font-bold text-sm ${isToday ? 'text-white' : 'text-stone-800'}`}>
                      {fc.maxC}° <span className={`font-normal text-xs ${isToday ? 'text-ocean-200' : 'text-stone-400'}`}>/ {fc.minC}°</span>
                    </p>
                    <p className={`text-[10px] mt-1 leading-tight ${isToday ? 'text-ocean-100' : 'text-stone-400'}`}>
                      {fc.desc || '—'}
                    </p>
                  </>
                ) : (
                  <div className="mt-3">
                    <p className="text-xl mb-1">🌊</p>
                    <p className={`text-[10px] ${isToday ? 'text-ocean-200' : 'text-stone-400'}`}>
                      预报更新中
                    </p>
                  </div>
                )}
                {isToday && (
                  <div className="mt-2 bg-white/20 rounded-full px-2 py-0.5">
                    <span className="text-[10px] text-white font-semibold">今天</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
