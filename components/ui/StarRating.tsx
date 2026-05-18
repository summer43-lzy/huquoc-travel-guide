import { Star } from 'lucide-react'

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-sand-400 text-sand-400" />
      <span className="text-sm font-medium text-stone-700">{rating.toFixed(1)}</span>
    </div>
  )
}
