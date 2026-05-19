'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { getPublicJournals, getPublicJournalsForContent, type Journal } from '@/lib/supabase/db'

function JournalCard({ journal }: { journal: Journal }) {
  const [expanded, setExpanded] = useState(false)
  const hasLongBody = (journal.body?.length ?? 0) > 150

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {journal.cover_url && (
        <img src={journal.cover_url} alt={journal.title} className="w-full h-36 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-stone-800 leading-snug">{journal.title}</h4>
          <span className="flex items-center gap-1 text-xs text-ocean-600 bg-ocean-50 px-2 py-0.5 rounded-full flex-shrink-0">
            <Globe className="w-3 h-3" />公开
          </span>
        </div>
        {journal.body && (
          <div>
            <p className={`text-stone-500 text-sm leading-relaxed ${!expanded && hasLongBody ? 'line-clamp-3' : ''}`}>
              {journal.body}
            </p>
            {hasLongBody && (
              <button
                onClick={() => setExpanded(p => !p)}
                className="flex items-center gap-0.5 text-xs text-ocean-600 hover:text-ocean-700 mt-1"
              >
                {expanded ? <><ChevronUp className="w-3 h-3" />收起</> : <><ChevronDown className="w-3 h-3" />展开</>}
              </button>
            )}
          </div>
        )}
        <p className="text-xs text-stone-400 mt-2">
          {new Date(journal.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

// Show all public journals (for memories page)
export function AllPublicJournals() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicJournals().then(j => { setJournals(j); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="w-6 h-6 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (journals.length === 0) return (
    <div className="text-center py-10 text-stone-400 text-sm">
      还没有旅行者分享游记，成为第一个吧
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {journals.map(j => <JournalCard key={j.id} journal={j} />)}
    </div>
  )
}

// Show public journals linked to a specific attraction/content
export function ContentPublicJournals({ contentType, contentId }: { contentType: string; contentId: string }) {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicJournalsForContent(contentType, contentId).then(j => { setJournals(j); setLoading(false) })
  }, [contentType, contentId])

  if (loading || journals.length === 0) return null

  return (
    <div className="mt-8 border-t border-stone-100 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-ocean-500" />
        <h3 className="font-display font-bold text-lg text-stone-900">旅行者游记</h3>
        <span className="text-xs bg-ocean-50 text-ocean-600 px-2 py-0.5 rounded-full">{journals.length}篇</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {journals.map(j => <JournalCard key={j.id} journal={j} />)}
      </div>
    </div>
  )
}
