'use client'

import { useEffect, useRef, useState } from 'react'
import { Attraction } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  beach:         '#0ea5e9',
  scenic:        '#22c55e',
  activity:      '#8b5cf6',
  restaurant:    '#f97316',
  accommodation: '#3b82f6',
  shopping:      '#ec4899',
}

const CATEGORY_EMOJI: Record<string, string> = {
  beach:         '🏖',
  scenic:        '🏛',
  activity:      '🎡',
  restaurant:    '🍜',
  accommodation: '🏨',
  shopping:      '🛍',
}

interface Props {
  attractions: Attraction[]
  onSelectAttraction?: (a: Attraction) => void
}

export default function InteractiveMap({ attractions, onSelectAttraction }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapError, setMapError] = useState(false)
  const [selected, setSelected] = useState<Attraction | null>(null)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || token.includes('placeholder') || !mapContainer.current) {
      setMapError(true)
      return
    }

    import('mapbox-gl').then(mapboxgl => {
      mapboxgl.default.accessToken = token

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [103.9700, 10.2200],
        zoom: 10.5,
      })

      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right')

      map.current.on('load', () => {
        attractions.forEach(attraction => {
          const el = document.createElement('div')
          el.className = 'mapbox-marker'
          el.style.cssText = `
            width: 36px; height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${CATEGORY_COLORS[attraction.category] ?? '#64748b'};
            border: 2.5px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
          `
          const inner = document.createElement('div')
          inner.style.cssText = 'transform: rotate(45deg); font-size: 14px; line-height: 1;'
          inner.textContent = CATEGORY_EMOJI[attraction.category] ?? '📍'
          el.appendChild(inner)

          el.addEventListener('click', () => {
            setSelected(attraction)
            onSelectAttraction?.(attraction)
          })

          new mapboxgl.default.Marker({ element: el })
            .setLngLat([attraction.location.lng, attraction.location.lat])
            .addTo(map.current!)
        })
      })
    }).catch(() => setMapError(true))

    return () => {
      map.current?.remove()
    }
  }, [attractions])

  if (mapError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-ocean-50 rounded-2xl border-2 border-dashed border-ocean-200 p-8 text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-ocean-700 font-semibold mb-2">交互式地图</p>
        <p className="text-stone-500 text-sm max-w-sm">
          配置 Mapbox Token 后即可显示交互式地图。
          请在 <code className="bg-stone-100 px-1 rounded">.env.local</code> 中设置{' '}
          <code className="bg-stone-100 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code>
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-sm text-left">
          {attractions.slice(0, 6).map(a => (
            <button
              key={a.id}
              onClick={() => { setSelected(a); onSelectAttraction?.(a) }}
              className="flex items-center gap-2 bg-white rounded-xl p-2.5 text-sm border border-stone-100 hover:border-ocean-300 hover:shadow-sm transition-all"
            >
              <span className="text-lg">{CATEGORY_EMOJI[a.category]}</span>
              <span className="text-stone-700 truncate text-xs font-medium">{a.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Popup */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100 z-10">
          <div className="relative h-32">
            <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 image-overlay" />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 text-white text-sm flex items-center justify-center hover:bg-black/50"
            >
              ×
            </button>
            <div className="absolute bottom-2 left-3 text-white">
              <p className="font-display font-bold text-sm">{selected.name}</p>
            </div>
          </div>
          <div className="p-3">
            <p className="text-stone-500 text-xs line-clamp-2">{selected.description}</p>
            {selected.price && (
              <p className="text-xs text-emerald-600 font-medium mt-2">{selected.price}</p>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl p-2.5 shadow-sm border border-stone-100 z-10">
        {Object.entries(CATEGORY_EMOJI).slice(0, 5).map(([cat, emoji]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-stone-600 py-0.5">
            <span>{emoji}</span>
            <span style={{ color: CATEGORY_COLORS[cat] }} className="font-medium">
              {{ beach: '海滩', scenic: '景点', activity: '活动', restaurant: '餐厅', shopping: '购物' }[cat]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
