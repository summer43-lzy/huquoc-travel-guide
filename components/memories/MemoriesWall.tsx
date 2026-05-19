'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, X, Image as ImageIcon } from 'lucide-react'
import { getMemories, addMemory, removeMemory, type Memory } from '@/lib/localStorage'

const DAY_OPTIONS = [
  { value: 1, label: 'Day 1 · 6月5日' },
  { value: 2, label: 'Day 2 · 6月6日' },
  { value: 3, label: 'Day 3 · 6月7日' },
  { value: 4, label: 'Day 4 · 6月8日' },
]

function AddMemoryModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [day, setDay] = useState(1)
  const [preview, setPreview] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    addMemory({ url: url.trim(), caption: caption.trim(), day })
    onAdd()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-display font-bold text-stone-900">添加照片回忆</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">图片 URL *</label>
            <input
              type="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setPreview(false) }}
              placeholder="https://..."
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean-400"
              required
            />
            {url && (
              <button
                type="button"
                onClick={() => setPreview(p => !p)}
                className="mt-1.5 text-xs text-ocean-600 hover:underline"
              >
                {preview ? '隐藏预览' : '预览图片'}
              </button>
            )}
            {preview && url && (
              <div className="mt-2 rounded-xl overflow-hidden h-32 bg-stone-100">
                <img src={url} alt="preview" className="w-full h-full object-cover" onError={() => setPreview(false)} />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">描述（可选）</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="记录这个美好瞬间…"
              maxLength={100}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">属于哪一天</label>
            <div className="grid grid-cols-2 gap-2">
              {DAY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDay(opt.value)}
                  className={[
                    'py-2 px-3 rounded-xl border text-xs font-medium transition-colors',
                    day === opt.value
                      ? 'border-ocean-500 bg-ocean-50 text-ocean-700'
                      : 'border-stone-200 text-stone-600 hover:border-ocean-300',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            添加到相册
          </button>
        </form>
      </div>
    </div>
  )
}

function MemoryCard({ memory, onDelete }: { memory: Memory; onDelete: (id: string) => void }) {
  const [imgError, setImgError] = useState(false)
  const dayLabel = DAY_OPTIONS.find(d => d.value === memory.day)?.label ?? `Day ${memory.day}`

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-white border border-stone-100 shadow-sm">
      <div className="aspect-square bg-stone-100 overflow-hidden">
        {!imgError ? (
          <img
            src={memory.url}
            alt={memory.caption || '旅行照片'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-xs">图片无法加载</p>
          </div>
        )}
      </div>
      <div className="p-3">
        <span className="inline-block bg-ocean-50 text-ocean-700 rounded-full px-2 py-0.5 text-[10px] font-medium mb-1">
          {dayLabel}
        </span>
        {memory.caption && (
          <p className="text-stone-700 text-xs leading-relaxed line-clamp-2">{memory.caption}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(memory.id)}
        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
        title="删除"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function MemoriesWall() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [showModal, setShowModal] = useState(false)
  const [filterDay, setFilterDay] = useState<number | 'all'>('all')

  useEffect(() => {
    setMemories(getMemories())
  }, [])

  function handleDelete(id: string) {
    removeMemory(id)
    setMemories(getMemories())
  }

  function handleAdded() {
    setMemories(getMemories())
  }

  const filtered = filterDay === 'all' ? memories : memories.filter(m => m.day === filterDay)

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">旅行相册</h2>
          <p className="text-stone-500 text-sm mt-0.5">
            粘贴图片链接，保存在本设备上
            {memories.length > 0 && <span className="ml-1">· 共 {memories.length} 张</span>}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-full transition-colors text-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          添加照片
        </button>
      </div>

      {/* Day filter */}
      {memories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
          <button
            onClick={() => setFilterDay('all')}
            className={[
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              filterDay === 'all'
                ? 'bg-ocean-600 text-white border-ocean-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300',
            ].join(' ')}
          >
            全部
          </button>
          {DAY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterDay(opt.value)}
              className={[
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                filterDay === opt.value
                  ? 'bg-ocean-600 text-white border-ocean-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map(m => (
            <MemoryCard key={m.id} memory={m} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <div className="text-5xl mb-4">📷</div>
          <h3 className="font-display font-bold text-stone-700 text-lg mb-2">
            {memories.length === 0 ? '还没有照片' : '这一天暂无照片'}
          </h3>
          <p className="text-stone-400 text-sm max-w-xs mx-auto">
            粘贴图片链接即可添加，照片保存在本设备浏览器中
          </p>
          {memories.length === 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-full transition-colors text-sm mx-auto"
            >
              <Plus className="w-4 h-4" />
              添加第一张照片
            </button>
          )}
        </div>
      )}

      {showModal && (
        <AddMemoryModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdded}
        />
      )}
    </div>
  )
}
