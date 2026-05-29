import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import ProviderProgramUpdateRequestForm from '@/components/training-providers/ProviderProgramUpdateRequestForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Request Program Update — ${siteConfig.name}`,
  description:
    'Submit a provider program update request for admin review.',
}

type PageProps = {
  params: {
    id: string
  }
}

export default async function ProviderProgramUpdateRequestPage({
  params,
}: PageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: program, error } = await supabase
    .from('programs')
    .select(
      `
      id,
      name,
      provider_name,
      description,
      duration,
      cost,
      website_url,
      provider_profile_id
      `
    )
    .eq('id', params.id)
    .maybeSingle()

  if (error || !program || !program.provider_profile_id) {
    notFound()
  }

  const { data: membership } = await supabase
    .from('training_provider_memberships')
    .select('id, role, status')
    .eq('provider_profile_id', program.provider_profile_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (
    !membership ||
    (membership.role !== 'owner' && membership.role !== 'manager')
  ) {
    redirect('/training-providers/dashboard')
  }

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Provider update request</p>

            <h1 className="page-title-dark mt-6">
              Request a correction to a program listing.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Submit proposed changes for admin review. The public listing will
              not change until an admin reviews the request.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <ProviderProgramUpdateRequestForm
              program={{
                id: program.id,
                name: program.name,
                providerName: program.provider_name,
                description: program.description,
                duration: program.duration,
                cost: program.cost,
                websiteUrl: program.website_url,
              }}
            />
          </div>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}