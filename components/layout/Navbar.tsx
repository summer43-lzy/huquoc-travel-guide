'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, MapPin, User, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/destination', label: '目的地' },
  { href: '/itinerary', label: '行程攻略' },
  { href: '/practical', label: '实用信息' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
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
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-ocean-600 text-white text-sm font-medium hover:bg-ocean-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">登录</span>
            </Link>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-stone-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-ocean-600 text-white'
                  : 'text-stone-600 hover:bg-ocean-50 hover:text-ocean-700'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
