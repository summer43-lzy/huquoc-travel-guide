import MemoriesWall from '@/components/memories/MemoriesWall'
import { AllPublicJournals } from '@/components/ui/PublicJournals'
import { BookOpen } from 'lucide-react'

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
          alt="旅行回忆"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/40 to-ocean-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-ocean-200 text-sm font-medium tracking-widest uppercase mb-2">Trip Memories</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">旅行回忆</h1>
          <p className="text-white/70 text-sm max-w-sm">用图片记录我们在富国岛的每一个精彩瞬间</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <MemoriesWall />

        {/* Public journals section */}
        <div className="mt-12 border-t border-stone-200 pt-10">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-ocean-500" />
            <h2 className="font-display text-2xl font-bold text-stone-900">旅行者游记</h2>
            <span className="text-stone-400 text-sm ml-1">· 公开分享的旅行故事</span>
          </div>
          <AllPublicJournals />
        </div>
      </div>
    </div>
  )
}
