import { cn } from '@/lib/utils'
import { Attraction } from '@/types'

const config: Record<Attraction['category'], { label: string; color: string }> = {
  scenic:        { label: '景点',   color: 'bg-emerald-100 text-emerald-700' },
  beach:         { label: '海滩',   color: 'bg-cyan-100 text-cyan-700' },
  activity:      { label: '活动',   color: 'bg-violet-100 text-violet-700' },
  restaurant:    { label: '餐厅',   color: 'bg-orange-100 text-orange-700' },
  accommodation: { label: '住宿',   color: 'bg-blue-100 text-blue-700' },
  shopping:      { label: '购物',   color: 'bg-pink-100 text-pink-700' },
}

export default function CategoryBadge({ category }: { category: Attraction['category'] }) {
  const { label, color } = config[category]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', color)}>
      {label}
    </span>
  )
}
