'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Loader2 } from 'lucide-react'
import StateSelect from '@/components/forms/StateSelect'
import { submitProviderProgram } from '@/app/actions/provider-programs'
import type { Database } from '@/lib/supabase/types'

type ProgramType = Database['public']['Enums']['program_type']

type ProviderProgramFormProps = {
  providerProfileId: string
  providerName: string
  defaultCity: string
  defaultState: string
  defaultWebsiteUrl: string | null
}

const PROGRAM_TYPES: { value: ProgramType; label: string }[] = [
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'trade_school', label: 'Trade school' },
  { value: 'community_college', label: 'Community college' },
  { value: 'workforce_program', label: 'Workforce program' },
  { value: 'employer_training', label: 'Employer training' },
]

const TRADE_OPTIONS = [
  'electrical',
  'hvac',
  'plumbing',
  'welding',
  'solar',
  'construction',
  'carpentry',
  'automotive',
  'other',
]

export default function ProviderProgramForm({
  providerProfileId,
  providerName,
  defaultCity,
  defaultState,
  defaultWebsiteUrl,
}: ProviderProgramFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState('')
  const [programType, setProgramType] = useState<ProgramType>('apprenticeship')
  const [tradeSlug, setTradeSlug] = useState('electrical')
  const [location, setLocation] = useState(defaultCity)
  const [state, setState] = useState(defaultState)
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [outcomes, setOutcomes] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState(defaultWebsiteUrl ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        await submitProviderProgram({
          providerProfileId,
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
        router.refresh()
      } catch (caughtError) {
        console.error('Provider program submission failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not submit training program.'
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
            Submit a real training program for review.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            This program will be connected to {providerName}. It will not appear
            publicly until an admin reviews and approves it.
          </p>
        </div>
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
            onChange={(event) => setProgramType(event.target.value as ProgramType)}
            className="input-field"
          >
            {PROGRAM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
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
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">City</label>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="input-field"
            required
          />
        </div>

        <StateSelect
          value={state}
          onChange={setState}
          required
          helperText="Use the program's primary operating state."
        />

        <div>
          <label className="label">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="input-field"
            placeholder="Example: 12 weeks, 6 months, 2 years"
          />
        </div>

        <div>
          <label className="label">Cost</label>
          <input
            type="text"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            className="input-field"
            placeholder="Example: Free, $1,200, varies, financial aid available"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Program description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="Describe what the program teaches, who it serves, and what students should expect."
            required
          />
        </div>

        <div>
          <label className="label">Requirements</label>
          <textarea
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            rows={6}
            className="input-field"
            placeholder={`One per line\nHigh school diploma or GED\n18+\nValid ID`}
          />
        </div>

        <div>
          <label className="label">Outcomes</label>
          <textarea
            value={outcomes}
            onChange={(event) => setOutcomes(event.target.value)}
            rows={6}
            className="input-field"
            placeholder={`One per line\nCertificate of completion\nApprenticeship readiness\nJob placement support`}
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Program URL</label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="input-field"
            placeholder="https://provider.edu/program"
          />
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Submitted programs enter admin review before they appear publicly.
        </p>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Submitting...' : 'Submit program for review'}
        </button>
      </div>
    </form>
  )
}