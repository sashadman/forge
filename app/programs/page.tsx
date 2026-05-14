import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GraduationCap, MapPin } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Training Programs — ${siteConfig.name}`,
  description:
    'Browse skilled trades training programs, apprenticeships, and workforce pathways.',
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function ProgramsPage() {
  const supabase = createClient()

  const { data: programs, error } = await supabase
    .from('programs')
    .select(
      'slug, name, provider_name, program_type, trade_slug, location, state, duration, cost, description'
    )
    .eq('is_active', true)
    .order('provider_name', { ascending: true })

  if (error) {
    console.error('Failed to load programs:', error)
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
              Training pathways
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Find real programs that can move you toward the trades.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Browse listed apprenticeships, workforce programs, and training pathways.
              These are public directory listings, not verified platform partners yet.
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
                  Program directory
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Listed San Diego-area pathways
                </h2>
              </div>

              <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {programs?.length ?? 0} listings
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {programs && programs.length > 0 ? (
              programs.map((program) => (
                <Link
                  key={program.slug}
                  href={`/programs/${program.slug}`}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                        {formatProgramType(program.program_type)}
                      </span>

                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                        {program.name}
                      </h3>

                      <p className="mt-2 font-semibold text-slate-600">
                        {program.provider_name}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-orange-600">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                    {program.description}
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
                        {program.location}, {program.state}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <GraduationCap className="h-4 w-4" />
                        <p className="text-xs font-semibold uppercase tracking-wide">
                          Duration
                        </p>
                      </div>
                      <p className="mt-2 font-semibold text-slate-950">
                        {program.duration || 'See provider'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center lg:col-span-2">
                <h3 className="text-2xl font-bold">No programs found</h3>
                <p className="mt-3 text-slate-600">
                  Program listings will appear here after they are added.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}