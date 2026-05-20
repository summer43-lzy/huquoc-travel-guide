'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit3, X, Loader2, Upload, ChevronDown, LogIn, Copy, Users, ArrowRight } from 'lucide-react'
import Toast from '@/components/ui/Toast'
import { usePullToRefresh } from '@/lib/usePullToRefresh'
import { createClient } from '@/lib/supabase/client'
import {
  getExpenses, addExpense, updateExpense, deleteExpense,
  isTeamMember, joinTeam, getProfile, type Expense,
} from '@/lib/supabase/db'
import type { User } from '@supabase/supabase-js'
import LoginModal from '@/components/auth/LoginModal'

const TEAM_CODE = '大王'
const CURRENCIES = ['VND', 'CNY', 'SGD'] as const
type Currency = typeof CURRENCIES[number]

const DAY_OPTIONS = [
  { value: 0, label: '不指定' },
  { value: 1, label: 'Day 1 · 6月5日' },
  { value: 2, label: 'Day 2 · 6月6日' },
  { value: 3, label: 'Day 3 · 6月7日' },
  { value: 4, label: 'Day 4 · 6月8日' },
]

// ── Exchange rate ─────────────────────────────────────────────────────────────

interface Rates { VND: number; CNY: number; SGD: number }

async function fetchRates(): Promise<Rates> {
  const res = await fetch('https://open.er-api.com/v6/latest/CNY')
  const json = await res.json()
  return {
    CNY: 1,
    VND: json.rates?.VND ?? 3450,
    SGD: json.rates?.SGD ?? 0.187,
  }
}

function toCNY(amount: number, currency: Currency, rates: Rates): number {
  if (currency === 'CNY') return amount
  if (currency === 'VND') return amount / rates.VND
  if (currency === 'SGD') return amount / rates.SGD
  return amount
}

function formatCNY(val: number) {
  return val < 1 ? val.toFixed(2) : val.toFixed(0)
}

// ── Team code gate ────────────────────────────────────────────────────────────

