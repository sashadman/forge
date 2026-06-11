import Link from 'next/link'
import { ArrowRight, Check, Circle, ShieldCheck } from 'lucide-react'
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
    <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-cyan)] bg-[var(--bg-raised)] p-6 shadow-2xl shadow-black/20 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.12),transparent_34%)]" />

      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-[var(--cyan-muted)] text-[var(--cyan)]">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div>
            <p className="eyebrow">Profile readiness</p>

            <h2 className="mt-3 font-display text-3xl font-black leading-tight text-[var(--text-primary)] md:text-4xl">
              Prepare before you apply
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[var(--text-secondary)]">
              Your readiness profile becomes part of your application package.
              Complete the required items before applying.
            </p>
          </div>
        </div>

        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[var(--radius-lg)] border border-[var(--border-cyan)] bg-[var(--bg-input)] text-center shadow-[var(--cyan-glow)]">
          <div>
            <p className="font-display text-4xl font-black leading-none text-[var(--cyan)]">
              {percentage}%
            </p>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Ready
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-base)] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-xl font-black text-[var(--text-primary)]">
              {config.label}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {config.description}
            </p>
          </div>

          <span className="level-badge self-start">LVL {level}</span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-[var(--bg-input)] ring-1 ring-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--cyan)] shadow-[var(--cyan-glow)] transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <span>Readiness XP</span>
          <span className="text-[var(--cyan)]">{percentage} / 100</span>
        </div>
      </div>

      <div className="relative mt-6 grid gap-4 md:grid-cols-2">
        {REQUIRED_READINESS_ITEMS.map((configItem) => {
          const item = itemsByType.get(configItem.type)
          const complete = item ? isReadinessItemComplete(item.status) : false
          const isNext = nextItem?.type === configItem.type

          return (
            <div
              key={configItem.type}
              className={`rounded-[var(--radius-lg)] border p-5 ${
                isNext
                  ? 'border-[var(--border-cyan)] bg-[var(--cyan-muted)]'
                  : 'border-[var(--border)] bg-[var(--bg-base)]'
              }`}
            >
              <div className="flex min-h-[3rem] items-start gap-3">
                {complete ? (
                  <Check className="mt-1 h-5 w-5 shrink-0 text-[var(--emerald)]" />
                ) : (
                  <Circle
                    className={`mt-1 h-5 w-5 shrink-0 ${
                      isNext ? 'text-[var(--cyan)]' : 'text-[var(--text-muted)]'
                    }`}
                  />
                )}

                <div className="grid gap-1 leading-none">
                  <p className="font-display text-lg font-black leading-6 text-[var(--text-primary)]">
                    {configItem.label}
                  </p>

                  <p className="text-sm leading-5 text-[var(--text-muted)]">
                    {item ? getReadinessStatusLabel(item.status) : 'Not started'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Link href="/dashboard/readiness" className="btn-outline relative mt-6 w-full rounded-[var(--radius-md)]">
        {nextItem ? `Complete: ${nextItem.label}` : 'Review readiness profile'}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
