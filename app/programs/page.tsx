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
          <ProgramsExplorer programs={programs ?? []} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}