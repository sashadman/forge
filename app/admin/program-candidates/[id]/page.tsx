import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import PageHero from '@/components/ui/PageHero'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { createClient } from '@/lib/supabase/server'
import {
  promoteProgramCandidate,
  rejectProgramCandidate,
} from '@/app/actions/program-candidates'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Program Candidate Detail — ${siteConfig.name}`,
  description:
    'Review one imported training program candidate before publishing it into the public program directory.',
}

type CandidateDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

type CandidateDetail = {
  id: string
  external_id: string | null
  source_url: string
  source_domain: string
  title: string
  provider_name: string
  institution_name: string | null
  program_type: string
  trade_slug: string
  location: string | null
  state: string | null
  country: string
  duration: string | null
  cost: string | null
  description: string | null
  requirements: string[] | null
  outcomes: string[] | null
  cip_code: string | null
  occupation_code: string | null
  apprenticeship_occupation: string | null
  verification_status: string
  source_authority: string
  trust_level: string
  confidence_score: number
  published_program_id: string | null
  review_notes: string | null
  reviewed_at: string | null
  raw_payload: Record<string, unknown>
  created_at: string
  updated_at: string
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function statusClass(status: string) {
  if (status === 'published') {
    return 'bg-blue-50 text-blue-700 ring-blue-100'
  }

  if (status === 'rejected') {
    return 'bg-rose-50 text-rose-700 ring-rose-100'
  }

  if (status === 'trusted_candidate' || status === 'approved') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  if (status === 'needs_review') {
    return 'bg-amber-50 text-amber-700 ring-amber-100'
  }

  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

function formatRawValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

export default async function CandidateDetailPage({
  params,
}: CandidateDetailPageProps) {
  const { id } = await params
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
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const { data: candidate, error } = await supabase
    .from('training_program_candidates')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !candidate) {
    notFound()
  }

  const typedCandidate = candidate as CandidateDetail
  const rawEntries = Object.entries(typedCandidate.raw_payload ?? {}).slice(0, 80)

  const canAct =
    typedCandidate.verification_status !== 'published' &&
    typedCandidate.verification_status !== 'rejected' &&
    typedCandidate.published_program_id === null

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Admin candidate detail"
        title="Inspect one imported training candidate before publishing."
        description="Review the candidate fields, source link, raw public-source payload, and status before promoting it into the public program directory."
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-3">
            <DetailMetricCard
              icon={<GraduationCap className="h-7 w-7" />}
              eyebrow="Trade"
              value={typedCandidate.trade_slug}
              description={typedCandidate.program_type}
            />

            <DetailMetricCard
              icon={<ShieldCheck className="h-7 w-7" />}
              eyebrow="Confidence"
              value={`${Number(typedCandidate.confidence_score).toFixed(0)}%`}
              description={typedCandidate.trust_level}
            />

            <DetailMetricCard
              icon={<Database className="h-7 w-7" />}
              eyebrow="Status"
              value={formatStatus(typedCandidate.verification_status)}
              description={
                typedCandidate.published_program_id
                  ? 'Linked to a published program.'
                  : 'Not linked to a published program.'
              }
            />
          </div>

          <div className="mt-8">
            <NextStepPanel
              eyebrow="Review standard"
              title="Promote only records that clearly help career seekers."
              description="Use the source link and raw payload to confirm the candidate is a useful training pathway. Reject records that are outside scope or too weak for the public directory."
              primaryHref="/admin/program-candidates"
              primaryLabel="Back to candidate queue"
              secondaryHref="/admin/programs"
              secondaryLabel="View published programs"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          <section className="mt-8">
            <Link
              href="/admin/program-candidates"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to candidate review
            </Link>

            <div className="content-panel mt-5">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClass(
                        typedCandidate.verification_status
                      )}`}
                    >
                      {formatStatus(typedCandidate.verification_status)}
                    </span>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
                      {typedCandidate.trade_slug}
                    </span>

                    {typedCandidate.published_program_id && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                        Published
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-slate-950">
                    {typedCandidate.title}
                  </h1>

                  <p className="mt-3 text-lg font-semibold text-slate-700">
                    {typedCandidate.provider_name}
                  </p>

                  {typedCandidate.institution_name &&
                    typedCandidate.institution_name !== typedCandidate.provider_name && (
                      <p className="mt-1 text-sm text-slate-500">
                        Institution: {typedCandidate.institution_name}
                      </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={typedCandidate.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    View source
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-6">
              <div className="content-panel">
                <h2 className="text-2xl font-bold text-slate-950">
                  Candidate details
                </h2>

                <dl className="mt-6 grid gap-5 md:grid-cols-2">
                  <DetailItem label="Program type" value={typedCandidate.program_type} />
                  <DetailItem label="CIP code" value={typedCandidate.cip_code ?? '—'} />
                  <DetailItem
                    label="Location"
                    value={typedCandidate.location ?? 'See provider'}
                  />
                  <DetailItem label="State" value={typedCandidate.state ?? '—'} />
                  <DetailItem label="Country" value={typedCandidate.country} />
                  <DetailItem
                    label="Duration"
                    value={typedCandidate.duration ?? '—'}
                  />
                  <DetailItem label="Cost" value={typedCandidate.cost ?? '—'} />
                  <DetailItem
                    label="External ID"
                    value={typedCandidate.external_id ?? '—'}
                  />
                </dl>

                <div className="mt-7">
                  <p className="eyebrow">Description</p>
                  <p className="mt-2 leading-7 text-slate-700">
                    {typedCandidate.description ??
                      'No candidate description is available yet.'}
                  </p>
                </div>
              </div>

              <div className="content-panel">
                <h2 className="text-2xl font-bold text-slate-950">
                  Raw source payload
                </h2>

                <p className="muted-text mt-2">
                  Showing the first 80 fields from the imported source record.
                </p>

                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                  <div className="max-h-[36rem] overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="sticky top-0 bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Field
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Value
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 bg-white">
                        {rawEntries.map(([key, value]) => (
                          <tr key={key}>
                            <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-slate-700">
                              {key}
                            </td>
                            <td className="px-4 py-3 text-xs leading-5 text-slate-600">
                              {formatRawValue(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="content-panel">
                <h2 className="text-2xl font-bold text-slate-950">
                  Review actions
                </h2>

                <p className="muted-text mt-3">
                  Promote this record only if it should become visible in the
                  public program directory.
                </p>

                <div className="mt-6 space-y-3">
                  {canAct ? (
                    <>
                      <form action={promoteProgramCandidate}>
                        <input
                          type="hidden"
                          name="candidateId"
                          value={typedCandidate.id}
                        />
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Promote to published program
                        </button>
                      </form>

                      <form action={rejectProgramCandidate}>
                        <input
                          type="hidden"
                          name="candidateId"
                          value={typedCandidate.id}
                        />
                        <input
                          type="hidden"
                          name="notes"
                          value="Rejected from candidate detail review."
                        />
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject candidate
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-800">
                        This candidate has already been reviewed or published.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="content-panel">
                <h2 className="text-2xl font-bold text-slate-950">
                  Review metadata
                </h2>

                <dl className="mt-6 space-y-5">
                  <DetailItem label="Trust level" value={typedCandidate.trust_level} />
                  <DetailItem
                    label="Source authority"
                    value={typedCandidate.source_authority}
                  />
                  <DetailItem
                    label="Source domain"
                    value={typedCandidate.source_domain}
                  />
                  <DetailItem
                    label="Published program ID"
                    value={typedCandidate.published_program_id ?? '—'}
                    breakAll
                  />
                  <DetailItem
                    label="Reviewed at"
                    value={typedCandidate.reviewed_at ?? '—'}
                  />
                  <DetailItem
                    label="Review notes"
                    value={typedCandidate.review_notes ?? '—'}
                  />
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function DetailMetricCard({
  icon,
  eyebrow,
  value,
  description,
}: {
  icon: React.ReactNode
  eyebrow: string
  value: string
  description: string
}) {
  return (
    <div className="content-panel">
      <div className="text-orange-600">{icon}</div>
      <p className="eyebrow mt-5">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold text-slate-950">{value}</h2>
      <p className="muted-text mt-3">{description}</p>
    </div>
  )
}

function DetailItem({
  label,
  value,
  breakAll = false,
}: {
  label: string
  value: string
  breakAll?: boolean
}) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd
        className={`mt-1 text-sm font-semibold text-slate-900 ${
          breakAll ? 'break-all' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  )
}