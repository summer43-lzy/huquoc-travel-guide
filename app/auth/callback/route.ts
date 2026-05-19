import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GitHub Pages static export: this route is server-only and won't function,
// but must be present for the build to succeed.
export const dynamic = 'force-static'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/profile'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
