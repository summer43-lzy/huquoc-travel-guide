'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MapPin, User, Heart, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import LoginModal from '@/components/auth/LoginModal'
import ShareButton from '@/components/ui/ShareButton'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/itinerary', label: '行程攻略' },
  { href: '/destination', label: '地域介绍' },
  { href: '/practical', label: '出发前关注' },
  { href: '/memories', label: '旅行回忆' },
  { href: '/expense', label: '记账' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  function handleSignIn() {
    setShowLogin(true)
  }

  return (
    <>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-ocean-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-ocean-900">
              富国岛旅行指南
            </span>
          </Link>

          {/* Desktop Nav — hidden on mobile (bottom nav handles it) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-ocean-600 text-white'
                    : 'text-stone-600 hover:text-ocean-700 hover:bg-ocean-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ShareButton
              label=""
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-stone-600 hover:text-ocean-700 hover:bg-ocean-50 transition-colors"
            />
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-stone-600 hover:text-ocean-700 hover:bg-ocean-50 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:block">收藏</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-ocean-600 text-white text-sm font-medium hover:bg-ocean-700 transition-colors"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-5 h-5 rounded-full" alt="" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="hidden sm:block">
                    {user.user_metadata?.name?.split(' ')[0] ?? '我的'} · 个人中心
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden md:flex p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-ocean-600 text-white text-sm font-medium hover:bg-ocean-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">登录</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
