import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import {
  AlertTriangle,
  DatabaseZap,
  Globe2,
  LinkIcon,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import TrainingSourceForm from '@/components/admin/training-sources/TrainingSourceForm'
import TrainingSourceStatusForm from '@/components/admin/training-sources/TrainingSourceStatusForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Training Sources — ${siteConfig.name}`,
  description: 'Admin registry for official national training data sources.',
}

type TrainingSource = {
  id: string
  source_name: string
  source_slug: string
  source_type: string
  source_authority: string
  trust_level: string
  base_url: string
  source_state: string | null
  source_country: string
  institution_name: string | null
  provider_name: string | null
  crawler_strategy: string
  allowed_domains: string[]
  program_index_url: string | null
  api_endpoint: string | null
  crawl_status: string
  last_crawled_at: string | null
  last_successful_crawl_at: string | null
  last_error: string | null
  is_active: boolean
  admin_notes: string | null
  created_at: string
}

type SourceStats = {
  candidates: number
  published: number
  importRuns: number
  failedRuns: number
}

function formatLabel(value: string) {
  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getSourceTone(trustLevel: string) {
  if (trustLevel === 'auto_trusted') {
    return {
      labelClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      icon: <ShieldCheck className="h-4 w-4" />,
    }
  }

  if (trustLevel === 'trusted_source_review') {
    return {
      labelClass: 'bg-orange-50 text-orange-700 ring-orange-200',
      icon: <ShieldCheck className="h-4 w-4" />,
    }
  }

  if (trustLevel === 'blocked') {
    return {
      labelClass: 'bg-red-50 text-red-700 ring-red-200',
      icon: <AlertTriangle className="h-4 w-4" />,
    }
  }

  return {
    labelClass: 'bg-slate-100 text-slate-700 ring-slate-200',
    icon: <AlertTriangle className="h-4 w-4" />,
  }
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

  const { data: sources, error: sourcesError } = await supabase
    .from('training_sources')
    .select(
      `
      id,
      source_name,
      source_slug,
      source_type,
      source_authority,
      trust_level,
      base_url,
      source_state,
      source_country,
      institution_name,
      provider_name,
      crawler_strategy,
      allowed_domains,
      program_index_url,
      api_endpoint,
      crawl_status,
      last_crawled_at,
      last_successful_crawl_at,
      last_error,
      is_active,
      admin_notes,
      created_at
      `
    )
    .order('source_country', { ascending: true })
    .order('source_state', { ascending: true })
    .order('source_name', { ascending: true })

  if (sourcesError) {
    console.error('Failed to load training sources:', sourcesError)
  }

  const { data: candidates, error: candidatesError } = await supabase
    .from('training_program_candidates')
    .select('id, source_id, verification_status, published_program_id')

  if (candidatesError) {
    console.error('Failed to load training program candidate counts:', candidatesError)
  }

  const { data: importRuns, error: importRunsError } = await supabase
    .from('program_import_runs')
    .select('id, source_id, status')

  if (importRunsError) {
    console.error('Failed to load import run counts:', importRunsError)
  }

  const trainingSources = (sources ?? []) as TrainingSource[]

  const statsBySource = new Map<string, SourceStats>()

  for (const source of trainingSources) {
    statsBySource.set(source.id, {
      candidates: 0,
      published: 0,
      importRuns: 0,
      failedRuns: 0,
    })
  }

  for (const candidate of candidates ?? []) {
    if (!candidate.source_id) continue

    const stats = statsBySource.get(candidate.source_id)

    if (!stats) continue

    stats.candidates += 1

    if (candidate.published_program_id || candidate.verification_status === 'published') {
      stats.published += 1
    }
  }

  for (const run of importRuns ?? []) {
    if (!run.source_id) continue

    const stats = statsBySource.get(run.source_id)

    if (!stats) continue

    stats.importRuns += 1

    if (run.status === 'failed') {
      stats.failedRuns += 1
    }
  }

  const activeCount = trainingSources.filter((source) => source.is_active).length
  const autoTrustedCount = trainingSources.filter(
    (source) => source.trust_level === 'auto_trusted'
  ).length
  const candidateCount = candidates?.length ?? 0

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">National data infrastructure</p>

            <h1 className="page-title-dark mt-6">
              Training source registry.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Manage the official education, apprenticeship, workforce, and
              provider sources that feed the program candidate pipeline.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-4">
            <StatusPanel label="Sources" value={`${trainingSources.length}`} />
            <StatusPanel label="Active" value={`${activeCount}`} />
            <StatusPanel label="Auto-trusted" value={`${autoTrustedCount}`} />
            <StatusPanel label="Candidates" value={`${candidateCount}`} />
          </div>

          <div className="mt-8">
            <TrainingSourceForm />
          </div>

          <section className="mt-8 content-panel">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="eyebrow">Registered sources</p>

                <h2 className="section-title mt-3">
                  Official source registry
                </h2>

                <p className="muted-text mt-3 max-w-3xl">
                  These sources do not publish directly to the public directory.
                  They feed candidate records that are reviewed and normalized
                  before becoming public programs.
                </p>
              </div>

              <p className="badge-slate">{trainingSources.length} sources</p>
            </div>
          </section>

          <div className="mt-6 grid gap-6">
            {trainingSources.length > 0 ? (
              trainingSources.map((source) => (
                <TrainingSourceCard
                  key={source.id}
                  source={source}
                  stats={
                    statsBySource.get(source.id) ?? {
                      candidates: 0,
                      published: 0,
                      importRuns: 0,
                      failedRuns: 0,
                    }
                  }
                />
              ))
            ) : (
              <section className="content-panel text-center">
                <h2 className="section-title">No training sources yet</h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Seed official national sources or add a trusted source through
                  the registry form.
                </p>
              </section>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function TrainingSourceCard({
  source,
  stats,
}: {
  source: TrainingSource
  stats: SourceStats
}) {
  const sourceTone = getSourceTone(source.trust_level)

  return (
    <article className="content-panel">
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-orange">{formatLabel(source.source_type)}</span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${sourceTone.labelClass}`}
            >
              {sourceTone.icon}
              {formatLabel(source.trust_level)}
            </span>

            <span className="badge-slate">
              {formatLabel(source.source_authority)}
            </span>

            <span className="badge-slate">
              {source.source_state || 'National'} · {source.source_country}
            </span>

            {!source.is_active && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-200">
                Inactive
              </span>
            )}
          </div>

          <h2 className="section-title mt-4">{source.source_name}</h2>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
            <InfoLine
              icon={<Globe2 className="h-4 w-4" />}
              value={source.base_url}
            />

            <InfoLine
              icon={<DatabaseZap className="h-4 w-4" />}
              value={`Crawler: ${formatLabel(source.crawler_strategy)}`}
            />

            <InfoLine
              icon={<LinkIcon className="h-4 w-4" />}
              value={`Status: ${formatLabel(source.crawl_status)}`}
            />

            <InfoLine
              icon={<ShieldCheck className="h-4 w-4" />}
              value={`Domains: ${source.allowed_domains.join(', ') || 'None'}`}
            />
          </div>

          {(source.provider_name || source.institution_name) && (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {source.provider_name && (
                <MiniInfo label="Provider / agency" value={source.provider_name} />
              )}

              {source.institution_name && (
                <MiniInfo label="Institution" value={source.institution_name} />
              )}
            </div>
          )}

          {(source.program_index_url || source.api_endpoint) && (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {source.program_index_url && (
                <a
                  href={source.program_index_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mini-card block text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  Program index URL
                </a>
              )}

              {source.api_endpoint && (
                <div className="mini-card">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    API endpoint
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-700">
                    {source.api_endpoint}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <MiniInfo label="Candidates" value={`${stats.candidates}`} />
            <MiniInfo label="Published" value={`${stats.published}`} />
            <MiniInfo label="Import runs" value={`${stats.importRuns}`} />
            <MiniInfo label="Failed runs" value={`${stats.failedRuns}`} />
          </div>

          {source.last_error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-800">Last error</p>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {source.last_error}
              </p>
            </div>
          )}

          {source.admin_notes && (
            <div className="mt-5 mini-card">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Admin notes
              </p>

              <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                {source.admin_notes}
              </p>
            </div>
          )}
        </div>

        <TrainingSourceStatusForm
          sourceId={source.id}
          currentIsActive={source.is_active}
          currentCrawlStatus={source.crawl_status}
          currentAdminNotes={source.admin_notes ?? ''}
        />
      </div>
    </article>
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

function InfoLine({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-orange-600">{icon}</span>
      <span className="break-all">{value}</span>
    </div>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-slate-950">{value}</p>
    </div>
  )
}