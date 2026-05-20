'use client'

import { useMemo, useState } from 'react'
import type {
  ReadinessItemRow as ReadinessItemRowData,
  ReadinessScoreRow,
} from '@/app/actions/readiness'
import {
  ALL_READINESS_ITEMS,
  REQUIRED_READINESS_ITEMS,
  isReadinessItemComplete,
} from '@/lib/readiness/readiness-config'
import ReadinessItemRow from '@/components/dashboard/readiness/ReadinessItemRow'
import ReadinessScoreHeader from '@/components/dashboard/readiness/ReadinessScoreHeader'

type ReadinessPanelProps = {
  initialItems: ReadinessItemRowData[]
  initialScore: ReadinessScoreRow | null
}

type TabId = 'required' | 'all'

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

  const displayItems =
    activeTab === 'required' ? REQUIRED_READINESS_ITEMS : ALL_READINESS_ITEMS

  const requiredCompleted = REQUIRED_READINESS_ITEMS.filter((config) => {
    const item = itemsByType.get(config.type)
    return item ? isReadinessItemComplete(item.status) : false
  }).length

  const allCompleted = ALL_READINESS_ITEMS.filter((config) => {
    const item = itemsByType.get(config.type)
    return item ? isReadinessItemComplete(item.status) : false
  }).length

  function handleItemUpdated(updatedItem: ReadinessItemRowData) {
    const nextItems = items.map((item) =>
      item.type === updatedItem.type ? updatedItem : item
    )

    const exists = nextItems.some((item) => item.type === updatedItem.type)
    const finalItems = exists ? nextItems : [...nextItems, updatedItem]

    setItems(finalItems)

    const optimisticScore = calculateOptimisticScore(finalItems)

    setScore((currentScore) => ({
      user_id: currentScore?.user_id ?? updatedItem.user_id,
      ...optimisticScore,
    }))
  }

  return (
    <div className="space-y-6">
      <ReadinessScoreHeader score={score} />

      <div className="inline-flex rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('required')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'required'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Required {requiredCompleted}/{REQUIRED_READINESS_ITEMS.length}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'all'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          All {allCompleted}/{ALL_READINESS_ITEMS.length}
        </button>
      </div>

      <div className="space-y-4">
        {displayItems.map((config) => (
          <ReadinessItemRow
            key={config.type}
            config={config}
            item={itemsByType.get(config.type) ?? null}
            onUpdated={handleItemUpdated}
          />
        ))}
      </div>

      {activeTab === 'all' && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            Sensitive items such as background check and drug test consent remain
            private in this version. Employer visibility will be designed later
            after the application workflow exists.
          </p>
        </div>
      )}
    </div>
  )
}