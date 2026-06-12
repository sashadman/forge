'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  Menu,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import AuthNav from '@/components/layout/AuthNav'
import ThemeToggle from '@/components/theme/ThemeToggle'

const roleLinks = [
  {
    href: '/career-seeker',
    label: 'Career Seeker',
    description: 'Explore paths, training programs, jobs, and readiness tools.',
    icon: UserRound,
    level: 'LVL 01',
  },
  {
    href: '/for-employers',
    label: 'Employer',
    description: 'Create a profile and submit hiring opportunities for review.',
    icon: BriefcaseBusiness,
    level: 'HIRING',
  },
  {
    href: '/for-programs',
    label: 'Training Provider',
    description: 'Request access, manage programs, and submit updates for review.',
    icon: GraduationCap,
    level: 'PROVIDER',
  },
]

const seekerLinks = [
  { href: '/trades', label: 'Career Paths' },
  { href: '/programs', label: 'Training Programs' },
  { href: '/opportunities', label: 'Jobs & Apprenticeships' },
  { href: '/pricing', label: 'Pricing' },
]

export default function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
    setIsRoleMenuOpen(false)
  }

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: 'color-mix(in srgb, var(--bg-base) 92%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="section-shell">
        <div className="flex items-center justify-between py-3">

          {/* Brand */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <div
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white transition-all"
              style={{
                boxShadow: '0 8px 18px rgba(15,23,42,0.12)',
              }}
            >
              <Image
                src="/AraSkills-Logo.png"
                alt={`${siteConfig.name} logo`}
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <span
                className="font-display text-base font-800 tracking-tight"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}
              >
                {siteConfig.name}
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {seekerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />

            {/* Role picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen((v) => !v)}
                className="btn-outline"
                style={{ padding: '8px 16px', fontSize: '12px' }}
                aria-expanded={isRoleMenuOpen}
              >
                <Zap className="h-3.5 w-3.5" />
                Choose your path
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform"
                  style={{ transform: isRoleMenuOpen ? 'rotate(180deg)' : 'none' }}
                />
              </button>

              {isRoleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl p-2 shadow-2xl"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-mid)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                  }}
                >
                  <p
                    className="px-3 py-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}
                  >
                    Select your role
                  </p>
                  <div className="grid gap-1">
                    {roleLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenu}
                          className="group rounded-xl p-3 transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-raised)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div className="flex gap-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                              style={{ background: 'var(--cyan-muted)', color: 'var(--cyan)' }}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                                  {link.label}
                                </p>
                                <span className="level-badge" style={{ fontSize: '9px', padding: '2px 6px' }}>
                                  {link.level}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs leading-5" style={{ color: 'var(--text-secondary)' }}>
                                {link.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <AuthNav />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
              style={{
                border: '1px solid var(--border-mid)',
                background: 'var(--bg-raised)',
                color: 'var(--text-primary)',
              }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="pb-4 lg:hidden"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="mt-4 grid gap-1">
              <p
                className="px-3 pb-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}
              >
                Choose your path
              </p>
              {roleLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-raised)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--cyan)' }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        {link.label}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {link.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-4 grid gap-1" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <p
                className="px-3 pb-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}
              >
                Career seeker tools
              </p>
              {seekerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 px-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <AuthNav />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
