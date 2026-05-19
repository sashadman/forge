'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BriefcaseBusiness, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OpportunityType } from '@/lib/supabase/app-types'

type OpportunityFormProps = {
  employerId: string
  employerSlug: string
}

const OPPORTUNITY_TYPES: { value: OpportunityType; label: string }[] = [
  { value: 'job', label: 'Job' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'trainee', label: 'Trainee role' },
  { value: 'internship', label: 'Internship' },
  { value: 'pre_apprenticeship', label: 'Pre-apprenticeship' },
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

export default function OpportunityForm({
  employerId,
  employerSlug,
}: OpportunityFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [opportunityType, setOpportunityType] =
    useState<OpportunityType>('job')
  const [tradeSlug, setTradeSlug] = useState('electrical')
  const [location, setLocation] = useState('')
  const [state, setState] = useState('CA')
  const [payRange, setPayRange] = useState('')
  const [schedule, setSchedule] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [benefits, setBenefits] = useState('')
  const [applicationUrl, setApplicationUrl] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setError('')

    const baseSlug = createSlug(title)

    if (!baseSlug) {
      setError('Please enter a valid opportunity title.')
      setSaving(false)
      return
    }

    const slug = `${employerSlug}-${baseSlug}`

    const { error } = await supabase.from('opportunities').insert({
      employer_id: employerId,
      title,
      slug,
      opportunity_type: opportunityType,
      trade_slug: tradeSlug,
      location,
      state,
      pay_range: payRange.trim() || null,
      schedule: schedule.trim() || null,
      description,
      requirements: splitLines(requirements),
      benefits: splitLines(benefits),
      application_url: cleanUrl(applicationUrl),
      is_active: true,
    })

    if (error) {
      console.error(error)

      if (error.message.toLowerCase().includes('duplicate')) {
        setError(
          'An opportunity with this title already exists for this employer. Try a more specific title.'
        )
      } else {
        setError('Could not create opportunity. Please try again.')
      }

      setSaving(false)
      return
    }

    router.push(`/opportunities/${slug}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <BriefcaseBusiness className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Opportunity listing</p>

          <h2 className="section-title mt-3">
            Add a real role or training opportunity.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            This listing will be connected to your employer profile. Only post
            real opportunities that someone can actually review or apply for.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className="label">Opportunity title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="input-field"
            placeholder="Example: Apprentice Electrician"
          />
        </div>

        <div>
          <label className="label">Opportunity type</label>
          <select
            value={opportunityType}
            onChange={(event) =>
              setOpportunityType(event.target.value as OpportunityType)
            }
            className="input-field"
          >
            {OPPORTUNITY_TYPES.map((type) => (
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
          <label className="label">Pay range</label>
          <input
            type="text"
            value={payRange}
            onChange={(event) => setPayRange(event.target.value)}
            className="input-field"
            placeholder="$22–$30/hr, DOE, or See listing"
          />
        </div>

        <div>
          <label className="label">Schedule</label>
          <input
            type="text"
            value={schedule}
            onChange={(event) => setSchedule(event.target.value)}
            className="input-field"
            placeholder="Full-time, part-time, evenings, flexible..."
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
            placeholder="Describe the opportunity, work environment, responsibilities, and who should apply."
          />
        </div>

        <div>
          <label className="label">Requirements</label>
          <textarea
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            rows={6}
            className="input-field"
            placeholder={`One per line\nValid driver's license\nBasic hand tools\nWillingness to learn`}
          />
        </div>

        <div>
          <label className="label">Benefits</label>
          <textarea
            value={benefits}
            onChange={(event) => setBenefits(event.target.value)}
            rows={6}
            className="input-field"
            placeholder={`One per line\nPaid training\nMentorship\nGrowth opportunity`}
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Application or information URL</label>
          <div className="relative">
            <input
              type="text"
              value={applicationUrl}
              onChange={(event) => setApplicationUrl(event.target.value)}
              className="input-field pr-12"
              placeholder="https://company.com/careers"
            />
            <ExternalLink className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          This will publish the opportunity as an active listing.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Creating listing...' : 'Create opportunity'}
        </button>
      </div>
    </form>
  )
}