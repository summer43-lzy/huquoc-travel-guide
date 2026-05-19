'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient as createImplicitClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [msg, setMsg] = useState('正在完成登录...')

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    const hash = window.location.hash

    if (code) {
      // PKCE flow — Google OAuth
      const supabase = createClient()
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setMsg('登录失败，正在返回首页...')
          setTimeout(() => router.replace('/'), 2000)
        } else {
          router.replace('/profile')
        }
      })
      return
    }

    if (hash.includes('access_token')) {
      // Implicit flow — email magic link
      // Use a supabase client with detectSessionInUrl:true to process the hash
      const supabase = createImplicitClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { flowType: 'implicit', detectSessionInUrl: true } }
      )
      // getSession triggers hash parsing and establishes the session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // Persist session into the SSR client's cookies via browser client
          router.replace('/profile')
        } else {
          setMsg('登录失败，正在返回首页...')
          setTimeout(() => router.replace('/'), 2000)
        }
      })
      return
    }

    // No code, no hash — stray visit
    setMsg('未检测到登录信息，正在返回首页...')
    setTimeout(() => router.replace('/'), 2000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-500 text-sm">{msg}</p>
      </div>
    </div>
  )
}
