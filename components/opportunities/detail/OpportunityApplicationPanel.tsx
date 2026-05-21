'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Send,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import type { ApplicationStatus } from '@/lib/supabase/app-types'
import {
  getApplicationStatusBadgeClass,
  getApplicationStatusLabel,
} from '@/lib/applications/application-review-config'
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

function getReadinessMessage(score: number) {
  if (score >= 100) {
    return {
      title: 'Strong application profile',
      description:
        'Your required readiness items are complete. This application will include a strong readiness snapshot.',
      tone: 'strong' as const,
    }
  }

  if (score >= 80) {
    return {
      title: 'Ready to apply',
      description:
        'Your readiness profile is strong enough to apply. You can still improve optional items later.',
      tone: 'strong' as const,
    }
  }

  if (score >= 40) {
    return {
      title: 'You can apply, but keep improving',
      description:
        'You can submit this application now, but completing more readiness items may make your profile stronger.',
      tone: 'medium' as const,
    }
  }

  return {
    title: 'Build readiness before applying',
    description:
      'You can still apply, but your profile is early. Completing your resume, intro message, experience summary, and work authorization is recommended.',
    tone: 'low' as const,
  }
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

  const alreadyApplied = Boolean(application && application.status !== 'withdrawn')
  const readiness = getReadinessMessage(readinessScore)

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
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <Send className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-950">
          Ready to apply?
        </h3>

        <p className="muted-text mt-3">
          Sign in to submit an application, attach your readiness snapshot, and
          track your status from the dashboard.
        </p>

        <Link href="/auth/sign-in" className="btn-dark mt-6 w-full">
          Sign in to apply
        </Link>

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
      </section>
    )
  }

  if (alreadyApplied && application) {
    return (
      <section className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              Application status
            </p>

            <div className="mt-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getApplicationStatusBadgeClass(
                  application.status
                )}`}
              >
                {getApplicationStatusLabel(application.status)}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-green-800">
              Submitted on{' '}
              {new Date(application.submitted_at).toLocaleDateString()}. You can
              track this application from your dashboard.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-green-200 bg-white/70 p-4">
          <p className="text-sm leading-6 text-green-900">
            This official application record includes the readiness snapshot you
            had at the time of submission.
          </p>
        </div>

        <Link href="/dashboard" className="btn-dark mt-5 w-full">
          Track from dashboard
        </Link>

        <button
          type="button"
          onClick={handleWithdrawApplication}
          disabled={isPending}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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

        {error && (
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        )}
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <Send className="h-6 w-6" />
        </div>

        <div>
          <p className="eyebrow">Apply through platform</p>

          <h3 className="mt-3 text-2xl font-bold text-slate-950">
            Submit your application
          </h3>

          <p className="muted-text mt-3">
            This creates an official application record and captures your current
            readiness profile as a snapshot.
          </p>
        </div>
      </div>

      <div
        className={`mt-6 rounded-2xl border p-4 ${
          readiness.tone === 'strong'
            ? 'border-green-200 bg-green-50'
            : readiness.tone === 'medium'
              ? 'border-orange-200 bg-orange-50'
              : 'border-red-200 bg-red-50'
        }`}
      >
        <div className="flex items-start gap-3">
          {readiness.tone === 'strong' ? (
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
          ) : (
            <AlertCircle
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                readiness.tone === 'medium' ? 'text-orange-700' : 'text-red-700'
              }`}
            />
          )}

          <div>
            <p className="font-semibold text-slate-950">
              {readiness.title}: {readinessScore}%
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {readiness.description}
            </p>

            <Link
              href="/dashboard/readiness"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
            >
              Improve readiness profile
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <label className="mt-6 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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

      {error && (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}
    </section>
  )
}