
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import {
  getReadinessIcon,
  readinessSections,
  type ReadinessStatus,
} from '@/lib/admin/system-readiness'

export const metadata: Metadata = {
  title: `System Readiness — ${siteConfig.name}`,
  description:
    'Internal production-readiness checklist for platform security, deployment, and data operations.',
}

type CountResult = {
  count: number | null
  error: { message: string } | null
}

type LooseCountQuery = {
  eq: (column: string, value: string | boolean) => Promise<CountResult>
}

type LooseCountTable = {
  select: (
    columns: string,
    options?: {
      count?: 'exact'
      head?: boolean
    }
  ) => Promise<CountResult> & LooseCountQuery
}

type LooseSupabaseClient = {
  from: (table: string) => LooseCountTable
}

type LiveReadinessCounts = {
  employers: number
  opportunities: number
  activeOpportunities: number
  applications: number
  programs: number
  providerClaims: number
  pendingProviderClaims: number
  providerProgramSubmissions: number
  providerProgramUpdateRequests: number
  employerOpportunitySubmissions: number
  pendingEmployerOpportunitySubmissions: number
  approvedEmployerOpportunitySubmissions: number
  rejectedEmployerOpportunitySubmissions: number
  trainingSources: number
  opportunitySources: number
}

function asLooseSupabase(client: unknown) {
  return client as LooseSupabaseClient
}

async function getLooseCount(
  client: unknown,
  table: string,
  filter?: {
    column: string
    value: string | boolean
  }
) {
  const query = asLooseSupabase(client)
    .from(table)
    .select('id', { count: 'exact', head: true })

  const result = filter
    ? await query.eq(filter.column, filter.value)
    : await query

  if (result.error) {
    console.error(`Failed to count ${table}:`, result.error)
  }

  return result.count ?? 0
}

