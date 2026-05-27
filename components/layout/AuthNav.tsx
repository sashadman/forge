'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/theme/ThemeProvider'

type AuthUser = {
  id: string
  email?: string
  role?: string | null
  hasEmployerProfile: boolean
  hasProviderWorkspace: boolean
}

function getDashboardHref(user: AuthUser) {
  if (user.hasEmployerProfile) return '/employers/dashboard'
  if (user.hasProviderWorkspace) return '/training-providers/dashboard'
  if (user.role === 'admin') return '/admin'

  return '/dashboard'
}

export default function AuthNav() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { isLight } = useTheme()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function buildAuthUser(authUser: {
      id: string
      email?: string | null
    }): Promise<AuthUser> {
      const [profileResult, employerResult, providerMembershipResult] =
        await Promise.all([
          supabase
            .from('profiles')
            .select('role')
            .eq('id', authUser.id)
            .maybeSingle(),

          supabase
            .from('employers')
            .select('id')
            .eq('owner_id', authUser.id)
            .maybeSingle(),

          supabase
            .from('training_provider_memberships')
            .select('id')
            .eq('user_id', authUser.id)
            .eq('status', 'active')
            .limit(1)
            .maybeSingle(),
        ])

      if (profileResult.error) {
        console.error('Failed to load auth profile:', profileResult.error)
      }

      if (employerResult.error) {
        console.error('Failed to load auth employer profile:', employerResult.error)
      }

      if (providerMembershipResult.error) {
        console.error(
          'Failed to load auth provider membership:',
          providerMembershipResult.error
        )
      }

      return {
        id: authUser.id,
        email: authUser.email ?? undefined,
        role: profileResult.data?.role ?? null,
        hasEmployerProfile: Boolean(employerResult.data),
        hasProviderWorkspace: Boolean(providerMembershipResult.data),
      }
    }

    async function loadUser() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted) return

      if (!user) {
        setUser(null)
        setLoading(false)
        return
      }

      const authUser = await buildAuthUser(user)

      if (!isMounted) return

      setUser(authUser)
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

      async function refreshAuthUser() {
        const authUser = await buildAuthUser(sessionUser)
        if (!isMounted) return

        setUser(authUser)
        setLoading(false)
      }

      refreshAuthUser()
    })

    return () => {
      isMounted = false
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

  const dashboardHref = getDashboardHref(user)
  const isAdmin = user.role === 'admin'

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <Link href={dashboardHref} className={secondaryButtonClass}>
        Dashboard
      </Link>

      {isAdmin && dashboardHref !== '/admin' && (
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