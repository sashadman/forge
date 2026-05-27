'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import {
  publishProgramCandidate,
  updateProgramCandidateStatus,
} from '@/app/actions/program-candidates'
import type { Database } from '@/lib/supabase/types'

type ProgramType = Database['public']['Enums']['program_type']

type CandidateReviewStatus =
  | 'candidate'
  | 'trusted_candidate'
  | 'needs_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'duplicate'

type ProgramCandidateReviewFormProps = {
  candidateId: string
  currentStatus: string
  currentProgramType: string
  currentTradeSlug: string
  currentReviewNotes: string
  alreadyPublished: boolean
}

const STATUS_OPTIONS: { value: CandidateReviewStatus; label: string }[] = [
  { value: 'candidate', label: 'Candidate' },
  { value: 'trusted_candidate', label: 'Trusted candidate' },
  { value: 'needs_review', label: 'Needs review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'duplicate', label: 'Duplicate' },
]

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

function isCandidateReviewStatus(value: string): value is CandidateReviewStatus {
  return (
    value === 'candidate' ||
    value === 'trusted_candidate' ||
    value === 'needs_review' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'published' ||
    value === 'duplicate'
  )
}

function isProgramType(value: string): value is ProgramType {
  return PROGRAM_TYPES.some((programType) => programType.value === value)
}

export default function ProgramCandidateReviewForm({
  candidateId,
  currentStatus,
  currentProgramType,
  currentTradeSlug,
  currentReviewNotes,
  alreadyPublished,
}: ProgramCandidateReviewFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [verificationStatus, setVerificationStatus] =
    useState<CandidateReviewStatus>(
      isCandidateReviewStatus(currentStatus) ? currentStatus : 'candidate'
    )
  const [programType, setProgramType] = useState<ProgramType>(
    isProgramType(currentProgramType) ? currentProgramType : 'workforce_program'
  )
  const [tradeSlug, setTradeSlug] = useState(currentTradeSlug || 'other')
  const [reviewNotes, setReviewNotes] = useState(currentReviewNotes)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function handleSaveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setError('')

    startTransition(async () => {
      try {
        await updateProgramCandidateStatus({
          candidateId,
          verificationStatus,
          reviewNotes,
        })

        setNotice('Candidate review updated.')
        router.refresh()
      } catch (caughtError) {
        console.error('Candidate review update failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not update candidate.'
        )
      }
    })
  }

  function handlePublish() {
    setNotice('')
    setError('')

    startTransition(async () => {
      try {
        await publishProgramCandidate({
          candidateId,
          programType,
          tradeSlug,
          reviewNotes,
        })

        setNotice('Candidate published to public programs.')
        router.refresh()
      } catch (caughtError) {
        console.error('Candidate publish failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not publish candidate.'
        )
      }
    })
  }

  return (
    <form
      onSubmit={handleSaveReview}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
    >
      <p className="text-sm font-bold text-slate-950">Candidate controls</p>

      <label className="mt-4 block">
        <span className="label">Verification status</span>

        <select
          value={verificationStatus}
          onChange={(event) =>
            setVerificationStatus(event.target.value as CandidateReviewStatus)
          }
          className="input-field"
          disabled={alreadyPublished}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="label">Program type when published</span>

        <select
          value={programType}
          onChange={(event) => setProgramType(event.target.value as ProgramType)}
          className="input-field"
          disabled={alreadyPublished}
        >
          {PROGRAM_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="label">Career focus when published</span>

        <select
          value={tradeSlug}
          onChange={(event) => setTradeSlug(event.target.value)}
          className="input-field"
          disabled={alreadyPublished}
        >
          {TRADE_OPTIONS.map((trade) => (
            <option key={trade} value={trade}>
              {trade}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="label">Review notes</span>

        <textarea
          value={reviewNotes}
          onChange={(event) => setReviewNotes(event.target.value)}
          rows={5}
          className="input-field"
          placeholder="Why this should be published, rejected, or marked duplicate."
        />
      </label>

      {notice && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-3">
        <button type="submit" disabled={isPending} className="btn-outline w-full">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {isPending ? 'Saving...' : 'Save review'}
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={isPending || alreadyPublished || verificationStatus === 'rejected'}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {alreadyPublished ? 'Already published' : 'Publish to programs'}
        </button>
      </div>
    </form>
  )
}