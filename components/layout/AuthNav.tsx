'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type AuthUser = {
  id: string
  email?: string
}

export default function AuthNav() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user ? { id: user.id, email: user.email ?? undefined } : null)
      setLoading(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user

      setUser(
        sessionUser
          ? { id: sessionUser.id, email: sessionUser.email ?? undefined }
          : null
      )
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="hidden h-10 w-32 rounded-full bg-slate-100 sm:block" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className="hidden rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
      >
        Sign in
      </Link>
    )
  }

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <Link
        href="/dashboard"
        className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Dashboard
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Sign out
      </button>
    </div>
  )
}