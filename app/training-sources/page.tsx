import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import TrainingSourceExplorer from '@/components/training-sources/TrainingSourceExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Training Sources — ${siteConfig.name}`,
  description:
    'Explore official education, apprenticeship, workforce, and training sources used to build the verified program directory.',
}

export default async function TrainingSourcesPage() {
  const supabase = createClient()

  const { data: sources, error } = await supabase
    .from('training_sources')
    .select(
      `
      id,
      source_name,
      source_slug,
      source_type,
      source_authority,
      trust_level,
      base_url,
      source_state,
      source_country,
      institution_name,
      provider_name,
      program_index_url,
      crawler_strategy,
      crawl_status,
      is_active,
      admin_notes
      `
    )
    .eq('is_active', true)
    .order('source_country', { ascending: true })
    .order('source_state', { ascending: true })
    .order('source_name', { ascending: true })

  if (error) {
    console.error('Failed to load training sources:', error)
  }

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Verified training sources</p>

            <h1 className="page-title-dark mt-6">
              Explore the official sources behind the program directory.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              The program directory is built from official education,
              apprenticeship, workforce, and provider sources. Public programs
              are published only after candidate records are reviewed and
              normalized.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <TrainingSourceExplorer sources={sources ?? []} />
          </div>
        </div>
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}