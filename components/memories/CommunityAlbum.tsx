'use client'

import { useState, useEffect } from 'react'
import { Heart, Download, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  getPublicPhotos, getPhotoLikeCounts, getUserLikedPhotos, togglePhotoLike, type Photo,
} from '@/lib/supabase/db'
import PhotoLightbox from '@/components/ui/PhotoLightbox'

const DAY_LABELS: Record<number, string> = {
  1: 'Day 1 · 6月5日',
  2: 'Day 2 · 6月6日',
  3: 'Day 3 · 6月7日',
  4: 'Day 4 · 6月8日',
}

function PhotoCard({
  photo,
  likeCount,
  liked,
  onToggleLike,
  onClick,
}: {
  photo: Photo
  likeCount: number
  liked: boolean
  onToggleLike: (id: string) => void
  onClick: () => void
}) {
  const [imgError, setImgError] = useState(false)

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation()
    const a = document.createElement('a')
    a.href = photo.url
    a.download = `phuquoc-${photo.id}.jpg`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-white border border-stone-100 shadow-sm">
      <button
        className="w-full aspect-square bg-stone-100 overflow-hidden block"
        onClick={onClick}
        aria-label="查看大图"
      >
        {!imgError ? (
          <img
            src={photo.url}
            alt={photo.caption || '旅行照片'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-xs">图片无法加载</p>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
          title="下载照片"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </button>

      <div className="p-3">
        {photo.day && (
          <span className="inline-block bg-ocean-50 text-ocean-700 rounded-full px-2 py-0.5 text-xs font-medium mb-1">
            {DAY_LABELS[photo.day] ?? `Day ${photo.day}`}
          </span>
        )}
        {photo.caption && (
          <p className="text-stone-700 text-xs leading-relaxed line-clamp-2 mb-2">{photo.caption}</p>
        )}
        <button
          onClick={() => onToggleLike(photo.id)}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            liked ? 'text-rose-500' : 'text-stone-400 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
          {likeCount > 0 ? likeCount : '点赞'}
        </button>
      </div>
    </div>
  )
}

export default function CommunityAlbum() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [filterDay, setFilterDay] = useState<number | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      setUserId(user?.id ?? null)

      const list = await getPublicPhotos()
      setPhotos(list)

      if (list.length > 0) {
        const ids = list.map(p => p.id)
        const [counts, liked] = await Promise.all([
          getPhotoLikeCounts(ids),
          user ? getUserLikedPhotos(user.id, ids) : Promise.resolve(new Set<string>()),
        ])
        setLikeCounts(counts)
        setLikedSet(liked)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleToggleLike(photoId: string) {
    if (!userId) return
    const wasLiked = likedSet.has(photoId)
    setLikedSet(prev => {
      const next = new Set(prev)
      wasLiked ? next.delete(photoId) : next.add(photoId)
      return next
    })
    setLikeCounts(prev => ({
      ...prev,
      [photoId]: Math.max(0, (prev[photoId] ?? 0) + (wasLiked ? -1 : 1)),
    }))
    await togglePhotoLike(userId, photoId)
  }

  const filtered = filterDay === 'all' ? photos : photos.filter(p => p.day === filterDay)
  const days = Array.from(new Set(photos.map(p => p.day).filter(Boolean))).sort() as number[]

  if (loading) {
    return (
      <div className="py-12 text-center text-stone-400 text-sm">加载中...</div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-stone-100">
        <div className="text-5xl mb-3">🌏</div>
        <p className="text-stone-500 text-sm">还没有公开照片，上传照片时选择"分享到公共相册"即可</p>
      </div>
    )
  }

  return (
    <div>
      {/* Day filter */}
      {days.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          <button
            onClick={() => setFilterDay('all')}
            className={[
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              filterDay === 'all'
                ? 'bg-ocean-600 text-white border-ocean-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300',
            ].join(' ')}
          >
            全部 ({photos.length})
          </button>
          {days.map(d => (
            <button
              key={d}
              onClick={() => setFilterDay(d)}
              className={[
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                filterDay === d
                  ? 'bg-ocean-600 text-white border-ocean-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300',
              ].join(' ')}
            >
              {DAY_LABELS[d] ?? `Day ${d}`}
            </button>
          ))}
        </div>
      )}

      {!userId && (
        <p className="text-xs text-stone-400 mb-4">登录后可点赞照片</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            likeCount={likeCounts[photo.id] ?? 0}
            liked={likedSet.has(photo.id)}
            onToggleLike={handleToggleLike}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={filtered.map(p => ({
            url: p.url,
            caption: p.caption ?? undefined,
            dayLabel: p.day ? (DAY_LABELS[p.day] ?? `Day ${p.day}`) : undefined,
          }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </div>
  )
}
