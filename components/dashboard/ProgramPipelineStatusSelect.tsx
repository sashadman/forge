'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProgramPipelineStatus } from '@/lib/supabase/app-types'

type ProgramPipelineStatusSelectProps = {
  userId: string
  programId: string
  initialStatus: ProgramPipelineStatus
  initialNotes?: string
  initialNextAction?: string
  initialFollowUpOn?: string
}

const STATUS_OPTIONS: {
  value: ProgramPipelineStatus
  label: string
  helper: string
}[] = [
  {
    value: 'saved',
    label: 'Saved',
    helper: 'Bookmarked for later review.',
  },
  {
    value: 'researching',
    label: 'Researching',
    helper: 'Comparing details, requirements, cost, and fit.',
  },
  {
    value: 'contacted',
    label: 'Contacted',
    helper: 'Reached out to the school, provider, or program office.',
  },
  {
    value: 'applying',
    label: 'Applying',
    helper: 'Preparing or submitting an application.',
  },
  {
    value: 'enrolled',
    label: 'Enrolled',
    helper: 'Accepted or enrolled in the program.',
  },
  {
    value: 'completed',
    label: 'Completed',
    helper: 'Program completed or training finished.',
  },
  {
    value: 'closed',
    label: 'Closed',
    helper: 'No longer active for you.',
  },
]

export default function ProgramPipelineStatusSelect({
  userId,
  programId,
  initialStatus,
  initialNotes = '',
  initialNextAction = '',
  initialFollowUpOn = '',
}: ProgramPipelineStatusSelectProps) {
  const supabase = useMemo(() => createClient(), [])

  const [status, setStatus] = useState<ProgramPipelineStatus>(initialStatus)
  const [notes, setNotes] = useState(initialNotes)
  const [nextAction, setNextAction] = useState(initialNextAction)
  const [followUpOn, setFollowUpOn] = useState(initialFollowUpOn)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedStatus = STATUS_OPTIONS.find((option) => option.value === status)

  async function saveProgramPipelineUpdate({
    nextStatus,
    nextNotes,
    nextActionValue,
    nextFollowUpOn,
  }: {
    nextStatus: ProgramPipelineStatus
    nextNotes: string
    nextActionValue: string
    nextFollowUpOn: string
  }) {
    setSaving(true)
    setMessage('')
    setError('')

    const { error } = await supabase.from('program_pipeline').upsert(
      {
        user_id: userId,
        program_id: programId,
        status: nextStatus,
        notes: nextNotes.trim() || null,
        next_action: nextActionValue.trim() || null,
        follow_up_on: nextFollowUpOn || null,
        last_action_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,program_id',
      }
    )

    if (error) {
      console.error('Failed to update program pipeline:', error)
      setError('Could not update training pipeline. Please try again.')
      setSaving(false)
      return
    }

    setMessage('Training pipeline updated.')
    setSaving(false)
  }

  async function updateStatus(nextStatus: ProgramPipelineStatus) {
    setStatus(nextStatus)

    await saveProgramPipelineUpdate({
      nextStatus,
      nextNotes: notes,
      nextActionValue: nextAction,
      nextFollowUpOn: followUpOn,
    })
  }

  async function saveDetails() {
    await saveProgramPipelineUpdate({
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
            Training status
          </p>

          <p className="mt-1 font-bold text-slate-950">
            {selectedStatus?.label ?? 'Saved'}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {selectedStatus?.helper ?? 'Track your progress on this program.'}
          </p>
        </div>

        <select
          value={status}
          onChange={(event) =>
            updateStatus(event.target.value as ProgramPipelineStatus)
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
              placeholder="Example: call admissions, compare cost, apply..."
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
            placeholder="Add application requirements, deadlines, contacts, tuition notes, or next steps..."
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
            {saving ? 'Saving...' : 'Save training details'}
          </button>
        </div>
      </div>

      {saving && (
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Saving training pipeline...
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