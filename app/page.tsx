import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import TradesExplorer from '@/components/trades/TradesExplorer'

export const metadata: Metadata = {
  title: 'Explore Skilled Trades — Forge',
  description:
    'Compare skilled trade careers, training paths, salaries, and job growth to find the right path for you.',
}

export default function TradesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Explore trades
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
              Compare skilled trade career paths.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Learn what each trade does, how long training usually takes,
              what the pay can look like, and why the work matters.
            </p>
          </div>

          <TradesExplorer />
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-slate-950 px-8 py-14 text-white md:px-14">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
                Need help choosing?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Find the trade that fits your strengths.
              </h2>

              <p className="mt-4 text-slate-300">
                Take the career quiz to compare your interests with different skilled trade paths.
              </p>

              <Link
                href="/quiz"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-100"
              >
                Take the quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}