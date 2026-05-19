'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, MapPin, User, Heart, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/destination', label: '地域介绍' },
  { href: '/itinerary', label: '行程攻略' },
  { href: '/practical', label: '出发前关注' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    setMobileOpen(false)
  }

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
              <div className="w-8 h-8 rounded-full bg-ocean-600 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-ocean-900 hidden sm:block">
                富国岛旅行指南
              </span>
              <span className="font-display font-bold text-lg text-ocean-900 sm:hidden">
                富国岛
              </span>
            </Link>

            {/* Desktop Nav */}
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
                    <span className="hidden sm:block">{user.user_metadata?.name?.split(' ')[0] ?? '我的'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors hidden md:flex"
                    title="退出登录"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-ocean-600 text-white text-sm font-medium hover:bg-ocean-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Google 登录</span>
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="打开菜单"
              >
                {mobileOpen ? <X className="w-6 h-6 text-stone-700" /> : <Menu className="w-6 h-6 text-stone-700" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in panel from right */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-ocean-600 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-bold text-stone-900">富国岛旅行指南</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-3.5 rounded-2xl text-base font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-ocean-600 text-white'
                      : 'text-stone-700 hover:bg-ocean-50 hover:text-ocean-700'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3.5 rounded-2xl text-base font-medium transition-colors',
                  pathname === '/profile'
                    ? 'bg-ocean-600 text-white'
                    : 'text-stone-700 hover:bg-ocean-50 hover:text-ocean-700'
                )}
              >
                <Heart className="w-4 h-4" />
                我的收藏 & 日程
              </Link>
            </nav>

            {/* Bottom auth section */}
            <div className="px-4 py-4 border-t border-stone-100">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-2xl">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} className="w-9 h-9 rounded-full" alt="" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-ocean-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-ocean-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-800 text-sm truncate">
                        {user.user_metadata?.name ?? user.email}
                      </p>
                      <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-stone-600 hover:bg-stone-100 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-ocean-600 text-white text-base font-medium hover:bg-ocean-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Google 登录
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
