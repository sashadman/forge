import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import {
  getOpportunityTypeLabel,
  getOpportunityVerificationBadgeClass,
  getOpportunityVerificationLabel,
} from '@/lib/opportunities/opportunity-options'
import type { OpportunityVerificationStatus } from '@/lib/supabase/app-types'

export const metadata: Metadata = {
  title: `Manage Opportunities — ${siteConfig.name}`,
  description: 'Admin review page for opportunity listing data quality.',
}

type EmployerRelation = {
  name: string
  slug: string
  is_verified: boolean
  is_active: boolean
}

function getSingleRelation<T>(relation: T | T[] | null | undefined) {
  if (Array.isArray(relation)) return relation[0] ?? null
  return relation ?? null
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
      external_url,
      source_name,
      source_attribution,
      verification_status,
      last_verified_at,
      expires_at,
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
  const sourcedCount =
    opportunities?.filter((opportunity) => Boolean(opportunity.source_name))
      .length ?? 0

  const strongQualityCount =
    opportunities?.filter((opportunity) => {
      const employer = getSingleRelation<EmployerRelation>(
        opportunity.employers
      )

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
        Boolean(opportunity.application_url || opportunity.external_url),
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
                Create and review real opportunity listings with employer
                connection, source attribution, verification status, application
                links, requirements, benefits, and public visibility controls.
              </p>
            </div>

        <Link
            href="/admin"
            className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
        >
          Back to admin
              <ArrowRight className="h-4 w-4" />
        </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <StatusPanel label="Total listings" value={totalOpportunities} />
            <StatusPanel label="Active" value={activeCount} />
            <StatusPanel label="Inactive" value={inactiveCount} />
            <StatusPanel label="Sourced" value={sourcedCount} />
            <StatusPanel label="Strong quality" value={strongQualityCount} />
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow">Opportunity directory</p>

                <h2 className="section-title mt-3">
                  {totalOpportunities} opportunity records
                </h2>

                <p className="muted-text mt-3 max-w-3xl">
                  Use this page to create and review listings. Keep public
                  opportunity records accurate, useful, current, and connected
                  to real employers and trusted sources.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admin/opportunities/new"
                  className="btn-primary px-5 py-3"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add opportunity
                </Link>

                <Link
                  href="/admin/opportunity-sources"
                  className="btn-outline px-5 py-3"
                >
                  Manage sources
                  <Database className="h-4 w-4" />
                </Link>

                <Link
                  href="/admin/employers"
                  className="btn-outline px-5 py-3"
                >
                  Manage employers
                  <BriefcaseBusiness className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {opportunities && opportunities.length > 0 ? (
            <div className="mt-8 grid gap-5">
              {opportunities.map((opportunity) => {
                const employer = getSingleRelation<EmployerRelation>(
                  opportunity.employers
                )

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
                  Boolean(opportunity.application_url || opportunity.external_url),
                ]

                const qualityScore = Math.round(
                  (qualityItems.filter(Boolean).length / qualityItems.length) *
                    100
                )

                const strongQuality = qualityScore >= 80
                const verificationStatus =
                  opportunity.verification_status as OpportunityVerificationStatus

                return (
                  <article key={opportunity.id} className="card bg-slate-50">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-orange">
                            {getOpportunityTypeLabel(
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

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getOpportunityVerificationBadgeClass(
                              verificationStatus
                            )}`}
                          >
                            {getOpportunityVerificationLabel(verificationStatus)}
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
                            label="Apply/source link"
                            complete={Boolean(
                              opportunity.application_url ||
                                opportunity.external_url
                            )}
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

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

                          <MiniDetail
                            label="Source"
                            value={opportunity.source_name || 'Manual / none'}
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

                        {opportunity.external_url && (
                          <a
                            href={opportunity.external_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline px-5 py-3 text-sm"
                          >
                            Source URL
                            <ExternalLink className="h-4 w-4" />
                          </a>
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
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8">
              <BriefcaseBusiness className="h-10 w-10 text-orange-600" />

              <h3 className="mt-5 text-2xl font-bold text-slate-950">
                No opportunities yet
              </h3>

              <p className="muted-text mt-3 max-w-2xl">
                Start by creating a real listing from a trusted source and
                connecting it to a real employer profile.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/admin/opportunities/new" className="btn-dark">
                  <PlusCircle className="h-4 w-4" />
                  Add first opportunity
                </Link>

                <Link href="/admin/opportunity-sources" className="btn-outline">
                  Manage sources
                  <Database className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function StatusPanel({ label, value }: { label: string; value: number }) {
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