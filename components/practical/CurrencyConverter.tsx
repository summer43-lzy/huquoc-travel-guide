'use client'

import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'

const rates = [
  { code: 'CNY', symbol: '¥', label: '人民币', rate: 3400 },
  { code: 'USD', symbol: '$', label: '美元', rate: 25000 },
  { code: 'HKD', symbol: 'HK$', label: '港元', rate: 3200 },
]

const presets = [100, 500, 1000, 5000]

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState(rates[0])
  const [amount, setAmount] = useState('')
  const [reversed, setReversed] = useState(false) // false = foreign→VND, true = VND→foreign

  const numericAmount = parseFloat(amount) || 0
  const converted = reversed
    ? (numericAmount / fromCurrency.rate).toFixed(2)
    : Math.round(numericAmount * fromCurrency.rate).toLocaleString()

  const fromLabel = reversed ? 'VND 越南盾' : `${fromCurrency.code} ${fromCurrency.label}`
  const toLabel = reversed ? `${fromCurrency.code} ${fromCurrency.label}` : 'VND 越南盾'

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-stone-900">货币换算器</h3>
          <p className="text-xs text-stone-400 mt-0.5">参考汇率，出发前请查询实时汇率</p>
        </div>
        <span className="text-2xl">💱</span>
      </div>

      {/* Currency selector */}
      <div className="flex gap-2 mb-4">
        {rates.map(r => (
          <button
            key={r.code}
            onClick={() => setFromCurrency(r)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${
              fromCurrency.code === r.code
                ? 'bg-ocean-600 text-white border-ocean-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300'
            }`}
          >
            {r.symbol} {r.code}
          </button>
        ))}
      </div>

      {/* Swap direction */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-xs text-stone-400 mb-1">{fromLabel}</p>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="输入金额"
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => { setReversed(!reversed); setAmount('') }}
          className="mt-5 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-ocean-50 hover:bg-ocean-100 text-ocean-600 transition-colors"
          title="切换换算方向"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-stone-400 mb-1">{toLabel}</p>
          <div className="w-full border border-stone-100 bg-stone-50 rounded-xl px-3 py-2.5 text-stone-900 text-sm font-semibold min-h-[42px]">
            {amount ? converted : <span className="text-stone-300">—</span>}
          </div>
        </div>
      </div>

      {/* Quick presets */}
      {!reversed && (
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-stone-400 self-center">快捷：</span>
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className="px-3 py-1 bg-stone-100 hover:bg-ocean-50 text-stone-600 hover:text-ocean-700 rounded-full text-xs transition-colors"
            >
              {fromCurrency.symbol}{p}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-stone-300 mt-3">
        参考汇率：1 {fromCurrency.code} ≈ {fromCurrency.rate.toLocaleString()} VND
      </p>
    </div>
  )
}
