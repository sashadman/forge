import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SaveProgramButton from '@/components/programs/SaveProgramButton'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
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
      title: `Program Not Found — ${siteConfig.name}`,
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
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to programs
          </Link>

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
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="-mt-12 space-y-8">
            <section className="content-panel">
              <p className="eyebrow">Program overview</p>

              <h2 className="section-title mt-3">
                What this pathway offers
              </h2>

              <p className="lead-text mt-5">{program.description}</p>

              {program.outcomes && program.outcomes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold">Potential outcomes</h3>

                  <div className="mt-5 grid gap-3">
                    {program.outcomes.map((outcome) => (
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
                  {program.requirements.map((requirement) => (
                    <div key={requirement} className="mini-card">
                      <p className="leading-7 text-slate-700">{requirement}</p>
                    </div>
                  ))}
                </div>
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
                  label="Trade focus"
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
                This is a public directory listing. Program details can change.
                Always confirm requirements, dates, cost, and availability directly
                with the provider.
              </p>
            </div>

            <div className="dark-panel p-6">
              <div className="dark-panel-content">
                <h3 className="text-2xl font-bold">Not sure yet?</h3>

                <p className="mt-3 leading-7 text-slate-300">
                  Compare this program with trade paths and save careers that match
                  your goals.
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