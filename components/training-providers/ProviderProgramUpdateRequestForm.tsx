'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Loader2 } from 'lucide-react'
import { submitProviderProgramUpdateRequest } from '@/app/actions/provider-program-update-requests'

type ProviderProgramUpdateRequestFormProps = {
  program: {
    id: string
    name: string
    providerName: string
    description: string
    duration: string | null
    cost: string | null
    websiteUrl: string | null
  }
}

const REQUEST_TYPES = [
  { value: 'correction', label: 'Correct inaccurate information' },
  { value: 'content_update', label: 'Update program description/details' },
  { value: 'availability_update', label: 'Update availability/status' },
  { value: 'cost_update', label: 'Update cost or fees' },
  { value: 'general_update', label: 'General update request' },
]

export default function ProviderProgramUpdateRequestForm({
  program,
}: ProviderProgramUpdateRequestFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [requestType, setRequestType] = useState('correction')
  const [changeSummary, setChangeSummary] = useState('')
  const [proposedName, setProposedName] = useState(program.name)
  const [proposedDescription, setProposedDescription] = useState(
    program.description
  )
  const [proposedDuration, setProposedDuration] = useState(
    program.duration ?? ''
  )
  const [proposedCost, setProposedCost] = useState(program.cost ?? '')
  const [proposedWebsiteUrl, setProposedWebsiteUrl] = useState(
    program.websiteUrl ?? ''
  )
  const [proposedRequirements, setProposedRequirements] = useState('')
  const [proposedOutcomes, setProposedOutcomes] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        await submitProviderProgramUpdateRequest({
          programId: program.id,
          requestType,
          changeSummary,
          proposedName,
          proposedDescription,
          proposedDuration,
          proposedCost,
          proposedWebsiteUrl,
          proposedRequirements,
          proposedOutcomes,
        })

        router.push('/training-providers/programs')
      } catch (caughtError) {
        console.error('Provider program update request failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not submit update request.'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <FileText className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Provider update request</p>

          <h2 className="section-title mt-3">
            Request corrections for this program listing.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            Submit the changes you want an admin to review. This does not change
            the public listing immediately.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
          Current listing
        </p>

        <h3 className="mt-3 text-2xl font-bold text-slate-950">
          {program.name}
        </h3>

        <p className="mt-2 font-semibold text-slate-700">
          {program.providerName}
        </p>

        <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
          {program.description}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="label">Request type</label>
          <select
            value={requestType}
            onChange={(event) => setRequestType(event.target.value)}
            className="input-field"
          >
            {REQUEST_TYPES.map((requestType) => (
              <option key={requestType.value} value={requestType.value}>
                {requestType.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Proposed program name</label>
          <input
            type="text"
            value={proposedName}
            onChange={(event) => setProposedName(event.target.value)}
            className="input-field"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Summary of requested change</label>
          <textarea
            value={changeSummary}
            onChange={(event) => setChangeSummary(event.target.value)}
            rows={4}
            className="input-field"
            placeholder="Explain what is inaccurate or what should be updated."
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Proposed description</label>
          <textarea
            value={proposedDescription}
            onChange={(event) => setProposedDescription(event.target.value)}
            rows={7}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Proposed duration</label>
          <input
            type="text"
            value={proposedDuration}
            onChange={(event) => setProposedDuration(event.target.value)}
            className="input-field"
            placeholder="Example: 6 months, 2 years, self-paced..."
          />
        </div>

        <div>
          <label className="label">Proposed cost</label>
          <input
            type="text"
            value={proposedCost}
            onChange={(event) => setProposedCost(event.target.value)}
            className="input-field"
            placeholder="Example: See provider, $2,500, tuition varies..."
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Proposed website URL</label>
          <input
            type="text"
            value={proposedWebsiteUrl}
            onChange={(event) => setProposedWebsiteUrl(event.target.value)}
            className="input-field"
            placeholder="https://provider.edu/program"
          />
        </div>

        <div>
          <label className="label">Proposed requirements</label>
          <textarea
            value={proposedRequirements}
            onChange={(event) => setProposedRequirements(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="One requirement per line."
          />
        </div>

        <div>
          <label className="label">Proposed outcomes</label>
          <textarea
            value={proposedOutcomes}
            onChange={(event) => setProposedOutcomes(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="One outcome per line."
          />
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Admin review is required before public program information changes.
        </p>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Submitting...' : 'Submit update request'}
        </button>
      </div>
    </form>
  )
}