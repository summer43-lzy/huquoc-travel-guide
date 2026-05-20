import Link from 'next/link'
import { ChevronRight, Receipt } from 'lucide-react'

export default function ExpenseSummaryCard({ className }: { className?: string }) {
  return (
    <div className={className ?? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8'}>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-3.5 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-ocean-50 flex items-center justify-center flex-shrink-0">
          <Receipt className="w-5 h-5 text-ocean-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-800 text-sm">团队记账</p>
          <p className="text-xs text-stone-400 mt-0.5">记录旅途中的每一笔花费</p>
        </div>
        <Link
          href="/expense"
          className="flex-shrink-0 inline-flex items-center gap-1 bg-ocean-50 hover:bg-ocean-100 border border-ocean-100 text-ocean-700 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          查看记账 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
