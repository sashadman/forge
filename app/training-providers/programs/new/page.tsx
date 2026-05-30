import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import ProviderProgramSubmissionForm from '@/components/training-providers/ProviderProgramSubmissionForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Submit Program — ${siteConfig.name}`,
  description:
    'Submit a provider training program for admin review before public publishing.',
}

type ProviderProfile = {
  id: string
  name: string
  city: string
  state: string
}

export default async function NewProviderProgramPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: memberships, error } = await supabase
    .from('training_provider_memberships')
    .select(
      `
      provider_profile_id,
      role,
      status,
      training_provider_profiles (
        id,
        name,
        city,
        state
      )
      `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)

  if (error) {
    console.error('Failed to load provider membership:', error)
  }

  const membership = memberships?.[0]
  const providerProfile = Array.isArray(membership?.training_provider_profiles)
    ? membership?.training_provider_profiles[0]
    : membership?.training_provider_profiles

  if (!providerProfile) {
    redirect('/training-providers/dashboard')
  }

  if (membership?.role !== 'owner' && membership?.role !== 'manager') {
    redirect('/training-providers/programs')
  }

  const typedProviderProfile = providerProfile as ProviderProfile

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Submit program</p>

            <h1 className="page-title-dark mt-6">
              Submit a training program for admin review.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Add a real training pathway connected to your approved provider
              workspace. The program will stay private until admin approval.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <ProviderProgramSubmissionForm
              providerProfile={{
                id: typedProviderProfile.id,
                name: typedProviderProfile.name,
                city: typedProviderProfile.city,
                state: typedProviderProfile.state,
              }}
            />
          </div>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}