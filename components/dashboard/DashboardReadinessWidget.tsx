import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle, ShieldCheck } from 'lucide-react'
import type {
  ReadinessItemRow,
  ReadinessScoreRow,
} from '@/app/actions/readiness'
import {
  REQUIRED_READINESS_ITEMS,
  getReadinessLevel,
  READINESS_LEVEL_CONFIG,
  isReadinessItemComplete,
  getReadinessStatusLabel,
} from '@/lib/readiness/readiness-config'

type DashboardReadinessWidgetProps = {
  items: ReadinessItemRow[]
  score: ReadinessScoreRow | null
}

export default function DashboardReadinessWidget({
  items,
  score,
}: DashboardReadinessWidgetProps) {
  const percentage = score?.score_pct ?? 0
  const level = getReadinessLevel(percentage)
  const config = READINESS_LEVEL_CONFIG[level]

  const itemsByType = new Map(items.map((item) => [item.type, item]))

  const nextItem = REQUIRED_READINESS_ITEMS.find((configItem) => {
    const item = itemsByType.get(configItem.type)
    return !item || !isReadinessItemComplete(item.status)
  })

  return (
    <section className="content-panel">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="eyebrow">Profile readiness</p>

            <h2 className="section-title mt-3">Prepare before you apply</h2>

            <p className="muted-text mt-3 max-w-2xl">
              Your readiness profile becomes part of your application package.
              Complete the required items before applying to serious opportunities.
            </p>
          </div>
        </div>

        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl bg-orange-100 text-orange-700">
          <p className="text-3xl font-bold">{percentage}%</p>
          <p className="text-xs font-semibold uppercase tracking-wide">Ready</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="font-semibold text-slate-950">{config.label}</p>
        <p className="muted-text mt-1 text-sm">{config.description}</p>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
          <div
            className="h-full rounded-full bg-orange-600 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {REQUIRED_READINESS_ITEMS.map((configItem) => {
          const item = itemsByType.get(configItem.type)
          const complete = item ? isReadinessItemComplete(item.status) : false
          const isNext = nextItem?.type === configItem.type

          return (
            <div
              key={configItem.type}
              className={`rounded-2xl border p-4 ${
                isNext
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                {complete ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                ) : (
                  <Circle
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      isNext ? 'text-orange-600' : 'text-slate-400'
                    }`}
                  />
                )}

                <div>
                  <p className="font-semibold text-slate-950">
                    {configItem.label}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item ? getReadinessStatusLabel(item.status) : 'Not started'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Link href="/dashboard/readiness" className="btn-dark mt-6 w-full">
        {nextItem ? `Complete: ${nextItem.label}` : 'Review readiness profile'}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}