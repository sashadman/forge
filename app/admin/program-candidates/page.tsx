import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  DatabaseZap,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ProgramCandidateReviewForm from '@/components/admin/program-candidates/ProgramCandidateReviewForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Program Candidates — ${siteConfig.name}`,
  description:
    'Review imported training program candidates before publishing them.',
}

function formatLabel(value: string | null) {
  if (!value) return 'Not provided'

  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function AdminProgramCandidatesPage() {
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

  const { data: candidates, error } = await supabase
    .from('training_program_candidates')
    .select(
      `
      id,
      source_id,
      source_url,
      source_domain,
      title,
      provider_name,
      institution_name,
      program_type,
      trade_slug,
      location,
      state,
      country,
      duration,
      cost,
      description,
      requirements,
      outcomes,
      cip_code,
      occupation_code,
      apprenticeship_occupation,
      verification_status,
      source_authority,
      trust_level,
      confidence_score,
      published_program_id,
      review_notes,
      created_at,
      training_sources (
        source_name,
        source_type,
        source_authority,
        trust_level
      )
      `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load program candidates:', error)
  }

  const programCandidates = candidates ?? []

  const publishedCount = programCandidates.filter(
    (candidate) => candidate.published_program_id
  ).length

  const needsReviewCount = programCandidates.filter((candidate) =>
    ['candidate', 'trusted_candidate', 'needs_review'].includes(
      candidate.verification_status
    )
  ).length

  const rejectedCount = programCandidates.filter(
    (candidate) => candidate.verification_status === 'rejected'
  ).length

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Candidate pipeline</p>

            <h1 className="page-title-dark mt-6">
              Review imported training programs.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Program candidates come from official sources. Admin review turns
              clean candidates into public training program records.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-4">
            <StatusPanel label="Candidates" value={`${programCandidates.length}`} />
            <StatusPanel label="Needs review" value={`${needsReviewCount}`} />
            <StatusPanel label="Published" value={`${publishedCount}`} />
            <StatusPanel label="Rejected" value={`${rejectedCount}`} />
          </div>

          <div className="mt-8 grid gap-6">
            {programCandidates.length > 0 ? (
              programCandidates.map((candidate) => {
                const source = Array.isArray(candidate.training_sources)
                  ? candidate.training_sources[0]
                  : candidate.training_sources

                return (
                  <article key={candidate.id} className="content-panel">
                    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-orange">
                            {formatLabel(candidate.program_type)}
                          </span>

                          <span className="badge-slate">
                            {formatLabel(candidate.verification_status)}
                          </span>

                          <span className="badge-slate">
                            {formatLabel(candidate.source_authority)}
                          </span>

                          {candidate.published_program_id && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                              Published
                            </span>
                          )}
                        </div>

                        <h2 className="section-title mt-4">{candidate.title}</h2>

                        <p className="mt-2 font-semibold text-slate-600">
                          {candidate.provider_name}
                        </p>

                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                          <MiniInfo
                            icon={<GraduationCap className="h-4 w-4" />}
                            label="Career focus"
                            value={candidate.trade_slug}
                          />

                          <MiniInfo
                            icon={<MapPin className="h-4 w-4" />}
                            label="Location"
                            value={`${candidate.location || 'See provider'}, ${
                              candidate.state || candidate.country
                            }`}
                          />

                          <MiniInfo
                            icon={<ShieldCheck className="h-4 w-4" />}
                            label="Trust"
                            value={formatLabel(candidate.trust_level)}
                          />
                        </div>

                        {source && (
                          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Source
                            </p>

                            <p className="mt-2 font-semibold text-slate-950">
                              {source.source_name}
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                              {formatLabel(source.source_type)} ·{' '}
                              {formatLabel(source.source_authority)}
                            </p>
                          </div>
                        )}

                        {candidate.description && (
                          <p className="mt-6 leading-7 text-slate-700">
                            {candidate.description}
                          </p>
                        )}

                        {candidate.requirements &&
                          candidate.requirements.length > 0 && (
                            <ReviewList
                              title="Requirements"
                              items={candidate.requirements}
                            />
                          )}

                        {candidate.outcomes && candidate.outcomes.length > 0 && (
                          <ReviewList title="Outcomes" items={candidate.outcomes} />
                        )}

                        <a
                          href={candidate.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                        >
                          View official source
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      <ProgramCandidateReviewForm
                        candidateId={candidate.id}
                        currentStatus={candidate.verification_status}
                        currentProgramType={candidate.program_type}
                        currentTradeSlug={candidate.trade_slug}
                        currentReviewNotes={candidate.review_notes ?? ''}
                        alreadyPublished={Boolean(candidate.published_program_id)}
                      />
                    </div>
                  </article>
                )
              })
            ) : (
              <section className="content-panel text-center">
                <DatabaseZap className="mx-auto h-12 w-12 text-orange-600" />

                <h2 className="section-title mt-5">
                  No program candidates yet
                </h2>

                <p className="muted-text mx-auto mt-4 max-w-2xl">
                  Candidates will appear here after an importer captures program
                  records from official sources.
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

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="mini-card">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-orange-600">{icon}</span>

        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6 mini-card">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <ul className="mt-3 space-y-2 text-slate-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}