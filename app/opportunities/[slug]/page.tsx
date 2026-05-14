import SaveOpportunityButton from '@/components/opportunities/SaveOpportunityButton'
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
  MapPin,
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

  const { data: opportunity } = await supabase
    .from('opportunities')
    .select(
      `
      title,
      description,
      employers (
        name
      )
    `
    )
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!opportunity) {
    return {
      title: `Opportunity Not Found — ${siteConfig.name}`,
    }
  }

  const employer = Array.isArray(opportunity.employers)
    ? opportunity.employers[0]
    : opportunity.employers

  return {
    title: `${opportunity.title} — ${siteConfig.name}`,
    description: `${employer?.name || 'Employer'}: ${opportunity.description}`,
  }
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const supabase = createClient()

  const { data: opportunity } = await supabase
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
      employers (
        name,
        slug,
        description,
        industry,
        website_url,
        is_verified
      )
    `
    )
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!opportunity) {
    notFound()
  }

  const employer = Array.isArray(opportunity.employers)
    ? opportunity.employers[0]
    : opportunity.employers

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
              {formatOpportunityType(opportunity.opportunity_type)}
            </p>

            <h1 className="page-title-dark mt-6">{opportunity.title}</h1>

            <p className="mt-5 text-xl font-semibold text-orange-300">
              {employer?.name || 'Employer listing'}
            </p>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {opportunity.description}
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="-mt-12 space-y-8">
            <section className="content-panel">
              <p className="eyebrow">Opportunity overview</p>

              <h2 className="section-title mt-3">
                What this opportunity offers
              </h2>

              <p className="lead-text mt-5">{opportunity.description}</p>

              {opportunity.benefits && opportunity.benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold">Benefits</h3>

                  <div className="mt-5 grid gap-3">
                    {opportunity.benefits.map((benefit) => (
                      <div key={benefit} className="mini-card flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                        <p className="leading-7 text-slate-700">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <section className="content-panel">
                <p className="eyebrow">Requirements</p>

                <h2 className="section-title mt-3">
                  What to review before applying
                </h2>

                <div className="mt-6 grid gap-3">
                  {opportunity.requirements.map((requirement) => (
                    <div key={requirement} className="mini-card">
                      <p className="leading-7 text-slate-700">{requirement}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {employer && (
              <section className="content-panel">
                <p className="eyebrow">Employer</p>

                <h2 className="section-title mt-3">{employer.name}</h2>

                {employer.description && (
                  <p className="lead-text mt-5">{employer.description}</p>
                )}
              </section>
            )}
          </div>

          <aside className="-mt-12 space-y-6">
            <div className="content-panel">
              <p className="eyebrow">Listing details</p>

              <div className="mt-6 space-y-4">
                <DetailItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Location"
                  value={`${opportunity.location}, ${opportunity.state}`}
                />

                <DetailItem
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Opportunity type"
                  value={formatOpportunityType(opportunity.opportunity_type)}
                />

                <DetailItem
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Trade focus"
                  value={opportunity.trade_slug}
                />

                <DetailItem
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Schedule"
                  value={opportunity.schedule || 'See listing'}
                />

                <DetailItem
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Pay range"
                  value={opportunity.pay_range || 'See listing'}
                />
              </div>
<div className="mt-8">
  <SaveOpportunityButton opportunityId={opportunity.id} />
</div>
              {opportunity.application_url && (
                <a
                  href={opportunity.application_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-8 w-full px-6 py-4"
                >
                  Apply or learn more
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <p className="mt-5 text-xs leading-6 text-slate-500">
                This is a public opportunity listing. Always confirm pay,
                schedule, requirements, and application details directly with
                the employer or listing provider.
              </p>
            </div>

            <div className="dark-panel p-6">
              <div className="dark-panel-content">
                <h3 className="text-2xl font-bold">Still preparing?</h3>

                <p className="mt-3 leading-7 text-slate-300">
                  Explore training programs and trade paths before applying.
                </p>

                <Link href="/programs" className="btn-light mt-6">
                  Explore programs
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