'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Trash2, Plus, X, Image as ImageIcon, Upload, Loader2, Globe, Lock, LogIn } from 'lucide-react'
import { getMemories, addMemory, removeMemory, type Memory } from '@/lib/localStorage'
import { createClient } from '@/lib/supabase/client'
import { addPublicPhoto } from '@/lib/supabase/db'
import PhotoLightbox, { type LightboxPhoto } from '@/components/ui/PhotoLightbox'

const DAY_OPTIONS = [
  { value: 1, label: 'Day 1 · 6月5日' },
  { value: 2, label: 'Day 2 · 6月6日' },
  { value: 3, label: 'Day 3 · 6月7日' },
  { value: 4, label: 'Day 4 · 6月8日' },
]

function AddMemoryModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [previewUrl, setPreviewUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [day, setDay] = useState(1)
  const [isPublic, setIsPublic] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setLoggedIn(!!data.user))
  }, [])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)

    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const folder = user ? user.id : 'anonymous'
    const ext = file.name.split('.').pop()
    const path = `${folder}/memories/${Date.now()}.${ext}`

    const { error: uploadError } = await sb.storage.from('journals').upload(path, file, { upsert: true })
    if (uploadError) {
      setError('上传失败，请重试')
      setUploading(false)
      return
    }
    const { data } = sb.storage.from('journals').getPublicUrl(path)
    setPreviewUrl(data.publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!previewUrl) return
    setSaving(true)
    addMemory({ url: previewUrl, caption: caption.trim(), day })
    if (isPublic) {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        await addPublicPhoto(user.id, previewUrl, caption.trim(), day)
      }
    }
    setSaving(false)
    onAdd()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-[72px] sm:pb-0">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-display font-bold text-stone-900">添加照片回忆</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Photo upload */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">选择照片 *</label>
            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden h-40 bg-stone-100">
                <img src={previewUrl} alt="预览" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(''); if (fileRef.current) fileRef.current.value = '' }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-32 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-ocean-300 hover:text-ocean-500 transition-colors"
              >
                {uploading
                  ? <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-sm">上传中...</span></>
                  : <><Upload className="w-6 h-6" /><span className="text-sm">点击选择照片</span><span className="text-xs">支持 JPG、PNG、HEIC</span></>
                }
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
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

          {/* Visibility */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">共享设置</label>
            {loggedIn === false ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                <LogIn className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  <Link href="/profile" className="font-semibold underline">登录</Link>后可将照片分享到公共相册，让大家一起看到
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                      !isPublic ? 'bg-stone-900 border-stone-900 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    仅自己可见
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                      isPublic ? 'bg-ocean-600 border-ocean-600 text-white' : 'border-stone-200 text-stone-600 hover:border-ocean-300'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    分享到公共相册
                  </button>
                </div>
                {isPublic && <p className="text-xs text-ocean-600 mt-1">照片将显示在旅行回忆页面的公共相册中</p>}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!previewUrl || uploading || saving}
            className="w-full py-2.5 bg-ocean-600 hover:bg-ocean-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {saving ? '保存中...' : '添加到相册'}
          </button>
        </form>
      </div>
    </div>
  )
}

function MemoryCard({
  memory,
  onDelete,
  onClick,
}: {
  memory: Memory
  onDelete: (id: string) => void
  onClick: () => void
}) {
  const [imgError, setImgError] = useState(false)
  const dayLabel = DAY_OPTIONS.find(d => d.value === memory.day)?.label ?? `Day ${memory.day}`

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-white border border-stone-100 shadow-sm">
      <button
        className="w-full aspect-square bg-stone-100 overflow-hidden block text-left"
        onClick={onClick}
        aria-label="查看大图"
      >
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
      </button>
      <div className="p-3">
        <span className="inline-block bg-ocean-50 text-ocean-700 rounded-full px-2 py-0.5 text-xs font-medium mb-1">
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

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

  const lightboxPhotos = filtered.map(m => ({
    url: m.url,
    caption: m.caption,
    dayLabel: DAY_OPTIONS.find(d => d.value === m.day)?.label,
  }))

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">旅行相册</h2>
          <p className="text-stone-500 text-sm mt-0.5">
            直接从手机/电脑上传照片
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
          {filtered.map((m, i) => (
            <MemoryCard key={m.id} memory={m} onDelete={handleDelete} onClick={() => setLightboxIndex(i)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <div className="text-5xl mb-4">📷</div>
          <h3 className="font-display font-bold text-stone-700 text-lg mb-2">
            {memories.length === 0 ? '还没有照片' : '这一天暂无照片'}
          </h3>
          <p className="text-stone-400 text-sm max-w-xs mx-auto">
            点击"添加照片"，直接从手机相册或电脑选择照片上传
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

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={lightboxPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </div>
  )
}
