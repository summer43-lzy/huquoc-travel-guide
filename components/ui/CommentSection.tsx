'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Clock } from 'lucide-react'
import { getComments, submitComment, type Comment } from '@/lib/supabase/db'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days}天前`
  return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default function CommentSection({
  contentType,
  contentId,
  title,
}: {
  contentType: string
  contentId: string
  title?: string
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    getComments(contentType, contentId).then(setComments)
  }, [contentType, contentId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !body.trim()) return
    setSubmitting(true)
    const ok = await submitComment(user.id, contentType, contentId, body.trim())
    setSubmitting(false)
    if (ok) {
      setBody('')
      setSubmitted(true)
    }
  }

  return (
    <div className="mt-8 border-t border-stone-100 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-ocean-500" />
        <h3 className="font-display font-bold text-lg text-stone-900">
          {title ?? '旅行者评论'}
        </h3>
        {comments.length > 0 && (
          <span className="text-xs bg-ocean-50 text-ocean-600 px-2 py-0.5 rounded-full">{comments.length}条</span>
        )}
      </div>

      {/* Submit form */}
      {user ? (
        submitted ? (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm text-amber-700">
            <Clock className="w-4 h-4 flex-shrink-0" />
            评论已提交，审核通过后将公开显示，感谢分享！
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-5">
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="分享你的真实体验..."
              rows={3}
              maxLength={500}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-ocean-400 transition-colors mb-2"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">{body.length}/500 · 审核后公开</span>
              <button
                type="submit"
                disabled={submitting || body.trim().length < 5}
                className="flex items-center gap-1.5 px-4 py-2 bg-ocean-600 hover:bg-ocean-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? '提交中...' : '提交评论'}
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="bg-stone-50 rounded-xl px-4 py-3 mb-5 text-sm text-stone-500">
          <a href="#" className="text-ocean-600 font-medium">登录</a> 后可以留下你的评论
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-stone-400 text-sm text-center py-6">还没有评论，成为第一个分享体验的人</p>
      ) : (
        <div className="space-y-3">
          {comments.map(c => (
            <div key={c.id} className="bg-white border border-stone-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-ocean-100 flex items-center justify-center text-xs font-bold text-ocean-700">
                    {(c.display_name ?? '游')?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-stone-700">{c.display_name ?? '旅行者'}</span>
                </div>
                <span className="text-xs text-stone-400">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
