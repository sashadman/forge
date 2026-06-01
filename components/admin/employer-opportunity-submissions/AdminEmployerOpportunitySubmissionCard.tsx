'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import {
  approveEmployerOpportunitySubmission,
  rejectEmployerOpportunitySubmission,
} from '@/app/actions/admin-employer-opportunity-submissions'

type EmployerRelation = {
  name: string
  slug: string
  is_verified: boolean
}

export type AdminEmployerOpportunitySubmission = {
  id: string
  title: string
  opportunity_type: string
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  requirements: string[] | null
  benefits: string[] | null
  application_url: string | null
  external_url: string | null
  status: string
  admin_notes: string | null
  approved_opportunity_id: string | null
  created_at: string
  employers: EmployerRelation | EmployerRelation[] | null
}

type AdminEmployerOpportunitySubmissionCardProps = {
  submission: AdminEmployerOpportunitySubmission
}

function getSingleRelation<T>(relation: T | T[] | null | undefined) {
  if (Array.isArray(relation)) return relation[0] ?? null
  return relation ?? null
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'approved':
      return 'badge-orange'
    case 'rejected':
      return 'rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-200'
    case 'submitted':
      return 'rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200'
    default:
      return 'badge-slate'
  }
}

export default function AdminEmployerOpportunitySubmissionCard({
  submission,
}: AdminEmployerOpportunitySubmissionCardProps) {
  const employer = getSingleRelation(submission.employers)
  const [adminNotes, setAdminNotes] = useState('')
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const canReview = submission.status === 'submitted'
  const hasApplyUrl = Boolean(submission.application_url || submission.external_url)

  async function handleApprove() {
    setWorking(true)
    setMessage('')
    setError('')

    try {
      await approveEmployerOpportunitySubmission({
        submissionId: submission.id,
      })

      setMessage('Submission approved and published.')
    } catch (approveError) {
      console.error(approveError)
      setError(
        approveError instanceof Error
          ? approveError.message
          : 'Could not approve submission.'
      )
    } finally {
      setWorking(false)
    }
  }

  async function handleReject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setWorking(true)
    setMessage('')
    setError('')

    try {
      await rejectEmployerOpportunitySubmission({
        submissionId: submission.id,
        adminNotes,
      })

      setMessage('Submission rejected with admin note.')
    } catch (rejectError) {
      console.error(rejectError)
      setError(
        rejectError instanceof Error
          ? rejectError.message
          : 'Could not reject submission.'
      )
    } finally {
      setWorking(false)
    }
  }

  return (
    <article className="card bg-slate-50">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="badge-orange">
              {formatOpportunityType(submission.opportunity_type)}
            </span>

            <span className={getStatusBadgeClass(submission.status)}>
              {submission.status}
            </span>

            <span className="badge-slate">
              Submitted {formatDate(submission.created_at)}
            </span>

            {employer && (
              <span className="badge-slate">
                {employer.is_verified ? 'Verified employer' : 'Unverified employer'}
              </span>
            )}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-950">
            {submission.title}
          </h3>

          <p className="mt-2 font-semibold text-slate-600">
            {employer?.name || 'Employer missing'} · {submission.trade_slug}
          </p>

          <p className="muted-text mt-4 line-clamp-4">
            {submission.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniCheck label="Apply/source link" complete={hasApplyUrl} />
            <MiniCheck label="Pay" complete={Boolean(submission.pay_range)} />
            <MiniCheck
              label="Requirements"
              complete={Boolean(
                submission.requirements && submission.requirements.length > 0
              )}
            />
            <MiniCheck
              label="Benefits"
              complete={Boolean(
                submission.benefits && submission.benefits.length > 0
              )}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniDetail
              label="Location"
              value={`${submission.location}, ${submission.state}`}
            />

            <MiniDetail
              label="Schedule"
              value={submission.schedule || 'See listing'}
            />

            <MiniDetail
              label="Pay range"
              value={submission.pay_range || 'See listing'}
            />

            <MiniDetail
              label="Application"
              value={hasApplyUrl ? 'URL provided' : 'Missing'}
            />
          </div>

          {submission.admin_notes && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-950">Admin note</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {submission.admin_notes}
              </p>
            </div>
          )}

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
          {submission.application_url && (
            <a
              href={submission.application_url}
              target="_blank"
              rel="noreferrer"
              className="btn-outline px-5 py-3 text-sm"
            >
              Application URL
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {employer && (
            <Link
              href={`/employers/${employer.slug}`}
              className="btn-outline px-5 py-3 text-sm"
            >
              Employer profile
              <BriefcaseBusiness className="h-4 w-4" />
            </Link>
          )}

          {canReview && (
            <button
              type="button"
              disabled={working}
              onClick={handleApprove}
              className="btn-dark px-5 py-3 text-sm"
            >
              {working ? 'Working...' : 'Approve & publish'}
              <ShieldCheck className="h-4 w-4" />
            </button>
          )}

          {submission.approved_opportunity_id && (
            <Link
              href="/admin/opportunities"
              className="btn-outline px-5 py-3 text-sm"
            >
              View published queue
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {canReview && (
        <form
          onSubmit={handleReject}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <label className="label">Reject with admin note</label>

          <textarea
            value={adminNotes}
            onChange={(event) => setAdminNotes(event.target.value)}
            rows={4}
            className="input-field mt-3"
            placeholder="Explain what the employer needs to fix before this can be approved."
          />

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={working}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {working ? 'Working...' : 'Reject submission'}
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </article>
  )
}

function MiniCheck({
  label,
  complete,
}: {
  label: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        {complete ? (
          <CheckCircle2 className="h-4 w-4 text-orange-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-slate-400" />
        )}

        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
    </div>
  )
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  )
}
