import Link from 'next/link'
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Layers3,
  Map,
  Route,
  Target,
} from 'lucide-react'
import { TRADE_MAP, formatSalary } from '@/utils/trades'
import type { TradeCategory } from '@/types'

type SavedTrade = {
  trade_slug: string
}

type CareerPathMissionGuideProps = {
  savedTrades: SavedTrade[] | null
}

export default function CareerPathMissionGuide({
  savedTrades,
}: CareerPathMissionGuideProps) {
  const savedTradeDetails =
    savedTrades
      ?.map((savedTrade) => TRADE_MAP[savedTrade.trade_slug as TradeCategory])
      .filter(Boolean) ?? []

  const savedCount = savedTradeDetails.length
  const hasSavedPaths = savedCount > 0
  const topSkills = Array.from(
    new Set(savedTradeDetails.flatMap((trade) => trade.key_skills.slice(0, 3)))
  ).slice(0, 6)

  const averageMedianSalary =
    savedTradeDetails.length > 0
      ? Math.round(
          savedTradeDetails.reduce(
            (total, trade) => total + trade.median_salary,
            0
          ) / savedTradeDetails.length
        )
      : null

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-emerald-500/10 to-cyan-500/10" />
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-orange-300">
            <Compass className="h-4 w-4" />
            Direction strategy
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight">
            Pick a direction before you compare training.
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            Career paths are your first filter. Save a few paths that match your
            interests, then use those paths to compare training programs and real
            jobs with more focus.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Map className="h-6 w-6 text-orange-300" />
              <p className="mt-3 text-3xl font-black">{savedCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Saved paths
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Target className="h-6 w-6 text-emerald-300" />
              <p className="mt-3 text-3xl font-black">
                {hasSavedPaths ? 'Active' : 'Open'}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Direction status
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <GraduationCap className="h-6 w-6 text-cyan-300" />
              <p className="mt-3 text-3xl font-black">Next</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Training mission
              </p>
            </div>
          </div>

          {!hasSavedPaths && (
            <div className="mt-7 rounded-2xl border border-orange-300/20 bg-orange-500/10 p-5">
              <p className="font-bold text-orange-100">
                Start by saving 2–3 career paths.
              </p>
              <p className="mt-2 text-sm leading-6 text-orange-100/80">
                Do not try to choose your final career immediately. Save a few
                strong options, compare them, then narrow your direction.
              </p>

              <Link href="/trades" className="btn-light mt-5">
                Compare career paths
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <Route className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-700">
                Mission rule
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Path first, training second.
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Training programs make more sense after you know which career
                path you are preparing for. This keeps the user journey focused
                and avoids random browsing.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <Layers3 className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
                Saved path signal
              </p>

              {hasSavedPaths ? (
                <>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Your saved paths are forming a shortlist.
                  </h3>

                  {averageMedianSalary && (
                    <p className="mt-3 leading-7 text-slate-600">
                      Average median salary across saved paths:{' '}
                      <span className="font-bold text-slate-950">
                        {formatSalary(averageMedianSalary)}
                      </span>
                    </p>
                  )}

                  {topSkills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {topSkills.map((skill) => (
                        <span key={skill} className="badge-slate">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    No career direction saved yet.
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    Save career paths from the public career path directory so
                    this mission can become your personal direction board.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}