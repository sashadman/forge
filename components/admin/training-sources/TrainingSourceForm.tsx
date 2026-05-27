'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DatabaseZap, Loader2 } from 'lucide-react'
import { createTrainingSource } from '@/app/actions/training-sources'
import type { SourceType } from '@/lib/training-data/source-classification'

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: 'community_college', label: 'Community college' },
  { value: 'technical_college', label: 'Technical college' },
  { value: 'college_scorecard', label: 'College Scorecard' },
  { value: 'ipeds', label: 'IPEDS / NCES' },
  { value: 'registered_apprenticeship', label: 'Registered apprenticeship' },
  { value: 'state_etpl', label: 'State ETPL' },
  { value: 'state_workforce', label: 'State workforce' },
  { value: 'workforce_board', label: 'Workforce board' },
  { value: 'provider_submitted', label: 'Provider submitted' },
  { value: 'other_verified', label: 'Other verified' },
]

export default function TrainingSourceForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [sourceName, setSourceName] = useState('')
  const [sourceType, setSourceType] = useState<SourceType>('community_college')
  const [baseUrl, setBaseUrl] = useState('')
  const [sourceState, setSourceState] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [providerName, setProviderName] = useState('')
  const [programIndexUrl, setProgramIndexUrl] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function resetForm() {
    setSourceName('')
    setSourceType('community_college')
    setBaseUrl('')
    setSourceState('')
    setInstitutionName('')
    setProviderName('')
    setProgramIndexUrl('')
    setApiEndpoint('')
    setAdminNotes('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setError('')

    startTransition(async () => {
      try {
        await createTrainingSource({
          sourceName,
          sourceType,
          baseUrl,
          sourceState,
          institutionName,
          providerName,
          programIndexUrl,
          apiEndpoint,
          adminNotes,
        })

        setNotice('Training source created.')
        resetForm()
        router.refresh()
      } catch (caughtError) {
        console.error('Training source creation failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not create training source.'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <DatabaseZap className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Add official source</p>

          <h2 className="section-title mt-3">
            Register a trusted training data source.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            Add official .edu, federal, state, workforce, or verified provider
            sources. The system classifies authority and trust level from the URL
            and source type.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="label">Source name</label>
          <input
            type="text"
            value={sourceName}
            onChange={(event) => setSourceName(event.target.value)}
            className="input-field"
            placeholder="Example: Texas Workforce Commission ETPL"
            required
          />
        </div>

        <div>
          <label className="label">Source type</label>
          <select
            value={sourceType}
            onChange={(event) => setSourceType(event.target.value as SourceType)}
            className="input-field"
          >
            {SOURCE_TYPES.map((sourceTypeOption) => (
              <option key={sourceTypeOption.value} value={sourceTypeOption.value}>
                {sourceTypeOption.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Base URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            className="input-field"
            placeholder="https://example.edu"
            required
          />
        </div>

        <div>
          <label className="label">State</label>
          <input
            type="text"
            value={sourceState}
            onChange={(event) => setSourceState(event.target.value)}
            className="input-field"
            placeholder="CA, TX, FL, NY, or blank for national"
            maxLength={2}
          />
        </div>

        <div>
          <label className="label">Institution name</label>
          <input
            type="text"
            value={institutionName}
            onChange={(event) => setInstitutionName(event.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="label">Provider / agency name</label>
          <input
            type="text"
            value={providerName}
            onChange={(event) => setProviderName(event.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="label">Program index URL</label>
          <input
            type="text"
            value={programIndexUrl}
            onChange={(event) => setProgramIndexUrl(event.target.value)}
            className="input-field"
            placeholder="Optional page where programs are listed"
          />
        </div>

        <div>
          <label className="label">API endpoint</label>
          <input
            type="text"
            value={apiEndpoint}
            onChange={(event) => setApiEndpoint(event.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Admin notes</label>
          <textarea
            value={adminNotes}
            onChange={(event) => setAdminNotes(event.target.value)}
            rows={4}
            className="input-field"
            placeholder="Why this source is legitimate, how it should be imported, or what needs review."
          />
        </div>
      </div>

      {notice && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          New sources create future import targets. They do not publish programs
          directly.
        </p>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Creating...' : 'Create source'}
        </button>
      </div>
    </form>
  )
}