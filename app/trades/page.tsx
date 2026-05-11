import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { TRADES, formatSalary } from '@/utils/trades'

export const metadata: Metadata = {
  title: 'Explore Skilled Trades',
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
              Learn what each trade does, how long training it takes,
              what the pay can look like, and why the work matters.
            </p>
          </div>

          <div className="mt-10 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="search"
                placeholder="Search trades like electrician, HVAC, plumbing..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters coming soon
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRADES.map((trade) => (
              <Link
                key={trade.id}
                href={`/trades/${trade.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                      {trade.training_duration}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-slate-950">
                      {trade.name}
                    </h2>
                  </div>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                    +{trade.job_growth_rate}%
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {trade.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Median salary
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {formatSalary(trade.median_salary)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Key skills
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {trade.key_skills.length}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {trade.key_skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600" />
                </div>
              </Link>
            ))}
          </div>
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

