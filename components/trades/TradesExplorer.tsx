'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
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
    <>
      <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <label
          htmlFor="trade-search"
          className="mb-3 block text-sm font-semibold text-slate-700"
        >
          Search skilled trades
        </label>

        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
          <Search className="h-5 w-5 text-slate-400" />

          <input
            id="trade-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search electrician, HVAC, solar, welding, salary, skills..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Showing {filteredTrades.length} of {TRADES.length} trades
        </p>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {filteredTrades.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrades.map((trade) => (
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
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">
                No trades found
              </h2>

              <p className="mt-3 text-slate-600">
                Try searching for a different trade, skill, certification, or training path.
              </p>

              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-6 rounded-full bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}