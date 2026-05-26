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
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import AuthNav from '@/components/layout/AuthNav'
import ThemeToggle from '@/components/theme/ThemeToggle'

const roleLinks = [
  {
    href: '/trades',
    label: 'Career Seeker',
    description: 'Explore paths, training programs, and jobs.',
    icon: UserRound,
  },
  {
    href: '/for-employers',
    label: 'Employer',
    description: 'Create a profile and manage hiring listings.',
    icon: BriefcaseBusiness,
  },
  {
    href: '/for-programs',
    label: 'Training Provider',
    description: 'Review provider workflow, program data, and future tools.',
    icon: GraduationCap,
  },
]

const seekerLinks = [
  { href: '/trades', label: 'Career Paths' },
  { href: '/programs', label: 'Training Programs' },
  { href: '/opportunities', label: 'Jobs & Apprenticeships' },
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
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="section-shell">
        <div className="flex items-center justify-between py-4">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-900/20">
              <Hammer className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-950">
              {siteConfig.name}
            </span>
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            {seekerLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-slate-950"
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
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                aria-expanded={isRoleMenuOpen}
              >
                Choose your path
                <ChevronDown className="h-4 w-4" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/10">
                  <div className="px-3 py-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
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
                          className="group rounded-2xl p-3 transition hover:bg-orange-50"
                        >
                          <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="font-bold text-slate-950 group-hover:text-orange-700">
                                {link.label}
                              </p>

                              <p className="mt-1 text-sm leading-5 text-slate-500">
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
    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm"
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
  >
    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </button>
</div>
        </div>

        {isOpen && (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <div className="grid gap-2">
              <p className="px-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                Choose your path
              </p>

              {roleLinks.map((link) => {
                const Icon = link.icon

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-2xl px-4 py-3 hover:bg-slate-100"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 text-orange-600" />

                      <div>
                        <p className="font-bold text-slate-800">{link.label}</p>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="px-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                Career seeker tools
              </p>

              <div className="mt-2 grid gap-2">
                {seekerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 px-4 pt-4">
              <AuthNav />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}