'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  Hammer,
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
  },
  {
    href: '/for-employers',
    label: 'Employer',
    description: 'Create a profile and submit hiring opportunities for review.',
    icon: BriefcaseBusiness,
  },
  {
    href: '/for-programs',
    label: 'Training Provider',
    description: 'Request access, manage programs, and submit updates for review.',
    icon: GraduationCap,
  },
]

const seekerLinks = [
  { href: '/trades', label: 'Career Paths' },
  { href: '/programs', label: 'Training Programs' },
  { href: '/opportunities', label: 'Jobs & Apprenticeships' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/quiz', label: 'Career Quiz' },
]

export default function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
    setIsRoleMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-void)]/95 backdrop-blur-xl">
      <div className="section-shell">
        <div className="flex min-h-[5.25rem] items-center justify-between gap-5 py-4">
          <Link href="/" onClick={closeMenu} className="group flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-[var(--radius-lg)] bg-[var(--cyan)] text-[var(--text-on-cyan)] shadow-[var(--cyan-glow)] transition group-hover:-translate-y-0.5">
              <Hammer className="h-5 w-5" />
            </div>

            <div className="leading-none">
              <p className="font-display text-xl font-black tracking-tight text-[var(--text-primary)]">
                {siteConfig.name}
              </p>
              <p className="mt-1 hidden font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] sm:block">
                Skilled trades
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 font-display text-sm font-black leading-tight text-[var(--text-secondary)] lg:flex">
            {seekerLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[var(--cyan)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen((current) => !current)}
                className="inline-flex min-w-[18rem] items-center justify-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-mid)] bg-transparent px-6 py-4 font-display text-sm font-black uppercase tracking-[0.16em] text-[var(--text-primary)] transition hover:border-[var(--border-cyan)] hover:bg-[var(--cyan-muted)] hover:text-[var(--cyan)]"
                aria-expanded={isRoleMenuOpen}
                aria-haspopup="menu"
              >
                <Zap className="h-4 w-4 text-[var(--amber)]" />
                Choose your path
                <ChevronDown className="h-4 w-4" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-3 w-96 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-overlay)] p-3 shadow-2xl shadow-black/40">
                  <div className="px-3 py-2">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">
                      Select your role
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {roleLinks.map((link) => {
                      const Icon = link.icon

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenu}
                          className="group rounded-[var(--radius-lg)] p-3 transition hover:bg-[var(--cyan-muted)]"
                        >
                          <div className="flex gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--border-cyan)] bg-[var(--cyan-muted)] text-[var(--cyan)]">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="font-display font-black text-[var(--text-primary)] group-hover:text-[var(--cyan)]">
                                {link.label}
                              </p>

                              <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
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

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] border border-[var(--border-mid)] bg-[var(--bg-raised)] text-[var(--text-primary)]"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-[var(--border)] py-5 lg:hidden">
            <div className="grid gap-2">
              <p className="px-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Choose your path
              </p>

              {roleLinks.map((link) => {
                const Icon = link.icon

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-[var(--radius-lg)] px-4 py-3 transition hover:bg-[var(--cyan-muted)]"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 text-[var(--cyan)]" />

                      <div>
                        <p className="font-display font-black text-[var(--text-primary)]">
                          {link.label}
                        </p>

                        <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <p className="px-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Career seeker tools
              </p>

              <div className="mt-2 grid gap-2">
                {seekerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-[var(--radius-lg)] px-4 py-3 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-[var(--cyan-muted)] hover:text-[var(--cyan)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--border)] px-4 pt-5">
              <AuthNav />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
