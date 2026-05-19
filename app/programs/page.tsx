import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ProgramsExplorer from '@/components/programs/ProgramsExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Training Programs — ${siteConfig.name}`,
  description:
    'Browse skilled trades training programs, apprenticeships, and workforce pathways.',
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
    console.error('Failed to load programs:', programsError)
  }

  let savedProgramIds: string[] = []

  if (user) {
    const { data: savedPrograms, error: savedProgramsError } = await supabase
      .from('saved_programs')
      .select('program_id')
      .eq('user_id', user.id)

    if (savedProgramsError) {
      console.error('Failed to load saved program IDs:', savedProgramsError)
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
            <p className="eyebrow-dark">Training pathways</p>

            <h1 className="page-title-dark mt-6">
              Find real programs that can move you toward the trades.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Browse listed apprenticeships, workforce programs, and training
              pathways. These are public directory listings, not verified
              platform partners yet.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <ProgramsExplorer
            programs={programs ?? []}
            savedProgramIds={savedProgramIds}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}