'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OpportunityPipelineStatus } from '@/lib/supabase/app-types'

type OpportunityPipelineStatusSelectProps = {
  userId: string
  opportunityId: string
  initialStatus: OpportunityPipelineStatus
  initialNotes?: string
  initialNextAction?: string
  initialFollowUpOn?: string
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
  initialNotes = '',
  initialNextAction = '',
  initialFollowUpOn = '',
}: OpportunityPipelineStatusSelectProps) {
  const supabase = useMemo(() => createClient(), [])

  const [status, setStatus] =
    useState<OpportunityPipelineStatus>(initialStatus)
  const [notes, setNotes] = useState(initialNotes)
  const [nextAction, setNextAction] = useState(initialNextAction)
  const [followUpOn, setFollowUpOn] = useState(initialFollowUpOn)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedStatus = STATUS_OPTIONS.find((option) => option.value === status)

  async function savePipelineUpdate({
    nextStatus,
    nextNotes,
    nextActionValue,
    nextFollowUpOn,
  }: {
    nextStatus: OpportunityPipelineStatus
    nextNotes: string
    nextActionValue: string
    nextFollowUpOn: string
  }) {
    setSaving(true)
    setMessage('')
    setError('')

    const { error } = await supabase.from('opportunity_pipeline').upsert(
      {
        user_id: userId,
        opportunity_id: opportunityId,
        status: nextStatus,
        notes: nextNotes.trim() || null,
        next_action: nextActionValue.trim() || null,
        follow_up_on: nextFollowUpOn || null,
        last_action_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,opportunity_id',
      }
    )

    if (error) {
      console.error('Failed to update opportunity pipeline:', error)
      setError('Could not update pipeline. Please try again.')
      setSaving(false)
      return
    }

    setMessage('Pipeline updated.')
    setSaving(false)
  }

  async function updateStatus(nextStatus: OpportunityPipelineStatus) {
    setStatus(nextStatus)

    await savePipelineUpdate({
      nextStatus,
      nextNotes: notes,
      nextActionValue: nextAction,
      nextFollowUpOn: followUpOn,
    })
  }

  async function saveDetails() {
    await savePipelineUpdate({
      nextStatus: status,
      nextNotes: notes,
      nextActionValue: nextAction,
      nextFollowUpOn: followUpOn,
    })
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

      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Next action
            </label>

            <input
              type="text"
              value={nextAction}
              onChange={(event) => setNextAction(event.target.value)}
              className="input-field mt-2"
              placeholder="Example: update resume, apply, call employer..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Follow-up date
            </label>

            <input
              type="date"
              value={followUpOn}
              onChange={(event) => setFollowUpOn(event.target.value)}
              className="input-field mt-2"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Private notes
          </label>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="input-field mt-2"
            placeholder="Add follow-up notes, application details, contacts, or next steps..."
          />
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Notes, next actions, and follow-up dates are private to your account.
          </p>

          <button
            type="button"
            onClick={saveDetails}
            disabled={saving}
            className="btn-outline px-4 py-2 text-sm"
          >
            {saving ? 'Saving...' : 'Save pipeline details'}
          </button>
        </div>
      </div>

      {saving && (
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Saving pipeline...
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