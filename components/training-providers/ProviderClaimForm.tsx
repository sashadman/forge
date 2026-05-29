'use client'

import { FormEvent, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Building2,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Loader2,
} from 'lucide-react'
import StateSelect from '@/components/forms/StateSelect'
import { submitProviderClaim } from '@/app/actions/provider-claims'

export type ClaimLinkedProgram = {
  id: string
  slug: string
  name: string
  providerName: string
  location: string
  state: string
  websiteUrl: string | null
}

type ProviderClaimFormProps = {
  linkedProgram?: ClaimLinkedProgram | null
}

const CLAIM_TYPES = [
  {
    value: 'provider_profile',
    label: 'Claim or create provider profile',
  },
  {
    value: 'program_listing',
    label: 'Submit or correct program listing',
  },
  {
    value: 'provider_and_programs',
    label: 'Provider profile and program listings',
  },
]

export default function ProviderClaimForm({
  linkedProgram = null,
}: ProviderClaimFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [organizationName, setOrganizationName] = useState(
    linkedProgram?.providerName ?? ''
  )
  const [websiteUrl, setWebsiteUrl] = useState(linkedProgram?.websiteUrl ?? '')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState(
    linkedProgram?.location && linkedProgram.location !== 'See provider'
      ? linkedProgram.location
      : ''
  )
  const [state, setState] = useState(linkedProgram?.state ?? 'CA')
  const [roleTitle, setRoleTitle] = useState('')
  const [claimType, setClaimType] = useState(
    linkedProgram ? 'program_listing' : 'provider_profile'
  )
  const [programNames, setProgramNames] = useState(
    linkedProgram ? `${linkedProgram.name} — ${linkedProgram.providerName}` : ''
  )
  const [evidenceSummary, setEvidenceSummary] = useState('')
  const [requestedAccess, setRequestedAccess] = useState(
    linkedProgram
      ? 'I am requesting to claim or correct this specific public program listing.'
      : ''
  )
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        await submitProviderClaim({
          programId: linkedProgram?.id ?? null,
          contactName,
          contactEmail,
          organizationName,
          websiteUrl,
          phone,
          city,
          state,
          roleTitle,
          claimType,
          programNames,
          evidenceSummary,
          requestedAccess,
        })

        router.push('/training-providers/claim/success')
      } catch (caughtError) {
        console.error('Provider claim submission failed:', caughtError)
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not submit provider request.'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="content-panel">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <Building2 className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Provider request</p>

          <h2 className="section-title mt-3">
            Request access for a real training provider or program.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            This is the first step toward provider ownership. Submit real
            organization information so an admin can review the request before
            any provider tools are enabled.
          </p>
        </div>
      </div>

      {linkedProgram && (
        <section className="mt-8 rounded-3xl border border-orange-200 bg-orange-50 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-orange-700">
                <GraduationCap className="h-5 w-5" />
                <p className="text-xs font-bold uppercase tracking-[0.25em]">
                  Selected program
                </p>
              </div>

              <h3 className="mt-3 text-2xl font-bold text-slate-950">
                {linkedProgram.name}
              </h3>

              <p className="mt-2 font-semibold text-slate-700">
                {linkedProgram.providerName}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {linkedProgram.location}, {linkedProgram.state}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/programs/${linkedProgram.slug}`}
                className="rounded-2xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
              >
                View listing
              </Link>

              {linkedProgram.websiteUrl && (
                <a
                  href={linkedProgram.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
                >
                  Provider website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-700">
            Your request will be linked to this exact public program record for
            admin review. Approval does not automatically grant editing rights;
            admin verification is still required.
          </p>
        </section>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="label">Your name</label>
          <input
            type="text"
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            className="input-field"
            placeholder="Jane Smith"
            required
          />
        </div>

        <div>
          <label className="label">Contact email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            className="input-field"
            placeholder="you@trainingprovider.edu"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Training provider or organization name</label>
          <input
            type="text"
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            className="input-field"
            placeholder="Example Workforce Training Center"
            required
          />
        </div>

        <div>
          <label className="label">Website</label>
          <input
            type="text"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className="input-field"
            placeholder="https://provider.edu"
          />
        </div>

        <div>
          <label className="label">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="label">City</label>
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="input-field"
            placeholder="San Diego"
            required
          />
        </div>

        <StateSelect
          value={state}
          onChange={setState}
          required
          helperText="Use the provider or program's primary operating state."
        />

        <div>
          <label className="label">Your role or title</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(event) => setRoleTitle(event.target.value)}
            className="input-field"
            placeholder="Program Director, Admissions, Workforce Coordinator..."
          />
        </div>

        <div>
          <label className="label">Request type</label>
          <select
            value={claimType}
            onChange={(event) => setClaimType(event.target.value)}
            className="input-field"
          >
            {CLAIM_TYPES.map((claimType) => (
              <option key={claimType.value} value={claimType.value}>
                {claimType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="label">Program names</label>
          <textarea
            value={programNames}
            onChange={(event) => setProgramNames(event.target.value)}
            rows={4}
            className="input-field"
            placeholder="List the programs you want to claim, add, or correct. One per line is fine."
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">Evidence of connection</label>
          <textarea
            value={evidenceSummary}
            onChange={(event) => setEvidenceSummary(event.target.value)}
            rows={6}
            className="input-field"
            placeholder="Explain your relationship to the provider or program. Include official email domain, website page, staff listing, authorization, or other proof."
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="label">What access are you requesting?</label>
          <textarea
            value={requestedAccess}
            onChange={(event) => setRequestedAccess(event.target.value)}
            rows={5}
            className="input-field"
            placeholder="Example: update provider profile, submit program details, correct cost/duration, add apprenticeship pathway..."
          />
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 text-sm leading-6 text-slate-500">
          <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
          <p>
            Submission does not automatically publish or grant access. An admin
            must review and approve the request.
          </p>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Submitting...' : 'Submit provider request'}
        </button>
      </div>
    </form>
  )
}