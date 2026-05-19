'use client'

import { useState } from 'react'

const categories = [
  {
    name: '基础用语',
    phrases: [
      { zh: '你好', vn: 'Xin chào', pron: '辛猫' },
      { zh: '谢谢', vn: 'Cảm ơn', pron: '感恩' },
      { zh: '不客气', vn: 'Không có gì', pron: '空戈基' },
      { zh: '对不起', vn: 'Xin lỗi', pron: '辛罗伊' },
      { zh: '好的', vn: 'Được', pron: '得' },
      { zh: '多少钱？', vn: 'Bao nhiêu?', pron: '包捏' },
      { zh: '太贵了', vn: 'Đắt quá', pron: '达瓜' },
      { zh: '便宜一点', vn: 'Rẻ hơn', pron: '热恨' },
    ],
  },
  {
    name: '餐厅点餐',
    phrases: [
      { zh: '菜单', vn: 'Thực đơn', pron: '特顿' },
      { zh: '我要这个', vn: 'Cho tôi cái này', pron: '走堆盖奈' },
      { zh: '不辣', vn: 'Không cay', pron: '空盖' },
      { zh: '买单', vn: 'Tính tiền', pron: '丁蒂恩' },
      { zh: '好吃！', vn: 'Ngon lắm!', pron: '哦朗' },
      { zh: '凉水', vn: 'Nước lạnh', pron: '努兰' },
      { zh: '啤酒', vn: 'Bia', pron: '比亚' },
      { zh: '海鲜', vn: 'Hải sản', pron: '嗨散' },
    ],
  },
  {
    name: '交通出行',
    phrases: [
      { zh: '去……怎么走？', vn: 'Đi ... thế nào?', pron: '滴…铁脑' },
      { zh: '打车', vn: 'Gọi xe', pron: '勾些' },
      { zh: '机场', vn: 'Sân bay', pron: '散拜' },
      { zh: '酒店', vn: 'Khách sạn', pron: '卡散' },
      { zh: '海滩', vn: 'Bãi biển', pron: '拜边' },
      { zh: '停这里', vn: 'Dừng ở đây', pron: '仍嗯旦' },
      { zh: '等一下', vn: 'Đợi một chút', pron: '对摩出' },
      { zh: '快一点', vn: 'Nhanh lên', pron: '南连' },
    ],
  },
  {
    name: '紧急情况',
    phrases: [
      { zh: '帮帮我！', vn: 'Giúp tôi với!', pron: '租堆喂' },
      { zh: '救命！', vn: 'Cứu tôi!', pron: '救堆' },
      { zh: '我迷路了', vn: 'Tôi bị lạc đường', pron: '堆比拉当' },
      { zh: '叫医生', vn: 'Gọi bác sĩ', pron: '勾巴斯' },
      { zh: '叫警察', vn: 'Gọi cảnh sát', pron: '勾康萨' },
      { zh: '医院在哪？', vn: 'Bệnh viện ở đâu?', pron: '本眼嗯豆' },
      { zh: '我过敏', vn: 'Tôi bị dị ứng', pron: '堆比依应' },
      { zh: '我需要帮助', vn: 'Tôi cần giúp đỡ', pron: '堆健租杜' },
    ],
  },
]

export default function PhrasesCard() {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  function copyPhrase(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(text)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-stone-900">越南语速查</h3>
          <p className="text-xs text-stone-400 mt-0.5">点击短语可复制，方便给当地人看</p>
        </div>
        <span className="text-2xl">🗣️</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              active === i
                ? 'bg-ocean-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-ocean-50 hover:text-ocean-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Phrases table */}
      <div className="space-y-1.5">
        {categories[active].phrases.map(p => (
          <button
            key={p.vn}
            onClick={() => copyPhrase(p.vn)}
            className="w-full grid grid-cols-3 gap-2 px-3 py-2.5 rounded-xl hover:bg-ocean-50 transition-colors text-left group"
          >
            <span className="text-sm font-medium text-stone-700">{p.zh}</span>
            <span className={`text-sm font-semibold transition-colors ${copied === p.vn ? 'text-emerald-600' : 'text-ocean-700 group-hover:text-ocean-600'}`}>
              {copied === p.vn ? '已复制！' : p.vn}
            </span>
            <span className="text-xs text-stone-400 self-center">[{p.pron}]</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-stone-300 mt-3 text-center">注：发音为近似中文注音，仅供参考</p>
    </div>
  )
}
