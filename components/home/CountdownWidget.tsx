'use client'

import { useEffect, useState } from 'react'
import { Cloud, Sun, Droplets } from 'lucide-react'

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
      .catch(() => {/* silent fail */})
  }, [])

  return data
}

function useCountdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return now
}

function getDiff(target: Date, now: Date) {
  const ms = target.getTime() - now.getTime()
  if (ms <= 0) return { days: 0, hours: 0, negative: true }
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    negative: false,
  }
}

function getTripDay(now: Date): number | null {
  if (now < TRIP_START || now > TRIP_END) return null
  return Math.floor((now.getTime() - TRIP_START.getTime()) / 86_400_000) + 1
}

export default function CountdownWidget() {
  const now = useCountdown()
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

  // ── During trip ──
  if (tripDay !== null) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <div className="bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-2xl p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-ocean-200 text-xs font-medium uppercase tracking-widest mb-1">行程进行中</p>
              <p className="font-display font-bold text-2xl">
                今天是 Day {tripDay}
                <span className="text-ocean-200 text-base font-normal ml-2">共 4 天</span>
              </p>
              <a href="/itinerary#day-1" className="mt-2 inline-block text-sm text-ocean-100 hover:text-white underline underline-offset-2">
                查看今日行程 →
              </a>
            </div>
            {weather && (
              <div className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3 flex-shrink-0">
                <span className="text-3xl">{weather.icon}</span>
                <div>
                  <p className="font-bold text-xl">{weather.temp}°C</p>
                  <p className="text-ocean-100 text-xs">{weather.condition}</p>
                  <p className="text-ocean-200 text-[10px]">富国岛实时</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Before trip ──
  const { days, hours } = getDiff(TRIP_START, now)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
      <div className="bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-2xl p-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-ocean-200 text-xs font-medium uppercase tracking-widest mb-1">距出发还有</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-4xl">{days}</span>
              <span className="text-ocean-200 text-lg">天</span>
              <span className="font-display font-bold text-2xl">{hours}</span>
              <span className="text-ocean-200">小时</span>
            </div>
            <p className="text-ocean-200 text-sm mt-1">2026年6月5日 · 富国拉菲斯塔·希尔顿</p>
          </div>
          {weather ? (
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3 flex-shrink-0">
              <span className="text-3xl">{weather.icon}</span>
              <div>
                <p className="font-bold text-xl">{weather.temp}°C</p>
                <p className="text-ocean-100 text-xs">{weather.condition}</p>
                <p className="text-ocean-200 text-[10px]">富国岛当前天气</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3 flex-shrink-0">
              <Sun className="w-8 h-8 text-sand-300" />
              <div>
                <p className="text-ocean-200 text-xs">天气加载中…</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
