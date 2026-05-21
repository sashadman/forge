import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
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
      linkedin_url,
      instagram_url,
      facebook_url,
      x_url,
      youtube_url,
      tiktok_url,
      other_social_url,
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

  const hasSocialLink = Boolean(
    employer.linkedin_url ||
      employer.instagram_url ||
      employer.facebook_url ||
      employer.x_url ||
      employer.youtube_url ||
      employer.tiktok_url ||
      employer.other_social_url
  )

  const completenessItems = [
    {
      label: 'Company description',
      complete: employer.description.trim().length >= 80,
      helpText: 'Add a clear company description so seekers understand who you are.',
    },
    {
      label: 'Website',
      complete: Boolean(employer.website_url),
      helpText: 'Add your company website for credibility.',
    },
    {
      label: 'Contact email',
      complete: Boolean(employer.contact_email),
      helpText: 'Add a contact email for follow-up.',
    },
    {
      label: 'Location',
      complete: Boolean(employer.location && employer.state),
      helpText: 'Confirm your city and state.',
    },
    {
      label: 'Social link',
      complete: hasSocialLink,
      helpText: 'Add at least one active social or professional link.',
    },
    {
      label: 'Verification',
      complete: employer.is_verified,
      helpText: 'Admin verification improves trust.',
    },
    {
      label: 'Active opportunity',
      complete: activeOpportunities.length > 0,
      helpText: 'Add a real opportunity when available.',
    },
  ]

  const completedItems = completenessItems.filter((item) => item.complete).length
  const completenessScore = Math.round(
    (completedItems / completenessItems.length) * 100
  )

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

                <Link href="/employers/profile" className="btn-outline w-full">
                  Edit employer profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/employers/applications" className="btn-outline w-full">
                    Review applications
                  <BriefcaseBusiness className="h-4 w-4" />
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

            <div className="content-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Profile quality</p>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                    {completenessScore}% complete
                  </h3>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-lg font-bold text-orange-700">
                  {completenessScore}%
                </div>
              </div>

              <p className="muted-text mt-4">
                Strong employer profiles build trust with career seekers and make
                listings easier to evaluate.
              </p>

              <div className="mt-6 space-y-3">
                {completenessItems.map((item) => (
                  <CompletenessItem
                    key={item.label}
                    label={item.label}
                    helpText={item.helpText}
                    complete={item.complete}
                  />
                ))}
              </div>

              <Link href="/employers/profile" className="btn-outline mt-6 w-full">
                Improve profile
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                    <div key={opportunity.id} className="card bg-slate-50">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="badge-orange">
                            {formatOpportunityType(opportunity.opportunity_type)}
                          </span>

                          <h3 className="mt-4 text-2xl font-bold text-slate-950">
                            {opportunity.title}
                          </h3>

                          <p className="mt-2 font-semibold text-slate-600">
                            {opportunity.trade_slug}
                          </p>
                        </div>
                      </div>

                      <p className="muted-text mt-5 line-clamp-3">
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

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/opportunities/${opportunity.slug}`}
                          className="btn-dark px-5 py-3 text-sm"
                        >
                          View public listing
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/employers/opportunities/${opportunity.id}/edit`}
                          className="btn-outline px-5 py-3 text-sm"
                        >
                          Edit or deactivate
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
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
                            {formatOpportunityType(opportunity.opportunity_type)} ·{' '}
                            {opportunity.trade_slug}
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

function CompletenessItem({
  label,
  helpText,
  complete,
}: {
  label: string
  helpText: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        {complete ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
        )}

        <div>
          <p className="font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{helpText}</p>
        </div>
      </div>
    </div>
  )
}