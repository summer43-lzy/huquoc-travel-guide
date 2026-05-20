'use client'

import { useEffect, useState } from 'react'

// Trip dates for labelling
const TRIP_DAY_LABELS: Record<string, string> = {
  '2026-06-05': 'Day 1 · 抵达',
  '2026-06-06': 'Day 2 · 出海',
  '2026-06-07': 'Day 3 · 探岛',
  '2026-06-08': 'Day 4 · 返程',
}

interface DayForecast {
  date: string       // YYYY-MM-DD
  maxC: string
  minC: string
  desc: string
  icon: string
  isToday: boolean
  tripLabel: string | null
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
  const vn = new Date(Date.now() + 7 * 3_600_000)
  return vn.toISOString().slice(0, 10)
}

function formatDateLabel(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m)}月${parseInt(d)}日`
}

export default function TripWeatherForecast() {
  const [forecasts, setForecasts] = useState<DayForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState('')

  useEffect(() => {
    const today = todayVietnam()

    fetch('https://wttr.in/Phu+Quoc?format=j1')
      .then(r => r.json())
      .then((json: {
        weather?: {
          date: string
          maxtempC: string
          mintempC: string
          hourly?: { weatherDesc?: { value: string }[] }[]
        }[]
      }) => {
        const weatherArr = json.weather ?? []
        const parsed: DayForecast[] = weatherArr.map(w => {
          const maxC = w.maxtempC
          const minC = w.mintempC
          const desc = w.hourly?.[4]?.weatherDesc?.[0]?.value ?? ''
          return {
            date: w.date,
            maxC,
            minC,
            desc,
            icon: iconForWeather(desc, parseInt(maxC)),
            isToday: w.date === today,
            tripLabel: TRIP_DAY_LABELS[w.date] ?? null,
          }
        })
        setForecasts(parsed)
        // Record time for freshness indicator
        const now = new Date(Date.now() + 7 * 3_600_000)
        setFetchedAt(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-700">🌤️ 富国岛天气预报</span>
          {forecasts.some(f => f.tripLabel) && (
            <span className="text-[10px] bg-ocean-50 text-ocean-600 border border-ocean-100 px-2 py-0.5 rounded-full font-medium">
              含行程日期
            </span>
          )}
        </div>
        <span className="text-[10px] text-stone-400">
          {fetchedAt ? `实时数据 · 更新于 ${fetchedAt}（越南时间）` : 'wttr.in 实时数据'}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-32 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : forecasts.length === 0 ? (
        <div className="bg-white border border-stone-100 rounded-2xl p-4 text-center text-stone-400 text-sm">
          天气数据暂时无法加载，请稍后刷新
        </div>
      ) : (
        <div className={`grid gap-3 ${forecasts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {forecasts.map(fc => (
            <div
              key={fc.date}
              className={`rounded-2xl p-3 text-center transition-all ${
                fc.isToday
                  ? 'bg-ocean-600 text-white shadow-md ring-2 ring-ocean-400'
                  : fc.tripLabel
                  ? 'bg-ocean-50 border border-ocean-100 shadow-sm'
                  : 'bg-white border border-stone-100 shadow-sm'
              }`}
            >
              {/* Label row */}
              <div className="mb-1.5">
                {fc.tripLabel ? (
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${
                    fc.isToday ? 'text-ocean-200' : 'text-ocean-600'
                  }`}>
                    {fc.tripLabel}
                  </p>
                ) : (
                  <p className={`text-[10px] font-medium ${fc.isToday ? 'text-ocean-200' : 'text-stone-400'}`}>
                    {fc.isToday ? '今天' : formatDateLabel(fc.date)}
                  </p>
                )}
                {/* Show actual date under trip label */}
                {fc.tripLabel && (
                  <p className={`text-[10px] ${fc.isToday ? 'text-ocean-200' : 'text-stone-400'}`}>
                    {formatDateLabel(fc.date)}
                  </p>
                )}
              </div>

              {/* Icon */}
              <p className="text-2xl mb-1.5">{fc.icon}</p>

              {/* Temp */}
              <p className={`font-bold text-sm leading-none ${fc.isToday ? 'text-white' : fc.tripLabel ? 'text-ocean-800' : 'text-stone-800'}`}>
                {fc.maxC}°
                <span className={`font-normal text-xs ml-1 ${fc.isToday ? 'text-ocean-200' : 'text-stone-400'}`}>
                  / {fc.minC}°
                </span>
              </p>

              {/* Condition */}
              <p className={`text-[10px] mt-1 leading-tight ${fc.isToday ? 'text-ocean-100' : 'text-stone-400'}`}>
                {fc.desc || '—'}
              </p>

              {/* Today badge */}
              {fc.isToday && (
                <div className="mt-2 bg-white/20 rounded-full px-2 py-0.5 inline-block">
                  <span className="text-[10px] text-white font-semibold">今天</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
