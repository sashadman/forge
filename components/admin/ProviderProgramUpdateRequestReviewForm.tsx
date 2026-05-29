'use client'

import { FormEvent, useState, useTransition } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import {
  approveAndApplyProviderProgramUpdateRequest,
  updateProviderProgramUpdateRequestStatus,
} from '@/app/actions/provider-program-update-requests'

type RequestStatus = 'pending' | 'approved' | 'rejected' | 'needs_more_info'

type ProviderProgramUpdateRequestReviewFormProps = {
  requestId: string
  currentStatus: string
  currentAdminNotes: string
}

const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'needs_more_info', label: 'Needs more info' },
  { value: 'approved', label: 'Approved only' },
  { value: 'rejected', label: 'Rejected' },
]

function isRequestStatus(value: string): value is RequestStatus {
  return (
    value === 'pending' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'needs_more_info'
  )
}

export default function ProviderProgramUpdateRequestReviewForm({
  requestId,
  currentStatus,
  currentAdminNotes,
}: ProviderProgramUpdateRequestReviewFormProps) {
  const [status, setStatus] = useState<RequestStatus>(
    isRequestStatus(currentStatus) ? currentStatus : 'pending'
  )
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [isUpdatingStatus, startStatusTransition] = useTransition()
  const [isApplying, startApplyTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setError('')

    startStatusTransition(async () => {
      try {
        await updateProviderProgramUpdateRequestStatus({
          requestId,
          status,
          adminNotes,
        })

        setNotice('Update request review status saved.')
      } catch (caughtError) {
        console.error('Program update request review failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not update request.'
        )
      }
    })
  }

  function handleApproveAndApply() {
    setNotice('')
    setError('')

    startApplyTransition(async () => {
      try {
        await approveAndApplyProviderProgramUpdateRequest({
          requestId,
          adminNotes,
        })

        setStatus('approved')
        setNotice('Request approved and changes applied to the program.')
      } catch (caughtError) {
        console.error('Approve and apply request failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not apply request.'
        )
      }
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <form onSubmit={handleSubmit}>
        <p className="text-sm font-bold text-slate-950">Admin review</p>

        <label className="mt-4 block">
          <span className="label">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as RequestStatus)}
            className="input-field"
          >
            {STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="label">Admin notes</span>
          <textarea
            value={adminNotes}
            onChange={(event) => setAdminNotes(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="Record review decision, missing evidence, or implementation notes."
          />
        </label>

        {notice && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isUpdatingStatus || isApplying}
          className="btn-outline mt-5 w-full"
        >
          {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
          {isUpdatingStatus ? 'Saving...' : 'Save status only'}
        </button>
      </form>

      <div className="mt-5 border-t border-slate-200 pt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Apply changes
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          This approves the request and applies non-empty proposed fields to the
          public program record.
        </p>

        <button
          type="button"
          onClick={handleApproveAndApply}
          disabled={isUpdatingStatus || isApplying || status === 'rejected'}
          className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {isApplying ? 'Applying...' : 'Approve and apply changes'}
        </button>
      </div>
    </div>
  )
}