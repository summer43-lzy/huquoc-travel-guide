'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { getRating, setRating } from '@/lib/localStorage'

export default function AttractionRating({ attractionId }: { attractionId: string }) {
  const [rating, setRatingState] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    setRatingState(getRating(attractionId))
  }, [attractionId])

  function handleRate(score: number) {
    setRating(attractionId, score)
    setRatingState(score)
  }

  const displayed = hover ?? rating

  return (
    <div className="flex items-center gap-0.5" title={rating ? `我的评分: ${rating}星` : '点击评分'}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          onClick={() => handleRate(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(null)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`评 ${s} 星`}
        >
          <Star
            className="w-4 h-4"
            fill={displayed !== null && s <= displayed ? '#f59e0b' : 'none'}
            stroke={displayed !== null && s <= displayed ? '#f59e0b' : '#d1d5db'}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {rating && (
        <span className="ml-1 text-xs text-stone-400">我的评分</span>
      )}
    </div>
  )
}
