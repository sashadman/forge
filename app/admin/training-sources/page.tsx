import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Training Sources — ${siteConfig.name}`,
  description:
    'Review training data sources, ingestion status, source trust, and freshness.',
}

type TrainingSourceRow = {
  id: string
  source_slug: string
  source_name: string
  source_domain: string | null
  source_type: string
  source_authority: string
  trust_level: string
  crawl_status: string | null
  last_crawled_at: string | null
  last_successful_crawl_at: string | null
  last_error: string | null
  created_at: string
  updated_at: string
}

type CandidateRow = {
  source_id: string | null
  verification_status: string
}

function formatLabel(value: string | null | undefined) {
  if (!value) return 'Not available'

  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not available'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Not available'

  return date.toLocaleDateString()
}

function getSourceHealth(source: TrainingSourceRow) {
  if (source.crawl_status === 'failed') {
    return {
      label: 'Failed',
      icon: AlertCircle,
      className: 'bg-red-50 text-red-700 ring-red-100',
      description: source.last_error || 'The latest source run failed.',
    }
  }

  if (source.crawl_status === 'completed') {
    return {
      label: 'Healthy',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      description: 'The latest source run completed successfully.',
    }
  }

  if (source.crawl_status === 'running') {
    return {
      label: 'Running',
      icon: Clock,
      className: 'bg-orange-50 text-orange-700 ring-orange-100',
      description: 'A source run appears to be in progress.',
    }
  }

  return {
    label: 'Not started',
    icon: Clock,
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
    description: 'This source has not completed an ingestion run yet.',
  }
}

function getFreshnessLabel(value: string | null | undefined) {
  if (!value) return 'Never crawled'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Unknown freshness'

  const daysOld = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysOld <= 7) return 'Fresh'
  if (daysOld <= 30) return 'Recent'
  if (daysOld <= 120) return 'Aging'

  return 'Stale'
}

export default async function AdminTrainingSourcesPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: sourcesData, error: sourcesError } = await supabase
    .from('training_sources')
    .select(
      `
      id,
      source_slug,
      source_name,
      source_domain,
      source_type,
      source_authority,
      trust_level,
      crawl_status,
      last_crawled_at,
      last_successful_crawl_at,
      last_error,
      created_at,
      updated_at
      `
    )
    .order('source_name', { ascending: true })

  if (sourcesError) {
    console.error('Failed to load training sources:', sourcesError)
  }

  const { data: candidatesData, error: candidatesError } = await supabase
    .from('training_program_candidates')
    .select('source_id, verification_status')

  if (candidatesError) {
    console.error('Failed to load source candidate counts:', candidatesError)
  }

  const sources = ((sourcesData ?? []) as unknown) as TrainingSourceRow[]
  const candidates = ((candidatesData ?? []) as unknown) as CandidateRow[]

  const completedCount = sources.filter(
    (source) => source.crawl_status === 'completed'
  ).length

  const failedCount = sources.filter(
    (source) => source.crawl_status === 'failed'
  ).length

  const candidateCountBySource = new Map<string, number>()
  const trustedCandidateCountBySource = new Map<string, number>()

  for (const candidate of candidates) {
    if (!candidate.source_id) continue

    candidateCountBySource.set(
      candidate.source_id,
      (candidateCountBySource.get(candidate.source_id) ?? 0) + 1
    )

    if (candidate.verification_status === 'trusted_candidate') {
      trustedCandidateCountBySource.set(
        candidate.source_id,
        (trustedCandidateCountBySource.get(candidate.source_id) ?? 0) + 1
      )
    }
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Admin data sources</p>

            <h1 className="page-title-dark mt-6">
              Monitor training source trust and freshness.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Track ingestion health, candidate volume, trust level, and source
              freshness so public program data stays reliable.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-4">
            <StatusPanel label="Training sources" value={`${sources.length}`} />
            <StatusPanel label="Completed" value={`${completedCount}`} />
            <StatusPanel label="Failed" value={`${failedCount}`} />
            <StatusPanel label="Candidates" value={`${candidates.length}`} />
          </div>

          <div className="mt-8 grid gap-6">
            {sources.length > 0 ? (
              sources.map((source) => {
                const health = getSourceHealth(source)
                const HealthIcon = health.icon
                const candidateCount = candidateCountBySource.get(source.id) ?? 0
                const trustedCandidateCount =
                  trustedCandidateCountBySource.get(source.id) ?? 0

                return (
                  <article key={source.id} className="content-panel">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                      <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${health.className}`}
                          >
                            <HealthIcon className="h-4 w-4" />
                            {health.label}
                          </span>

                          <span className="badge-slate">
                            {formatLabel(source.trust_level)}
                          </span>

                          <span className="badge-slate">
                            {formatLabel(source.source_authority)}
                          </span>

                          <span className="badge-slate">
                            {getFreshnessLabel(source.last_successful_crawl_at)}
                          </span>
                        </div>

                        <h2 className="section-title mt-4">
                          {source.source_name}
                        </h2>

                        <p className="muted-text mt-3 max-w-3xl">
                          {health.description}
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-4">
                          <InfoCard
                            label="Candidates"
                            value={`${candidateCount}`}
                          />
                          <InfoCard
                            label="Trusted"
                            value={`${trustedCandidateCount}`}
                          />
                          <InfoCard
                            label="Last success"
                            value={formatDate(source.last_successful_crawl_at)}
                          />
                          <InfoCard
                            label="Last crawl"
                            value={formatDate(source.last_crawled_at)}
                          />
                        </div>

                        {source.last_error && (
                          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                            <p className="text-sm font-bold text-red-800">
                              Last error
                            </p>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-red-700">
                              {source.last_error}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 lg:w-64">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Database className="h-4 w-4 text-orange-600" />

                            <p className="text-xs font-bold uppercase tracking-wide">
                              Domain
                            </p>
                          </div>

                          <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                            {source.source_domain ?? 'Not available'}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="flex items-center gap-2 text-slate-600">
                            <ShieldCheck className="h-4 w-4 text-orange-600" />

                            <p className="text-xs font-bold uppercase tracking-wide">
                              Source type
                            </p>
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {formatLabel(source.source_type)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })
            ) : (
              <section className="content-panel text-center">
                <h2 className="section-title">No training sources yet</h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Training sources will appear here after seed scripts or import
                  workflows create official source records.
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

function StatusPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-panel">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}