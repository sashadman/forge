import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import type { AdminOpportunityReviewItem } from '@/lib/admin/get-admin-opportunities-page-data'
import {
  getOpportunityTypeLabel,
  getOpportunityVerificationBadgeClass,
  getOpportunityVerificationLabel,
} from '@/lib/opportunities/opportunity-options'

type AdminOpportunityReviewCardProps = {
  opportunity: AdminOpportunityReviewItem
}

function formatDate(value: string | null) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleDateString()
}

export default function AdminOpportunityReviewCard({
  opportunity,
}: AdminOpportunityReviewCardProps) {
  const strongQuality = opportunity.quality_score >= 80

  return (
    <article className="card bg-slate-50">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="badge-orange">
              {getOpportunityTypeLabel(opportunity.opportunity_type)}
            </span>

            <span className={opportunity.is_active ? 'badge-orange' : 'badge-slate'}>
              {opportunity.is_active ? 'Active' : 'Inactive'}
            </span>

            <span className={strongQuality ? 'badge-orange' : 'badge-slate'}>
              {opportunity.quality_score}% quality
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getOpportunityVerificationBadgeClass(
                opportunity.verification_status
              )}`}
            >
              {getOpportunityVerificationLabel(opportunity.verification_status)}
            </span>

            {opportunity.review_due && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-200">
                Review due
              </span>
            )}

            {opportunity.employer && (
              <span className="badge-slate">
                {opportunity.employer.is_verified
                  ? 'Verified employer'
                  : 'Employer not verified'}
              </span>
            )}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-950">
            {opportunity.title}
          </h3>

          <p className="mt-2 font-semibold text-slate-600">
            {opportunity.employer?.name || 'Employer missing'} ·{' '}
            {opportunity.trade_slug}
          </p>

          <p className="muted-text mt-4 line-clamp-3">
            {opportunity.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniCheck
              label="Apply/source link"
              complete={Boolean(
                opportunity.application_url || opportunity.external_url
              )}
            />
            <MiniCheck label="Pay" complete={Boolean(opportunity.pay_range)} />
            <MiniCheck
              label="Requirements"
              complete={Boolean(
                opportunity.requirements && opportunity.requirements.length > 0
              )}
            />
            <MiniCheck
              label="Benefits"
              complete={Boolean(
                opportunity.benefits && opportunity.benefits.length > 0
              )}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniDetail
              label="Location"
              value={`${opportunity.location}, ${opportunity.state}`}
            />

            <MiniDetail
              label="Schedule"
              value={opportunity.schedule || 'See listing'}
            />

            <MiniDetail
              label="Pay range"
              value={opportunity.pay_range || 'See listing'}
            />

            <MiniDetail
              label="Source"
              value={opportunity.source_name || 'Manual / none'}
            />

            <MiniDetail
              label="Last verified"
              value={formatDate(opportunity.last_verified_at)}
            />

            <MiniDetail
              label="Review date"
              value={formatDate(opportunity.expires_at)}
            />
          </div>

          {opportunity.quality_issues.length > 0 && (
            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="font-semibold text-orange-900">Quality gaps</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {opportunity.quality_issues.slice(0, 6).map((issue) => (
                  <span
                    key={issue}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-800 ring-1 ring-orange-200"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {opportunity.source_attribution && (
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Source attribution: {opportunity.source_attribution}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
          {opportunity.is_active && (
            <Link
              href={`/opportunities/${opportunity.slug}`}
              className="btn-dark px-5 py-3 text-sm"
            >
              Public listing
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}

          {opportunity.external_url && (
            <a
              href={opportunity.external_url}
              target="_blank"
              rel="noreferrer"
              className="btn-outline px-5 py-3 text-sm"
            >
              Source URL
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {opportunity.employer && (
            <Link
              href={`/employers/${opportunity.employer.slug}`}
              className="btn-outline px-5 py-3 text-sm"
            >
              Employer profile
              <BriefcaseBusiness className="h-4 w-4" />
            </Link>
          )}

          <Link
            href={`/admin/opportunities/${opportunity.id}/edit`}
            className="btn-outline px-5 py-3 text-sm"
          >
            Review / edit
            <ArrowRight className="h-4 w-4" />
          </Link>

          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
            {strongQuality ? (
              <ShieldCheck className="h-4 w-4 text-orange-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-slate-500" />
            )}
            {strongQuality ? 'Strong listing' : 'Needs detail'}
          </span>
        </div>
      </div>
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