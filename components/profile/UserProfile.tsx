'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, BookOpen, MapPin, Plus, Globe, Lock, Trash2, Edit3, LogOut, Wallet, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  getFavorites, getUserJournals, getFootprints, getUserStats,
  deleteJournal, getProfile, upsertProfile, updateExpensesNickname, getMyExpenses,
  type Journal, type Footprint, type Expense,
} from '@/lib/supabase/db'
import { attractions } from '@/data/attractions'
import { restaurants } from '@/data/restaurants'
import type { User } from '@supabase/supabase-js'
import JournalEditor from './JournalEditor'
import CategoryBadge from '@/components/ui/CategoryBadge'
import { useRouter } from 'next/navigation'

type Tab = 'favorites' | 'journals' | 'footprints' | 'expenses'

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center bg-white/15 rounded-xl py-3 px-2">
      <p className="font-bold text-2xl">{value}</p>
      <p className="text-white/70 text-xs mt-0.5">{label}</p>
    </div>
  )
}

function resolveContent(contentType: string, contentId: string) {
  if (contentType === 'attraction') {
    const a = attractions.find(x => x.id === contentId)
    return a ? { name: a.name, image: a.image, category: a.category as string } : null
  }
  if (contentType === 'restaurant') {
    const r = restaurants.find(x => x.id === contentId)
    return r ? { name: r.name, image: (r as any).image ?? '', category: 'restaurant' as string } : null
  }
  return null
}

const CURRENCY_LABELS: Record<string, string> = { CNY: '¥', VND: '₫', SGD: 'S$' }
const DAY_LABELS: Record<number, string> = { 1: 'Day 1', 2: 'Day 2', 3: 'Day 3', 4: 'Day 4' }

