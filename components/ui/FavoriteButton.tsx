'use client'

import { useState, useEffect } from 'react'
import { Heart, CheckCircle } from 'lucide-react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { toggleFavoriteDb, isFavoriteDb } from '@/lib/supabase/db'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import LoginModal from '@/components/auth/LoginModal'

function FavoriteToast({ visible }: { visible: boolean }) {
  if (typeof window === 'undefined') return null
  return createPortal(
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      )}
    >
      <div className="flex items-center gap-3 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm whitespace-nowrap">
        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>已收藏！可在</span>
        <Link href="/profile" className="font-semibold text-ocean-300 hover:text-ocean-200 underline underline-offset-2">
          个人中心
        </Link>
        <span>查看</span>
      </div>
    </div>,
    document.body
  )
}

export default function FavoriteButton({
  attractionId,
  contentType = 'attraction',
  contentId,
  className,
}: {
  attractionId?: string
  contentType?: string
  contentId?: string
  className?: string
}) {
  const id = contentId ?? attractionId ?? ''
  const [faved, setFaved] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!id || !user) return
    isFavoriteDb(user.id, contentType, id).then(setFaved)
  }, [id, user, contentType])

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      setShowLogin(true)
      return
    }
    const newState = await toggleFavoriteDb(user.id, contentType, id)
    setFaved(newState)
    if (newState) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center transition-all',
          faved ? 'bg-rose-500 text-white shadow-md' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/40',
          className
        )}
        title={faved ? '取消收藏' : '收藏'}
      >
        <Heart className={cn('w-4 h-4', faved && 'fill-white')} />
      </button>
      <FavoriteToast visible={showToast} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
