import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Database,
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

export const metadata: Metadata = {
  title: `Admin — ${siteConfig.name}`,
  description: `Admin tools for managing real ${siteConfig.name} platform records.`,
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
    programCountResult,
    candidateCountResult,
    sourceCountResult,
    activeSourceCountResult,
    reviewDueSourceCountResult,
    trustedCandidateCountResult,
  ] = await Promise.all([
    supabase.from('employers').select('id', { count: 'exact', head: true }),

    supabase.from('opportunities').select('id', { count: 'exact', head: true }),

    supabase.from('programs').select('id', { count: 'exact', head: true }),

    supabase
      .from('training_program_candidates')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('opportunity_sources')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('opportunity_sources')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),

    supabase
      .from('opportunity_sources')
      .select('id', { count: 'exact', head: true })
      .lte('next_review_at', new Date().toISOString()),

    supabase
      .from('training_program_candidates')
      .select('id', { count: 'exact', head: true })
      .eq('verification_status', 'trusted_candidate'),
  ])

  const employerCount = employerCountResult.count ?? 0
  const opportunityCount = opportunityCountResult.count ?? 0
  const programCount = programCountResult.count ?? 0
  const candidateCount = candidateCountResult.count ?? 0
  const sourceCount = sourceCountResult.count ?? 0
  const activeSourceCount = activeSourceCountResult.count ?? 0
  const reviewDueSourceCount = reviewDueSourceCountResult.count ?? 0
  const trustedCandidateCount = trustedCandidateCountResult.count ?? 0

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Admin command center"
        title="Manage platform quality with clear operational workflows."
        description="Use this area to manage trusted sources, real employers, opportunity listings, training pathways, applications, and data-quality operations."
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard
              icon={<Building2 className="h-8 w-8" />}
              eyebrow="Employers"
              value={employerCount}
              description="Real employer profiles currently stored."
            />

            <AdminMetricCard
              icon={<BriefcaseBusiness className="h-8 w-8" />}
              eyebrow="Opportunities"
              value={opportunityCount}
              description="Opportunity records connected to employers."
            />

            <AdminMetricCard
              icon={<GraduationCap className="h-8 w-8" />}
              eyebrow="Published programs"
              value={programCount}
              description="Public training programs currently visible or staged."
            />

            <AdminMetricCard
              icon={<ClipboardCheck className="h-8 w-8" />}
              eyebrow="Candidate queue"
              value={candidateCount}
              description={`${trustedCandidateCount} trusted candidates ready for review.`}
            />
          </div>

          <div className="mt-8">
            <NextStepPanel
              eyebrow="Recommended next step"
              title="Review imported training candidates before publishing."
              description="Imported program candidates should be reviewed before they become public records. Start with trusted candidates, promote one at a time, and reject records outside the platform scope."
              primaryHref="/admin/program-candidates"
              primaryLabel="Review candidates"
              secondaryHref="/admin/training-sources"
              secondaryLabel="Manage training sources"
              icon={<ClipboardCheck className="h-6 w-6" />}
            />
          </div>

          <section className="mt-8">
            <div>
              <p className="eyebrow">Admin workflows</p>

              <h2 className="section-title mt-3">
                Choose the workflow you need.
              </h2>

              <p className="muted-text mt-3 max-w-3xl">
                Each area has a focused purpose. Review candidate training data
                before publishing it, and keep employer, opportunity, and
                provider workflows separated.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AdminActionCard
                href="/admin/program-candidates"
                icon={<ClipboardCheck className="h-7 w-7" />}
                title="Review program candidates"
                description="Review imported training candidates, promote trusted records, and reject records that do not fit the platform."
                action="Open candidate queue"
                featured
              />

              <AdminActionCard
                href="/admin/data-expansion"
                icon={<Database className="h-7 w-7" />}
                title="Expand real data"
                description="Use trusted sources, source review, and freshness rules to grow real listings."
                action="Open workflow"
              />

              <AdminActionCard
                href="/admin/training-sources"
                icon={<ShieldCheck className="h-7 w-7" />}
                title="Manage training sources"
                description="Review national, state, and provider training data sources."
                action="Open training sources"
              />

              <AdminActionCard
                href="/admin/opportunity-sources"
                icon={<ShieldCheck className="h-7 w-7" />}
                title="Manage opportunity sources"
                description="Add, review, activate, and check trusted opportunity sources."
                action="Open opportunity sources"
              />

              <AdminActionCard
                href="/admin/opportunities"
                icon={<BriefcaseBusiness className="h-7 w-7" />}
                title="Review opportunities"
                description="Review real listings, source attribution, quality, and public visibility."
                action="Open opportunities"
              />

              <AdminActionCard
                href="/admin/programs"
                icon={<GraduationCap className="h-7 w-7" />}
                title="Review published programs"
                description="Review public training programs, apprenticeships, and pathway records."
                action="Open programs"
              />

              <AdminActionCard
                href="/admin/applications"
                icon={<UsersRound className="h-7 w-7" />}
                title="Review applications"
                description="Review submitted applications, readiness snapshots, and timeline status."
                action="Open applications"
              />

              <AdminActionCard
                href="/admin/employers"
                icon={<Building2 className="h-7 w-7" />}
                title="Manage employers"
                description="Review employer records, verification status, and public profiles."
                action="Open employers"
              />
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Operating standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Broad listings only matter if they stay trustworthy.
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Every public record should serve a seeker. Use source
                  attribution, review dates, verification status, and official
                  external links so users can trust what they find.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <QualityCard
                  title="Real"
                  description="No fake employers or filler listings."
                />
                <QualityCard
                  title="Verified"
                  description="Review source quality and public status."
                />
                <QualityCard
                  title="Current"
                  description={`${sourceCount} sources tracked, including ${activeSourceCount} active sources and ${reviewDueSourceCount} due for review.`}
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
  icon: React.ReactNode
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
  action,
  featured = false,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  action: string
  featured?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? 'border-orange-200 bg-orange-50'
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

      <h2 className="mt-5 text-2xl font-bold text-slate-950">{title}</h2>

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