import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import type { ReadinessScoreRow } from '@/app/actions/readiness'
import {
  getReadinessLevel,
  READINESS_LEVEL_CONFIG,
} from '@/lib/readiness/readiness-config'

type ReadinessScoreHeaderProps = {
  score: ReadinessScoreRow | null
}

export default function ReadinessScoreHeader({
  score,
}: ReadinessScoreHeaderProps) {
  const percentage = score?.score_pct ?? 0
  const level = getReadinessLevel(percentage)
  const config = READINESS_LEVEL_CONFIG[level]
  const requiredCompleted = score?.required_completed ?? 0
  const requiredTotal = score?.required_total ?? 4
  const remaining = Math.max(requiredTotal - requiredCompleted, 0)

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: `conic-gradient(rgb(234 88 12) ${percentage * 3.6}deg, rgb(226 232 240) 0deg)`,
            }}
          />

          <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
            <p className="text-3xl font-bold text-orange-600">{percentage}</p>
            <p className="text-xs font-semibold text-slate-500">%</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {percentage === 100 ? (
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            ) : percentage >= 80 ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-600" />
            )}

            <p className="font-semibold text-orange-700">{config.label}</p>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            Profile readiness
          </h2>

          <p className="muted-text mt-2">{config.description}</p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
            <div
              className="h-full rounded-full bg-orange-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <span>
              {requiredCompleted} of {requiredTotal} required items complete
            </span>

            {remaining > 0 && (
              <span className="font-semibold text-orange-700">
                {remaining} remaining
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}