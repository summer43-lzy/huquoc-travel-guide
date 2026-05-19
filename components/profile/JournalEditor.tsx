'use client'

import { useState, useRef } from 'react'
import { X, Upload, Globe, Lock, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createJournal, updateJournal, type Journal } from '@/lib/supabase/db'

interface Props {
  userId: string
  existing?: Journal
  onSaved: (journal: Journal) => void
  onCancel: () => void
}

export default function JournalEditor({ userId, existing, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(existing?.title ?? '')
  const [body, setBody] = useState(existing?.body ?? '')
  const [isPublic, setIsPublic] = useState(existing?.is_public ?? false)
  const [coverUrl, setCoverUrl] = useState(existing?.cover_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const sb = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error } = await sb.storage.from('journals').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = sb.storage.from('journals').getPublicUrl(path)
      setCoverUrl(data.publicUrl)
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    let saved: Journal | null = null
    if (existing) {
      await updateJournal(existing.id, title.trim(), body.trim(), isPublic, coverUrl || undefined)
      saved = { ...existing, title: title.trim(), body: body.trim(), is_public: isPublic, cover_url: coverUrl || null }
    } else {
      saved = await createJournal(userId, title.trim(), body.trim(), isPublic, coverUrl || undefined)
    }
    setSaving(false)
    if (saved) onSaved(saved)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-display font-bold text-stone-900">{existing ? '编辑游记' : '写游记'}</h3>
          <button onClick={onCancel} className="p-1.5 rounded-full hover:bg-stone-100">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Cover photo */}
          <div>
            <label className="text-xs font-semibold text-stone-500 block mb-1.5">封面照片（可选）</label>
            {coverUrl ? (
              <div className="relative rounded-xl overflow-hidden h-32">
                <img src={coverUrl} alt="封面" className="w-full h-full object-cover" />
                <button
                  onClick={() => setCoverUrl('')}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-24 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-ocean-300 hover:text-ocean-500 transition-colors"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs">{uploading ? '上传中...' : '点击上传封面'}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-stone-500 block mb-1.5">标题</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="给这段旅行起个名字..."
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-ocean-400 transition-colors"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-xs font-semibold text-stone-500 block mb-1.5">内容</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="写下这段旅行的故事、感受、建议..."
              rows={6}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-ocean-400 transition-colors"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="text-xs font-semibold text-stone-500 block mb-2">可见范围</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPublic(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  !isPublic ? 'bg-stone-900 border-stone-900 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <Lock className="w-4 h-4" />
                仅自己可见
              </button>
              <button
                onClick={() => setIsPublic(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  isPublic ? 'bg-ocean-600 border-ocean-600 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                公开分享
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stone-100 flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors">
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex-1 py-2.5 bg-ocean-600 hover:bg-ocean-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
