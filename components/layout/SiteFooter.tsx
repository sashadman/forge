'use client'

import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell py-10">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
                <Hammer className="h-5 w-5" />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-950">
                {siteConfig.name}
              </span>
            </Link>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Skilled trades career discovery and workforce pipeline platform.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-950">
              Career seekers
            </p>

            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <Link href="/trades" className="hover:text-slate-950">
                Trades
              </Link>

              <Link href="/programs" className="hover:text-slate-950">
                Programs
              </Link>

              <Link href="/opportunities" className="hover:text-slate-950">
                Opportunities
              </Link>

              <Link href="/quiz" className="hover:text-slate-950">
                Career quiz
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-950">
              Partner portals
            </p>

            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <Link href="/for-employers" className="hover:text-slate-950">
                Employer portal
              </Link>

              <Link href="/for-programs" className="hover:text-slate-950">
                Training provider portal
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © {currentYear} Shadman Consulting. All rights reserved.
        </div>
      </div>
    </footer>
  )
}