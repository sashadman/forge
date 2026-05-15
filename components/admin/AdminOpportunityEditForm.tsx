'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BriefcaseBusiness,
  ExternalLink,
  Save,
  ShieldCheck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OpportunityType } from '@/lib/supabase/types'

type EmployerRelation = {
  name: string
  slug: string
}

type Opportunity = {
  id: string
  employer_id: string
  title: string
  slug: string
  opportunity_type: OpportunityType
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  requirements: string[] | null
  benefits: string[] | null
  application_url: string | null
  is_active: boolean
  employers: EmployerRelation | EmployerRelation[] | null
}

type AdminOpportunityEditFormProps = {
  opportunity: Opportunity
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

export default function AdminOpportunityEditForm({
  opportunity,
}: AdminOpportunityEditFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const employer = Array.isArray(opportunity.employers)
    ? opportunity.employers[0]
    : opportunity.employers

  const [title, setTitle] = useState(opportunity.title)
  const [opportunityType, setOpportunityType] = useState<OpportunityType>(
    opportunity.opportunity_type
  )
  const [tradeSlug, setTradeSlug] = useState(opportunity.trade_slug)
  const [location, setLocation] = useState(opportunity.location)
  const [state, setState] = useState(opportunity.state)
  const [payRange, setPayRange] = useState(opportunity.pay_range || '')
  const [schedule, setSchedule] = useState(opportunity.schedule || '')
  const [description, setDescription] = useState(opportunity.description)
  const [requirements, setRequirements] = useState(
    joinLines(opportunity.requirements)
  )
  const [benefits, setBenefits] = useState(joinLines(opportunity.benefits))
  const [applicationUrl, setApplicationUrl] = useState(
    opportunity.application_url || ''
  )
  const [isActive, setIsActive] = useState(opportunity.is_active)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setSuccess('')
    setError('')

    const { error } = await supabase
      .from('opportunities')
      .update({
        title,
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
        is_active: isActive,
      })
      .eq('id', opportunity.id)

    if (error) {
      console.error(error)
      setError('Could not update opportunity. Check permissions and try again.')
      setSaving(false)
      return
    }

    setSuccess('Opportunity updated successfully.')
    setSaving(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <BriefcaseBusiness className="h-7 w-7" />
          </div>

          <div>
            <p className="eyebrow">Edit opportunity</p>

            <h2 className="section-title mt-3">{opportunity.title}</h2>

            <p className="muted-text mt-3 max-w-3xl">
              Update a real listing connected to {employer?.name || 'an employer'}.
              The public slug stays the same for now.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/admin/opportunities" className="btn-outline">
            <ArrowLeft className="h-4 w-4" />
            Back to opportunities
          </Link>

          {opportunity.is_active && (
            <Link href={`/opportunities/${opportunity.slug}`} className="btn-dark">
              Public listing
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
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
          <label className="label">Pay range</label>
          <input
            type="text"
            value={payRange}
            onChange={(event) => setPayRange(event.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Schedule</label>
          <input
            type="text"
            value={schedule}
            onChange={(event) => setSchedule(event.target.value)}
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
          <label className="label">Benefits</label>
          <textarea
            value={benefits}
            onChange={(event) => setBenefits(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="One per line"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Application or information URL</label>
          <input
            type="text"
            value={applicationUrl}
            onChange={(event) => setApplicationUrl(event.target.value)}
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
              Active listing
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-500">
              Active opportunities can appear publicly.
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
          Changes update this opportunity record.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="h-4 w-4" />
          {saving ? 'Saving changes...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}