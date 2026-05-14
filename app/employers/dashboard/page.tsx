import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Employer Dashboard — ${siteConfig.name}`,
  description: 'Manage your employer profile and opportunity listings.',
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

/*
  Hidden foundation for future employer deactivation.

  Do not expose this in the UI yet.

  When we are ready, we can move this into a server action and add owner confirmation:
  - confirm employer ownership
  - set employers.is_active = false
  - optionally set related opportunities.is_active = false
  - redirect away from the public employer profile
*/
async function deactivateEmployerProfile(employerId: string) {
  const supabase = createClient()

  await supabase
    .from('opportunities')
    .update({ is_active: false })
    .eq('employer_id', employerId)

  await supabase
    .from('employers')
    .update({ is_active: false })
    .eq('id', employerId)
}

export default async function EmployerDashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/employers/sign-in')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select(
      `
      id,
      name,
      slug,
      description,
      industry,
      location,
      state,
      website_url,
      contact_email,
      is_verified,
      is_active,
      opportunities (
        id,
        title,
        slug,
        opportunity_type,
        trade_slug,
        location,
        state,
        schedule,
        pay_range,
        description,
        is_active,
        created_at
      )
    `
    )
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (!employer) {
    redirect('/employers/new')
  }

  const activeOpportunities =
    employer.opportunities?.filter((opportunity) => opportunity.is_active) ?? []

  const inactiveOpportunities =
    employer.opportunities?.filter((opportunity) => !opportunity.is_active) ?? []

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Employer dashboard</p>

            <h1 className="page-title-dark mt-6">
              Manage your employer profile.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Review your company profile, create real opportunity listings, and
              manage your employer presence on {siteConfig.name}.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="-mt-12 space-y-6">
            <div className="content-panel">
              <p className="eyebrow">Employer profile</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {employer.name}
              </h2>

              {employer.industry && (
                <p className="mt-2 font-semibold text-slate-600">
                  {employer.industry}
                </p>
              )}

              <p className="muted-text mt-5 line-clamp-4">
                {employer.description}
              </p>

              <div className="mt-6 space-y-4">
                <DetailItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Location"
                  value={`${employer.location}, ${employer.state}`}
                />

                <DetailItem
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Verification"
                  value={employer.is_verified ? 'Verified' : 'Not verified yet'}
                />

                <DetailItem
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Active opportunities"
                  value={`${activeOpportunities.length}`}
                />
              </div>

              <div className="mt-8 grid gap-3">
                <Link href={`/employers/${employer.slug}`} className="btn-dark w-full">
                  View public profile
                  <ExternalLink className="h-4 w-4" />
                </Link>

                <Link
                  href="/employers/opportunities/new"
                  className="btn-primary w-full"
                >
                  Create opportunity
                  <Plus className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-5 text-xs leading-6 text-slate-500">
                Deactivation controls are intentionally hidden for now. We will
                add them later with confirmation and safety checks.
              </p>
            </div>

            <div className="dark-panel p-6">
              <div className="dark-panel-content">
                <h3 className="text-2xl font-bold">Profile visibility</h3>

                <p className="mt-3 leading-7 text-slate-300">
                  Your employer profile can be viewed publicly while active.
                  Opportunity listings should only be real openings or real
                  training opportunities.
                </p>
              </div>
            </div>
          </aside>

          <div className="-mt-12 space-y-8">
            <section className="content-panel">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="eyebrow">Listings</p>

                  <h2 className="section-title mt-3">
                    Active opportunity listings
                  </h2>

                  <p className="muted-text mt-3 max-w-2xl">
                    These listings appear in the public opportunities directory.
                  </p>
                </div>

                <Link
                  href="/employers/opportunities/new"
                  className="btn-primary px-5 py-3 text-sm"
                >
                  Add listing
                  <Plus className="h-4 w-4" />
                </Link>
              </div>

              {activeOpportunities.length > 0 ? (
                <div className="mt-8 grid gap-5">
                  {activeOpportunities.map((opportunity) => (
                    <Link
                      key={opportunity.id}
                      href={`/opportunities/${opportunity.slug}`}
                      className="card card-hover group bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="badge-orange">
                            {formatOpportunityType(opportunity.opportunity_type)}
                          </span>

                          <h3 className="mt-4 text-2xl font-bold text-slate-950 transition group-hover:text-orange-700">
                            {opportunity.title}
                          </h3>

                          <p className="mt-2 font-semibold text-slate-600">
                            {opportunity.trade_slug}
                          </p>
                        </div>

                        <div className="rounded-full bg-white p-3 ring-1 ring-slate-200 transition group-hover:ring-orange-200">
                          <ArrowRight className="h-5 w-5 text-slate-700 group-hover:text-orange-700" />
                        </div>
                      </div>

                      <p className="muted-text mt-5 line-clamp-3">
                        {opportunity.description}
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <MiniDetail label="Location" value={`${opportunity.location}, ${opportunity.state}`} />
                        <MiniDetail label="Schedule" value={opportunity.schedule || 'See listing'} />
                        <MiniDetail label="Pay range" value={opportunity.pay_range || 'See listing'} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                  <h3 className="text-xl font-bold text-slate-950">
                    No active listings yet
                  </h3>

                  <p className="muted-text mt-2 max-w-2xl">
                    Create your first real opportunity listing when you have a
                    job, apprenticeship, trainee role, or pre-apprenticeship that
                    someone can actually review or apply for.
                  </p>

                  <Link
                    href="/employers/opportunities/new"
                    className="btn-primary mt-5"
                  >
                    Create opportunity
                    <Plus className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>

            {inactiveOpportunities.length > 0 && (
              <section className="content-panel">
                <p className="eyebrow">Inactive listings</p>

                <h2 className="section-title mt-3">
                  Hidden opportunity listings
                </h2>

                <p className="muted-text mt-3 max-w-2xl">
                  These listings are not currently active in the public directory.
                </p>

                <div className="mt-8 grid gap-4">
                  {inactiveOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="mini-card">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <p className="font-bold text-slate-950">
                            {opportunity.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {formatOpportunityType(opportunity.opportunity_type)} · {opportunity.trade_slug}
                          </p>
                        </div>

                        <span className="badge-slate">Inactive</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="mini-card">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
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