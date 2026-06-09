'use client'

import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useTheme } from '@/components/theme/ThemeProvider'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const { isLight } = useTheme()

  const footerClass = isLight
    ? 'border-t border-slate-200 bg-white'
    : 'border-t border-white/10 bg-slate-950'

  const brandTextClass = isLight
    ? 'text-xl font-bold tracking-tight text-slate-950'
    : 'text-xl font-bold tracking-tight text-white'

  const descriptionClass = isLight
    ? 'mt-4 max-w-xl text-sm leading-6 text-slate-500'
    : 'mt-4 max-w-xl text-sm leading-6 text-slate-400'

  const headingClass = isLight
    ? 'text-sm font-bold uppercase tracking-wide text-slate-950'
    : 'text-sm font-bold uppercase tracking-wide text-white'

  const linkGroupClass = isLight
    ? 'mt-4 grid gap-3 text-sm font-semibold text-slate-600'
    : 'mt-4 grid gap-3 text-sm font-semibold text-slate-400'

  const linkClass = isLight
    ? 'hover:text-slate-950'
    : 'hover:text-white'

  const bottomClass = isLight
    ? 'mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500'
    : 'mt-8 border-t border-white/10 pt-6 text-sm text-slate-500'

  return (
    <footer className={footerClass}>
      <div className="section-shell py-10">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
                <Hammer className="h-5 w-5" />
              </div>

              <span className={brandTextClass}>{siteConfig.name}</span>
            </Link>

            <p className={descriptionClass}>
              Skilled-trades pathway platform for career seekers, employers, and
              verified training providers.
            </p>
          </div>

          <div>
            <p className={headingClass}>Career Seekers</p>

            <div className={linkGroupClass}>
              <Link href="/trades" className={linkClass}>
                Career Paths
              </Link>

              <Link href="/programs" className={linkClass}>
                Training Programs
              </Link>

              <Link href="/opportunities" className={linkClass}>
                Jobs & Apprenticeships
              </Link>

              <Link href="/quiz" className={linkClass}>
                Career Quiz
              </Link>
            </div>
          </div>

          <div>
            <p className={headingClass}>Employers</p>

            <div className={linkGroupClass}>
              <Link href="/for-employers" className={linkClass}>
                Employers Overview
              </Link>

              <Link href="/employers/sign-up" className={linkClass}>
                Create Employers Account
              </Link>

              <Link href="/employers/sign-in" className={linkClass}>
                Employers Sign In
              </Link>
            </div>
          </div>

          <div>
            <p className={headingClass}>Training Providers</p>

            <div className={linkGroupClass}>
              <Link href="/for-programs" className={linkClass}>
                Provider Overview
              </Link>

              <Link href="/training-providers/claim" className={linkClass}>
                Request Provider Access
              </Link>

              <Link href="/for-programs#provider-workflow" className={linkClass}>
                Provider Workflow
              </Link>

              <Link href="/for-programs#program-data" className={linkClass}>
                Program Data Model
              </Link>

              <Link href="/for-programs#provider-insights" className={linkClass}>
                Provider Insights
              </Link>
            </div>
          </div>
        </div>

        <div className={bottomClass}>
          © {currentYear} Shadman Consulting. All rights reserved.
        </div>
      </div>
    </footer>
  )
}