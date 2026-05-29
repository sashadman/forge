import type { Metadata } from 'next'
import Link from 'next/link'
import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import ProgramsExplorer, {
  type Program,
} from '@/components/programs/ProgramsExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import BackLink from '@/components/ui/BackLink'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'

export const metadata: Metadata = {
  title: `Training Programs — ${siteConfig.name}`,
  description:
    'Browse skilled-trades training programs, apprenticeships, pre-apprenticeships, and workforce preparation pathways.',
}

type ProgramRecord = {
  id: string
  slug: string
  name: string
  provider_name: string
  program_type: string
  trade_slug: string
  location: string
  state: string
  duration: string | null
  cost: string | null
  description: string
  website_url?: unknown
  review_status?: unknown
  data_origin?: unknown
  source_url?: unknown
  source_candidate_id?: unknown
}

function normalizeProgram(program: ProgramRecord): Program {
  return {
    id: program.id,
    slug: program.slug,
    name: program.name,
    provider_name: program.provider_name,
    program_type: program.program_type,
    trade_slug: program.trade_slug,
    location: program.location,
    state: program.state,
    duration: program.duration,
    cost: program.cost,
    description: program.description,
    website_url:
      typeof program.website_url === 'string' ? program.website_url : null,
    review_status:
      typeof program.review_status === 'string'
        ? program.review_status
        : 'admin_created',
    data_origin:
      typeof program.data_origin === 'string' ? program.data_origin : null,
    source_url:
      typeof program.source_url === 'string' ? program.source_url : null,
    source_candidate_id:
      typeof program.source_candidate_id === 'string'
        ? program.source_candidate_id
        : null,
  }
}

export default async function ProgramsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: programsData, error: programsError } = await supabase
    .from('programs')
    .select('*')
    .eq('is_active', true)
    .in('review_status', ['approved', 'admin_created'])
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
      console.error(
        'Failed to load saved training program IDs:',
        savedProgramsError
      )
    }

    savedProgramIds =
      savedPrograms?.map((savedProgram) => savedProgram.program_id) ?? []
  }

  const normalizedPrograms = ((programsData ?? []) as ProgramRecord[]).map(
    normalizeProgram
  )

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <BackLink href="/trades" label="Back to career paths" variant="light" />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Training programs</p>

            <h1 className="page-title-dark mt-6">
              Compare training options before you apply.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Browse apprenticeships, pre-apprenticeships, workforce programs,
              and training providers. Use this page when you need preparation
              before applying to jobs or apprenticeships.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="pt-8">
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
              programs={normalizedPrograms}
              savedProgramIds={savedProgramIds}
            />
          </div>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-xl">
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
                  apprenticeships, and trainee roles to see what employers
                  expect.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/opportunities" className="btn-light">
                    View jobs & apprenticeships
                  </Link>

                  <Link
                    href="/dashboard/readiness"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Build readiness profile
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}