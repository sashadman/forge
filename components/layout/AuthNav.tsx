'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/theme/ThemeProvider'

type AuthUser = {
  id: string
  email?: string
  role?: string | null
}

export default function AuthNav() {
  const router = useRouter()
  const supabase = createClient()
  const { isLight } = useTheme()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setUser(null)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      setUser({
        id: user.id,
        email: user.email ?? undefined,
        role: profile?.role ?? null,
      })

      setLoading(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user

      if (!sessionUser) {
        setUser(null)
        setLoading(false)
        return
      }

      async function loadProfileRole() {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .maybeSingle()

        setUser({
          id: sessionUser.id,
          email: sessionUser.email ?? undefined,
          role: profile?.role ?? null,
        })

        setLoading(false)
      }

      loadProfileRole()
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

  const loadingClass = isLight
    ? 'hidden h-10 w-32 rounded-full bg-slate-100 sm:block'
    : 'hidden h-10 w-32 rounded-full bg-white/10 sm:block'

  const secondaryButtonClass = isLight
    ? 'rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
    : 'rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-white'

  const signInButtonClass = isLight
    ? 'hidden rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex'
    : 'hidden rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-white sm:inline-flex'

  const adminButtonClass = isLight
    ? 'rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100'
    : 'rounded-full border border-orange-300/30 bg-orange-500/15 px-5 py-2 text-sm font-semibold text-orange-200 transition hover:border-orange-300/50 hover:bg-orange-500/20'

  const signOutButtonClass = isLight
    ? 'rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800'
    : 'rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-100'

  if (loading) {
    return <div className={loadingClass} />
  }

  if (!user) {
    return (
      <Link href="/auth/sign-in" className={signInButtonClass}>
        Sign in
      </Link>
    )
  }

  const isAdmin = user.role === 'admin'

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <Link href="/dashboard" className={secondaryButtonClass}>
        Dashboard
      </Link>

      {isAdmin && (
        <Link href="/admin" className={adminButtonClass}>
          Admin
        </Link>
      )}

      <button
        type="button"
        onClick={handleSignOut}
        className={signOutButtonClass}
      >
        Sign out
      </button>
    </div>
  )
}