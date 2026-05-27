'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { updateTrainingSourceStatus } from '@/app/actions/training-sources'

type TrainingSourceStatusFormProps = {
  sourceId: string
  currentIsActive: boolean
  currentCrawlStatus: string
  currentAdminNotes: string
}

const CRAWL_STATUSES = [
  { value: 'not_started', label: 'Not started' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'paused', label: 'Paused' },
]

export default function TrainingSourceStatusForm({
  sourceId,
  currentIsActive,
  currentCrawlStatus,
  currentAdminNotes,
}: TrainingSourceStatusFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [isActive, setIsActive] = useState(currentIsActive)
  const [crawlStatus, setCrawlStatus] = useState(currentCrawlStatus)
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setError('')

    startTransition(async () => {
      try {
        await updateTrainingSourceStatus({
          sourceId,
          isActive,
          crawlStatus,
          adminNotes,
        })

        setNotice('Source updated.')
        router.refresh()
      } catch (caughtError) {
        console.error('Training source update failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not update source.'
        )
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
    >
      <p className="text-sm font-bold text-slate-950">Source control</p>

      <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
        />
        Active source
      </label>

      <label className="mt-4 block">
        <span className="label">Crawl status</span>

        <select
          value={crawlStatus}
          onChange={(event) => setCrawlStatus(event.target.value)}
          className="input-field"
        >
          {CRAWL_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="label">Admin notes</span>

        <textarea
          value={adminNotes}
          onChange={(event) => setAdminNotes(event.target.value)}
          rows={5}
          className="input-field"
          placeholder="Notes about source quality, import strategy, or review needs."
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
        {isPending ? 'Saving...' : 'Save source'}
      </button>
    </form>
  )
}