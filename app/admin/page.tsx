import { attractions } from '@/data/attractions'
import { tripData } from '@/data/itinerary'
import { Edit, Plus, Trash2, Image, FileText, MapPin, Calendar, Users } from 'lucide-react'
import CategoryBadge from '@/components/ui/CategoryBadge'
import StarRating from '@/components/ui/StarRating'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-ocean-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-ocean-300 text-sm mb-1">Admin Dashboard</p>
          <h1 className="font-display text-3xl font-bold mb-2">内容管理后台</h1>
          <p className="text-ocean-200 text-sm">管理网站内容，仅限管理员访问</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: <MapPin className="w-5 h-5 text-ocean-600" />, label: '景点总数', value: attractions.length, bg: 'bg-ocean-50' },
            { icon: <Calendar className="w-5 h-5 text-violet-600" />, label: '行程天数', value: tripData.totalDays, bg: 'bg-violet-50' },
            { icon: <Users className="w-5 h-5 text-emerald-600" />, label: '团队人数', value: tripData.groupSize, bg: 'bg-emerald-50' },
            { icon: <FileText className="w-5 h-5 text-amber-600" />, label: '内容分类', value: 6, bg: 'bg-amber-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border border-stone-100`}>
              <div className="flex items-center justify-between mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-stone-800">{stat.value}</div>
              <div className="text-sm text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Attractions management */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-stone-900">景点 & 餐厅管理</h2>
            <button className="flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              添加景点
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">景点</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">分类</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">评分</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium hidden md:table-cell">价格</th>
                    <th className="text-right px-4 py-3 text-stone-500 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {attractions.map(attraction => (
                    <tr key={attraction.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="font-medium text-stone-800">{attraction.name}</p>
                            <p className="text-xs text-stone-400 truncate max-w-48">{attraction.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={attraction.category} />
                      </td>
                      <td className="px-4 py-3">
                        <StarRating rating={attraction.rating} />
                      </td>
                      <td className="px-4 py-3 text-stone-500 hidden md:table-cell text-xs">
                        {attraction.price ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button className="p-1.5 rounded-lg hover:bg-ocean-50 text-stone-400 hover:text-ocean-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Itinerary management */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-stone-900">行程管理</h2>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              新增行程日
            </button>
          </div>

          <div className="space-y-3">
            {tripData.days.map(day => (
              <div
                key={day.day}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-ocean-600 text-white flex flex-col items-center justify-center flex-shrink-0 text-center">
                  <span className="text-xs">Day</span>
                  <span className="text-lg font-bold leading-none">{day.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-800">{day.title}</h3>
                  <p className="text-stone-400 text-sm mt-0.5">{day.date} · {day.attractions.length} 个地点</p>
                  <p className="text-stone-500 text-sm mt-1 line-clamp-1">{day.description}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-1.5 rounded-lg hover:bg-ocean-50 text-stone-400 hover:text-ocean-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Setup guide */}
        <section className="mt-10 bg-gradient-to-br from-ocean-50 to-ocean-100 border border-ocean-200 rounded-2xl p-6">
          <h2 className="font-display font-bold text-ocean-900 text-lg mb-4">🚀 上线前配置清单</h2>
          <div className="space-y-2 text-sm text-ocean-800">
            {[
              { done: false, text: '在 Supabase 创建项目，填写 .env.local 中的 SUPABASE_URL 和 ANON_KEY' },
              { done: false, text: '在 Supabase Authentication 中启用 Google OAuth Provider' },
              { done: false, text: '在 Supabase SQL 编辑器中执行 lib/supabase/schema.sql' },
              { done: false, text: '申请 Mapbox 账号，填写 .env.local 中的 MAPBOX_TOKEN' },
              { done: false, text: '将景点真实图片上传至 Supabase Storage 或 Cloudinary，替换 Unsplash 链接' },
              { done: false, text: '更新 data/itinerary.ts 和 data/attractions.ts 中的实际行程日期和景点信息' },
              { done: false, text: '部署到 Vercel：连接 GitHub 仓库，填写环境变量' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  item.done ? 'bg-emerald-500 border-emerald-500' : 'border-ocean-400'
                }`}>
                  {item.done && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={item.done ? 'line-through text-ocean-400' : ''}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
