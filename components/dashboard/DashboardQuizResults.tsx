import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TRADE_MAP, formatSalary } from '@/utils/trades'
import type { TradeCategory } from '@/types'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'

export type QuizResultItem = {
  trade: TradeCategory
  score: number
  rank: number
}

type DashboardQuizResultsProps = {
  quizResults: QuizResultItem[]
}

export default function DashboardQuizResults({
  quizResults,
}: DashboardQuizResultsProps) {
  return (
    <section className="content-panel">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="eyebrow">Career match</p>

          <h2 className="section-title mt-3">Your latest quiz result</h2>
        </div>

        <Link href="/quiz" className="btn-outline px-5 py-2 text-sm">
          Retake quiz
        </Link>
      </div>

      {quizResults.length > 0 ? (
        <div className="mt-8 grid gap-5">
          {quizResults.map((result) => {
            const trade = TRADE_MAP[result.trade]

            if (!trade) return null

            return (
              <div key={result.trade} className="card-soft">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                        {result.rank}
                      </span>

                      <div>
                        <h3 className="text-2xl font-bold text-slate-950">
                          {trade.name}
                        </h3>

                        <p className="text-slate-600">{trade.tagline}</p>
                      </div>
                    </div>

                    <p className="muted-text mt-5 max-w-3xl">
                      {trade.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {trade.key_skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="badge-slate bg-white">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mini-card-white min-w-40">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Match score
                    </p>

                    <p className="mt-1 text-3xl font-bold text-orange-600">
                      {result.score}%
                    </p>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Median salary
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {formatSalary(trade.median_salary)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/trades/${trade.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                  >
                    View career profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <DashboardEmptyState
          title="No saved quiz result yet"
          description="Take the career quiz to get your first personalized trade matches."
          href="/quiz"
          action="Take career quiz"
          variant="orange"
        />
      )}
    </section>
  )
}