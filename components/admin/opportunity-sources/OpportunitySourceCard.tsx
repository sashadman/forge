'use client'

import { useState, useTransition } from 'react'
import { CalendarCheck, ExternalLink, Power } from 'lucide-react'
import type { OpportunitySourceItem } from '@/lib/admin/get-opportunity-sources-page-data'
import {
  getOpportunitySourceTypeLabel,
  getSourceReliabilityBadgeClass,
  getSourceReliabilityLabel,
} from '@/lib/opportunities/opportunity-source-config'
import {
  markOpportunitySourceChecked,
  updateOpportunitySourceStatus,
} from '@/app/actions/opportunity-sources'

type OpportunitySourceCardProps = {
  source: OpportunitySourceItem
}

function formatDate(value: string | null) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleDateString()
}

function isDueForReview(value: string | null) {
  if (!value) return false
  return new Date(value).getTime() <= Date.now()
}

export default function OpportunitySourceCard({
  source,
}: OpportunitySourceCardProps) {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const dueForReview = isDueForReview(source.next_review_at)

  function handleToggleActive() {
    setError('')

    startTransition(async () => {
      try {
        await updateOpportunitySourceStatus({
          sourceId: source.id,
          isActive: !source.is_active,
        })
      } catch (error) {
        console.error('Failed to update source status:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not update source status.'
        )
      }
    })
  }

  function handleMarkChecked() {
    setError('')

    startTransition(async () => {
      try {
        await markOpportunitySourceChecked({
          sourceId: source.id,
        })
      } catch (error) {
        console.error('Failed to mark source checked:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not mark source checked.'
        )
      }
    })
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getSourceReliabilityBadgeClass(
                source.reliability_level
              )}`}
            >
              {getSourceReliabilityLabel(source.reliability_level)}
            </span>

            <span className="badge-slate">
              {getOpportunitySourceTypeLabel(source.source_type)}
            </span>

            <span
              className={
                source.is_active
                  ? 'rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-200'
                  : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600'
              }
            >
              {source.is_active ? 'Active' : 'Inactive'}
            </span>

            {dueForReview && (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700 ring-1 ring-orange-200">
                Review due
              </span>
            )}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-950">
            {source.name}
          </h3>

          {source.description && (
            <p className="muted-text mt-3 max-w-3xl">{source.description}</p>
          )}

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoBox label="Region" value={source.region || 'Not set'} />
            <InfoBox label="State" value={source.state || 'Not set'} />
            <InfoBox
              label="Next review"
              value={formatDate(source.next_review_at)}
            />
          </div>

          {source.trade_focus && source.trade_focus.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {source.trade_focus.map((trade) => (
                <span key={trade} className="badge-orange">
                  {trade}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:min-w-52">
          <a
            href={source.website_url}
            target="_blank"
            rel="noreferrer"
            className="btn-outline px-5 py-2 text-sm"
          >
            Open source
            <ExternalLink className="h-4 w-4" />
          </a>

          {source.search_url && (
            <a
              href={source.search_url}
              target="_blank"
              rel="noreferrer"
              className="btn-outline px-5 py-2 text-sm"
            >
              Open search
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          <button
            type="button"
            onClick={handleMarkChecked}
            disabled={isPending}
            className="btn-dark px-5 py-2 text-sm"
          >
            <CalendarCheck className="h-4 w-4" />
            {isPending ? 'Saving...' : 'Mark checked'}
          </button>

          <button
            type="button"
            onClick={handleToggleActive}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Power className="h-4 w-4" />
            {source.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {source.notes && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Admin notes
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {source.notes}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}
    </article>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  )
}