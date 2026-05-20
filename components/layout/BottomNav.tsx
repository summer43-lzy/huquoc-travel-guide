'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, Globe, Info, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/',            label: '首页',   Icon: Home },
  { href: '/itinerary',   label: '行程',   Icon: CalendarDays },
  { href: '/destination', label: '目的地', Icon: Globe },
  { href: '/practical',   label: '出发前', Icon: Info },
  { href: '/memories',    label: '回忆',   Icon: Camera },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-stone-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex h-16">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                active ? 'text-ocean-600' : 'text-stone-400 active:text-stone-600'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'stroke-[2.5]')} />
              <span className={cn('text-[10px] leading-tight font-medium', active && 'font-semibold')}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-ocean-600 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
