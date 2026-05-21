import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ListChecks,
  PlusCircle,
} from 'lucide-react'
import type { DataExpansionOpportunity } from '@/lib/admin/get-data-expansion-page-data'
import {
  getOpportunityVerificationBadgeClass,
  getOpportunityVerificationLabel,
} from '@/lib/opportunities/opportunity-options'
import type { OpportunityVerificationStatus } from '@/lib/supabase/app-types'

type RealListingWorkflowProps = {
  recentOpportunities: DataExpansionOpportunity[]
}

function getSingleRelation<T>(relation: T | T[] | null | undefined) {
  if (Array.isArray(relation)) return relation[0] ?? null
  return relation ?? null
}

function formatDate(value: string | null) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleDateString()
}

export default function RealListingWorkflow({
  recentOpportunities,
}: RealListingWorkflowProps) {
  return (
    <section className="content-panel">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Real listing workflow</p>

          <h2 className="section-title mt-3">
            Create listings only after source review.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            This workflow keeps broad listings trustworthy. Do not create filler
            listings. Every opportunity should come from a real employer and
            current source URL.
          </p>
        </div>

        <Link href="/admin/opportunities/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" />
          Add sourced opportunity
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        <WorkflowStep
          step="01"
          title="Open source"
          description="Start from an official or trusted source such as Apprenticeship.gov, California DAS, CalJOBS, or an employer career page."
        />
        <WorkflowStep
          step="02"
          title="Verify listing"
          description="Confirm the listing is current, real, relevant to skilled trades, and has an official external URL."
        />
        <WorkflowStep
          step="03"
          title="Create record"
          description="Use the admin opportunity form. Connect employer, source, location, trade, application URL, and verification status."
        />
        <WorkflowStep
          step="04"
          title="Review freshness"
          description="Set review date, keep questionable records inactive, and revisit stale listings before showing them publicly."
        />
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-3">
          <ListChecks className="h-5 w-5 text-orange-600" />
          <h3 className="text-2xl font-bold text-slate-950">
            Recent sourced opportunities
          </h3>
        </div>

        {recentOpportunities.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {recentOpportunities.map((opportunity) => {
              const employer = getSingleRelation(opportunity.employers)
              const status =
                opportunity.verification_status as OpportunityVerificationStatus

              return (
                <article
                  key={opportunity.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getOpportunityVerificationBadgeClass(
                            status
                          )}`}
                        >
                          {getOpportunityVerificationLabel(status)}
                        </span>

                        <span
                          className={
                            opportunity.is_active
                              ? 'badge-orange'
                              : 'badge-slate'
                          }
                        >
                          {opportunity.is_active ? 'Active' : 'Inactive'}
                        </span>

                        <span className="badge-slate">
                          {opportunity.source_name || 'Source missing'}
                        </span>
                      </div>

                      <h4 className="mt-4 text-xl font-bold text-slate-950">
                        {opportunity.title}
                      </h4>

                      <p className="mt-2 text-sm font-semibold text-slate-600">
                        {employer?.name || 'Employer missing'} ·{' '}
                        {opportunity.location}, {opportunity.state}
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <MiniDetail
                          label="Trade"
                          value={opportunity.trade_slug}
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
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
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

                      <Link
                        href={`/admin/opportunities/${opportunity.id}/edit`}
                        className="btn-outline px-5 py-3 text-sm"
                      >
                        Review listing
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
            <h4 className="text-xl font-bold text-slate-950">
              No sourced opportunities yet
            </h4>

            <p className="muted-text mt-2 max-w-2xl">
              Once you create real listings from trusted sources, they will
              appear here for freshness monitoring.
            </p>

            <Link href="/admin/opportunities/new" className="btn-dark mt-5">
              <PlusCircle className="h-4 w-4" />
              Create first sourced listing
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function WorkflowStep({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-700">
        {step}
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
      <p className="muted-text mt-2">{description}</p>

      <div className="mt-4 flex items-center gap-2 text-orange-700">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm font-semibold">Required</span>
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