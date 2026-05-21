import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Database,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
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
    sourceCountResult,
    activeSourceCountResult,
    reviewDueSourceCountResult,
  ] = await Promise.all([
    supabase.from('employers').select('id', { count: 'exact', head: true }),

    supabase.from('opportunities').select('id', { count: 'exact', head: true }),

    supabase.from('programs').select('id', { count: 'exact', head: true }),

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
  ])

  const employerCount = employerCountResult.count ?? 0
  const opportunityCount = opportunityCountResult.count ?? 0
  const programCount = programCountResult.count ?? 0
  const sourceCount = sourceCountResult.count ?? 0
  const activeSourceCount = activeSourceCountResult.count ?? 0
  const reviewDueSourceCount = reviewDueSourceCountResult.count ?? 0

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Admin</p>

            <h1 className="page-title-dark mt-6">
              Manage real platform records.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Use this area for verified employers, trusted sources, real
              opportunity listings, and training pathways. Keep the platform
              accurate, current, and credible.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard
              icon={<Building2 className="h-8 w-8" />}
              eyebrow="Employers"
              value={employerCount}
              description="Employer profiles currently stored in the platform."
            />

            <AdminMetricCard
              icon={<BriefcaseBusiness className="h-8 w-8" />}
              eyebrow="Opportunities"
              value={opportunityCount}
              description="Opportunity records connected to employer profiles."
            />

            <AdminMetricCard
              icon={<Database className="h-8 w-8" />}
              eyebrow="Sources"
              value={sourceCount}
              description={`${activeSourceCount} active trusted listing sources.`}
            />

            <AdminMetricCard
              icon={<ShieldCheck className="h-8 w-8" />}
              eyebrow="Review due"
              value={reviewDueSourceCount}
              description="Sources that need admin review or verification."
            />
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow">Admin command center</p>

                <h2 className="section-title mt-3">
                  Build a trustworthy skilled-trades data platform.
                </h2>

                <p className="muted-text mt-3 max-w-3xl">
                  Manage employers, opportunities, training programs, and the
                  trusted source directory that supports broad listings.
                </p>
              </div>

              <Link href="/admin/opportunity-sources" className="btn-primary">
                Manage opportunity sources
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <AdminActionCard
              href="/admin/opportunity-sources"
              icon={<Database className="h-7 w-7" />}
              title="Manage sources"
              description="Add and review public directories, workforce boards, apprenticeship sources, and official career pages."
              action="Open source directory"
              featured
            />
<AdminActionCard
  href="/admin/applications"
  icon={<BriefcaseBusiness className="h-7 w-7" />}
  title="Review applications"
  description="Review seeker applications, readiness snapshots, timeline events, and employer review status."
  action="Open application review"
/>
            <AdminActionCard
              href="/admin/opportunities"
              icon={<BriefcaseBusiness className="h-7 w-7" />}
              title="Review opportunities"
              description="Review real opportunity listings connected to employer profiles and trusted sources."
              action="Open opportunity admin"
            />

            <AdminActionCard
              href="/admin/employers"
              icon={<Building2 className="h-7 w-7" />}
              title="Manage employers"
              description="Review employer records, verification status, and public profile pages."
              action="Open employer admin"
            />

            <AdminActionCard
              href="/admin/programs"
              icon={<GraduationCap className="h-7 w-7" />}
              title="Review programs"
              description="Review real training programs, apprenticeships, and pathway records."
              action="Open program admin"
            />

            <AdminActionCard
              href="/admin/employers/new"
              icon={<Building2 className="h-7 w-7" />}
              title="Add real employer"
              description="Manually add a real employer after checking the organization information."
              action="Create employer record"
            />
          </div>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Data quality standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Broad listings only matter if they stay trustworthy.
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Use source attribution, review dates, verification status, and
                  official external links so users can trust the opportunities
                  they find.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <QualityCard
                  title="Real"
                  description="No fake employers or filler listings."
                />
                <QualityCard
                  title="Verified"
                  description="Review source quality and active status."
                />
                <QualityCard
                  title="Current"
                  description="Track stale, expired, and review-due records."
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

      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>

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