import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Manage Opportunities — ${siteConfig.name}`,
  description: 'Admin review page for opportunity listings.',
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

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Admin</p>

              <h1 className="page-title-dark mt-6">
                Opportunity records.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review real opportunity listings connected to employer profiles.
                This page is for visibility and review only.
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
          <div className="content-panel -mt-12">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Opportunity directory</p>

                <h2 className="section-title mt-3">
                  {opportunities?.length ?? 0} opportunity records
                </h2>

                <p className="muted-text mt-3 max-w-2xl">
                  Use this page to review listings, employer status, and public
                  visibility. Do not add fake opportunities.
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
                            Edit opportunity
                            <ArrowRight className="h-4 w-4" />
                          </Link>

                          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                            <ShieldCheck className="h-4 w-4" />
                            Admin review
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