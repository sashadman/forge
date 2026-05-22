import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Music2,
  Play,
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

type SocialLink = {
  label: string
  href: string | null
  icon: ReactNode
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
      linkedin_url,
      instagram_url,
      facebook_url,
      x_url,
      youtube_url,
      tiktok_url,
      other_social_url,
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

  const socialLinks: SocialLink[] = [
    {
      label: 'LinkedIn',
      href: employer.linkedin_url,
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      label: 'Instagram',
      href: employer.instagram_url,
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      label: 'Facebook',
      href: employer.facebook_url,
      icon: <Facebook className="h-4 w-4" />,
    },
    {
      label: 'X / Twitter',
      href: employer.x_url,
      icon: <ExternalLink className="h-4 w-4" />,
    },
    {
      label: 'YouTube',
      href: employer.youtube_url,
      icon: <Play className="h-4 w-4" />,
    },
    {
      label: 'TikTok',
      href: employer.tiktok_url,
      icon: <Music2 className="h-4 w-4" />,
    },
    {
      label: 'Other social',
      href: employer.other_social_url,
      icon: <ExternalLink className="h-4 w-4" />,
    },
  ].filter((link) => Boolean(link.href))

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
            Back to jobs & apprenticeships
          </Link>

          <div className="mt-10 max-w-4xl">
            <div className="inline-flex flex-wrap items-center gap-3">
              <p className="eyebrow-dark">
                {employer.is_verified ? 'Verified employer' : 'Employer profile'}
              </p>

              <span
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                  employer.is_verified
                    ? 'bg-green-400/15 text-green-200 ring-1 ring-green-300/30'
                    : 'bg-white/10 text-slate-200 ring-1 ring-white/15'
                }`}
              >
                {employer.is_verified ? 'Admin reviewed' : 'Not yet verified'}
              </span>
            </div>

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

              <h2 className="section-title mt-3">About this employer</h2>

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
                  value={
                    employer.is_verified
                      ? 'Verified profile'
                      : 'Not verified yet'
                  }
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

                <Link
                  href="/opportunities"
                  className="btn-outline px-5 py-2 text-sm"
                >
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
                            {formatOpportunityType(
                              opportunity.opportunity_type
                            )}
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
                    This employer does not have active jobs or apprenticeships listed right
                    now. We do not show fake openings.
                  </p>

                  <Link href="/opportunities" className="btn-dark mt-5">
                    Browse job and apprenticeships
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

              {socialLinks.length > 0 && (
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-950">
                    Social links
                  </h3>

                  <div className="mt-4 grid gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                      >
                        <span className="inline-flex items-center gap-2">
                          {link.icon}
                          {link.label}
                        </span>

                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

                  <div>
                    <p className="font-semibold text-slate-950">
                      {employer.is_verified
                        ? 'Verified profile'
                        : 'Verification pending'}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {employer.is_verified
                        ? 'This employer profile has been reviewed by an admin. Always confirm current details directly with the employer before applying.'
                        : 'This employer profile has not been verified yet. Review the employer website, contact information, and listing details before making career decisions.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dark-panel p-6">
              <div className="dark-panel-content">
                <h3 className="text-2xl font-bold">Still exploring?</h3>

                <p className="mt-3 leading-7 text-slate-300">
                  Compare trade paths and training programs before applying.
                </p>

                <Link href="/trades" className="btn-light mt-6">
                  Explore career paths
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