'use client'

import { useState } from 'react'
import { X, Mail } from 'lucide-react'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

// Non-PKCE client for OTP — PKCE stores a verifier locally which breaks verifyOtp
function createOtpClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: 'implicit', autoRefreshToken: true, persistSession: true } }
  )
}

interface Props {
  onClose: () => void
}

type Step = 'input-email' | 'input-code' | 'success'

export default function LoginModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('input-email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Step 1: send OTP code ──────────────────────────────────────────────────
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createOtpClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    setLoading(false)
    if (error) {
      setError('发送失败：' + error.message)
    } else {
      setStep('input-code')
    }
  }

  // ── Step 2: verify OTP code ────────────────────────────────────────────────
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createOtpClient()
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'email',
    })
    setLoading(false)
    if (error || !data.session) {
      setError('验证码错误或已过期，请重新发送')
    } else {
      // Sync session into the SSR client so Navbar picks it up after reload
      const mainClient = createClient()
      await mainClient.auth.setSession(data.session)
      setStep('success')
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 1200)
    }
  }

  async function handleGoogleLogin() {
    const ua = navigator.userAgent
    if (/MicroMessenger|WeiBo|QQ\/|FBAN|FBAV/i.test(ua)) {
      alert('请用 Safari 或 Chrome 浏览器打开后再登录，微信内置浏览器不支持 Google 登录。')
      return
    }
    const supabase = createClient()
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${basePath}/auth/callback` },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-display font-bold text-stone-900">
            {step === 'input-email' && '登录账号'}
            {step === 'input-code' && '输入验证码'}
            {step === 'success' && '登录成功'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        <div className="p-5">

          {/* ── Step 1: email input ── */}
          {step === 'input-email' && (
            <>
              <form onSubmit={handleSendCode} className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-semibold text-stone-500 mb-1.5 block">
                    邮箱登录 · 国内直接可用，无需翻墙
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="QQ邮箱 / 163 / Gmail 均可"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-ocean-400 transition-colors"
                    required
                  />
                </div>
                {error && <p className="text-xs text-rose-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-ocean-600 hover:bg-ocean-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {loading ? '发送中...' : '发送验证码'}
                </button>
              </form>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-xs text-stone-400">或</span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google 登录（需要翻墙）
              </button>
            </>
          )}

          {/* ── Step 2: code input ── */}
          {step === 'input-code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-center py-2">
                <div className="text-3xl mb-3">📬</div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  验证码已发送至<br />
                  <span className="font-semibold text-ocean-600">{email}</span>
                </p>
                <p className="text-stone-400 text-xs mt-1">请查收邮件，将 6 位数字验证码填入下方</p>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6 位验证码"
                className="w-full border border-stone-200 rounded-xl px-3 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-ocean-400 transition-colors"
                maxLength={6}
                required
              />
              {error && <p className="text-xs text-rose-500 text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-2.5 bg-ocean-600 hover:bg-ocean-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {loading ? '验证中...' : '确认登录'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('input-email'); setCode(''); setError('') }}
                className="w-full text-xs text-stone-400 hover:text-stone-600 py-1"
              >
                重新发送 / 换个邮箱
              </button>
            </form>
          )}

          {/* ── Step 3: success ── */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold text-stone-800">登录成功！</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
