'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type AuthUser = {
  id: string
  email?: string
  role?: string | null
}

function getDashboardHref(pathname: string, user: AuthUser) {
  if (pathname.startsWith('/employers') || pathname.startsWith('/for-employers')) {
    return '/employers/dashboard'
  }

  if (
    pathname.startsWith('/training-providers') ||
    pathname.startsWith('/for-programs')
  ) {
    return '/training-providers/dashboard'
  }

  if (pathname.startsWith('/admin') && user.role === 'admin') {
    return '/admin'
  }

  return '/dashboard'
}

export default function AuthNav() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function buildAuthUser(authUser: {
      id: string
      email?: string | null
    }): Promise<AuthUser> {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .maybeSingle()

      if (error) {
        console.error('Failed to load auth profile:', error)
      }

      return {
        id: authUser.id,
        email: authUser.email ?? undefined,
        role: profile?.role ?? null,
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

  const loadingClass =
    'hidden h-10 w-32 rounded-[var(--radius-pill)] bg-[var(--bg-raised)] sm:block'

  const secondaryButtonClass =
    'rounded-[var(--radius-pill)] border border-[var(--border-mid)] px-5 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:border-[var(--border-cyan)] hover:bg-[var(--cyan-muted)] hover:text-[var(--cyan)]'

  const signInButtonClass =
    'hidden rounded-[var(--radius-pill)] border border-[var(--border-mid)] px-5 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:border-[var(--border-cyan)] hover:bg-[var(--cyan-muted)] hover:text-[var(--cyan)] sm:inline-flex'

  const adminButtonClass =
    'rounded-[var(--radius-pill)] border border-[rgba(255,179,0,0.25)] bg-[var(--amber-muted)] px-5 py-2 text-sm font-bold text-[var(--amber)] transition hover:shadow-[var(--amber-glow)]'

  const signOutButtonClass =
    'rounded-[var(--radius-pill)] bg-[var(--text-primary)] px-5 py-2 text-sm font-bold text-[var(--bg-void)] transition hover:bg-[var(--cyan)]'

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

  const dashboardHref = getDashboardHref(pathname, user)
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