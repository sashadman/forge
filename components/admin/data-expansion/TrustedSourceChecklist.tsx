import Link from 'next/link'
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import type { DataExpansionSource } from '@/lib/admin/get-data-expansion-page-data'
import {
  getOpportunitySourceTypeLabel,
  getSourceReliabilityBadgeClass,
  getSourceReliabilityLabel,
} from '@/lib/opportunities/opportunity-source-config'

type TrustedSourceChecklistProps = {
  sources: DataExpansionSource[]
}

function formatDate(value: string | null) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleDateString()
}

function isDueForReview(value: string | null) {
  if (!value) return false
  return new Date(value).getTime() <= Date.now()
}

export default function TrustedSourceChecklist({
  sources,
}: TrustedSourceChecklistProps) {
  return (
    <section className="content-panel">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Trusted source inventory</p>

          <h2 className="section-title mt-3">
            Expand from reliable sources first.
          </h2>

          <p className="muted-text mt-3 max-w-3xl">
            Use official and trusted sources as the backbone of opportunity data.
            Every broad listing effort should start from source credibility,
            currentness, and attribution.
          </p>
        </div>

        <Link href="/admin/opportunity-sources" className="btn-primary">
          Manage sources
        </Link>
      </div>

      {sources.length > 0 ? (
        <div className="mt-8 grid gap-4">
          {sources.map((source) => {
            const dueForReview = isDueForReview(source.next_review_at)

            return (
              <article
                key={source.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getSourceReliabilityBadgeClass(
                          source.reliability_level
                        )}`}
                      >
                        {getSourceReliabilityLabel(source.reliability_level)}
                      </span>

                      <span className="badge-slate">
                        {getOpportunitySourceTypeLabel(source.source_type)}
                      </span>

                      <span
                        className={
                          source.is_active ? 'badge-orange' : 'badge-slate'
                        }
                      >
                        {source.is_active ? 'Active' : 'Inactive'}
                      </span>

                      {dueForReview && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-200">
                          Review due
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-950">
                      {source.name}
                    </h3>

                    {source.description && (
                      <p className="muted-text mt-2 max-w-3xl">
                        {source.description}
                      </p>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <MiniDetail
                        label="Region"
                        value={source.region || 'Not set'}
                      />
                      <MiniDetail
                        label="State"
                        value={source.state || 'Not set'}
                      />
                      <MiniDetail
                        label="Next review"
                        value={formatDate(source.next_review_at)}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                    <a
                      href={source.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline px-5 py-3 text-sm"
                    >
                      Open source
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    {source.search_url && (
                      <a
                        href={source.search_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline px-5 py-3 text-sm"
                      >
                        Search source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <ChecklistItem
                    complete={source.reliability_level === 'official'}
                    label="Official or high-trust source"
                  />
                  <ChecklistItem
                    complete={Boolean(source.search_url)}
                    label="Has search/listing URL"
                  />
                  <ChecklistItem
                    complete={Boolean(source.last_checked_at)}
                    label="Has been checked"
                  />
                  <ChecklistItem
                    complete={!dueForReview}
                    label="Not due for review"
                  />
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
          <h3 className="text-xl font-bold text-slate-950">
            No sources yet
          </h3>

          <p className="muted-text mt-2">
            Add trusted sources before creating broad listings.
          </p>
        </div>
      )}
    </section>
  )
}

function ChecklistItem({
  complete,
  label,
}: {
  complete: boolean
  label: string
}) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
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