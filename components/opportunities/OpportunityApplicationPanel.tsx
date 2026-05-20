'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Send,
  XCircle,
} from 'lucide-react'
import type { ApplicationStatus } from '@/lib/supabase/app-types'
import {
  submitOpportunityApplication,
  withdrawOpportunityApplication,
} from '@/app/actions/applications'

type ExistingApplication = {
  id: string
  status: ApplicationStatus
  submitted_at: string
  withdrawn_at: string | null
}

type OpportunityApplicationPanelProps = {
  opportunityId: string
  applicationUrl: string | null
  userIsSignedIn: boolean
  readinessScore: number
  introMessageTemplate: string
  existingApplication: ExistingApplication | null
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  reviewed: 'Reviewed',
  contacted: 'Contacted',
  interviewing: 'Interviewing',
  offered: 'Offered',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export default function OpportunityApplicationPanel({
  opportunityId,
  applicationUrl,
  userIsSignedIn,
  readinessScore,
  introMessageTemplate,
  existingApplication,
}: OpportunityApplicationPanelProps) {
  const [application, setApplication] =
    useState<ExistingApplication | null>(existingApplication)
  const [introMessage, setIntroMessage] = useState(introMessageTemplate)
  const [seekerNotes, setSeekerNotes] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const readinessIsStrong = readinessScore >= 80
  const alreadyApplied = Boolean(application && application.status !== 'withdrawn')

  function handleSubmitApplication() {
    setError('')

    startTransition(async () => {
      try {
        const submitted = await submitOpportunityApplication({
          opportunityId,
          introMessage,
          seekerNotes,
        })

        setApplication({
          id: submitted.id,
          status: submitted.status,
          submitted_at: submitted.submitted_at,
          withdrawn_at: submitted.withdrawn_at,
        })
      } catch (error) {
        console.error('Failed to submit application:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not submit application.'
        )
      }
    })
  }

  function handleWithdrawApplication() {
    if (!application) return

    setError('')

    startTransition(async () => {
      try {
        const withdrawn = await withdrawOpportunityApplication({
          applicationId: application.id,
        })

        setApplication({
          id: withdrawn.id,
          status: withdrawn.status,
          submitted_at: withdrawn.submitted_at,
          withdrawn_at: withdrawn.withdrawn_at,
        })
      } catch (error) {
        console.error('Failed to withdraw application:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not withdraw application.'
        )
      }
    })
  }

  if (!userIsSignedIn) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-xl font-bold text-slate-950">Ready to apply?</h3>

        <p className="muted-text mt-2">
          Sign in to submit an application and track your status.
        </p>

        <Link href="/auth/sign-in" className="btn-dark mt-5 w-full">
          Sign in to apply
        </Link>
      </div>
    )
  }

  if (alreadyApplied && application) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-700" />

          <div>
            <p className="font-bold text-green-900">
              Application {STATUS_LABELS[application.status].toLowerCase()}
            </p>

            <p className="mt-1 text-sm leading-6 text-green-800">
              Submitted on{' '}
              {new Date(application.submitted_at).toLocaleDateString()}.
              You can track this application from your dashboard.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleWithdrawApplication}
          disabled={isPending}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <XCircle className="h-4 w-4" />
          {isPending ? 'Withdrawing...' : 'Withdraw application'}
        </button>

        {applicationUrl && (
          <a
            href={applicationUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline mt-3 w-full"
          >
            Employer application page
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-xl font-bold text-slate-950">Apply through platform</h3>

      <p className="muted-text mt-2">
        Submit your interest with a readiness snapshot. This creates an official
        application record tied to this opportunity.
      </p>

      <div
        className={`mt-5 rounded-2xl border p-4 ${
          readinessIsStrong
            ? 'border-green-200 bg-green-50'
            : 'border-orange-200 bg-orange-50'
        }`}
      >
        <div className="flex items-start gap-3">
          {readinessIsStrong ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
          )}

          <div>
            <p className="font-semibold text-slate-950">
              Readiness score: {readinessScore}%
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {readinessIsStrong
                ? 'Your readiness profile is strong enough to apply.'
                : 'You can still apply, but completing your readiness profile may strengthen your application.'}
            </p>
          </div>
        </div>
      </div>

      <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Intro message
      </label>

      <textarea
        value={introMessage}
        onChange={(event) => setIntroMessage(event.target.value)}
        rows={5}
        className="input-field mt-2"
        placeholder="Write a short message explaining your interest and readiness."
      />

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Private notes
      </label>

      <textarea
        value={seekerNotes}
        onChange={(event) => setSeekerNotes(event.target.value)}
        rows={3}
        className="input-field mt-2"
        placeholder="Optional private note for your own tracking."
      />

      <button
        type="button"
        onClick={handleSubmitApplication}
        disabled={isPending}
        className="btn-primary mt-5 w-full px-6 py-4"
      >
        <Send className="h-4 w-4" />
        {isPending ? 'Submitting...' : 'Submit application'}
      </button>

      {applicationUrl && (
        <a
          href={applicationUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-outline mt-3 w-full"
        >
          Employer application page
          <ExternalLink className="h-4 w-4" />
        </a>
      )}

      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}