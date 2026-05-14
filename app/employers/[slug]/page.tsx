import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

type PageProps = {
  params: {
    slug: string
  }
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const supabase = createClient()

  const { data: employer } = await supabase
    .from('employers')
    .select('name, description')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!employer) {
    return {
      title: `Employer Not Found — ${siteConfig.name}`,
    }
  }

  return {
    title: `${employer.name} — ${siteConfig.name}`,
    description: employer.description,
  }
}

export default async function EmployerDetailPage({ params }: PageProps) {
  const supabase = createClient()

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
      opportunities (
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
        is_active
      )
    `
    )
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!employer) {
    notFound()
  }

  const activeOpportunities =
    employer.opportunities?.filter((opportunity) => opportunity.is_active) ?? []

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to opportunities
          </Link>

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">
              {employer.is_verified ? 'Verified employer' : 'Employer profile'}
            </p>

            <h1 className="page-title-dark mt-6">{employer.name}</h1>

            {employer.industry && (
              <p className="mt-5 text-xl font-semibold text-orange-300">
                {employer.industry}
              </p>
            )}

            <p className="lead-text-dark mt-6 max-w-3xl">
              {employer.description}
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="-mt-12 space-y-8">
            <section className="content-panel">
              <p className="eyebrow">Employer overview</p>

              <h2 className="section-title mt-3">
                About this employer
              </h2>

              <p className="lead-text mt-5">{employer.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Location"
                  value={`${employer.location}, ${employer.state}`}
                />

                <DetailItem
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Industry"
                  value={employer.industry || 'See employer'}
                />

                <DetailItem
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Verification"
                  value={employer.is_verified ? 'Verified profile' : 'Not verified yet'}
                />

                <DetailItem
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Active listings"
                  value={`${activeOpportunities.length}`}
                />
              </div>
            </section>

            <section className="content-panel">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="eyebrow">Opportunities</p>

                  <h2 className="section-title mt-3">
                    Active listings from this employer
                  </h2>
                </div>

                <Link href="/opportunities" className="btn-outline px-5 py-2 text-sm">
                  View all opportunities
                  <ArrowRight className="h-4 w-4" />
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

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="mini-card-white">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Location
                          </p>

                          <p className="mt-1 font-bold text-slate-950">
                            {opportunity.location}, {opportunity.state}
                          </p>
                        </div>

                        <div className="mini-card-white">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Schedule
                          </p>

                          <p className="mt-1 font-bold text-slate-950">
                            {opportunity.schedule || 'See listing'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                  <h3 className="text-xl font-bold text-slate-950">
                    No active listings yet
                  </h3>

                  <p className="muted-text mt-2">
                    This employer does not have active opportunities listed right now.
                    We do not show fake openings.
                  </p>

                  <Link href="/opportunities" className="btn-dark mt-5">
                    Browse opportunities
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>
          </div>

          <aside className="-mt-12 space-y-6">
            <div className="content-panel">
              <p className="eyebrow">Employer details</p>

              <div className="mt-6 space-y-4">
                <DetailItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Location"
                  value={`${employer.location}, ${employer.state}`}
                />

                <DetailItem
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Profile status"
                  value={employer.is_verified ? 'Verified' : 'Not verified yet'}
                />
              </div>

              {employer.website_url && (
                <a
                  href={employer.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-8 w-full px-6 py-4"
                >
                  Visit employer website
                  <Globe className="h-4 w-4" />
                </a>
              )}

              {employer.contact_email && (
                <a
                  href={`mailto:${employer.contact_email}`}
                  className="btn-outline mt-4 w-full px-6 py-4"
                >
                  Contact employer
                  <Mail className="h-4 w-4" />
                </a>
              )}

              <p className="mt-5 text-xs leading-6 text-slate-500">
                Employer information can change. Always confirm details directly
                with the employer before applying or making career decisions.
              </p>
            </div>

            <div className="dark-panel p-6">
              <div className="dark-panel-content">
                <h3 className="text-2xl font-bold">Still exploring?</h3>

                <p className="mt-3 leading-7 text-slate-300">
                  Compare trade paths and training programs before applying.
                </p>

                <Link href="/trades" className="btn-light mt-6">
                  Explore trades
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
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
  icon: ReactNode
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