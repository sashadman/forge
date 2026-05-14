import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'
import AuthNav from '@/components/layout/AuthNav'

export default function SiteNavbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
            <Hammer className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/trades" className="hover:text-slate-950">
            Trades
          </Link>

          <Link href="/programs" className="hover:text-slate-950">
            Programs
          </Link>

          <Link href="/quiz" className="hover:text-slate-950">
            Quiz
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <AuthNav />

          <Link
            href="/quiz"
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Find your trade
          </Link>
        </div>
      </div>
    </nav>
  )
}