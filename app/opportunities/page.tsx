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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.24),transparent_34rem)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-orange-300">
              Real opportunities
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Find skilled-trades opportunities when verified listings become available.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              This section is designed for real jobs, apprenticeships, trainee roles,
              and pre-apprenticeship opportunities. We will not show fake openings.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="-mt-16 rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl shadow-slate-900/10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Opportunity directory
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Active skilled-trades listings
                </h2>
              </div>

              <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
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
                    className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
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
                      <div className="rounded-2xl bg-slate-50 p-4">
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

                      <div className="rounded-2xl bg-slate-50 p-4">
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
            <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 shadow-sm">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <ClipboardList className="h-8 w-8" />
                </div>

                <h3 className="mt-6 text-3xl font-bold tracking-tight">
                  No active opportunities yet
                </h3>

                <p className="mt-4 text-lg leading-8 text-slate-600">
                  We are keeping this section honest. Opportunities will appear here
                  only when real employer listings, apprenticeships, trainee roles,
                  or workforce opportunities are added.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    href="/programs"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                  >
                    Explore training programs
                    <GraduationCap className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/for-employers"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100"
                  >
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