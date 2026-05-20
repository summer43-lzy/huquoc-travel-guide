'use client'

import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export interface LightboxPhoto {
  url: string
  caption?: string
  dayLabel?: string
}

interface Props {
  photos: LightboxPhoto[]
  index: number
  onClose: () => void
  onNav: (index: number) => void
}

export default function PhotoLightbox({ photos, index, onClose, onNav }: Props) {
  const photo = photos[index]
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1

  const prev = useCallback(() => { if (hasPrev) onNav(index - 1) }, [hasPrev, index, onNav])
  const next = useCallback(() => { if (hasNext) onNav(index + 1) }, [hasNext, index, onNav])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  // Touch swipe
  let touchStartX = 0
  function onTouchStart(e: React.TouchEvent) { touchStartX = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX
    if (dx > 60) prev()
    else if (dx < -60) next()
  }

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {photos.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {index + 1} / {photos.length}
        </div>
      )}

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-3 sm:left-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <img
        src={photo.url}
        alt={photo.caption || '旅行照片'}
        className="max-h-[80vh] max-w-[92vw] sm:max-w-[80vw] object-contain rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
        draggable={false}
      />

      {/* Next */}
      {hasNext && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-3 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Caption */}
      {(photo.caption || photo.dayLabel) && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center px-4">
          {photo.dayLabel && (
            <span className="inline-block bg-ocean-600/80 text-white rounded-full px-3 py-0.5 text-xs mb-1.5">
              {photo.dayLabel}
            </span>
          )}
          {photo.caption && (
            <p className="text-white/90 text-sm max-w-sm">{photo.caption}</p>
          )}
        </div>
      )}

      {/* Thumbnail strip for multi-photo */}
      {photos.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 pb-2 pt-2 bg-gradient-to-t from-black/60 to-transparent overflow-x-auto px-4">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); onNav(i) }}
              className={`flex-shrink-0 w-10 h-10 rounded-md overflow-hidden border-2 transition-all ${
                i === index ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-75'
              }`}
            >
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
