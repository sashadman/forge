import type { Metadata } from 'next'
import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import ProgramsExplorer from '@/components/programs/ProgramsExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Training Programs — ${siteConfig.name}`,
  description:
    'Browse skilled-trades training programs, apprenticeships, and workforce pathways.',
}

export default async function ProgramsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select(
      'id, slug, name, provider_name, program_type, trade_slug, location, state, duration, cost, description'
    )
    .eq('is_active', true)
    .order('provider_name', { ascending: true })

  if (programsError) {
    console.error('Failed to load training programs:', programsError)
  }

  let savedProgramIds: string[] = []

  if (user) {
    const { data: savedPrograms, error: savedProgramsError } = await supabase
      .from('saved_programs')
      .select('program_id')
      .eq('user_id', user.id)

    if (savedProgramsError) {
      console.error('Failed to load saved training program IDs:', savedProgramsError)
    }

    savedProgramIds =
      savedPrograms?.map((savedProgram) => savedProgram.program_id) ?? []
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Training programs</p>

            <h1 className="page-title-dark mt-6">
              Build skills for skilled-trades careers.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Compare apprenticeships, pre-apprenticeships, workforce programs,
              and training providers. Use this page when you need preparation
              before applying to jobs or apprenticeships.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-pt-8">
            <NextStepPanel
              title="Training should connect to a real career path."
              description="Use saved training programs to compare cost, duration, requirements, and how each pathway can move you toward real jobs or apprenticeships."
              primaryHref="/opportunities"
              primaryLabel="View jobs & apprenticeships"
              secondaryHref="/trades"
              secondaryLabel="Compare career paths"
              icon={<GraduationCap className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8">
            <ProgramsExplorer
              programs={programs ?? []}
              savedProgramIds={savedProgramIds}
            />
          </div>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <BriefcaseBusiness className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Ready for work?
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Move from training research to real openings.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  Once you understand the training pathway, compare real jobs,
                  apprenticeships, and trainee roles to see what employers expect.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href="/opportunities" className="btn-light">
                    View jobs & apprenticeships
                  </a>

                  <a
                    href="/dashboard/readiness"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Build readiness profile
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}