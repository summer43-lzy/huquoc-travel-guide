'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toggleFavorite, isFavorite } from '@/lib/localStorage'
import { cn } from '@/lib/utils'

export default function FavoriteButton({
  attractionId,
  className,
}: {
  attractionId: string
  className?: string
}) {
  const [faved, setFaved] = useState(false)

  useEffect(() => {
    setFaved(isFavorite(attractionId))
  }, [attractionId])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const newState = toggleFavorite(attractionId)
    setFaved(newState)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center transition-all',
        faved
          ? 'bg-rose-500 text-white shadow-md'
          : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/40',
        className
      )}
      title={faved ? '取消收藏' : '收藏'}
    >
      <Heart className={cn('w-4 h-4', faved && 'fill-white')} />
    </button>
  )
}
