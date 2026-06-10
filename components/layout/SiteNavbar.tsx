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
import { useTheme } from '@/components/theme/ThemeProvider'

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
  const { isLight } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
    setIsRoleMenuOpen(false)
  }

  const navClass = isLight
    ? 'sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur'
    : 'sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur'

  const brandTextClass = isLight
    ? 'text-xl font-bold tracking-tight text-slate-950'
    : 'text-xl font-bold tracking-tight text-white'

  const desktopLinkClass = isLight
    ? 'transition hover:text-slate-950'
    : 'transition text-slate-300 hover:text-white'

  const desktopLinksWrapperClass = isLight
    ? 'hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex'
    : 'hidden items-center gap-6 text-sm font-semibold text-slate-300 lg:flex'

  const roleButtonClass = isLight
    ? 'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700'
    : 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-orange-300/40 hover:bg-white/15 hover:text-orange-200'

  const roleMenuClass = isLight
    ? 'absolute right-0 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/10'
    : 'absolute right-0 mt-3 w-80 rounded-3xl border border-white/10 bg-slate-950 p-3 shadow-2xl shadow-black/40'

  const roleMenuEyebrowClass = isLight
    ? 'text-xs font-bold uppercase tracking-wide text-slate-400'
    : 'text-xs font-bold uppercase tracking-wide text-slate-500'

  const roleMenuLinkClass = isLight
    ? 'group rounded-2xl p-3 transition hover:bg-orange-50'
    : 'group rounded-2xl p-3 transition hover:bg-white/10'

  const roleMenuTitleClass = isLight
    ? 'font-bold text-slate-950 group-hover:text-orange-700'
    : 'font-bold text-white group-hover:text-orange-200'

  const roleMenuDescriptionClass = isLight
    ? 'mt-1 text-sm leading-5 text-slate-500'
    : 'mt-1 text-sm leading-5 text-slate-400'

  const mobileButtonClass = isLight
    ? 'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm'
    : 'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-slate-100 shadow-sm'

  const mobileMenuClass = isLight
    ? 'border-t border-slate-200 py-4 lg:hidden'
    : 'border-t border-white/10 py-4 lg:hidden'

  const mobileSectionLabelClass = isLight
    ? 'px-4 text-xs font-bold uppercase tracking-wide text-slate-400'
    : 'px-4 text-xs font-bold uppercase tracking-wide text-slate-500'

  const mobileRoleLinkClass = isLight
    ? 'rounded-2xl px-4 py-3 hover:bg-slate-100'
    : 'rounded-2xl px-4 py-3 hover:bg-white/10'

  const mobileRoleTitleClass = isLight
    ? 'font-bold text-slate-800'
    : 'font-bold text-white'

  const mobileRoleDescriptionClass = isLight
    ? 'mt-1 text-sm leading-5 text-slate-500'
    : 'mt-1 text-sm leading-5 text-slate-400'

  const mobileDividerClass = isLight
    ? 'mt-4 border-t border-slate-200 pt-4'
    : 'mt-4 border-t border-white/10 pt-4'

  const mobileAuthWrapperClass = isLight
    ? 'mt-4 border-t border-slate-200 px-4 pt-4'
    : 'mt-4 border-t border-white/10 px-4 pt-4'

  const mobileToolLinkClass = isLight
    ? 'rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    : 'rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white'

  return (
    <nav className={navClass}>
      <div className="section-shell">
        <div className="flex items-center justify-between py-4">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-900/20">
              <Hammer className="h-5 w-5" />
            </div>

            <span className={brandTextClass}>{siteConfig.name}</span>
          </Link>

          <div className={desktopLinksWrapperClass}>
            {seekerLinks.slice(0, 4).map((link) => (
              <Link key={link.href} href={link.href} className={desktopLinkClass}>
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
                className={roleButtonClass}
                aria-expanded={isRoleMenuOpen}
              >
                Choose your path
                <ChevronDown className="h-4 w-4" />
              </button>

              {isRoleMenuOpen && (
                <div className={roleMenuClass}>
                  <div className="px-3 py-2">
                    <p className={roleMenuEyebrowClass}>Select your role</p>
                  </div>

                  <div className="grid gap-2">
                    {roleLinks.map((link) => {
                      const Icon = link.icon

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenu}
                          className={roleMenuLinkClass}
                        >
                          <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div>
                              <p className={roleMenuTitleClass}>{link.label}</p>

                              <p className={roleMenuDescriptionClass}>
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
              className={mobileButtonClass}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className={mobileMenuClass}>
            <div className="grid gap-2">
              <p className={mobileSectionLabelClass}>Choose your path</p>

              {roleLinks.map((link) => {
                const Icon = link.icon

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={mobileRoleLinkClass}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 text-orange-600" />

                      <div>
                        <p className={mobileRoleTitleClass}>{link.label}</p>

                        <p className={mobileRoleDescriptionClass}>
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className={mobileDividerClass}>
              <p className={mobileSectionLabelClass}>Career seeker tools</p>

              <div className="mt-2 grid gap-2">
                {seekerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={mobileToolLinkClass}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className={mobileAuthWrapperClass}>
              <AuthNav />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}