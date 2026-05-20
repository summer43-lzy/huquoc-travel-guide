import { CheckCircle, Clock, AlertCircle, Phone } from 'lucide-react'

const bookingItems = [
  {
    category: '住宿',
    emoji: '🏨',
    items: [
      { label: '拉菲斯塔·希尔顿格芮精选酒店', detail: '5晚 6月5–8日 · 含早餐 · 要求高层海景房', status: 'confirmed' },
    ],
  },
  {
    category: '交通',
    emoji: '✈️',
    items: [
      { label: '深圳出发 → 富国岛 PQC（6月5日 13:45到达）', detail: '全员从新加坡出发，统一抵达', status: 'confirmed' },
      { label: '深圳组返程（6月8日 10:40起飞）', detail: '需 08:00 前离开酒店 · 提前叫好出租车', status: 'confirmed' },
      { label: '新加坡组返程（6月8日 15:45起飞）', detail: '约 13:00 前离开酒店', status: 'confirmed' },
      { label: '酒店接机（6月5日下午）', detail: '提前联系酒店预约接机服务', status: 'pending' },
    ],
  },
  {
    category: '活动预订',
    emoji: '🎣',
    items: [
      { label: '深海海钓包船（6月6日 09:30）', detail: '10人包船 · 约5,000,000–8,000,000 VND · 提前1天预订', status: 'pending' },
      { label: '富国岛跨海缆车（6月6日下午）', detail: '现场购票或提前网购 · 约600,000 VND/人', status: 'pending' },
    ],
  },
  {
    category: '餐厅预订',
    emoji: '🍽️',
    items: [
      { label: 'Chez Carole 法越精品餐厅（6月7日晚餐）', detail: '提前2天预约 · Google 4.8分 · 10人需提前告知', status: 'pending' },
      { label: 'SeaSense 日落时分晚餐（任意一晚）', detail: '提前1天预约日落时段（18:00–19:30）', status: 'pending' },
    ],
  },
  {
    category: '其他',
    emoji: '📋',
    items: [
      { label: '越南盾现金兑换', detail: '建议出发前在新加坡兑好，机场汇率较差', status: 'pending' },
      { label: '越南本地SIM卡', detail: '机场购买 Viettel 卡 · 约100,000 VND/7天不限流量', status: 'pending' },
      { label: '旅行保险（10人）', detail: '建议团体保险，涵盖医疗和行程取消', status: 'pending' },
    ],
  },
]

const statusConfig = {
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, label: '已确认', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  pending: { icon: <Clock className="w-4 h-4" />, label: '待确认', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  issue: { icon: <AlertCircle className="w-4 h-4" />, label: '需跟进', color: 'text-rose-600 bg-rose-50 border-rose-200' },
}

export default function BookingPage() {
  const total = bookingItems.flatMap(c => c.items).length
  const confirmed = bookingItems.flatMap(c => c.items).filter(i => i.status === 'confirmed').length

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1600&q=80"
          alt="预订状态"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/50 to-ocean-900/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="font-display text-4xl font-bold mb-2">预订状态</h1>
          <p className="text-white/80">实时追踪10人行程所有预订事项</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress summary */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-stone-800">预订进度</p>
            <p className="text-sm text-stone-500">{confirmed} / {total} 已确认</p>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all"
              style={{ width: `${(confirmed / total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-stone-400 mt-2">出发前请确保所有事项状态变为"已确认"</p>
        </div>

        {/* Booking items by category */}
        <div className="space-y-6">
          {bookingItems.map(cat => (
            <div key={cat.category}>
              <h2 className="font-display text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                <span>{cat.emoji}</span>
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item, i) => {
                  const cfg = statusConfig[item.status as keyof typeof statusConfig]
                  return (
                    <div key={i} className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-start gap-3">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 mt-0.5 ${cfg.color}`}>
                        {cfg.icon}
                        {cfg.label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-800 text-sm">{item.label}</p>
                        <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency contacts quick access */}
        <div className="mt-8 bg-rose-50 border border-rose-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-rose-600" />
            <h2 className="font-semibold text-rose-800">紧急联系</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '警察', number: '113' },
              { label: '急救', number: '115' },
              { label: '中国大使馆', number: '+84 24 3845 3736' },
              { label: '酒店前台', number: '询问前台' },
            ].map(c => (
              <a
                key={c.label}
                href={`tel:${c.number}`}
                className="text-center bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-rose-700 font-bold text-sm">{c.number}</div>
                <div className="text-rose-600 text-xs mt-0.5">{c.label}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
