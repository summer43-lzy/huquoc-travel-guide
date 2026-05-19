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
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setMsg('登录失败，正在返回首页...')
          setTimeout(() => router.replace('/'), 2000)
        } else {
          router.replace('/profile')
        }
      })
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        router.replace(session ? '/profile' : '/')
      })
    }
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
