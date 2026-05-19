'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OpportunityPipelineStatus } from '@/lib/supabase/app-types'

type OpportunityPipelineStatusSelectProps = {
  userId: string
  opportunityId: string
  initialStatus: OpportunityPipelineStatus
}

const STATUS_OPTIONS: {
  value: OpportunityPipelineStatus
  label: string
  helper: string
}[] = [
  {
    value: 'saved',
    label: 'Saved',
    helper: 'Bookmarked for later review.',
  },
  {
    value: 'interested',
    label: 'Interested',
    helper: 'Worth exploring more seriously.',
  },
  {
    value: 'preparing',
    label: 'Preparing',
    helper: 'Getting documents, skills, or requirements ready.',
  },
  {
    value: 'applied',
    label: 'Applied',
    helper: 'Application has been submitted.',
  },
  {
    value: 'interviewing',
    label: 'Interviewing',
    helper: 'Interview, screening, or employer contact in progress.',
  },
  {
    value: 'offer',
    label: 'Offer',
    helper: 'Offer received or final decision pending.',
  },
  {
    value: 'closed',
    label: 'Closed',
    helper: 'No longer active for you.',
  },
]

export default function OpportunityPipelineStatusSelect({
  userId,
  opportunityId,
  initialStatus,
}: OpportunityPipelineStatusSelectProps) {
  const supabase = useMemo(() => createClient(), [])

  const [status, setStatus] =
    useState<OpportunityPipelineStatus>(initialStatus)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedStatus = STATUS_OPTIONS.find((option) => option.value === status)

  async function updateStatus(nextStatus: OpportunityPipelineStatus) {
    setStatus(nextStatus)
    setSaving(true)
    setMessage('')
    setError('')

    const { error } = await supabase.from('opportunity_pipeline').upsert(
      {
        user_id: userId,
        opportunity_id: opportunityId,
        status: nextStatus,
        last_action_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,opportunity_id',
      }
    )

    if (error) {
      console.error('Failed to update opportunity pipeline status:', error)
      setStatus(status)
      setError('Could not update status. Please try again.')
      setSaving(false)
      return
    }

    setMessage('Status updated.')
    setSaving(false)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pipeline status
          </p>

          <p className="mt-1 font-bold text-slate-950">
            {selectedStatus?.label ?? 'Saved'}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {selectedStatus?.helper ?? 'Track your progress on this opportunity.'}
          </p>
        </div>

        <select
          value={status}
          onChange={(event) =>
            updateStatus(event.target.value as OpportunityPipelineStatus)
          }
          disabled={saving}
          className="select-field min-w-44"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {saving && (
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Saving status...
        </p>
      )}

      {message && !saving && (
        <p className="mt-3 text-sm font-semibold text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}