async function getLiveReadinessCounts(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<LiveReadinessCounts> {
  const [
    employers,
    opportunities,
    activeOpportunities,
    applications,
    programs,
    providerClaims,
    pendingProviderClaims,
    providerProgramSubmissions,
    providerProgramUpdateRequests,
    employerOpportunitySubmissions,
    pendingEmployerOpportunitySubmissions,
    approvedEmployerOpportunitySubmissions,
    rejectedEmployerOpportunitySubmissions,
    trainingSources,
    opportunitySources,
  ] = await Promise.all([
    getLooseCount(supabase, 'employers'),
    getLooseCount(supabase, 'opportunities'),
    getLooseCount(supabase, 'opportunities', {
      column: 'is_active',
      value: true,
    }),
    getLooseCount(supabase, 'applications'),
    getLooseCount(supabase, 'programs'),
    getLooseCount(supabase, 'provider_claims'),
    getLooseCount(supabase, 'provider_claims', {
      column: 'status',
      value: 'pending',
    }),
    getLooseCount(supabase, 'provider_program_submissions'),
    getLooseCount(supabase, 'provider_program_update_requests'),
    getLooseCount(supabase, 'employer_opportunity_submissions'),
    getLooseCount(supabase, 'employer_opportunity_submissions', {
      column: 'status',
      value: 'submitted',
    }),
    getLooseCount(supabase, 'employer_opportunity_submissions', {
      column: 'status',
      value: 'approved',
    }),
    getLooseCount(supabase, 'employer_opportunity_submissions', {
      column: 'status',
      value: 'rejected',
    }),
    getLooseCount(supabase, 'training_sources'),
    getLooseCount(supabase, 'opportunity_sources'),
  ])

  return {
    employers,
    opportunities,
    activeOpportunities,
    applications,
    programs,
    providerClaims,
    pendingProviderClaims,
    providerProgramSubmissions,
    providerProgramUpdateRequests,
    employerOpportunitySubmissions,
    pendingEmployerOpportunitySubmissions,
    approvedEmployerOpportunitySubmissions,
    rejectedEmployerOpportunitySubmissions,
    trainingSources,
    opportunitySources,
  }
}

function getStatusConfig(status: ReadinessStatus) {
  if (status === 'ready') {
    return {
      label: 'Ready',
      className: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      icon: CheckCircle2,
    }
  }

  if (status === 'needs_review') {
    return {
      label: 'Review',
      className: 'bg-orange-50 text-orange-700 ring-orange-100',
      icon: AlertTriangle,
    }
  }

  return {
    label: 'Manual',
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
    icon: ClipboardCheck,
  }
}

function getEnvStatus() {
  return {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  }
}

export default async function AdminSystemReadinessPage() {
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

  const counts = await getLiveReadinessCounts(supabase)
  const envStatus = getEnvStatus()

  const totalItems = readinessSections.reduce(
    (total, section) => total + section.items.length,
    0
  )

  const readyItems = readinessSections.reduce(
    (total, section) =>
      total + section.items.filter((item) => item.status === 'ready').length,
    0
  )

  const reviewItems = readinessSections.reduce(
    (total, section) =>
      total +
      section.items.filter((item) => item.status === 'needs_review').length,
    0
  )

  const manualItems = readinessSections.reduce(
    (total, section) =>
      total +
      section.items.filter((item) => item.status === 'manual_check').length,
    0
  )

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Production readiness</p>

            <h1 className="page-title-dark mt-6">
              Review platform readiness before serious deployment.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Use this page as an internal checklist for security, role
              separation, RLS, provider workflows, employer review operations,
              admin controls, and deployment hygiene.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-5 md:grid-cols-4">
            <StatusPanel label="Checklist items" value={`${totalItems}`} />
            <StatusPanel label="Ready" value={`${readyItems}`} />
            <StatusPanel label="Need review" value={`${reviewItems}`} />
            <StatusPanel label="Manual checks" value={`${manualItems}`} />
          </div>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Readiness standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Type-check and build are required, but not enough.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                  Before real users test Ara Skills, verify role routing, public
                  visibility, RLS behavior, admin-only controls, environment
                  variables, and Supabase migration state.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <ShieldCheck className="h-8 w-8" />
              </div>
            </div>
          </section>

          <section className="content-panel mt-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Database className="h-6 w-6" />
                </div>

                <p className="eyebrow mt-5">Live system snapshot</p>

                <h2 className="section-title mt-3">
                  Current records and review queues
                </h2>

                <p className="muted-text mt-3 max-w-3xl">
                  These counts confirm the admin dashboard is connected to the
                  live Supabase tables used by the MVP workflows.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <LiveCountCard label="Employers" value={counts.employers} />
              <LiveCountCard
                label="Public opportunities"
                value={counts.opportunities}
                helper={`${counts.activeOpportunities} active`}
              />
              <LiveCountCard label="Applications" value={counts.applications} />
              <LiveCountCard label="Programs" value={counts.programs} />

              <LiveCountCard
                label="Employer submissions"
                value={counts.employerOpportunitySubmissions}
                helper={`${counts.pendingEmployerOpportunitySubmissions} pending`}
              />
              <LiveCountCard
                label="Approved submissions"
                value={counts.approvedEmployerOpportunitySubmissions}
              />
              <LiveCountCard
                label="Rejected submissions"
                value={counts.rejectedEmployerOpportunitySubmissions}
              />
              <LiveCountCard
                label="Provider update requests"
                value={counts.providerProgramUpdateRequests}
              />

              <LiveCountCard
                label="Provider claims"
                value={counts.providerClaims}
                helper={`${counts.pendingProviderClaims} pending`}
              />
              <LiveCountCard
                label="Provider program submissions"
                value={counts.providerProgramSubmissions}
              />
              <LiveCountCard
                label="Training sources"
                value={counts.trainingSources}
              />
              <LiveCountCard
                label="Opportunity sources"
                value={counts.opportunitySources}
              />
            </div>
          </section>

          <section className="content-panel mt-8">
            <p className="eyebrow">Environment checks</p>

            <h2 className="section-title mt-3">Required runtime variables</h2>

            <p className="muted-text mt-3 max-w-3xl">
              These checks only confirm whether expected public runtime variables
              are present in the current environment. They do not expose secret
              values.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <EnvStatusCard
                label="NEXT_PUBLIC_SUPABASE_URL"
                ready={envStatus.supabaseUrl}
              />
              <EnvStatusCard
                label="NEXT_PUBLIC_SUPABASE_ANON_KEY"
                ready={envStatus.supabaseAnonKey}
              />
              <EnvStatusCard
                label="NEXT_PUBLIC_SITE_URL"
                ready={envStatus.siteUrl}
              />
            </div>
          </section>

          <div className="mt-8 grid gap-6">
            {readinessSections.map((section) => {
              const SectionIcon = getReadinessIcon(section.iconName)

              return (
                <section key={section.title} className="content-panel">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                        <SectionIcon className="h-6 w-6" />
                      </div>

                      <p className="eyebrow mt-5">Readiness area</p>

                      <h2 className="section-title mt-3">{section.title}</h2>

                      <p className="muted-text mt-3">{section.description}</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {section.items.map((item) => {
                      const statusConfig = getStatusConfig(item.status)
                      const StatusIcon = statusConfig.icon

                      return (
                        <div
                          key={item.title}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusConfig.className}`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {statusConfig.label}
                            </span>
                          </div>

                          <h3 className="mt-4 text-xl font-bold text-slate-950">
                            {item.title}
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
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

function LiveCountCard({
  label,
  value,
  helper,
}: {
  label: string
  value: number
  helper?: string
}) {
  return (
    <div className="mini-card-white">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>

      {helper && <p className="mt-1 text-sm font-semibold text-slate-600">{helper}</p>}
    </div>
  )
}

function EnvStatusCard({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="mini-card-white">
      <div className="flex items-center gap-2">
        {ready ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-orange-600" />
        )}

        <p className="font-bold text-slate-950">{label}</p>
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-600">
        {ready ? 'Configured' : 'Missing or not available'}
      </p>
    </div>
  )
}