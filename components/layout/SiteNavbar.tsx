'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Hammer, Menu, X } from 'lucide-react'
import { siteConfig } from '@/config/site'
import AuthNav from '@/components/layout/AuthNav'

const seekerLinks = [
  { href: '/trades', label: 'Career Paths' },
  { href: '/programs', label: 'Training Programs' },
  { href: '/opportunities', label: 'Jobs & Apprenticeships' },
]

const partnerLinks = [
  { href: '/for-employers', label: 'For Employers' },
  { href: '/for-programs', label: 'For Training Providers' },
]

export default function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
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
            {seekerLinks.map((link) => (
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
            <Link
              href="/for-employers"
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              For Employers
            </Link>

            <AuthNav />

            <Link href="/quiz" className="btn-dark px-5 py-2 text-sm">
              Find your path
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <div className="grid gap-2">
              <p className="px-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                Explore
              </p>

              {seekerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/quiz"
                onClick={closeMenu}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              >
                Career Quiz
              </Link>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="px-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                Partner portals
              </p>

              <div className="mt-2 grid gap-2">
                {partnerLinks.map((link) => (
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

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="px-4">
                <AuthNav />
              </div>

              <Link
                href="/quiz"
                onClick={closeMenu}
                className="btn-dark mt-4 w-full px-5 py-3 text-sm"
              >
                Find your path
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}