function TeamCodeGate({ onJoined }: { onJoined: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim() !== TEAM_CODE) {
      setError('暗号不对，请联系旅行组织者')
      return
    }
    setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const profile = await getProfile(user.id)
    const nickname = profile?.nickname ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? '旅行者'
    await joinTeam(user.id, nickname)
    onJoined()
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="font-display font-bold text-stone-900 text-xl mb-1">输入团队暗号</h2>
        <p className="text-stone-400 text-sm mb-6">此功能仅限旅行团队成员使用</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={code}
            onChange={e => { setCode(e.target.value); setError('') }}
            placeholder="输入暗号..."
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-center text-lg font-medium focus:outline-none focus:border-ocean-400"
            autoFocus
          />
          {error && <p className="text-rose-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full py-3 bg-ocean-600 hover:bg-ocean-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? '验证中…' : '进入记账'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Add/Edit form ─────────────────────────────────────────────────────────────

function ExpenseForm({
  userId, nickname, existing, onSaved, onCancel,
}: {
  userId: string
  nickname: string
  existing?: Expense
  onSaved: (e: Expense) => void
  onCancel: () => void
}) {
  const [amount, setAmount] = useState(existing?.amount.toString() ?? '')
  const [currency, setCurrency] = useState<Currency>((existing?.currency as Currency) ?? 'VND')
  const [purpose, setPurpose] = useState(existing?.purpose ?? '')
  const [day, setDay] = useState(existing?.day ?? 0)
  const [payer, setPayer] = useState(existing?.payer ?? nickname)
  const [imageUrl, setImageUrl] = useState(existing?.image_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDayPicker, setShowDayPicker] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const sb = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/expenses/${Date.now()}.${ext}`
    const { error } = await sb.storage.from('journals').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = sb.storage.from('journals').getPublicUrl(path)
      setImageUrl(data.publicUrl)
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !purpose) return
    setSaving(true)
    const num = parseFloat(amount)
    const payerVal = payer.trim() || nickname
    if (existing) {
      await updateExpense(existing.id, payerVal, num, currency, purpose, day || null, imageUrl || null)
      onSaved({ ...existing, payer: payerVal, amount: num, currency, purpose, day: day || null, image_url: imageUrl || null })
    } else {
      const created = await addExpense(userId, nickname, payerVal, num, currency, purpose, day || null, imageUrl || null)
      if (created) onSaved(created)
    }
    setSaving(false)
  }

  const selectedDayLabel = DAY_OPTIONS.find(d => d.value === day)?.label ?? '不指定'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-6 pb-[60px] sm:pb-0">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[calc(100dvh-80px)] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 flex-shrink-0">
          <h3 className="font-display font-bold text-stone-900">{existing ? '编辑账单' : '新增消费'}</h3>
          <button onClick={onCancel} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto overscroll-contain flex-1">
          {/* Amount + Currency */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">金额 *</label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="any"
                className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean-400"
                autoFocus
              />
              <div className="flex rounded-xl border border-stone-200 overflow-hidden text-sm">
                {CURRENCIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-2.5 font-medium transition-colors ${
                      currency === c ? 'bg-ocean-600 text-white' : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">用途 *</label>
            <input
              type="text"
              inputMode="text"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="如：晚餐、缆车票、打车费…"
              maxLength={60}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean-400"
            />
          </div>

          {/* Payer */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">支出人</label>
            <input
              type="text"
              inputMode="text"
              value={payer}
              onChange={e => setPayer(e.target.value)}
              placeholder="实际付款的人"
              maxLength={20}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean-400"
            />
            <p className="text-xs text-stone-400 mt-1">默认为记账人本人，AA 结算按支出人计算</p>
          </div>

          {/* Day */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">所属日期（可选）</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDayPicker(p => !p)}
                className="w-full flex items-center justify-between border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 hover:border-ocean-300 transition-colors"
              >
                {selectedDayLabel}
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </button>
              {showDayPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {DAY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setDay(opt.value); setShowDayPicker(false) }}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                        day === opt.value ? 'bg-ocean-50 text-ocean-700 font-medium' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">凭证图片（可选）</label>
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden h-32 bg-stone-100">
                <img src={imageUrl} alt="凭证" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageUrl(''); if (fileRef.current) fileRef.current.value = '' }}
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
                className="w-full h-20 border-2 border-dashed border-stone-200 rounded-xl flex items-center justify-center gap-2 text-stone-400 hover:border-ocean-300 hover:text-ocean-500 transition-colors text-sm"
              >
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />上传中…</> : <><Upload className="w-4 h-4" />上传小票或截图</>}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <button
            type="submit"
            disabled={!amount || !purpose || saving}
            className="w-full py-2.5 bg-ocean-600 hover:bg-ocean-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {saving ? '保存中…' : existing ? '保存修改' : '添加账单'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Settlement helpers ────────────────────────────────────────────────────────

interface PersonBalance {
  nickname: string
  paid: number   // CNY
  share: number  // CNY
  balance: number // paid - share; positive = should receive, negative = owes
}

interface Transfer {
  from: string
  to: string
  amount: number
}

function computeBalances(expenses: Expense[], rates: Rates, headCount: number): PersonBalance[] {
  const totalCNY = expenses.reduce((s, e) => s + toCNY(e.amount, e.currency as Currency, rates), 0)
  const share = headCount > 0 ? totalCNY / headCount : 0
  const paid: Record<string, number> = {}
  for (const e of expenses) {
    const name = e.payer ?? e.nickname
    paid[name] = (paid[name] ?? 0) + toCNY(e.amount, e.currency as Currency, rates)
  }
  return Object.entries(paid).map(([nickname, p]) => ({
    nickname,
    paid: p,
    share,
    balance: p - share,
  }))
}

function computeTransfers(balances: PersonBalance[], headCount: number, totalCNY: number): Transfer[] {
  const share = headCount > 0 ? totalCNY / headCount : 0
  // Build mutable balance array including anonymous debtors (people who paid 0)
  const entries = balances.map(b => ({ name: b.nickname, bal: b.balance }))
  // add anonymous slots for unlisted members
  const listedCount = balances.length
  if (headCount > listedCount) {
    entries.push({ name: `其余 ${headCount - listedCount} 人`, bal: -(share * (headCount - listedCount)) })
  }
  const transfers: Transfer[] = []
  const eps = 0.01
  // greedy: always pair largest creditor with largest debtor
  const list = entries.map(e => ({ ...e }))
  for (let i = 0; i < 200; i++) {
    list.sort((a, b) => b.bal - a.bal)
    const creditor = list[0]
    const debtor = list[list.length - 1]
    if (creditor.bal < eps || debtor.bal > -eps) break
    const amount = Math.min(creditor.bal, -debtor.bal)
    transfers.push({ from: debtor.name, to: creditor.name, amount })
    creditor.bal -= amount
    debtor.bal += amount
  }
  return transfers
}

function SettlementTab({
  expenses, rates, rateLoading,
}: { expenses: Expense[]; rates: Rates; rateLoading: boolean }) {
  const [headCount, setHeadCount] = useState(10)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const totalCNY = expenses.reduce((s, e) => s + toCNY(e.amount, e.currency as Currency, rates), 0)
  const share = headCount > 0 ? totalCNY / headCount : 0
  const balances = computeBalances(expenses, rates, headCount)
  const transfers = computeTransfers(balances, headCount, totalCNY)
  const listedCount = balances.length
  const anonCount = Math.max(0, headCount - listedCount)

  function copySettlement() {
    const lines: string[] = [
      `【富国岛旅行 AA 结算】`,
      `总消费：¥${totalCNY.toFixed(1)}，人均：¥${share.toFixed(1)}（${headCount}人，按支出人统计）`,
      '',
      '─ 每人账单 ─',
      ...balances.map(b =>
        `${b.nickname}：已付¥${b.paid.toFixed(1)}，${b.balance >= 0 ? `应收¥${b.balance.toFixed(1)}` : `应付¥${(-b.balance).toFixed(1)}`}`
      ),
      ...(anonCount > 0 ? [`其余${anonCount}人：各应付¥${share.toFixed(1)}`] : []),
      '',
      '─ 转账指令 ─',
      ...transfers.map(t => `${t.from} → ${t.to}  ¥${t.amount.toFixed(1)}`),
    ]
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setToastMsg('已复制！粘贴到微信群即可')
      setTimeout(() => setToastMsg(null), 2000)
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {/* Participant count */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-ocean-500" />
            <span className="text-sm font-semibold text-stone-700">参与人数</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHeadCount(c => Math.max(1, c - 1))}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600 transition-colors"
            >−</button>
            <span className="w-8 text-center font-display font-bold text-xl text-stone-900">{headCount}</span>
            <button
              onClick={() => setHeadCount(c => c + 1)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600 transition-colors"
            >+</button>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-stone-50 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-stone-400 text-xs">总消费</p>
            <p className="font-display font-bold text-lg text-stone-900">¥{totalCNY.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-stone-400 text-xs">人均应付</p>
            <p className="font-display font-bold text-lg text-ocean-600">¥{share.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-stone-400 text-xs">笔数</p>
            <p className="font-display font-bold text-lg text-stone-900">{expenses.length}</p>
          </div>
        </div>
      </div>

      {/* Per-person balance */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-50">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">每人账单</p>
        </div>
        <div className="divide-y divide-stone-50">
          {balances.map(b => (
            <div key={b.nickname} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{b.nickname}</p>
                <p className="text-xs text-stone-400 mt-0.5">已付 ¥{b.paid.toFixed(1)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {b.balance >= 0 ? (
                  <span className="inline-block bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">
                    应收 ¥{b.balance.toFixed(1)}
                  </span>
                ) : (
                  <span className="inline-block bg-rose-50 text-rose-600 rounded-full px-3 py-1 text-xs font-semibold">
                    应付 ¥{(-b.balance).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
          {anonCount > 0 && (
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-400 truncate">其余 {anonCount} 人（未记账）</p>
                <p className="text-xs text-stone-300 mt-0.5">已付 ¥0</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="inline-block bg-rose-50 text-rose-600 rounded-full px-3 py-1 text-xs font-semibold">
                  各付 ¥{share.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer paths */}
      {transfers.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-50 flex items-center justify-between">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">最优转账路径</p>
            <span className="text-xs text-stone-400">{transfers.length} 笔结清</span>
          </div>
          <div className="divide-y divide-stone-50">
            {transfers.map((t, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-rose-600 min-w-0 truncate flex-1">{t.from}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                  <span className="text-sm font-bold text-stone-900">¥{t.amount.toFixed(1)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                </div>
                <span className="text-sm font-semibold text-emerald-600 min-w-0 truncate flex-1 text-right">{t.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-stone-500 text-sm">先在流水 Tab 记录消费，结算自动计算</p>
        </div>
      )}

      {/* Copy button */}
      {expenses.length > 0 && (
        <button
          onClick={copySettlement}
          className="w-full flex items-center justify-center gap-2 py-3 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-2xl transition-colors text-sm"
        >
          <Copy className="w-4 h-4" />
          复制结算文本
        </button>
      )}
      <Toast message={toastMsg ?? ''} visible={!!toastMsg} />
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ExpensePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [nickname, setNickname] = useState('')
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [rates, setRates] = useState<Rates>({ VND: 3450, CNY: 1, SGD: 5.35 })
  const [rateLoading, setRateLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Expense | undefined>()
  const [showLogin, setShowLogin] = useState(false)
  const [showDayFilter, setShowDayFilter] = useState<number | 'all'>('all')
  const [activeTab, setActiveTab] = useState<'ledger' | 'settle'>('ledger')

  const { refreshing: pullRefreshing, pullY } = usePullToRefresh(async () => {
    const data = await getExpenses()
    setExpenses(data)
  })

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data }) => {
      const u = data.user
      setUser(u ?? null)
      if (u) {
        const [profile, member] = await Promise.all([getProfile(u.id), isTeamMember(u.id)])
        setNickname(profile?.nickname ?? u.user_metadata?.name ?? u.email?.split('@')[0] ?? '旅行者')
        setIsMember(member)
        if (member) {
          getExpenses().then(setExpenses)
        }
      }
    })
    fetchRates().then(r => { setRates(r); setRateLoading(false) }).catch(() => setRateLoading(false))
  }, [])

  async function handleJoined() {
    setIsMember(true)
    getExpenses().then(setExpenses)
  }

  function handleSaved(e: Expense) {
    setExpenses(prev => {
      const idx = prev.findIndex(x => x.id === e.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = e; return next }
      return [e, ...prev]
    })
    setShowForm(false)
    setEditTarget(undefined)
  }

  async function handleDelete(id: string) {
    if (!confirm('删除这条记录？')) return
    await deleteExpense(id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  // Loading
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="font-display font-bold text-stone-900 text-xl mb-1">团队记账</h2>
            <p className="text-stone-400 text-sm mb-6">登录后输入团队暗号即可查看和记录消费</p>
            <button
              onClick={() => setShowLogin(true)}
              className="w-full py-3 bg-ocean-600 hover:bg-ocean-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              登录
            </button>
          </div>
        </div>
      </>
    )
  }

  // Team code gate
  if (isMember === false) {
    return <TeamCodeGate onJoined={handleJoined} />
  }

  // Loading membership check
  if (isMember === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Total in CNY
  const totalCNY = expenses.reduce((sum, e) => sum + toCNY(e.amount, e.currency as Currency, rates), 0)

  const filtered = showDayFilter === 'all' ? expenses : expenses.filter(e => e.day === showDayFilter)

  const CURRENCY_SYMBOL: Record<string, string> = { VND: '₫', CNY: '¥', SGD: 'S$' }

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-ocean-600 to-ocean-800 text-white">
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
            <p className="text-ocean-200 text-xs font-medium uppercase tracking-widest mb-1">团队记账</p>
            <h1 className="font-display text-3xl font-bold mb-4">消费流水</h1>
            {/* Total + rate */}
            <div className="bg-white/15 rounded-2xl p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-ocean-200 text-xs mb-1">团队总消费（折合人民币）</p>
                  <p className="font-display font-bold text-4xl">¥{formatCNY(totalCNY)}</p>
                  <p className="text-ocean-200 text-xs mt-1">{expenses.length} 笔记录</p>
                </div>
                <div className="text-right">
                  {rateLoading ? (
                    <p className="text-ocean-300 text-xs">汇率加载中…</p>
                  ) : (
                    <div className="text-ocean-200 text-xs space-y-0.5">
                      <p>1 CNY = {rates.VND.toFixed(0)} VND</p>
                      <p>1 SGD = {(1 / rates.SGD).toFixed(2)} CNY</p>
                      <p className="text-ocean-300">实时汇率</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Tab switcher */}
            <div className="flex gap-1 mt-4">
              {([['ledger', '流水明细'], ['settle', 'AA 结算']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === key
                      ? 'bg-white text-ocean-700'
                      : 'bg-white/15 text-white/80 hover:bg-white/25'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pull-to-refresh indicator */}
        <div
          style={{
            height: pullRefreshing ? 40 : pullY * 0.5,
            opacity: Math.min((pullRefreshing ? 70 : pullY) / 70, 1),
          }}
          className="flex items-center justify-center overflow-hidden"
        >
          {pullRefreshing ? (
            <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
          ) : (
            <p className="text-xs text-white/60">{pullY >= 70 ? '松手刷新' : '↓ 下拉刷新'}</p>
          )}
        </div>

        {/* ── Ledger tab ── */}
        {activeTab === 'ledger' && (
          <div className="max-w-2xl mx-auto px-4 py-5">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-3">
              {/* Day filter */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
                {[{ value: 'all' as const, label: '全部' }, ...DAY_OPTIONS.filter(d => d.value > 0).map(d => ({ value: d.value, label: `Day ${d.value}` }))].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setShowDayFilter(opt.value)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      showDayFilter === opt.value
                        ? 'bg-ocean-600 text-white border-ocean-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-ocean-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setEditTarget(undefined); setShowForm(true) }}
                className="flex-shrink-0 flex items-center gap-1.5 bg-ocean-600 hover:bg-ocean-500 text-white rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                记账
              </button>
            </div>

            {/* Expense list */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
                <div className="text-4xl mb-3">💸</div>
                <p className="text-stone-500 text-sm mb-4">
                  {showDayFilter === 'all' ? '还没有记录，快来记第一笔' : '这天还没有记录'}
                </p>
                {showDayFilter === 'all' && (
                  <button
                    onClick={() => { setEditTarget(undefined); setShowForm(true) }}
                    className="inline-flex items-center gap-2 bg-ocean-600 hover:bg-ocean-500 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加第一笔
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(e => {
                  const cnyVal = toCNY(e.amount, e.currency as Currency, rates)
                  const isOwn = e.user_id === user.id
                  const dayLabel = DAY_OPTIONS.find(d => d.value === e.day)?.label
                  return (
                    <div key={e.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                      {e.image_url && (
                        <img src={e.image_url} alt="凭证" className="w-full h-32 object-cover" />
                      )}
                      <div className="p-4 flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-stone-800 text-sm leading-snug">{e.purpose}</p>
                            <div className="flex-shrink-0 text-right">
                              <p className="font-bold text-stone-900 text-sm">
                                {CURRENCY_SYMBOL[e.currency]}{e.currency === 'VND'
                                  ? e.amount.toLocaleString()
                                  : e.amount.toFixed(2)}
                              </p>
                              {e.currency !== 'CNY' && (
                                <p className="text-stone-400 text-xs">≈ ¥{formatCNY(cnyVal)}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-stone-500 font-medium">{e.payer ?? e.nickname}</span>
                            {dayLabel && (
                              <span className="text-xs bg-ocean-50 text-ocean-600 px-2 py-0.5 rounded-full">{dayLabel}</span>
                            )}
                            <span className="text-xs text-stone-300">
                              {new Date(e.created_at).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        {isOwn && (
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => { setEditTarget(e); setShowForm(true) }}
                              className="p-1.5 text-stone-400 hover:text-ocean-600 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(e.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Settlement tab ── */}
        {activeTab === 'settle' && (
          <SettlementTab expenses={expenses} rates={rates} rateLoading={rateLoading} />
        )}
      </div>

      {showForm && (
        <ExpenseForm
          userId={user.id}
          nickname={nickname}
          existing={editTarget}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditTarget(undefined) }}
        />
      )}
    </>
  )
}
