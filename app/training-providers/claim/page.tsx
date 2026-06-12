import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import ProviderClaimForm, {
  type ClaimLinkedProgram,
} from '@/components/training-providers/ProviderClaimForm'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Request Training Provider Access — ${siteConfig.name}`,
  description:
    'Submit a real training provider or program access request for admin review.',
}

type TrainingProviderClaimPageProps = {
  searchParams?: Promise<{
    programId?: string
  }>
}

export default async function TrainingProviderClaimPage({
  searchParams,
}: TrainingProviderClaimPageProps) {
  const params = await searchParams
  const programId = params?.programId?.trim()

  let linkedProgram: ClaimLinkedProgram | null = null

  if (programId) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('programs')
      .select('id, slug, name, provider_name, location, state, website_url')
      .eq('id', programId)
      .eq('is_active', true)
      .maybeSingle()

    if (!error && data) {
      linkedProgram = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        providerName: data.provider_name,
        location: data.location,
        state: data.state,
        websiteUrl: data.website_url,
      }
    }
  }

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Training provider access</p>

            <h1 className="page-title-dark mt-6">
              Request access for a provider or training program.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Submit a request only for a real organization or program you are
              authorized to represent. Admin review is required before provider
              tools or program updates are enabled.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <ProviderClaimForm linkedProgram={linkedProgram} />
          </div>
        </div>
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}