'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  ExternalLink,
  Save,
  ShieldCheck,
} from 'lucide-react'
import StateSelect from '@/components/forms/StateSelect'
import { createClient } from '@/lib/supabase/client'
import type { OpportunityType } from '@/lib/supabase/app-types'

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

  const qualityItems = useMemo(
    () => [
      {
        label: 'Opportunity title',
        complete: Boolean(title.trim()),
        helpText: 'The listing has a clear opportunity title.',
      },
      {
        label: 'Employer connection',
        complete: Boolean(employer?.name),
        helpText: 'The opportunity is connected to an employer profile.',
      },
      {
        label: 'Opportunity type',
        complete: Boolean(opportunityType),
        helpText: 'The listing is categorized by opportunity type.',
      },
      {
        label: 'Trade focus',
        complete: Boolean(tradeSlug),
        helpText: 'The listing is connected to a trade or pathway.',
      },
      {
        label: 'Location',
        complete: Boolean(location.trim() && state.trim()),
        helpText: 'City and state are present.',
      },
      {
        label: 'Description quality',
        complete: description.trim().length >= 100,
        helpText:
          'Description explains the role, training path, or opportunity clearly.',
      },
      {
        label: 'Schedule',
        complete: Boolean(schedule.trim()),
        helpText: 'Schedule, shift, or time expectation is listed.',
      },
      {
        label: 'Pay range',
        complete: Boolean(payRange.trim()),
        helpText: 'Pay range or compensation guidance is listed when available.',
      },
      {
        label: 'Requirements',
        complete: splitLines(requirements) !== null,
        helpText: 'At least one requirement or eligibility note is listed.',
      },
      {
        label: 'Benefits',
        complete: splitLines(benefits) !== null,
        helpText: 'At least one benefit, support, or advantage is listed.',
      },
      {
        label: 'Application URL',
        complete: Boolean(applicationUrl.trim()),
        helpText: 'A real application or information link is listed.',
      },
    ],
    [
      title,
      employer,
      opportunityType,
      tradeSlug,
      location,
      state,
      description,
      schedule,
      payRange,
      requirements,
      benefits,
      applicationUrl,
    ]
  )

  const completedQualityItems = qualityItems.filter((item) => item.complete)
    .length

  const qualityScore = Math.round(
    (completedQualityItems / qualityItems.length) * 100
  )

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

    setSuccess('Opportunity data-quality record updated successfully.')
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
            <p className="eyebrow">Opportunity data quality</p>

            <h2 className="section-title mt-3">{opportunity.title}</h2>

            <p className="muted-text mt-3 max-w-3xl">
              Review real listing information, employer connection,
              requirements, benefits, application link, and public visibility
              before keeping this opportunity active.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/admin/opportunities" className="btn-outline">
            <ArrowLeft className="h-4 w-4" />
            Back to opportunities
          </Link>

          {isActive && (
            <Link href={`/opportunities/${opportunity.slug}`} className="btn-dark">
              Public listing
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Listing quality</p>

              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {qualityScore}% complete
              </h3>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-lg font-bold text-orange-700">
              {qualityScore}%
            </div>
          </div>

          <p className="muted-text mt-4">
            This score does not automatically approve a listing. It helps admin
            review whether the opportunity is useful enough for seekers.
          </p>

          <div className="mt-6 grid gap-3">
            {qualityItems.map((item) => (
              <QualityItem
                key={item.label}
                label={item.label}
                helpText={item.helpText}
                complete={item.complete}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-orange-600" />

            <div>
              <p className="eyebrow">Admin decision</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                Visibility
              </h3>
            </div>
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
                Keep listing active
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-500">
                Active opportunities can appear publicly. Inactive opportunities
                stay hidden from public browsing.
              </span>
            </span>
          </label>

          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="font-semibold text-orange-900">
              Current public status
            </p>

            <p className="mt-2 text-sm leading-6 text-orange-900/80">
              {isActive
                ? qualityScore >= 80
                  ? 'This listing is active and has strong data completeness.'
                  : 'This listing is active, but it may need more detail before seekers rely on it.'
                : 'This listing is inactive and should not appear publicly.'}
            </p>
          </div>
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
            placeholder="San Diego"
          />
        </div>

        <StateSelect
          value={state}
          onChange={setState}
          required
          helperText="ZIP autofill will be added through the internal ZIP data layer next."
        />

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
          Opportunity visibility affects what seekers can browse. Keep only
          useful, real opportunity records active.
        </p>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="h-4 w-4" />
          {saving ? 'Saving opportunity quality...' : 'Save opportunity record'}
        </button>
      </div>
    </form>
  )
}

function QualityItem({
  label,
  helpText,
  complete,
}: {
  label: string
  helpText: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {complete ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
        )}

        <div>
          <p className="font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{helpText}</p>
        </div>
      </div>
    </div>
  )
}