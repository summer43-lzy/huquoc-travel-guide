import { Calendar, MapPin, Utensils, Camera, Waves, TreePine } from 'lucide-react'
import { TripOverview } from '@/types'

const dayColors = [
  'from-ocean-500 to-ocean-600',
  'from-violet-500 to-violet-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
]

const categoryIcon: Record<string, React.ReactNode> = {
  beach:      <Waves className="w-3.5 h-3.5" />,
  scenic:     <Camera className="w-3.5 h-3.5" />,
  restaurant: <Utensils className="w-3.5 h-3.5" />,
  activity:   <TreePine className="w-3.5 h-3.5" />,
  shopping:   <MapPin className="w-3.5 h-3.5" />,
}

export default function OverviewSection({ trip }: { trip: TripOverview }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section heading */}
      <div className="text-center mb-12">
        <p className="text-ocean-600 font-semibold text-sm tracking-widest uppercase mb-3">Trip Overview</p>
        <h2 className="font-display text-4xl font-bold text-stone-900 mb-4">行程一览</h2>
        <p className="text-stone-500 max-w-xl mx-auto">
          {trip.totalDays} 天精心规划，每一天都有独特体验等你解锁
        </p>
      </div>

      {/* Timeline grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trip.days.map((day, i) => (
          <div
            key={day.day}
            className="group relative bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Day header */}
            <div className={`bg-gradient-to-br ${dayColors[i % dayColors.length]} p-4 text-white`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium opacity-80">Day {day.day}</span>
                <Calendar className="w-4 h-4 opacity-70" />
              </div>
              <div className="font-display font-bold text-lg leading-tight">{day.title.split('·')[0].trim()}</div>
              <div className="text-xs opacity-75 mt-1">{day.date}</div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-stone-500 text-xs leading-relaxed mb-3 line-clamp-3">
                {day.description}
              </p>
              <div className="space-y-1.5">
                {day.attractions.slice(0, 3).map(a => (
                  <div key={a.id} className="flex items-center gap-2 text-xs text-stone-600">
                    <span className="text-stone-400 flex-shrink-0">
                      {categoryIcon[a.category] ?? <MapPin className="w-3.5 h-3.5" />}
                    </span>
                    <span className="truncate">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
