import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import Footer from '@/components/layout/Footer'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import PwaInstallPrompt from '@/components/ui/PwaInstallPrompt'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '富国岛旅行指南',
  description: '团队专属富国岛旅行指南 — 行程攻略、景点推荐、实用信息一站汇聚',
  manifest: '/huquoc-travel-guide/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '富国岛',
  },
  icons: {
    apple: '/huquoc-travel-guide/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0369a1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <ServiceWorkerRegister />
        <PwaInstallPrompt />
        <Navbar />
        <main className="flex-1 pt-16 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}
