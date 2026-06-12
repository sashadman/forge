import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import TrainingProviderProfileForm from '@/components/training-providers/TrainingProviderProfileForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Profile — ${siteConfig.name}`,
  description: 'Manage an approved training provider profile.',
}

export default async function TrainingProviderProfilePage() {
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
      id,
      role,
      status,
      training_provider_profiles (
        id,
        name,
        description,
        website_url,
        contact_email,
        phone,
        city,
        state,
        verification_status
      )
      `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)

  if (error) {
    console.error('Failed to load provider profile:', error)
  }

  const membership = memberships?.[0]
  const providerProfile = Array.isArray(membership?.training_provider_profiles)
    ? membership?.training_provider_profiles[0]
    : membership?.training_provider_profiles

  if (!providerProfile) {
    redirect('/training-providers/dashboard')
  }

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <Link
            href="/training-providers/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to provider dashboard
          </Link>

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Provider profile</p>

            <h1 className="page-title-dark mt-6">
              Manage your provider profile.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Update the core organization information connected to your approved
              provider workspace.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <TrainingProviderProfileForm providerProfile={providerProfile} />
          </div>
        </div>
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}