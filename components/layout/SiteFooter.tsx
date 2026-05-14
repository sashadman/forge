'use client'

import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell py-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
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

          <div className="grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-2 md:text-right">
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
              Quiz
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © {currentYear} Shadman Consulting. All rights reserved.
        </div>
      </div>
    </footer>
  )
}