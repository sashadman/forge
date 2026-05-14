import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import EmployerProfileEditForm from '@/components/employers/EmployerProfileEditForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Edit Employer Profile — ${siteConfig.name}`,
  description: 'Update your employer profile, website, and social links.',
}

export default async function EmployerProfilePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/employers/sign-in')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select(
      `
      id,
      name,
      slug,
      description,
      industry,
      location,
      state,
      website_url,
      contact_email,
      linkedin_url,
      instagram_url,
      facebook_url,
      x_url,
      youtube_url,
      tiktok_url,
      other_social_url,
      is_verified,
      is_active
    `
    )
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (!employer) {
    redirect('/employers/new')
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Employer profile</p>

            <h1 className="page-title-dark mt-6">
              Update your employer profile.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Keep your company information, website, contact email, and social
              links accurate for career seekers.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <EmployerProfileEditForm employer={employer} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}