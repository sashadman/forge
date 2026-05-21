'use client'

import { useState, useTransition } from 'react'
import { Save } from 'lucide-react'
import type { ApplicationStatus } from '@/lib/supabase/app-types'
import {
  REVIEWABLE_APPLICATION_STATUS_OPTIONS,
  getApplicationStatusDescription,
} from '@/lib/applications/application-review-config'
import { updateApplicationReview } from '@/app/actions/application-review'

type ApplicationStatusUpdateFormProps = {
  applicationId: string
  currentStatus: ApplicationStatus
  employerNotes: string | null
}

export default function ApplicationStatusUpdateForm({
  applicationId,
  currentStatus,
  employerNotes,
}: ApplicationStatusUpdateFormProps) {
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus)
  const [notes, setNotes] = useState(employerNotes ?? '')
  const [eventNote, setEventNote] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  const isWithdrawn = currentStatus === 'withdrawn'

  function handleSave() {
    if (isWithdrawn) return

    setError('')
    setSuccess('')

    startTransition(async () => {
      try {
        await updateApplicationReview({
          applicationId,
          status,
          employerNotes: notes,
          eventNote,
        })

        setSuccess('Application review updated.')
        setEventNote('')
      } catch (error) {
        console.error('Failed to update application review:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not update application review.'
        )
      }
    })
  }

  if (isWithdrawn) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-800">
          This application was withdrawn by the seeker.
        </p>
        <p className="mt-2 text-sm leading-6 text-red-700">
          Withdrawn applications should remain visible for records but should not
          be moved forward.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Review controls
      </p>

      <label className="mt-4 block">
        <span className="label">Application status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
          className="input-field"
        >
          {REVIEWABLE_APPLICATION_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {getApplicationStatusDescription(status)}
      </p>

      <label className="mt-4 block">
        <span className="label">Internal employer/admin notes</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          className="input-field"
          placeholder="Private review notes for employer/admin workflow."
        />
      </label>

      <label className="mt-4 block">
        <span className="label">Timeline note</span>
        <textarea
          value={eventNote}
          onChange={(event) => setEventNote(event.target.value)}
          rows={3}
          className="input-field"
          placeholder="Optional note to add to the application timeline."
        />
      </label>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
          {success}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="btn-primary mt-5 w-full px-6 py-3"
      >
        <Save className="h-4 w-4" />
        {isPending ? 'Saving review...' : 'Save review'}
      </button>
    </div>
  )
}