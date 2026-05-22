'use client'

import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell py-10">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
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
              Skilled-trades pathway platform for career seekers, employers, and
              training providers.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-950">
              Career Seeker
            </p>

            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <Link href="/trades" className="hover:text-slate-950">
                Career Paths
              </Link>

              <Link href="/programs" className="hover:text-slate-950">
                Training Programs
              </Link>

              <Link href="/opportunities" className="hover:text-slate-950">
                Jobs & Apprenticeships
              </Link>

              <Link href="/quiz" className="hover:text-slate-950">
                Career Quiz
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-950">
              Employer
            </p>

            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <Link href="/for-employers" className="hover:text-slate-950">
                Employer Overview
              </Link>

              <Link href="/employers/new" className="hover:text-slate-950">
                Create Employer Profile
              </Link>

              <Link href="/employers/sign-in" className="hover:text-slate-950">
                Employer Sign In
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-950">
              Training Provider
            </p>

            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <Link href="/for-programs" className="hover:text-slate-950">
                Provider Overview
              </Link>

              <Link href="/programs" className="hover:text-slate-950">
                Training Program Directory
              </Link>

              <Link href="/auth/sign-in" className="hover:text-slate-950">
                Sign In
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