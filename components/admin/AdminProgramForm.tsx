'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ProgramType } from '@/lib/supabase/types'

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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  return `https://${trimmed}`
}

function splitLines(value: string) {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length > 0 ? lines : null
}

export default function AdminProgramForm() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [providerName, setProviderName] = useState('')
  const [programType, setProgramType] = useState<ProgramType>('apprenticeship')
  const [tradeSlug, setTradeSlug] = useState('electrical')
  const [location, setLocation] = useState('')
  const [state, setState] = useState('CA')
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [outcomes, setOutcomes] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setError('')

    const slug = createSlug(`${providerName}-${name}`)

    if (!slug) {
      setError('Please enter a valid provider and program name.')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('programs').insert({
      slug,
      name,
      provider_name: providerName,
      program_type: programType,
      trade_slug: tradeSlug,
      location,
      state,
      duration: duration.trim() || null,
      cost: cost.trim() || null,
      description,
      requirements: splitLines(requirements),
      outcomes: splitLines(outcomes),
      website_url: cleanUrl(websiteUrl),
      is_active: isActive,
    })

    if (error) {
      console.error(error)

      if (error.message.toLowerCase().includes('duplicate')) {
        setError(
          'A program with this provider/name slug already exists. Use a more specific program name.'
        )
      } else {
        setError('Could not create program. Check permissions and try again.')
      }

      setSaving(false)
      return
    }

    router.push(`/programs/${slug}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <GraduationCap className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Manual program entry</p>

          <h2 className="section-title mt-3">
            Add verified real training pathway information.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            This creates a public program record. Use only real provider and
            program information that career seekers can verify.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="label">Program name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="input-field"
            placeholder="Example: Inside Wireman Apprenticeship"
          />
        </div>

        <div>
          <label className="label">Provider name</label>
          <input
            type="text"
            value={providerName}
            onChange={(event) => setProviderName(event.target.value)}
            required
            className="input-field"
            placeholder="Example: Electrical Training Institute"
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
          <label className="label">Trade focus</label>
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
            required
            className="input-field"
            placeholder="San Diego"
          />
        </div>

        <div>
          <label className="label">State</label>
          <input
            type="text"
            value={state}
            onChange={(event) => setState(event.target.value.toUpperCase())}
            required
            maxLength={2}
            className="input-field"
            placeholder="CA"
          />
        </div>

        <div>
          <label className="label">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="input-field"
            placeholder="Example: 4–5 years, 12 weeks, varies"
          />
        </div>

        <div>
          <label className="label">Cost</label>
          <input
            type="text"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            className="input-field"
            placeholder="Example: See provider, tuition varies, paid apprenticeship"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={6}
            className="input-field"
            placeholder="Describe the real program, training model, and who it serves."
          />
        </div>

        <div>
          <label className="label">Requirements</label>
          <textarea
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            rows={6}
            className="input-field"
            placeholder={`One per line\nHigh school diploma or GED\nValid driver's license\nApplication required`}
          />
        </div>

        <div>
          <label className="label">Outcomes</label>
          <textarea
            value={outcomes}
            onChange={(event) => setOutcomes(event.target.value)}
            rows={6}
            className="input-field"
            placeholder={`One per line\nApprenticeship preparation\nIndustry-recognized training\nPathway to employment`}
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Provider website</label>
          <div className="relative">
            <input
              type="text"
              value={websiteUrl}
              onChange={(event) => setWebsiteUrl(event.target.value)}
              className="input-field pr-12"
              placeholder="https://provider.org/program"
            />
            <ExternalLink className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-orange-600" />
          <h3 className="text-2xl font-bold tracking-tight text-slate-950">
            Admin settings
          </h3>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="mt-1 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          />
          <span>
            <span className="block font-semibold text-slate-950">
              Publish as active
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-500">
              Active programs can appear publicly in the program directory.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Submit only real training program information. No placeholder records.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Creating program...' : 'Create program'}
        </button>
      </div>
    </form>
  )
}