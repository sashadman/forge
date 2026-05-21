'use client'

import { FormEvent, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BriefcaseBusiness,
  Database,
  ExternalLink,
  Info,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react'
import StateSelect from '@/components/forms/StateSelect'
import type {
  AdminOpportunityEmployerOption,
  AdminOpportunitySourceOption,
} from '@/lib/admin/get-admin-opportunity-create-page-data'
import type {
  OpportunityType,
  OpportunityVerificationStatus,
} from '@/lib/supabase/app-types'
import {
  OPPORTUNITY_TYPE_OPTIONS,
  OPPORTUNITY_VERIFICATION_OPTIONS,
  TRADE_OPTIONS,
} from '@/lib/opportunities/opportunity-options'
import { createAdminOpportunity } from '@/app/actions/admin-opportunities'

type AdminOpportunityCreateFormProps = {
  employers: AdminOpportunityEmployerOption[]
  sources: AdminOpportunitySourceOption[]
}

export default function AdminOpportunityCreateForm({
  employers,
  sources,
}: AdminOpportunityCreateFormProps) {
  const router = useRouter()

  const [employerId, setEmployerId] = useState(employers[0]?.id ?? '')
  const [sourceId, setSourceId] = useState('')
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
  const [externalUrl, setExternalUrl] = useState('')
  const [applicationUrl, setApplicationUrl] = useState('')
  const [verificationStatus, setVerificationStatus] =
    useState<OpportunityVerificationStatus>('source_verified')
  const [expiresAt, setExpiresAt] = useState('')
  const [isActive, setIsActive] = useState(false)

  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const selectedEmployer = useMemo(
    () => employers.find((employer) => employer.id === employerId),
    [employerId, employers]
  )

  const selectedSource = useMemo(
    () => sources.find((source) => source.id === sourceId),
    [sourceId, sources]
  )

  const qualityScore = useMemo(() => {
    const checks = [
      Boolean(employerId),
      Boolean(title.trim()),
      Boolean(opportunityType),
      Boolean(tradeSlug),
      Boolean(location.trim() && state.trim()),
      description.trim().length >= 80,
      Boolean(externalUrl.trim()),
      Boolean(verificationStatus),
    ]

    const completed = checks.filter(Boolean).length
    return Math.round((completed / checks.length) * 100)
  }, [
    employerId,
    title,
    opportunityType,
    tradeSlug,
    location,
    state,
    description,
    externalUrl,
    verificationStatus,
  ])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        const created = await createAdminOpportunity({
          employerId,
          sourceId: sourceId || undefined,
          title,
          opportunityType,
          tradeSlug,
          location,
          state,
          payRange,
          schedule,
          description,
          requirements,
          benefits,
          applicationUrl,
          externalUrl,
          verificationStatus,
          isActive,
          expiresAt: expiresAt || undefined,
        })

        router.push(`/admin/opportunities/${created.id}/edit`)
        router.refresh()
      } catch (error) {
        console.error('Failed to create admin opportunity:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not create opportunity.'
        )
      }
    })
  }

  if (employers.length === 0) {
    return (
      <div className="content-panel">
        <BriefcaseBusiness className="h-10 w-10 text-orange-600" />

        <h2 className="mt-5 text-2xl font-bold text-slate-950">
          Add an employer first
        </h2>

        <p className="muted-text mt-3 max-w-2xl">
          Admin-created opportunities must be connected to a real active
          employer profile before they can be created.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/admin/employers/new" className="btn-primary">
            <PlusCircle className="h-4 w-4" />
            Add employer
          </Link>

          <Link href="/admin/employers" className="btn-outline">
            Manage employers
            <BriefcaseBusiness className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="content-panel">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>

            <div>
              <p className="eyebrow">Create opportunity</p>

              <h2 className="section-title mt-3">
                Add a real listing from a trusted source.
              </h2>

              <p className="muted-text mt-3 max-w-3xl">
                Create only real opportunities connected to real employers.
                Include the official or trusted source URL so the listing can be
                verified later.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/opportunities" className="btn-outline">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary px-6 py-3"
            >
              <PlusCircle className="h-4 w-4" />
              {isPending ? 'Creating...' : 'Create opportunity'}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="content-panel">
          <div className="grid gap-6 lg:grid-cols-2">
            <SelectField
              label="Employer"
              value={employerId}
              onChange={setEmployerId}
              options={employers.map((employer) => ({
                value: employer.id,
                label: `${employer.name} — ${employer.location}, ${employer.state}`,
              }))}
            />

            <SelectField
              label="Source"
              value={sourceId}
              onChange={setSourceId}
              options={[
                {
                  value: '',
                  label: 'Manual admin research',
                },
                ...sources.map((source) => ({
                  value: source.id,
                  label: source.name,
                })),
              ]}
            />

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

            <SelectField
              label="Opportunity type"
              value={opportunityType}
              onChange={(value) => setOpportunityType(value as OpportunityType)}
              options={OPPORTUNITY_TYPE_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />

            <SelectField
              label="Trade focus"
              value={tradeSlug}
              onChange={setTradeSlug}
              options={TRADE_OPTIONS}
            />

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

            <StateSelect value={state} onChange={setState} required />

            <div>
              <label className="label">Pay range</label>
              <input
                type="text"
                value={payRange}
                onChange={(event) => setPayRange(event.target.value)}
                className="input-field"
                placeholder="$22–$30/hr, DOE, See listing"
              />
            </div>

            <div>
              <label className="label">Schedule</label>
              <input
                type="text"
                value={schedule}
                onChange={(event) => setSchedule(event.target.value)}
                className="input-field"
                placeholder="Full-time, part-time, apprenticeship schedule..."
              />
            </div>

            <div className="lg:col-span-2">
              <label className="label">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={7}
                className="input-field"
                placeholder="Write a clear, useful summary based on the official listing. Do not copy large blocks blindly."
              />
              <p className="mt-2 text-xs text-slate-500">
                Minimum 80 characters. Summarize the real listing clearly and
                professionally.
              </p>
            </div>

            <div>
              <label className="label">Requirements</label>
              <textarea
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                rows={6}
                className="input-field"
                placeholder={`One per line\nValid driver's license\nBasic tools\nWillingness to learn`}
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
              <label className="label">External source URL</label>
              <div className="relative">
                <input
                  type="text"
                  value={externalUrl}
                  onChange={(event) => setExternalUrl(event.target.value)}
                  required
                  className="input-field pr-12"
                  placeholder="Official listing or trusted source URL"
                />
                <ExternalLink className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="label">Application URL</label>
              <input
                type="text"
                value={applicationUrl}
                onChange={(event) => setApplicationUrl(event.target.value)}
                className="input-field"
                placeholder="Optional. If blank, the external source URL will be used."
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="content-panel">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-orange-600" />

              <div>
                <p className="eyebrow">Quality control</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  {qualityScore}% complete
                </h3>
              </div>
            </div>

            <p className="muted-text mt-4">
              This score helps admin review listing completeness. It does not
              automatically verify the opportunity.
            </p>

            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                <p className="text-sm leading-6 text-orange-900">
                  Keep new listings inactive unless you are ready for seekers to
                  see them publicly.
                </p>
              </div>
            </div>
          </section>

          <section className="content-panel">
            <p className="eyebrow">Source and visibility</p>

            <SelectField
              label="Verification status"
              value={verificationStatus}
              onChange={(value) =>
                setVerificationStatus(value as OpportunityVerificationStatus)
              }
              options={OPPORTUNITY_VERIFICATION_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />

            <div className="mt-5">
              <label className="label">Expiration / review date</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className="input-field"
              />
            </div>

            <label className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
                  Active listings can appear publicly. Keep unchecked if the
                  listing needs more review.
                </span>
              </span>
            </label>

            {selectedEmployer && (
              <InfoCard
                title="Selected employer"
                main={selectedEmployer.name}
                detail={`${selectedEmployer.location}, ${selectedEmployer.state}`}
              />
            )}

            {selectedSource ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Selected source
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  {selectedSource.name}
                </p>
                <a
                  href={selectedSource.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  Open source
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Selected source
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  Manual admin research
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Use this only when you have verified the source manually.
                </p>
                <Link
                  href="/admin/opportunity-sources"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  Manage sources
                  <Database className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full px-6 py-4"
          >
            <PlusCircle className="h-4 w-4" />
            {isPending ? 'Creating opportunity...' : 'Create opportunity'}
          </button>
        </aside>
      </div>
    </form>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="input-field mt-2"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function InfoCard({
  title,
  main,
  detail,
}: {
  title: string
  main: string
  detail: string
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-2 font-semibold text-slate-950">{main}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  )
}