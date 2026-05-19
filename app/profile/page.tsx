'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import UserProfile from '@/components/profile/UserProfile'
import GuestProfile from '@/components/profile/GuestProfile'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return <UserProfile user={user} />
  return <GuestProfile />
}
