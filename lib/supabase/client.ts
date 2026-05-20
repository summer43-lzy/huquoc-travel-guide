import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  return createBrowserClient(url, key, {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 30, // 30 天
      sameSite: 'lax',
    },
  })
}
