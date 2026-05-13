import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Search,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import TradesExplorer from '@/components/trades/TradesExplorer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Explore Skilled Trades — ${siteConfig.name}`,
  description:
    'Compare skilled trade careers, training paths, salaries, and job growth to find the right path for you.',
}

export default function TradesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.25),transparent_35rem)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-orange-300">
              Skilled trades marketplace
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Compare skilled trade career paths before choosing your next move.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Explore high-demand trades, understand training pathways, compare
              earning potential, and start building a practical route toward
              apprenticeships, programs, and employers.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <Search className="h-6 w-6 text-orange-300" />
                <p className="mt-4 font-bold text-white">Discover</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Learn what each trade actually does.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <GraduationCap className="h-6 w-6 text-orange-300" />
                <p className="mt-4 font-bold text-white">Prepare</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Understand training and apprenticeship pathways.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <BriefcaseBusiness className="h-6 w-6 text-orange-300" />
                <p className="mt-4 font-bold text-white">Connect</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Move toward programs and employers as the platform grows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <TradesExplorer />
        </div>
      </section>

      <section className="bg-slate-50 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 shadow-xl">
            <div className="grid gap-10 px-8 py-14 text-white md:grid-cols-[1.2fr_0.8fr] md:items-center md:px-14">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
                  Need help choosing?
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Find the trade that fits your strengths.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                  Take the career quiz to compare your interests, work style,
                  and goals with different skilled trade paths.
                </p>
              </div>

              <div className="flex md:justify-end">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-slate-950 hover:bg-slate-100"
                >
                  Take the quiz
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
