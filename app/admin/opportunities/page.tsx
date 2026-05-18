import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Manage Opportunities — ${siteConfig.name}`,
  description: 'Admin review page for opportunity listing data quality.',
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function AdminOpportunitiesPage() {
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

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select(
      `
      id,
      title,
      slug,
      opportunity_type,
      trade_slug,
      location,
      state,
      pay_range,
      schedule,
      description,
      requirements,
      benefits,
      application_url,
      is_active,
      created_at,
      employers (
        name,
        slug,
        is_verified,
        is_active
      )
    `
    )
    .order('created_at', { ascending: false })

  const totalOpportunities = opportunities?.length ?? 0
  const activeCount =
    opportunities?.filter((opportunity) => opportunity.is_active).length ?? 0
  const inactiveCount =
    opportunities?.filter((opportunity) => !opportunity.is_active).length ?? 0

  const strongQualityCount =
    opportunities?.filter((opportunity) => {
      const employer = Array.isArray(opportunity.employers)
        ? opportunity.employers[0]
        : opportunity.employers

      const qualityItems = [
        Boolean(opportunity.title),
        Boolean(employer?.name),
        Boolean(opportunity.opportunity_type),
        Boolean(opportunity.trade_slug),
        Boolean(opportunity.location && opportunity.state),
        opportunity.description.trim().length >= 100,
        Boolean(opportunity.schedule),
        Boolean(opportunity.pay_range),
        Boolean(opportunity.requirements && opportunity.requirements.length > 0),
        Boolean(opportunity.benefits && opportunity.benefits.length > 0),
        Boolean(opportunity.application_url),
      ]

      const qualityScore = Math.round(
        (qualityItems.filter(Boolean).length / qualityItems.length) * 100
      )

      return qualityScore >= 80
    }).length ?? 0

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Admin data quality</p>

              <h1 className="page-title-dark mt-6">
                Opportunity quality workflow.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review real opportunity listings, employer connection, application
                details, requirements, benefits, and public visibility before
                seekers rely on them.
              </p>
            </div>

            <Link href="/admin" className="btn-light">
              Back to admin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-4">
            <StatusPanel
              label="Total listings"
              value={`${totalOpportunities}`}
            />
            <StatusPanel label="Active" value={`${activeCount}`} />
            <StatusPanel label="Inactive" value={`${inactiveCount}`} />
            <StatusPanel
              label="Strong quality"
              value={`${strongQualityCount}`}
            />
          </div>

          <div className="content-panel mt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Opportunity directory</p>

                <h2 className="section-title mt-3">
                  {totalOpportunities} opportunity records
                </h2>

                <p className="muted-text mt-3 max-w-2xl">
                  Use this page to review listing quality. Keep public opportunity
                  records accurate, useful, and based on real employer information.
                  Do not add fake opportunities.
                </p>
              </div>

              <Link
                href="/admin/employers"
                className="btn-outline px-5 py-2 text-sm"
              >
                Manage employers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {opportunities && opportunities.length > 0 ? (
              <div className="mt-8 grid gap-5">
                {opportunities.map((opportunity) => {
                  const employer = Array.isArray(opportunity.employers)
                    ? opportunity.employers[0]
                    : opportunity.employers

                  const qualityItems = [
                    Boolean(opportunity.title),
                    Boolean(employer?.name),
                    Boolean(opportunity.opportunity_type),
                    Boolean(opportunity.trade_slug),
                    Boolean(opportunity.location && opportunity.state),
                    opportunity.description.trim().length >= 100,
                    Boolean(opportunity.schedule),
                    Boolean(opportunity.pay_range),
                    Boolean(
                      opportunity.requirements &&
                        opportunity.requirements.length > 0
                    ),
                    Boolean(opportunity.benefits && opportunity.benefits.length > 0),
                    Boolean(opportunity.application_url),
                  ]

                  const qualityScore = Math.round(
                    (qualityItems.filter(Boolean).length / qualityItems.length) *
                      100
                  )

                  const strongQuality = qualityScore >= 80

                  return (
                    <div key={opportunity.id} className="card bg-slate-50">
                      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="badge-orange">
                              {formatOpportunityType(
                                opportunity.opportunity_type
                              )}
                            </span>

                            <span className="badge-slate">
                              {opportunity.is_active ? 'Active' : 'Inactive'}
                            </span>

                            <span
                              className={
                                strongQuality ? 'badge-orange' : 'badge-slate'
                              }
                            >
                              {qualityScore}% quality
                            </span>

                            {employer && (
                              <span className="badge-slate">
                                {employer.is_verified
                                  ? 'Verified employer'
                                  : 'Employer not verified'}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 text-2xl font-bold text-slate-950">
                            {opportunity.title}
                          </h3>

                          <p className="mt-2 font-semibold text-slate-600">
                            {employer?.name || 'Employer missing'} ·{' '}
                            {opportunity.trade_slug}
                          </p>

                          <p className="muted-text mt-4 line-clamp-3">
                            {opportunity.description}
                          </p>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <MiniCheck
                              label="Apply link"
                              complete={Boolean(opportunity.application_url)}
                            />
                            <MiniCheck
                              label="Pay"
                              complete={Boolean(opportunity.pay_range)}
                            />
                            <MiniCheck
                              label="Requirements"
                              complete={Boolean(
                                opportunity.requirements &&
                                  opportunity.requirements.length > 0
                              )}
                            />
                            <MiniCheck
                              label="Benefits"
                              complete={Boolean(
                                opportunity.benefits &&
                                  opportunity.benefits.length > 0
                              )}
                            />
                          </div>

                          <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <MiniDetail
                              label="Location"
                              value={`${opportunity.location}, ${opportunity.state}`}
                            />

                            <MiniDetail
                              label="Schedule"
                              value={opportunity.schedule || 'See listing'}
                            />

                            <MiniDetail
                              label="Pay range"
                              value={opportunity.pay_range || 'See listing'}
                            />
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                          {opportunity.is_active && (
                            <Link
                              href={`/opportunities/${opportunity.slug}`}
                              className="btn-dark px-5 py-3 text-sm"
                            >
                              Public listing
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          )}

                          {employer && (
                            <Link
                              href={`/employers/${employer.slug}`}
                              className="btn-outline px-5 py-3 text-sm"
                            >
                              Employer profile
                              <BriefcaseBusiness className="h-4 w-4" />
                            </Link>
                          )}

                          <Link
                            href={`/admin/opportunities/${opportunity.id}/edit`}
                            className="btn-outline px-5 py-3 text-sm"
                          >
                            Review / edit
                            <ArrowRight className="h-4 w-4" />
                          </Link>

                          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                            {strongQuality ? (
                              <ShieldCheck className="h-4 w-4 text-orange-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-slate-500" />
                            )}
                            {strongQuality ? 'Strong listing' : 'Needs detail'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                <h3 className="text-xl font-bold text-slate-950">
                  No opportunities yet
                </h3>

                <p className="muted-text mt-2">
                  Opportunity records will appear here when real employers create
                  real listings.
                </p>

                <Link href="/admin" className="btn-dark mt-5">
                  Back to admin
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
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
      <p className="eyebrow">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}

function MiniCheck({
  label,
  complete,
}: {
  label: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
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