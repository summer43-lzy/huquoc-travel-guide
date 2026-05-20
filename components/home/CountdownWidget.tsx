'use client'

import { useEffect, useState } from 'react'
import { Sun, MapPin, ExternalLink, ChevronRight } from 'lucide-react'
import { tripData } from '@/data/itinerary'

const TRIP_START = new Date('2026-06-05T00:00:00+08:00')
const TRIP_END   = new Date('2026-06-08T23:59:59+08:00')

interface WttrData {
  temp: string
  condition: string
  icon: string
}

function useWeather() {
  const [data, setData] = useState<WttrData | null>(null)
  useEffect(() => {
    fetch('https://wttr.in/Phu+Quoc?format=j1')
      .then(r => r.json())
      .then(json => {
        const cur = json.current_condition?.[0]
        if (!cur) return
        setData({
          temp: cur.temp_C,
          condition: cur.weatherDesc?.[0]?.value ?? '',
          icon: parseInt(cur.temp_C) >= 30 ? '☀️' : parseInt(cur.temp_C) >= 26 ? '⛅' : '🌦️',
        })
      })
      .catch(() => {})
  }, [])
  return data
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])
  return now
}

function getDiff(target: Date, now: Date) {
  const ms = target.getTime() - now.getTime()
  if (ms <= 0) return { days: 0, hours: 0 }
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
  }
}

function getTripDay(now: Date): number | null {
  if (now < TRIP_START || now > TRIP_END) return null
  return Math.floor((now.getTime() - TRIP_START.getTime()) / 86_400_000) + 1
}

export default function CountdownWidget() {
  const now = useNow()
  const weather = useWeather()
  const tripDay = getTripDay(now)
  const isBefore = now < TRIP_START
  const isAfter  = now > TRIP_END

  // ── After trip ──
  if (isAfter) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl p-5 text-center">
          <p className="text-2xl mb-1">🌅</p>
          <p className="font-display font-bold text-stone-700 text-lg">美好旅程已圆满结束</p>
          <p className="text-stone-500 text-sm mt-1">感谢每一位团队成员，期待下次出发</p>
        </div>
      </div>
    )
  }

  // ── During trip — full today dashboard ──
  if (tripDay !== null) {
    const day = tripData.days.find(d => d.day === tripDay)
    const firstAttraction = day?.attractions[0]
    const mapsUrl = firstAttraction?.location
      ? `https://maps.google.com/?q=${firstAttraction.location.lat},${firstAttraction.location.lng}`
      : null

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <div className="bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-2xl overflow-hidden text-white">
          {/* Header row */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/20">
            <div>
              <p className="text-ocean-200 text-xs font-medium uppercase tracking-widest">行程进行中</p>
              <p className="font-display font-bold text-2xl mt-0.5">
                今天是 Day {tripDay}
                <span className="text-ocean-200 text-sm font-normal ml-2">共 4 天</span>
              </p>
              {day && <p className="text-ocean-100 text-sm mt-0.5">{day.title}</p>}
            </div>
            {weather && (
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 flex-shrink-0">
                <span className="text-2xl">{weather.icon}</span>
                <div>
                  <p className="font-bold text-lg leading-none">{weather.temp}°C</p>
                  <p className="text-ocean-200 text-[10px] mt-0.5">富国岛实时</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Today's bullets */}
            {day?.bullets && (
              <div>
                <p className="text-ocean-200 text-[10px] font-semibold uppercase tracking-wider mb-2">今日行程</p>
                <ul className="space-y-1.5">
                  {day.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-white/90 leading-snug">
                      {b.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {/* Essentials */}
              {day?.essentials && (
                <div>
                  <p className="text-ocean-200 text-[10px] font-semibold uppercase tracking-wider mb-2">今日必带</p>
                  <div className="flex flex-wrap gap-1.5">
                    {day.essentials.map((e, i) => (
                      <span key={i} className="bg-white/15 rounded-full px-2.5 py-1 text-xs text-white/90">{e}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`/itinerary#day-${tripDay}`}
                  className="inline-flex items-center gap-1.5 bg-white text-ocean-700 rounded-full px-4 py-2 text-sm font-semibold hover:bg-ocean-50 transition-colors"
                >
                  查看今日行程 <ChevronRight className="w-3.5 h-3.5" />
                </a>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    导航到第一站
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Before trip ──
  const { days, hours } = getDiff(TRIP_START, now)
  const day1 = tripData.days.find(d => d.day === 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
      <div className="bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-2xl overflow-hidden text-white">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/20">
          <div>
            <p className="text-ocean-200 text-xs font-medium uppercase tracking-widest">行程预览</p>
            <p className="font-display font-bold text-2xl mt-0.5">
              Day 1 · 出发日
              <span className="text-ocean-200 text-sm font-normal ml-2">6月5日</span>
            </p>
            {day1 && <p className="text-ocean-100 text-sm mt-0.5">{day1.title}</p>}
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            {/* Countdown badge */}
            <div className="flex items-baseline gap-1.5 bg-white/15 rounded-xl px-3 py-2 justify-center">
              <span className="font-display font-bold text-lg leading-none">{days}</span>
              <span className="text-ocean-200 text-xs">天</span>
              <span className="font-display font-bold text-base leading-none">{hours}</span>
              <span className="text-ocean-200 text-xs">小时</span>
            </div>
            {/* Weather card */}
            {weather ? (
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
                <span className="text-2xl">{weather.icon}</span>
                <div>
                  <p className="font-bold text-lg leading-none">{weather.temp}°C</p>
                  <p className="text-ocean-200 text-[10px] mt-0.5">富国岛实时</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
                <Sun className="w-6 h-6 text-sand-300" />
                <p className="text-ocean-200 text-xs">天气加载中…</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Day 1 bullets */}
          {day1?.bullets && (
            <div>
              <p className="text-ocean-200 text-[10px] font-semibold uppercase tracking-wider mb-2">今日行程</p>
              <ul className="space-y-1.5">
                {day1.bullets.map((b, i) => (
                  <li key={i} className="text-sm text-white/90 leading-snug">
                    {b.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            {/* Essentials */}
            {day1?.essentials && (
              <div>
                <p className="text-ocean-200 text-[10px] font-semibold uppercase tracking-wider mb-2">今日必带</p>
                <div className="flex flex-wrap gap-1.5">
                  {day1.essentials.map((e, i) => (
                    <span key={i} className="bg-white/15 rounded-full px-2.5 py-1 text-xs text-white/90">{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick link */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="/itinerary#day-1"
                className="inline-flex items-center gap-1.5 bg-white text-ocean-700 rounded-full px-4 py-2 text-sm font-semibold hover:bg-ocean-50 transition-colors"
              >
                查看完整行程 <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
