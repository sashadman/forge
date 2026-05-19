'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, GraduationCap, Save, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ProgramType } from '@/lib/supabase/app-types'

type Program = {
  id: string
  slug: string
  name: string
  provider_name: string
  program_type: ProgramType
  trade_slug: string
  location: string
  state: string
  duration: string | null
  cost: string | null
  description: string
  requirements: string[] | null
  outcomes: string[] | null
  website_url: string | null
  is_active: boolean
}

type AdminProgramEditFormProps = {
  program: Program
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

function joinLines(value: string[] | null) {
  return value?.join('\n') ?? ''
}

export default function AdminProgramEditForm({
  program,
}: AdminProgramEditFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(program.name)
  const [providerName, setProviderName] = useState(program.provider_name)
  const [programType, setProgramType] = useState<ProgramType>(program.program_type)
  const [tradeSlug, setTradeSlug] = useState(program.trade_slug)
  const [location, setLocation] = useState(program.location)
  const [state, setState] = useState(program.state)
  const [duration, setDuration] = useState(program.duration || '')
  const [cost, setCost] = useState(program.cost || '')
  const [description, setDescription] = useState(program.description)
  const [requirements, setRequirements] = useState(joinLines(program.requirements))
  const [outcomes, setOutcomes] = useState(joinLines(program.outcomes))
  const [websiteUrl, setWebsiteUrl] = useState(program.website_url || '')
  const [isActive, setIsActive] = useState(program.is_active)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setSuccess('')
    setError('')

    const { error } = await supabase
      .from('programs')
      .update({
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
      .eq('id', program.id)

    if (error) {
      console.error(error)
      setError('Could not update program. Check permissions and try again.')
      setSaving(false)
      return
    }

    setSuccess('Program updated successfully.')
    setSaving(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <GraduationCap className="h-7 w-7" />
          </div>

          <div>
            <p className="eyebrow">Edit program</p>

            <h2 className="section-title mt-3">{program.name}</h2>

            <p className="muted-text mt-3 max-w-3xl">
              Update real provider and program information. The public slug stays the same for now.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/admin/programs" className="btn-outline">
            <ArrowLeft className="h-4 w-4" />
            Back to programs
          </Link>

          {program.is_active && (
            <Link href={`/programs/${program.slug}`} className="btn-dark">
              Public page
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
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
          />
        </div>

        <div>
          <label className="label">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Cost</label>
          <input
            type="text"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            className="input-field"
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
          />
        </div>

        <div>
          <label className="label">Requirements</label>
          <textarea
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="One per line"
          />
        </div>

        <div>
          <label className="label">Outcomes</label>
          <textarea
            value={outcomes}
            onChange={(event) => setOutcomes(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="One per line"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Provider website</label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="input-field"
          />
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
              Active program
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

      {success && (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Changes update this program record.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="h-4 w-4" />
          {saving ? 'Saving changes...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}