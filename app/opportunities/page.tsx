import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Opportunities — ${siteConfig.name}`,
  description:
    'Browse real skilled-trades jobs, apprenticeships, trainee roles, and workforce opportunities when they become available.',
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function OpportunitiesPage() {
  const supabase = createClient()

  const { data: opportunities, error } = await supabase
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
      employers (
        name,
        slug,
        is_verified
      )
    `
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load opportunities:', error)
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Real opportunities</p>

            <h1 className="page-title-dark mt-6">
              Find skilled-trades opportunities when verified listings become available.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              This section is designed for real jobs, apprenticeships, trainee roles,
              and pre-apprenticeship opportunities. We will not show fake openings.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="content-panel -mt-16">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="eyebrow">Opportunity directory</p>

                <h2 className="section-title mt-3">
                  Active skilled-trades listings
                </h2>
              </div>

              <p className="badge-slate">
                {opportunities?.length ?? 0} listings
              </p>
            </div>
          </div>

          {opportunities && opportunities.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {opportunities.map((opportunity) => {
                const employer = Array.isArray(opportunity.employers)
                  ? opportunity.employers[0]
                  : opportunity.employers

                return (
                  <Link
                    key={opportunity.id}
                    href={`/opportunities/${opportunity.slug}`}
                    className="card card-hover group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="badge-orange">
                          {formatOpportunityType(opportunity.opportunity_type)}
                        </span>

                        <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                          {opportunity.title}
                        </h3>

                        <p className="mt-2 font-semibold text-slate-600">
                          {employer?.name || 'Employer listing'}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-orange-600">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                      {opportunity.description}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="mini-card">
                        <div className="flex items-center gap-2 text-slate-500">
                          <MapPin className="h-4 w-4" />
                          <p className="text-xs font-semibold uppercase tracking-wide">
                            Location
                          </p>
                        </div>

                        <p className="mt-2 font-semibold text-slate-950">
                          {opportunity.location}, {opportunity.state}
                        </p>
                      </div>

                      <div className="mini-card">
                        <div className="flex items-center gap-2 text-slate-500">
                          <BriefcaseBusiness className="h-4 w-4" />
                          <p className="text-xs font-semibold uppercase tracking-wide">
                            Schedule
                          </p>
                        </div>

                        <p className="mt-2 font-semibold text-slate-950">
                          {opportunity.schedule || 'See listing'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="card mt-10 border-dashed p-10">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <ClipboardList className="h-8 w-8" />
                </div>

                <h3 className="mt-6 text-3xl font-bold tracking-tight">
                  No active opportunities yet
                </h3>

                <p className="lead-text mt-4">
                  We are keeping this section honest. Opportunities will appear here
                  only when real employer listings, apprenticeships, trainee roles,
                  or workforce opportunities are added.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/programs" className="btn-dark">
                    Explore training programs
                    <GraduationCap className="h-4 w-4" />
                  </Link>

                  <Link href="/for-employers" className="btn-outline">
                    For employers
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}