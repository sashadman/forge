'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu, X, ChevronDown, Zap, HardHat, LogOut,
  User, LayoutDashboard, Hammer
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { label: 'Explore Trades', href: '/trades' },
  { label: 'Find Programs', href: '/programs' },
  { label: 'Employers', href: '/employers' },
  { label: 'Career Quiz', href: '/quiz' },
]

interface NavbarProps {
  variant?: 'light' | 'dark' | 'transparent'
}

export default function Navbar({ variant = 'light' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) setUser(profile as UserProfile)
          })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isDark = variant === 'dark' || (variant === 'transparent' && !isScrolled)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : isDark
            ? 'bg-transparent'
            : 'bg-white border-b border-slate-100'
      )}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-forge-orange rounded-lg flex items-center justify-center
                            group-hover:scale-105 transition-transform duration-150">
              <Hammer size={16} className="text-white" />
            </div>
            <span className={cn(
              'font-display text-xl font-bold tracking-tight',
              isDark && !isScrolled ? 'text-white' : 'text-forge-navy'
            )}>
              Forge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  pathname === link.href
                    ? 'bg-forge-ash text-forge-navy'
                    : isDark && !isScrolled
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-forge-steel hover:text-forge-navy hover:bg-forge-ash'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isDark && !isScrolled
                      ? 'text-white hover:bg-white/10'
                      : 'text-forge-navy hover:bg-forge-ash'
                  )}
                >
                  <div className="w-7 h-7 bg-forge-orange text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {user.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.full_name?.split(' ')[0] ?? 'Account'}</span>
                  <ChevronDown size={14} className={cn('transition-transform', isUserMenuOpen && 'rotate-180')} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <p className="text-xs font-semibold text-forge-steel capitalize mt-0.5">{user.role} account</p>
                    </div>
                    <Link
                      href={`/dashboard/${user.role}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-forge-steel hover:text-forge-navy hover:bg-forge-ash"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-forge-steel hover:text-forge-navy hover:bg-forge-ash"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={15} />
                      Profile
                    </Link>
                    <div className="border-t border-slate-50 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    'text-sm font-medium px-4 py-2 rounded-lg transition-all',
                    isDark && !isScrolled
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-forge-steel hover:text-forge-navy'
                  )}
                >
                  Sign in
                </Link>
                <Link href="/signup" className="btn-primary text-sm px-5 py-2.5">
                  Get started
                </Link>
              </>
            )}

            {/* Employer CTA */}
            <Link
              href="/for-employers"
              className={cn(
                'hidden lg:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition-all',
                isDark && !isScrolled
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-200 text-forge-steel hover:border-slate-300 hover:text-forge-navy'
              )}
            >
              <HardHat size={14} />
              For employers
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg',
              isDark && !isScrolled ? 'text-white' : 'text-forge-navy'
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="section-container py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-forge-steel hover:text-forge-navy hover:bg-forge-ash"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href={`/dashboard/${user.role}`} onClick={() => setIsOpen(false)} className="btn-secondary">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="btn-ghost text-red-500">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="btn-secondary">
                    Sign in
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="btn-primary">
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}