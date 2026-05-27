'use client'

import { FormEvent, useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateProviderClaimStatus } from '@/app/actions/provider-claims'

type ProviderClaimStatus = 'pending' | 'approved' | 'rejected' | 'needs_more_info'

type ProviderClaimReviewFormProps = {
  claimId: string
  currentStatus: string
  currentAdminNotes: string
}

const STATUS_OPTIONS: { value: ProviderClaimStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'needs_more_info', label: 'Needs more info' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export default function ProviderClaimReviewForm({
  claimId,
  currentStatus,
  currentAdminNotes,
}: ProviderClaimReviewFormProps) {
  const [status, setStatus] = useState<ProviderClaimStatus>(
    isProviderClaimStatus(currentStatus) ? currentStatus : 'pending'
  )
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setNotice('')

    startTransition(async () => {
      try {
        await updateProviderClaimStatus({
          claimId,
          status,
          adminNotes,
        })

        setNotice('Provider request updated.')
      } catch (caughtError) {
        console.error('Provider claim review failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not update provider request.'
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
            setStatus(event.target.value as ProviderClaimStatus)
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
        <span className="label">Admin notes</span>

        <textarea
          value={adminNotes}
          onChange={(event) => setAdminNotes(event.target.value)}
          rows={6}
          className="input-field"
          placeholder="Record verification notes, missing evidence, or approval reasoning."
        />
      </label>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary mt-5 w-full"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? 'Updating...' : 'Update request'}
      </button>
    </form>
  )
}

function isProviderClaimStatus(value: string): value is ProviderClaimStatus {
  return (
    value === 'pending' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'needs_more_info'
  )
}