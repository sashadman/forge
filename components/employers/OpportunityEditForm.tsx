'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  ExternalLink,
  Save,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OpportunityType } from '@/lib/supabase/types'

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
}

type OpportunityEditFormProps = {
  employerSlug: string
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

export default function OpportunityEditForm({
  employerSlug,
  opportunity,
}: OpportunityEditFormProps) {
  const router = useRouter()
  const supabase = createClient()

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

  const [saving, setSaving] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
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
      })
      .eq('id', opportunity.id)
      .eq('employer_id', opportunity.employer_id)

    if (error) {
      console.error(error)
      setError('Could not update opportunity. Please try again.')
      setSaving(false)
      return
    }

    setSuccess('Opportunity updated successfully.')
    setSaving(false)
    router.refresh()
  }

  async function deactivateListing() {
    if (!confirmDeactivate) {
      setConfirmDeactivate(true)
      return
    }

    setDeactivating(true)
    setSuccess('')
    setError('')

    const { error } = await supabase
      .from('opportunities')
      .update({ is_active: false })
      .eq('id', opportunity.id)
      .eq('employer_id', opportunity.employer_id)

    if (error) {
      console.error(error)
      setError('Could not deactivate listing. Please try again.')
      setDeactivating(false)
      return
    }

    router.push('/employers/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="content-panel">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>

            <div>
              <p className="eyebrow">Edit listing</p>

              <h2 className="section-title mt-3">{opportunity.title}</h2>

              <p className="muted-text mt-3 max-w-3xl">
                Update the details for this real opportunity. The public URL slug stays the same for now to avoid broken links.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/employers/dashboard" className="btn-outline">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>

            {opportunity.is_active && (
              <Link
                href={`/opportunities/${opportunity.slug}`}
                className="btn-dark"
              >
                View public listing
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
              placeholder="https://company.com/careers"
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
            Changes update the public opportunity listing.
          </p>

          <button type="submit" disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? 'Saving changes...' : 'Save changes'}
          </button>
        </div>
      </form>

      {opportunity.is_active && (
        <section className="content-panel border-red-200">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Deactivate listing
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Hide this opportunity from the public directory.
              </h2>

              <p className="muted-text mt-3 max-w-3xl">
                Deactivation does not delete the listing. It changes the listing to inactive so it no longer appears publicly.
              </p>

              {confirmDeactivate && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Click deactivate again to confirm.
                </div>
              )}

              <button
                type="button"
                onClick={deactivateListing}
                disabled={deactivating}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deactivating ? 'Deactivating...' : 'Deactivate listing'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}