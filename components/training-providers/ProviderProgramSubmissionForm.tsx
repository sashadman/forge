'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Loader2 } from 'lucide-react'
import StateSelect from '@/components/forms/StateSelect'
import { submitProviderProgramForReview } from '@/app/actions/provider-program-submissions'

type ProviderProgramSubmissionFormProps = {
  providerProfile: {
    id: string
    name: string
    city: string
    state: string
  }
}

const PROGRAM_TYPES = [
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'trade_school', label: 'Trade school' },
  { value: 'community_college', label: 'Community college' },
  { value: 'workforce_program', label: 'Workforce program' },
  { value: 'employer_training', label: 'Employer training' },
]

const TRADE_OPTIONS = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'construction', label: 'Construction' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'welding', label: 'Welding' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'other', label: 'Other' },
]

export default function ProviderProgramSubmissionForm({
  providerProfile,
}: ProviderProgramSubmissionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [programType, setProgramType] = useState('workforce_program')
  const [tradeSlug, setTradeSlug] = useState('other')
  const [location, setLocation] = useState(providerProfile.city)
  const [state, setState] = useState(providerProfile.state)
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [outcomes, setOutcomes] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        await submitProviderProgramForReview({
          providerProfileId: providerProfile.id,
          name,
          programType,
          tradeSlug,
          location,
          state,
          duration,
          cost,
          description,
          requirements,
          outcomes,
          websiteUrl,
        })

        router.push('/training-providers/programs')
      } catch (caughtError) {
        console.error('Provider program submission failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not submit program for review.'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <GraduationCap className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Provider program submission</p>

          <h2 className="section-title mt-3">
            Submit a real program for admin review.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            This program will not become public immediately. Admin review is
            required before the listing appears in the public directory.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
          Provider workspace
        </p>

        <h3 className="mt-3 text-2xl font-bold text-slate-950">
          {providerProfile.name}
        </h3>

        <p className="mt-2 text-sm font-semibold text-slate-600">
          {providerProfile.city}, {providerProfile.state}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className="label">Program name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-field"
            placeholder="Example: Electrical Apprenticeship Preparation"
            required
          />
        </div>

        <div>
          <label className="label">Program type</label>
          <select
            value={programType}
            onChange={(event) => setProgramType(event.target.value)}
            className="input-field"
          >
            {PROGRAM_TYPES.map((programType) => (
              <option key={programType.value} value={programType.value}>
                {programType.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Career focus</label>
          <select
            value={tradeSlug}
            onChange={(event) => setTradeSlug(event.target.value)}
            className="input-field"
          >
            {TRADE_OPTIONS.map((trade) => (
              <option key={trade.value} value={trade.value}>
                {trade.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">City or location</label>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="input-field"
            placeholder="San Diego"
            required
          />
        </div>

        <StateSelect
          value={state}
          onChange={setState}
          required
          helperText="Use the primary state where the program operates."
        />

        <div>
          <label className="label">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="input-field"
            placeholder="Example: 12 weeks, 2 years, self-paced"
          />
        </div>

        <div>
          <label className="label">Cost</label>
          <input
            type="text"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            className="input-field"
            placeholder="Example: See provider, free, $2,500"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Program website URL</label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="input-field"
            placeholder="https://provider.edu/program"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Program description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={8}
            className="input-field"
            placeholder="Describe who this program serves, what it teaches, how it connects to work, and what students should expect."
            required
          />
          <p className="mt-2 text-xs font-medium text-slate-500">
            Minimum 80 characters. Be specific enough for a career seeker to
            understand the program.
          </p>
        </div>

        <div>
          <label className="label">Requirements</label>
          <textarea
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="One requirement per line."
          />
        </div>

        <div>
          <label className="label">Outcomes</label>
          <textarea
            value={outcomes}
            onChange={(event) => setOutcomes(event.target.value)}
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
          Provider submissions are reviewed by admins before becoming public.
          This protects seekers from inaccurate or unverified listings.
        </p>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Submitting...' : 'Submit for review'}
        </button>
      </div>
    </form>
  )
}