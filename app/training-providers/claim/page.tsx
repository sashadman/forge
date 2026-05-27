import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ProviderClaimForm from '@/components/training-providers/ProviderClaimForm'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Request Training Provider Access — ${siteConfig.name}`,
  description:
    'Submit a real training provider or program access request for admin review.',
}

export default function TrainingProviderClaimPage() {
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
              This is the first real provider workflow. Submit a request only
              for a real organization or program you are authorized to represent.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <ProviderClaimForm />
          </div>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}