'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { getRating, setRating } from '@/lib/localStorage'
import { getUserRating, setRatingDb, getAggregateRating } from '@/lib/supabase/db'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function AttractionRating({
  attractionId,
  contentType = 'attraction',
  contentId,
}: {
  attractionId?: string
  contentType?: string
  contentId?: string
}) {
  const id = contentId ?? attractionId ?? ''
  const [myRating, setMyRating] = useState<number | null>(null)
  const [aggregate, setAggregate] = useState<{ avg: number; count: number } | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!id) return
    if (user) {
      getUserRating(user.id, contentType, id).then(setMyRating)
    } else {
      setMyRating(getRating(id))
    }
    getAggregateRating(contentType, id).then(setAggregate)
  }, [id, user, contentType])

  async function handleRate(score: number) {
    if (user) {
      await setRatingDb(user.id, contentType, id, score)
      const agg = await getAggregateRating(contentType, id)
      setAggregate(agg)
    } else {
      setRating(id, score)
    }
    setMyRating(score)
  }

  const displayed = hover ?? myRating

  return (
    <div className="space-y-1">
      {aggregate && aggregate.count > 0 && (
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
          <span className="font-medium text-stone-600">{aggregate.avg}</span>
          <span>({aggregate.count}人评分)</span>
        </div>
      )}
      <div className="flex items-center gap-0.5" title={myRating ? `我的评分: ${myRating}星` : '点击评分'}>
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
        {myRating && <span className="ml-1 text-xs text-stone-400">我的评分</span>}
        {!user && !myRating && <span className="ml-1 text-xs text-stone-300">登录后可评分</span>}
      </div>
    </div>
  )
}
