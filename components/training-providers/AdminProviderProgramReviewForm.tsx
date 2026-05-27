'use client'

import { FormEvent, useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateProviderProgramReviewStatus } from '@/app/actions/provider-programs'

type ProgramReviewStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_more_info'

type AdminProviderProgramReviewFormProps = {
  programId: string
  currentStatus: string
  currentReviewNotes: string
}

const STATUS_OPTIONS: { value: ProgramReviewStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'needs_more_info', label: 'Needs more info' },
  { value: 'approved', label: 'Approved and publish' },
  { value: 'rejected', label: 'Rejected' },
]

export default function AdminProviderProgramReviewForm({
  programId,
  currentStatus,
  currentReviewNotes,
}: AdminProviderProgramReviewFormProps) {
  const [status, setStatus] = useState<ProgramReviewStatus>(
    isProgramReviewStatus(currentStatus) ? currentStatus : 'pending'
  )
  const [reviewNotes, setReviewNotes] = useState(currentReviewNotes)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setNotice('')
    setError('')

    startTransition(async () => {
      try {
        await updateProviderProgramReviewStatus({
          programId,
          status,
          reviewNotes,
        })

        setNotice('Program review updated.')
      } catch (caughtError) {
        console.error('Program review update failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not update program review.'
        )
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
    >
      <p className="text-sm font-bold text-slate-950">Review decision</p>

      <label className="mt-4 block">
        <span className="label">Status</span>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as ProgramReviewStatus)
          }
          className="input-field"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="label">Review notes</span>

        <textarea
          value={reviewNotes}
          onChange={(event) => setReviewNotes(event.target.value)}
          rows={6}
          className="input-field"
          placeholder="Explain approval, missing information, or rejection reason."
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
        disabled={isPending}
        className="btn-primary mt-5 w-full"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? 'Updating...' : 'Update program review'}
      </button>
    </form>
  )
}

function isProgramReviewStatus(value: string): value is ProgramReviewStatus {
  return (
    value === 'pending' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'needs_more_info'
  )
}