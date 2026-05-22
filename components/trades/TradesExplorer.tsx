'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Search, TrendingUp, WalletCards } from 'lucide-react'
import { TRADES, formatSalary } from '@/utils/trades'

export default function TradesExplorer() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTrades = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return TRADES
    }

    return TRADES.filter((trade) => {
      const searchableText = [
        trade.name,
        trade.tagline,
        trade.description,
        trade.training_duration,
        trade.day_in_life,
        trade.key_skills.join(' '),
        trade.certifications.join(' '),
        trade.pros.join(' '),
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [searchTerm])

  return (
    <div className="space-y-8">
      <section className="content-panel">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="career-path-search" className="eyebrow mb-3">
              Career path search
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
              <Search className="h-5 w-5 text-slate-400" />

              <input
                id="career-path-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search electrician, HVAC, solar, welding, salary, skills..."
                className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <p className="muted-text mt-3 max-w-2xl">
              Search is useful here because career seekers may already know a
              trade name, skill, certification, or work environment they want to
              compare.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Showing
            </p>

            <p className="mt-1 text-2xl font-bold">
              {filteredTrades.length} of {TRADES.length}
            </p>
          </div>
        </div>
      </section>

      {filteredTrades.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrades.map((trade) => (
            <Link
              key={trade.id}
              href={`/trades/${trade.slug}`}
              className="card card-hover group overflow-hidden p-0"
            >
              <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-slate-900" />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="badge-orange">{trade.training_duration}</p>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                      {trade.name}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {trade.tagline}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">
                    +{trade.job_growth_rate}%
                  </span>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                  {trade.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="mini-card">
                    <div className="flex items-center gap-2">
                      <WalletCards className="h-4 w-4 text-orange-600" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Salary
                      </p>
                    </div>

                    <p className="mt-2 font-bold text-slate-950">
                      {formatSalary(trade.median_salary)}
                    </p>
                  </div>

                  <div className="mini-card">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Skills
                      </p>
                    </div>

                    <p className="mt-2 font-bold text-slate-950">
                      {trade.key_skills.length} key areas
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {trade.key_skills.slice(0, 2).map((skill) => (
                      <span key={skill} className="badge-slate">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-orange-600">
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card border-dashed p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-950">
            No career paths found
          </h2>

          <p className="mt-3 text-slate-600">
            Try searching for a different career path, skill, certification, or
            training direction.
          </p>

          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="btn-primary mt-6"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}