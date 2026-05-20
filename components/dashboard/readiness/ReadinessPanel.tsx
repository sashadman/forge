'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react'
import type {
  ReadinessItemRow as ReadinessItemRowData,
  ReadinessScoreRow,
} from '@/app/actions/readiness'
import {
  ALL_READINESS_ITEMS,
  REQUIRED_READINESS_ITEMS,
  getReadinessLevel,
  isReadinessItemComplete,
} from '@/lib/readiness/readiness-config'
import ReadinessItemRow from '@/components/dashboard/readiness/ReadinessItemRow'
import ReadinessScoreHeader from '@/components/dashboard/readiness/ReadinessScoreHeader'

type ReadinessPanelProps = {
  initialItems: ReadinessItemRowData[]
  initialScore: ReadinessScoreRow | null
}

type TabId = 'required' | 'optional' | 'all'

function calculateOptimisticScore(items: ReadinessItemRowData[]) {
  const requiredTypes = REQUIRED_READINESS_ITEMS.map((item) => item.type)

  const requiredItems = items.filter((item) =>
    requiredTypes.includes(item.type)
  )

  const requiredCompleted = requiredItems.filter((item) =>
    isReadinessItemComplete(item.status)
  ).length

  const completedItems = items.filter((item) =>
    isReadinessItemComplete(item.status)
  ).length

  const requiredTotal = REQUIRED_READINESS_ITEMS.length

  return {
    total_items: items.length,
    completed_items: completedItems,
    required_total: requiredTotal,
    required_completed: requiredCompleted,
    score_pct:
      requiredTotal === 0
        ? 0
        : Math.round((requiredCompleted / requiredTotal) * 100),
  }
}

export default function ReadinessPanel({
  initialItems,
  initialScore,
}: ReadinessPanelProps) {
  const [items, setItems] = useState(initialItems)
  const [score, setScore] = useState<ReadinessScoreRow | null>(initialScore)
  const [activeTab, setActiveTab] = useState<TabId>('required')

  const itemsByType = useMemo(() => {
    return new Map(items.map((item) => [item.type, item]))
  }, [items])

  const requiredConfigs = REQUIRED_READINESS_ITEMS
  const optionalConfigs = ALL_READINESS_ITEMS.filter((item) => !item.isRequired)

  const displayItems =
    activeTab === 'required'
      ? requiredConfigs
      : activeTab === 'optional'
        ? optionalConfigs
        : ALL_READINESS_ITEMS

  const requiredCompleted = requiredConfigs.filter((config) => {
    const item = itemsByType.get(config.type)
    return item ? isReadinessItemComplete(item.status) : false
  }).length

  const optionalCompleted = optionalConfigs.filter((config) => {
    const item = itemsByType.get(config.type)
    return item ? isReadinessItemComplete(item.status) : false
  }).length

  const allCompleted = ALL_READINESS_ITEMS.filter((config) => {
    const item = itemsByType.get(config.type)
    return item ? isReadinessItemComplete(item.status) : false
  }).length

  const percentage = score?.score_pct ?? 0
  const readinessLevel = getReadinessLevel(percentage)

  function handleItemUpdated(updatedItem: ReadinessItemRowData) {
    const existingItemFound = items.some(
      (item) => item.type === updatedItem.type
    )

    const nextItems = existingItemFound
      ? items.map((item) =>
          item.type === updatedItem.type ? updatedItem : item
        )
      : [...items, updatedItem]

    setItems(nextItems)

    const optimisticScore = calculateOptimisticScore(nextItems)

    setScore((currentScore) => ({
      user_id: currentScore?.user_id ?? updatedItem.user_id,
      ...optimisticScore,
    }))
  }

  return (
    <div className="space-y-8">
      <ReadinessScoreHeader score={score} />

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <p className="eyebrow">Application preparation</p>

            <h2 className="section-title mt-3">
              Complete the essentials before you apply.
            </h2>

            <p className="muted-text mt-3 max-w-3xl">
              These items help turn a saved opportunity into a stronger
              application. Required items build your readiness score. Optional
              items give you a more complete profile when future employer review
              tools are added.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:min-w-56">
            <div className="flex items-center gap-2">
              {readinessLevel === 'standout' || readinessLevel === 'ready' ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
              )}

              <p className="font-semibold text-slate-950">
                {requiredCompleted}/{requiredConfigs.length} required complete
              </p>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Finish the required items first. Optional items can be completed
              after your application profile is usable.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <ReadinessSummaryCard
            label="Required"
            value={`${requiredCompleted}/${requiredConfigs.length}`}
            description="Counts toward readiness score"
          />

          <ReadinessSummaryCard
            label="Optional"
            value={`${optionalCompleted}/${optionalConfigs.length}`}
            description="Improves profile depth"
          />

          <ReadinessSummaryCard
            label="Total"
            value={`${allCompleted}/${ALL_READINESS_ITEMS.length}`}
            description="Overall preparation progress"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Readiness items</p>

            <h2 className="section-title mt-3">Build your application profile</h2>
          </div>

          <div className="inline-flex rounded-2xl bg-slate-100 p-1">
            <ReadinessTabButton
              active={activeTab === 'required'}
              label="Required"
              count={`${requiredCompleted}/${requiredConfigs.length}`}
              onClick={() => setActiveTab('required')}
            />

            <ReadinessTabButton
              active={activeTab === 'optional'}
              label="Optional"
              count={`${optionalCompleted}/${optionalConfigs.length}`}
              onClick={() => setActiveTab('optional')}
            />

            <ReadinessTabButton
              active={activeTab === 'all'}
              label="All"
              count={`${allCompleted}/${ALL_READINESS_ITEMS.length}`}
              onClick={() => setActiveTab('all')}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {displayItems.map((config) => (
            <ReadinessItemRow
              key={config.type}
              config={config}
              item={itemsByType.get(config.type) ?? null}
              onUpdated={handleItemUpdated}
            />
          ))}
        </div>

        {(activeTab === 'optional' || activeTab === 'all') && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

              <p className="text-sm leading-6 text-slate-600">
                Sensitive items such as background check and drug test consent
                remain private in this version. Employer visibility will be
                designed later after the formal employer review workflow is
                complete.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function ReadinessSummaryCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-orange-600">{value}</p>

      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  )
}

function ReadinessTabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-white text-slate-950 shadow-sm'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      <span>{label}</span>
      <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
        {count}
      </span>
    </button>
  )
}