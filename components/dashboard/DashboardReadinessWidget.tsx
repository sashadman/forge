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

/** Map readiness level to a display label */
const LEVEL_LABEL: Record<string, string> = {
  not_started:   'LVL 00',
  getting_ready: 'LVL 01',
  almost_ready:  'LVL 02',
  ready:         'LVL 03',
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
      {/* Header row */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: 'var(--cyan-muted)', color: 'var(--cyan)' }}
          >
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="eyebrow">Profile readiness</p>
            <h2 className="section-title mt-3">Prepare before you apply</h2>
            <p className="muted-text mt-3 max-w-2xl">
              Your readiness profile becomes part of your application package.
              Complete the required items before applying to serious jobs or apprenticeships.
            </p>
          </div>
        </div>

        {/* Score circle */}
        <div
          className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl"
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border-cyan)',
            boxShadow: 'var(--cyan-glow)',
          }}
        >
          <p
            className="text-3xl font-black"
            style={{ color: 'var(--cyan)', fontFamily: 'var(--font-display)', lineHeight: 1 }}
          >
            {percentage}
            <span className="text-lg">%</span>
          </p>
          <p className="mono-label mt-1">Ready</p>
        </div>
      </div>

      {/* XP bar section */}
      <div
        className="mt-5 rounded-2xl p-4"
        style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p
              className="font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              {config.label}
            </p>
            <p className="muted-text mt-1 text-sm">{config.description}</p>
          </div>
          <span className="level-badge shrink-0">{LEVEL_LABEL[level] ?? 'LVL 01'}</span>
        </div>

        {/* XP bar */}
        <div className="xp-bar-track mt-4">
          <div className="xp-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
        <div className="mt-2 flex justify-between">
          <span className="mono-label">Readiness XP</span>
          <span className="mono-label" style={{ color: 'var(--cyan)' }}>
            {percentage} / 100
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {REQUIRED_READINESS_ITEMS.map((configItem) => {
          const item = itemsByType.get(configItem.type)
          const complete = item ? isReadinessItemComplete(item.status) : false
          const isNext = nextItem?.type === configItem.type

          return (
            <div
              key={configItem.type}
              className="rounded-2xl p-4 transition-colors"
              style={{
                border: isNext ? '1px solid var(--border-cyan)' : '1px solid var(--border)',
                background: isNext ? 'var(--cyan-muted)' : 'var(--bg-base)',
              }}
            >
              <div className="flex items-start gap-3">
                {complete ? (
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: 'var(--emerald)' }}
                  />
                ) : (
                  <Circle
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: isNext ? 'var(--cyan)' : 'var(--text-muted)' }}
                  />
                )}

                <div>
                  <p
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                  >
                    {configItem.label}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {item ? getReadinessStatusLabel(item.status) : 'Not started'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <Link href="/dashboard/readiness" className="btn-primary mt-6 w-full justify-center">
        {nextItem ? `Complete: ${nextItem.label}` : 'Review readiness profile'}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}