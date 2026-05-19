'use client'

import { useEffect, useState } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react'

interface WeatherData {
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  desc: string
  code: number
}

// wttr.in free public weather API — no key required
async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const res = await fetch('https://wttr.in/Phu+Quoc,Vietnam?format=j1', { next: { revalidate: 3600 } })
    const data = await res.json()
    const cur = data.current_condition[0]
    return {
      temp: parseInt(cur.temp_C),
      feelsLike: parseInt(cur.FeelsLikeC),
      humidity: parseInt(cur.humidity),
      windSpeed: parseInt(cur.windspeedKmph),
      desc: cur.lang_zh?.[0]?.value ?? cur.weatherDesc[0].value,
      code: parseInt(cur.weatherCode),
    }
  } catch {
    return null
  }
}

function WeatherIcon({ code, className }: { code: number; className?: string }) {
  if (code <= 116) return <Sun className={className} />
  if (code <= 260) return <Cloud className={className} />
  return <CloudRain className={className} />
}

const monthlyRef = [
  { month: '1月', rain: '低', temp: '27°C', note: '旱季极佳' },
  { month: '2月', rain: '低', temp: '28°C', note: '旱季极佳' },
  { month: '3月', rain: '低', temp: '29°C', note: '旱季极佳' },
  { month: '4月', rain: '中', temp: '30°C', note: '旱季末期' },
  { month: '5月', rain: '高', temp: '29°C', note: '雨季开始' },
  { month: '6月', rain: '高', temp: '28°C', note: '⛅ 本次出行' },
  { month: '7月', rain: '高', temp: '28°C', note: '雨季' },
  { month: '8月', rain: '高', temp: '28°C', note: '雨季' },
  { month: '9月', rain: '高', temp: '27°C', note: '雨季' },
  { month: '10月', rain: '高', temp: '27°C', note: '雨季末期' },
  { month: '11月', rain: '中', temp: '27°C', note: '旱季开始' },
  { month: '12月', rain: '低', temp: '27°C', note: '旱季极佳' },
]

const rainColor: Record<string, string> = {
  低: 'text-emerald-600 bg-emerald-50',
  中: 'text-amber-600 bg-amber-50',
  高: 'text-rose-600 bg-rose-50',
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeather().then(d => {
      setWeather(d)
      setLoading(false)
    })
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-stone-900">天气参考</h3>
          <p className="text-xs text-stone-400 mt-0.5">富国岛实时 & 月份参考</p>
        </div>
        <span className="text-2xl">🌤️</span>
      </div>

      {/* Live weather */}
      <div className="bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-2xl p-4 text-white mb-4">
        {loading ? (
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            加载实时天气…
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ocean-100 text-xs mb-1">富国岛 · 当前天气</p>
              <div className="flex items-end gap-2">
                <span className="font-display text-5xl font-bold">{weather.temp}°</span>
                <span className="text-ocean-200 text-sm mb-1.5">{weather.desc}</span>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-ocean-100">
                <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />体感 {weather.feelsLike}°</span>
                <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />湿度 {weather.humidity}%</span>
                <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{weather.windSpeed} km/h</span>
              </div>
            </div>
            <WeatherIcon code={weather.code} className="w-14 h-14 text-white/80" />
          </div>
        ) : (
          <p className="text-white/60 text-sm">天气加载失败，请检查网络</p>
        )}
      </div>

      {/* 6月出行提示 */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
        <p className="text-xs font-semibold text-amber-700 mb-1">☁️ 6月出行须知</p>
        <p className="text-xs text-stone-600 leading-relaxed">
          6月属于雨季，多为午后短暂阵雨，早上通常晴朗。建议<strong>上午安排户外活动</strong>，下午备好雨衣。气温约27–30°C，体感较热，防晒必备。
        </p>
      </div>

      {/* Monthly reference */}
      <div>
        <p className="text-xs font-semibold text-stone-500 mb-2">全年天气概览</p>
        <div className="grid grid-cols-4 gap-1.5">
          {monthlyRef.map(m => (
            <div
              key={m.month}
              className={`rounded-xl p-2 text-center ${m.month === '6月' ? 'bg-ocean-50 border border-ocean-200' : 'bg-stone-50'}`}
            >
              <p className="text-xs font-semibold text-stone-600">{m.month}</p>
              <p className="text-xs text-stone-500">{m.temp}</p>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${rainColor[m.rain]}`}>
                {m.rain}雨
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
