import { Heart, Calendar, User, LogOut, Star } from 'lucide-react'
import LoginButton from '@/components/profile/LoginButton'
import TripCalendar from '@/components/profile/TripCalendar'
import { attractions } from '@/data/attractions'
import CategoryBadge from '@/components/ui/CategoryBadge'
import StarRating from '@/components/ui/StarRating'

// Demo: show first 4 attractions as mock favorites
const mockFavorites = attractions.slice(0, 4)

export default function ProfilePage() {
  const isLoggedIn = false // Will be replaced with actual Supabase auth check

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-ocean-100 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-ocean-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-3">登录解锁个人功能</h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            登录后即可收藏喜欢的行程，拖拽排入个人日历，规划专属旅程。
          </p>
          <div className="flex justify-center">
            <LoginButton />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '❤️', text: '收藏景点' },
              { icon: '📅', text: '拖拽排程' },
              { icon: '💬', text: '添加贴士' },
            ].map(f => (
              <div key={f.text} className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-xs text-stone-500">{f.text}</p>
              </div>
            ))}
          </div>

          {/* Demo preview */}
          <div className="mt-10 bg-white rounded-2xl border border-stone-100 shadow-sm p-5 text-left">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-3 font-medium">预览效果</p>
            <div className="space-y-2">
              {mockFavorites.slice(0, 3).map(a => (
                <div key={a.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50">
                  <img src={a.image} alt={a.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{a.name}</p>
                    <CategoryBadge category={a.category} />
                  </div>
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400 flex-shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-ocean-600 flex items-center justify-center text-white text-2xl font-bold">
            A
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">用户名</h1>
            <p className="text-stone-500 text-sm">user@example.com</p>
          </div>
          <button className="ml-auto flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm border border-stone-200 rounded-full px-4 py-2 hover:bg-stone-100 transition-colors">
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Favorites */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="font-display font-bold text-xl text-stone-900">我的收藏</h2>
              <span className="ml-auto text-sm bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full font-medium">
                {mockFavorites.length}
              </span>
            </div>

            <div className="space-y-3">
              {mockFavorites.map(attraction => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden card-hover"
                >
                  <div className="flex gap-3 p-3">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-stone-800 text-sm leading-tight">{attraction.name}</h3>
                        <button className="flex-shrink-0">
                          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <CategoryBadge category={attraction.category} />
                        <StarRating rating={attraction.rating} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-ocean-500" />
              <h2 className="font-display font-bold text-xl text-stone-900">我的日程</h2>
              <span className="text-stone-400 text-sm ml-2">拖拽收藏排入日历</span>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
              <TripCalendar favorites={mockFavorites} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
