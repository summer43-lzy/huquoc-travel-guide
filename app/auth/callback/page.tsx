'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [msg, setMsg] = useState('正在完成登录...')

  useEffect(() => {
    const supabase = createClient()
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      // PKCE flow (Google OAuth / magic link PKCE)
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

    // Implicit / hash flow (magic link default)
    // Supabase browser client processes the hash automatically on init;
    // listen for the SIGNED_IN event or poll getSession.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/profile')
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/profile')
      } else if (!window.location.hash.includes('access_token')) {
        setMsg('未检测到登录信息，正在返回首页...')
        setTimeout(() => router.replace('/'), 2500)
      }
    })

    return () => subscription.unsubscribe()
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
