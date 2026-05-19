import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="hidden md:block bg-ocean-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">富国岛旅行指南</span>
            </div>
            <p className="text-ocean-200 text-sm leading-relaxed">
              团队专属旅行指南，记录我们在越南富国岛最美好的时光。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-ocean-100">快速导航</h3>
            <ul className="space-y-2 text-sm text-ocean-200">
              <li><Link href="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link href="/destination" className="hover:text-white transition-colors">地域介绍</Link></li>
              <li><Link href="/itinerary" className="hover:text-white transition-colors">行程攻略</Link></li>
              <li><Link href="/practical" className="hover:text-white transition-colors">出发前关注</Link></li>
              <li><Link href="/memories" className="hover:text-white transition-colors">旅行回忆</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-ocean-100">旅行信息</h3>
            <ul className="space-y-2 text-sm text-ocean-200">
              <li>目的地：越南 · 富国岛</li>
              <li>出发日期：2026年6月5日</li>
              <li>行程天数：4天3晚</li>
              <li>团队人数：10人</li>
              <li>住宿：富国拉菲斯塔-希尔顿格芮精选酒店</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ocean-800 mt-8 pt-8 text-center text-ocean-300 text-sm">
          © 2026 富国岛旅行指南 · 仅供团队内部使用
        </div>
      </div>
    </footer>
  )
}
