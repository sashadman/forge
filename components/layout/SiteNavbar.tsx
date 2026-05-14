import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'
import AuthNav from '@/components/layout/AuthNav'

export default function SiteNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="section-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-900/20">
            <Hammer className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/trades" className="transition hover:text-slate-950">
            Trades
          </Link>

          <Link href="/programs" className="transition hover:text-slate-950">
            Programs
          </Link>

          <Link href="/opportunities" className="transition hover:text-slate-950">
            Opportunities
          </Link>

          <Link href="/quiz" className="transition hover:text-slate-950">
            Quiz
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <AuthNav />

          <Link href="/quiz" className="btn-dark px-5 py-2 text-sm">
            Find your trade
          </Link>
        </div>
      </div>
    </nav>
  )
}