'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react'

const STORAGE_KEY = 'phuquoc_packing_checklist'

const categories = [
  {
    name: '📋 证件与财务',
    items: ['护照（有效期6个月以上）', '手机（存好机票、酒店订单截图）', '信用卡（Visa/Mastercard）', '现金越南盾（小额备用）', '旅行保险凭证'],
  },
  {
    name: '👗 衣物',
    items: ['轻薄透气短袖（3–4件）', '沙滩短裤/比基尼', '薄外套（室内空调很强）', '防晒衣/防晒袖', '拖鞋 + 运动鞋各一双', '参观寺庙用的遮体布或薄外套'],
  },
  {
    name: '🌊 沙滩 & 户外',
    items: ['防晒霜 SPF 50+（足量）', '太阳镜', '遮阳帽', '防水手机袋', '浮潜面镜（可租，自带更卫生）', '防水运动手表/防晒喷雾'],
  },
  {
    name: '💊 医疗 & 卫生',
    items: ['晕船药', '肠胃药（止泻 + 助消化）', '防蚊喷雾', '蚊虫叮咬止痒药', '感冒退烧药', '创可贴', '湿纸巾 / 消毒湿巾'],
  },
  {
    name: '📱 电子设备',
    items: ['手机充电线 + 充电头', '充电宝（飞机允许20000mAh以下）', '越南本地SIM卡（到了机场买）', '防水手机壳或袋', '相机（可选）'],
  },
  {
    name: '🎒 其他',
    items: ['折叠购物袋（买特产用）', '泳衣收纳防水袋', '快干浴巾', '酒店预订打印或截图', '常用App提前下载（Grab, Google Maps, Google翻译）'],
  },
]

function loadChecked(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export default function PackingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setChecked(loadChecked())
    setMounted(true)
  }, [])

  function toggle(item: string) {
    setChecked(prev => {
      const next = { ...prev, [item]: !prev[item] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function reset() {
    setChecked({})
    localStorage.removeItem(STORAGE_KEY)
  }

  const allItems = categories.flatMap(c => c.items)
  const doneCount = allItems.filter(i => checked[i]).length
  const progress = allItems.length > 0 ? Math.round((doneCount / allItems.length) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-stone-900">行李清单</h3>
          <p className="text-xs text-stone-400 mt-0.5">逐项打钩，出发更安心</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
          title="重置所有"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置
        </button>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-stone-500">打包进度</span>
          <span className="text-xs font-semibold text-ocean-700">{doneCount} / {allItems.length} 件</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-ocean-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-emerald-600 font-medium mt-1.5">✅ 全部打包完成！准备出发！</p>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map(cat => {
          const catDone = cat.items.filter(i => checked[i]).length
          return (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-stone-700">{cat.name}</h4>
                <span className="text-xs text-stone-400">{catDone}/{cat.items.length}</span>
              </div>
              <div className="space-y-1.5">
                {cat.items.map(item => (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                  >
                    {mounted && checked[item] ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 group-hover:text-stone-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm transition-colors ${mounted && checked[item] ? 'line-through text-stone-300' : 'text-stone-700'}`}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
