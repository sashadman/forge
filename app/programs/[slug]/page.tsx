import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import BackLink from '@/components/ui/BackLink'
import NextStepPanel from '@/components/ui/NextStepPanel'
import SaveProgramButton from '@/components/programs/SaveProgramButton'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

type PageProps = {
  params: {
    slug: string
  }
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const supabase = createClient()

  const { data: program } = await supabase
    .from('programs')
    .select('name, provider_name, description')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!program) {
    return {
      title: `Training Program Not Found — ${siteConfig.name}`,
    }
  }

  return {
    title: `${program.name} — ${siteConfig.name}`,
    description: program.description,
  }
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const supabase = createClient()

  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!program) {
    notFound()
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <BackLink
            href="/programs"
            label="Back to training programs"
            variant="light"
          />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">
              {formatProgramType(program.program_type)}
            </p>

            <h1 className="page-title-dark mt-6">{program.name}</h1>

            <p className="mt-5 text-xl font-semibold text-orange-300">
              {program.provider_name}
            </p>

            <p className="lead-text-dark mt-6 max-w-3xl">
              {program.description}
            </p>

            <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-400">
              Training program information can change. Always confirm
              requirements, cost, dates, and availability directly with the
              provider before making enrollment decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Save this program if it belongs in your training plan."
              description="Use saved training programs to compare cost, duration, requirements, outcomes, and how each pathway connects to real jobs or apprenticeships."
              primaryHref="/programs"
              primaryLabel="Compare training programs"
              secondaryHref="/opportunities"
              secondaryLabel="View jobs & apprenticeships"
              icon={<GraduationCap className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <section className="content-panel">
                <p className="eyebrow">Training program overview</p>

                <h2 className="section-title mt-3">
                  What this pathway offers
                </h2>

                <p className="lead-text mt-5">{program.description}</p>

                {program.outcomes && program.outcomes.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold">Potential outcomes</h3>

                    <div className="mt-5 grid gap-3">
                      {program.outcomes.map((outcome: string) => (
                        <div key={outcome} className="mini-card flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                          <p className="leading-7 text-slate-700">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {program.requirements && program.requirements.length > 0 && (
                <section className="content-panel">
                  <p className="eyebrow">Requirements</p>

                  <h2 className="section-title mt-3">
                    What to check before applying
                  </h2>

                  <div className="mt-6 grid gap-3">
                    {program.requirements.map((requirement: string) => (
                      <div key={requirement} className="mini-card">
                        <p className="leading-7 text-slate-700">
                          {requirement}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <div className="content-panel">
                <p className="eyebrow">Program details</p>

                <div className="mt-6 space-y-4">
                  <DetailItem
                    icon={<MapPin className="h-5 w-5" />}
                    label="Location"
                    value={`${program.location}, ${program.state}`}
                  />

                  <DetailItem
                    icon={<GraduationCap className="h-5 w-5" />}
                    label="Duration"
                    value={program.duration || 'See provider'}
                  />

                  <DetailItem
                    icon={<GraduationCap className="h-5 w-5" />}
                    label="Cost"
                    value={program.cost || 'See provider'}
                  />

                  <DetailItem
                    icon={<GraduationCap className="h-5 w-5" />}
                    label="Career focus"
                    value={program.trade_slug}
                  />
                </div>

                <div className="mt-8">
                  <SaveProgramButton programId={program.id} />
                </div>

                {program.website_url && (
                  <a
                    href={program.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-4 w-full px-6 py-4"
                  >
                    Visit provider website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <p className="mt-5 text-xs leading-6 text-slate-500">
                  This is a public directory listing. Confirm requirements,
                  dates, cost, and availability directly with the provider.
                </p>
              </div>

              <div className="dark-panel p-6">
                <div className="dark-panel-content">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">
                    Not sure this is the right path?
                  </h3>

                  <p className="mt-3 leading-7 text-slate-300">
                    Compare this program with real jobs, apprenticeships, and
                    career paths before deciding where to spend time or money.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link href="/opportunities" className="btn-light">
                      View jobs & apprenticeships
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/trades"
                      className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                    >
                      Compare career paths
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
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