export default function UserProfile({ user }: { user: User }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('favorites')
  const [stats, setStats] = useState({ favorites: 0, journals: 0, footprints: 0, publicJournals: 0 })
  const [favItems, setFavItems] = useState<{ content_type: string; content_id: string }[]>([])
  const [journals, setJournals] = useState<Journal[]>([])
  const [footprints, setFootprints] = useState<Footprint[]>([])
  const [myExpenses, setMyExpenses] = useState<Expense[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingJournal, setEditingJournal] = useState<Journal | undefined>()

  // Nickname state — default to email prefix, overwritten by profile once loaded
  const emailPrefix = user.email?.split('@')[0] ?? '旅行者'
  const [nickname, setNickname] = useState(emailPrefix)
  const [editingNickname, setEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState(emailPrefix)
  const [savingNickname, setSavingNickname] = useState(false)

  const avatar = user.user_metadata?.avatar_url

  useEffect(() => {
    getUserStats(user.id).then(setStats)
    getFavorites(user.id).then(setFavItems)
    getUserJournals(user.id).then(setJournals)
    getFootprints(user.id).then(setFootprints)
    getMyExpenses(user.id).then(setMyExpenses)
    getProfile(user.id).then(p => {
      const resolved = p?.nickname || emailPrefix
      setNickname(resolved)
      setNicknameInput(resolved)
    })
  }, [user.id])

  async function handleSignOut() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function handleJournalSaved(j: Journal) {
    setShowEditor(false)
    setEditingJournal(undefined)
    setJournals(prev => {
      const idx = prev.findIndex(x => x.id === j.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = j; return next }
      return [j, ...prev]
    })
    getUserStats(user.id).then(setStats)
  }

  async function handleDeleteJournal(id: string) {
    if (!confirm('确定删除这篇游记？')) return
    await deleteJournal(id)
    setJournals(prev => prev.filter(j => j.id !== id))
    getUserStats(user.id).then(setStats)
  }

  async function saveNickname() {
    const trimmed = nicknameInput.trim()
    if (!trimmed) return
    setSavingNickname(true)
    await Promise.all([
      upsertProfile(user.id, trimmed),
      updateExpensesNickname(user.id, trimmed),
    ])
    setNickname(trimmed)
    setEditingNickname(false)
    setSavingNickname(false)
  }

  function cancelNicknameEdit() {
    setNicknameInput(nickname)
    setEditingNickname(false)
  }

  // Group expenses by currency for total display
  const expenseTotals = myExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.currency] = (acc[e.currency] ?? 0) + e.amount
    return acc
  }, {})

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'favorites', label: '收藏', icon: <Heart className="w-4 h-4" />, count: stats.favorites },
    { key: 'journals', label: '游记', icon: <BookOpen className="w-4 h-4" />, count: stats.journals },
    { key: 'footprints', label: '足迹', icon: <MapPin className="w-4 h-4" />, count: stats.footprints },
    { key: 'expenses', label: '消费', icon: <Wallet className="w-4 h-4" />, count: myExpenses.length },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-ocean-700 to-ocean-900 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img src={avatar} alt="" className="w-16 h-16 rounded-full border-2 border-white/30 object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {nickname[0]?.toUpperCase()}
                </div>
              )}
              <div>
                {/* Nickname — main title, inline edit */}
                {editingNickname ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={nicknameInput}
                      onChange={e => setNicknameInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveNickname(); if (e.key === 'Escape') cancelNicknameEdit() }}
                      className="bg-white/20 text-white placeholder-white/50 rounded-lg px-2 py-1 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-white/50 font-display font-bold"
                      placeholder="输入昵称"
                      autoFocus
                      maxLength={20}
                    />
                    <button
                      onClick={saveNickname}
                      disabled={savingNickname}
                      className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={cancelNicknameEdit}
                      className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-display text-xl font-bold">{nickname}</h1>
                    <button
                      onClick={() => { setNicknameInput(nickname); setEditingNickname(true) }}
                      className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors flex-shrink-0"
                      title="编辑昵称"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-ocean-200 text-sm mt-0.5">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              退出
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatCard value={stats.favorites} label="收藏" />
            <StatCard value={stats.journals} label="游记" />
            <StatCard value={stats.footprints} label="足迹" />
            <StatCard value={stats.publicJournals} label="公开" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex border-b border-stone-200 bg-white sticky top-16 z-10">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-ocean-600 text-ocean-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {t.icon}
              {t.label}
              {t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-ocean-100 text-ocean-700' : 'bg-stone-100 text-stone-500'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="py-5">
          {/* Favorites tab */}
          {tab === 'favorites' && (
            favItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">❤️</div>
                <p className="text-stone-500">还没有收藏，去景点页面点击 ❤️ 收藏</p>
                <Link href="/itinerary" className="mt-4 inline-block text-ocean-600 text-sm font-medium hover:underline">
                  去看行程攻略 →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favItems.map(f => {
                  const content = resolveContent(f.content_type, f.content_id)
                  if (!content) return null
                  return (
                    <div key={`${f.content_type}-${f.content_id}`} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex gap-3 p-3">
                      {content.image && (
                        <img src={content.image} alt={content.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-stone-800 text-sm leading-tight truncate">{content.name}</p>
                        <CategoryBadge category={content.category} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}

          {/* Journals tab */}
          {tab === 'journals' && (
            <div className="space-y-3">
              <button
                onClick={() => { setEditingJournal(undefined); setShowEditor(true) }}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-ocean-200 rounded-2xl text-ocean-600 hover:border-ocean-400 hover:bg-ocean-50 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                写一篇游记
              </button>

              {journals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-stone-500 text-sm">还没有游记，记录下你的旅行故事吧</p>
                </div>
              ) : (
                journals.map(j => (
                  <div key={j.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                    {j.cover_url && (
                      <img src={j.cover_url} alt={j.title} className="w-full h-32 object-cover" />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-stone-800">{j.title}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${j.is_public ? 'bg-ocean-50 text-ocean-600' : 'bg-stone-100 text-stone-500'}`}>
                            {j.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {j.is_public ? '公开' : '私密'}
                          </span>
                        </div>
                      </div>
                      {j.body && <p className="text-stone-500 text-sm line-clamp-2 mb-3">{j.body}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-stone-400">
                          {new Date(j.created_at).toLocaleDateString('zh-CN')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditingJournal(j); setShowEditor(true) }}
                            className="p-1.5 text-stone-400 hover:text-ocean-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJournal(j.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footprints tab */}
          {tab === 'footprints' && (
            footprints.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🗺️</div>
                <p className="text-stone-500 text-sm">还没有足迹，去景点页面标记去过的地方</p>
              </div>
            ) : (
              <div className="space-y-2">
                {footprints.map(f => {
                  const content = resolveContent(f.content_type, f.content_id)
                  return (
                    <div key={f.id} className="bg-white rounded-xl border border-stone-100 p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-stone-800 text-sm truncate">{content?.name ?? f.content_id}</p>
                        <p className="text-xs text-stone-400">{new Date(f.visited_at).toLocaleDateString('zh-CN')}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}

          {/* Expenses tab */}
          {tab === 'expenses' && (
            <div className="space-y-4">
              {/* Summary */}
              {myExpenses.length > 0 && (
                <div className="bg-ocean-50 border border-ocean-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-ocean-600 mb-2">我的消费总计</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(expenseTotals).map(([currency, total]) => (
                      <div key={currency} className="flex items-baseline gap-1">
                        <span className="font-bold text-xl text-ocean-700">
                          {CURRENCY_LABELS[currency] ?? ''}{total.toLocaleString()}
                        </span>
                        <span className="text-xs text-ocean-500">{currency}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/expense"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-ocean-600 hover:text-ocean-700 font-medium"
                  >
                    查看全队账单 →
                  </Link>
                </div>
              )}

              {myExpenses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">💰</div>
                  <p className="text-stone-500 text-sm">还没有消费记录</p>
                  <Link href="/expense" className="mt-4 inline-block text-ocean-600 text-sm font-medium hover:underline">
                    去记一笔 →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {myExpenses.map(e => (
                    <div key={e.id} className="bg-white rounded-xl border border-stone-100 shadow-sm p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 text-sm truncate">{e.purpose}</p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {e.day ? DAY_LABELS[e.day] ?? `Day ${e.day}` : ''}
                          {e.day && ' · '}
                          {new Date(e.created_at).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-stone-800">
                          {CURRENCY_LABELS[e.currency] ?? ''}{e.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-stone-400">{e.currency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <JournalEditor
          userId={user.id}
          existing={editingJournal}
          onSaved={handleJournalSaved}
          onCancel={() => { setShowEditor(false); setEditingJournal(undefined) }}
        />
      )}
    </div>
  )
}
