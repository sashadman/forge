import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Database,
  FileText,
  GraduationCap,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import PageHero from '@/components/ui/PageHero'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import RoleFlowCards from '@/components/ui/RoleFlowCards'

export const metadata: Metadata = {
  title: `Admin — ${siteConfig.name}`,
  description: `Admin tools for managing real ${siteConfig.name} platform records.`,
}

type CountResult = {
  count: number | null
  error: { message: string } | null
}

type LooseCountTable = {
  select: (
    columns: string,
    options?: {
      count?: 'exact'
      head?: boolean
    }
  ) => Promise<CountResult>
}

type LooseSupabaseClient = {
  from: (table: string) => LooseCountTable
}

function asLooseSupabase(client: unknown) {
  return client as LooseSupabaseClient
}

async function getLooseCount(client: unknown, table: string) {
  const { count, error } = await asLooseSupabase(client)
    .from(table)
    .select('id', { count: 'exact', head: true })

  if (error) {
    console.error(`Failed to count ${table}:`, error)
  }

  return count ?? 0
}

export default async function AdminPage() {
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

  const [
    employerCountResult,
    opportunityCountResult,
    applicationCountResult,
    programCountResult,
    candidateCountResult,
    trustedCandidateCountResult,
    providerClaimCountResult,
    pendingProviderClaimCountResult,
    employerOpportunitySubmissionCountResult,
    trainingSourceCountResult,
    opportunitySourceCountResult,
    activeOpportunitySourceCountResult,
    programUpdateRequestCount,
  ] = await Promise.all([
    supabase.from('employers').select('id', { count: 'exact', head: true }),

    supabase.from('opportunities').select('id', { count: 'exact', head: true }),

    supabase.from('applications').select('id', { count: 'exact', head: true }),

    supabase.from('programs').select('id', { count: 'exact', head: true }),

    supabase
      .from('training_program_candidates')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('training_program_candidates')
      .select('id', { count: 'exact', head: true })
      .eq('verification_status', 'trusted_candidate'),

    supabase
      .from('provider_claims')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('provider_claims')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase
      .from('employer_opportunity_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'submitted'),

    supabase
      .from('training_sources')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('opportunity_sources')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('opportunity_sources')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),

    getLooseCount(supabase, 'provider_program_update_requests'),
  ])

  const employerCount = employerCountResult.count ?? 0
  const opportunityCount = opportunityCountResult.count ?? 0
  const applicationCount = applicationCountResult.count ?? 0
  const programCount = programCountResult.count ?? 0
  const candidateCount = candidateCountResult.count ?? 0
  const trustedCandidateCount = trustedCandidateCountResult.count ?? 0
  const providerClaimCount = providerClaimCountResult.count ?? 0
  const pendingProviderClaimCount = pendingProviderClaimCountResult.count ?? 0
  const employerOpportunitySubmissionCount =
    employerOpportunitySubmissionCountResult.count ?? 0
  const trainingSourceCount = trainingSourceCountResult.count ?? 0
  const opportunitySourceCount = opportunitySourceCountResult.count ?? 0
  const activeOpportunitySourceCount = activeOpportunitySourceCountResult.count ?? 0

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Admin command center"
        title="Operate platform quality from one control room."
        description="Review imported records, provider claims, update requests, public programs, employers, opportunities, and source quality without mixing user-role workflows."
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard
              icon={<ClipboardCheck className="h-8 w-8" />}
              eyebrow="Candidate queue"
              value={candidateCount}
              description={`${trustedCandidateCount} trusted program candidates ready for review.`}
            />

            <AdminMetricCard
              icon={<Building2 className="h-8 w-8" />}
              eyebrow="Provider claims"
              value={providerClaimCount}
              description={`${pendingProviderClaimCount} provider requests pending review.`}
            />

            <AdminMetricCard
              icon={<FileText className="h-8 w-8" />}
              eyebrow="Update requests"
              value={programUpdateRequestCount}
              description="Provider-submitted program correction requests."
            />

            <AdminMetricCard
              icon={<GraduationCap className="h-8 w-8" />}
              eyebrow="Published programs"
              value={programCount}
              description="Training program records stored in the public directory."
            />
          </div>

          <div className="mt-8">
            <NextStepPanel
              eyebrow="Recommended admin flow"
              title="Review provider-submitted updates before touching public data."
              description="Program update requests are now the safest way for providers to suggest corrections while admin review remains the publishing gate."
              primaryHref="/admin/program-update-requests"
              primaryLabel="Review update requests"
              secondaryHref="/admin/program-candidates"
              secondaryLabel="Review candidates"
              icon={<FileText className="h-6 w-6" />}
            />
          </div>

          <section className="mt-8">
            <div>
              <p className="eyebrow">Review queues</p>

              <h2 className="section-title mt-3">
                Work the highest-impact admin queues first.
              </h2>

              <p className="muted-text mt-3 max-w-3xl">
                These workflows protect platform quality. Imported records,
                provider claims, and provider update requests should move
                through admin review before becoming public or changing public
                listings.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AdminActionCard
                href="/admin/program-update-requests"
                icon={<FileText className="h-7 w-7" />}
                title="Program update requests"
                description="Review provider-submitted corrections and apply approved changes to public program records."
                metric={`${programUpdateRequestCount} requests`}
                action="Review requests"
                featured
              />

              <AdminActionCard
                href="/admin/provider-claims"
                icon={<Building2 className="h-7 w-7" />}
                title="Provider claims"
                description="Review provider identity, program evidence, and workspace access requests."
                metric={`${pendingProviderClaimCount} pending`}
                action="Review provider claims"
                featured={pendingProviderClaimCount > 0}
              />

              <AdminActionCard
                href="/admin/employer-opportunity-submissions"
                icon={<BriefcaseBusiness className="h-7 w-7" />}
                title="Employer opportunity submissions"
                description="Review employer-submitted jobs, apprenticeships, trainee roles, and pre-apprenticeships before they become public."
                metric={`${employerOpportunitySubmissionCount} pending`}
                action="Review submissions"
                featured={employerOpportunitySubmissionCount > 0}
              />

              <AdminActionCard
                href="/admin/program-candidates"
                icon={<ClipboardCheck className="h-7 w-7" />}
                title="Program candidate review"
                description="Review imported training candidates, promote trusted records, and reject records outside scope."
                metric={`${trustedCandidateCount} trusted`}
                action="Open candidate queue"
              />

              <AdminActionCard
                href="/admin/programs"
                icon={<GraduationCap className="h-7 w-7" />}
                title="Published programs"
                description="Review public training programs, apprenticeships, and pathway records."
                metric={`${programCount} records`}
                action="Open programs"
              />

              <AdminActionCard
                href="/admin/training-sources"
                icon={<Database className="h-7 w-7" />}
                title="Training sources"
                description="Review source quality, ingestion status, and official data-source tracking."
                metric={`${trainingSourceCount} sources`}
                action="Open training sources"
              />

              <AdminActionCard
                href="/admin/opportunity-sources"
                icon={<ShieldCheck className="h-7 w-7" />}
                title="Opportunity sources"
                description="Manage trusted job and apprenticeship source directories."
                metric={`${activeOpportunitySourceCount}/${opportunitySourceCount} active`}
                action="Open opportunity sources"
              />
            </div>
          </section>

          <section className="mt-10">
            <div>
              <p className="eyebrow">Platform operations</p>

              <h2 className="section-title mt-3">
                Manage employer, opportunity, and application data.
              </h2>

              <p className="muted-text mt-3 max-w-3xl">
                These workflows support the seeker and employer sides of the
                platform while keeping admin responsibilities separate from
                provider-facing program workflows.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AdminActionCard
                href="/admin/opportunities"
                icon={<BriefcaseBusiness className="h-7 w-7" />}
                title="Opportunities"
                description="Review real listings, source attribution, freshness, and public visibility."
                metric={`${opportunityCount} listings`}
                action="Open opportunities"
              />

              <AdminActionCard
                href="/admin/employers"
                icon={<Building2 className="h-7 w-7" />}
                title="Employers"
                description="Review employer records, verification status, and public profiles."
                metric={`${employerCount} employers`}
                action="Open employers"
              />
              <AdminActionCard
                href="/admin/system-readiness"
                icon={<ShieldCheck className="h-7 w-7" />}
                title="System readiness"
                description="Review security, deployment, environment, RLS, and operational readiness before production use."
                metric="Checklist"
                action="Open system readiness"
              />

              <AdminActionCard
                href="/admin/applications"
                icon={<UsersRound className="h-7 w-7" />}
                title="Applications"
                description="Review submitted applications, readiness snapshots, and status history."
                metric={`${applicationCount} applications`}
                action="Open applications"
              />
            </div>
          </section>
          <section className="mt-10">
            <RoleFlowCards
              role="admin"
              title="Admin workflow map"
              description="Use these pages to operate platform data quality, review queues, and role-safe publishing workflows."
            />
          </section>
          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Operating standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Keep the data real, reviewed, and role-safe.
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Career seekers need trustworthy listings. Providers need a
                  path to request corrections. Admins must remain the final
                  control point before public data changes.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <QualityCard
                  title="Real"
                  description="No fake employers, programs, or filler listings."
                />
                <QualityCard
                  title="Reviewed"
                  description="Imported and provider-submitted data goes through admin review."
                />
                <QualityCard
                  title="Separated"
                  description="Seeker, provider, employer, and admin workflows stay role-specific."
                />
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function AdminMetricCard({
  icon,
  eyebrow,
  value,
  description,
}: {
  icon: ReactNode
  eyebrow: string
  value: number
  description: string
}) {
  return (
    <div className="content-panel">
      <div className="text-orange-600">{icon}</div>

      <p className="eyebrow mt-5">{eyebrow}</p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">
        {value.toLocaleString()}
      </h2>

      <p className="muted-text mt-3">{description}</p>
    </div>
  )
}

function AdminActionCard({
  href,
  icon,
  title,
  description,
  metric,
  action,
  featured = false,
}: {
  href: string
  icon: ReactNode
  title: string
  description: string
  metric: string
  action: string
  featured?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? 'highlight-card'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          featured ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'
        }`}
      >
        {icon}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        <span className="badge-slate">{metric}</span>
      </div>

      <p className="muted-text mt-3">{description}</p>

      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-700 transition group-hover:text-orange-800">
        {action}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

function QualityCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
      <p className="text-xl font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  )
}