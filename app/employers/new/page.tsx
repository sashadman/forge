import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import EmployerProfileForm from '@/components/employers/EmployerProfileForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Create Employer Profile — ${siteConfig.name}`,
  description:
    'Create a real employer profile connected to your account.',
}

export default async function NewEmployerPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/employers/sign-in')
  }

  const { data: existingEmployer } = await supabase
    .from('employers')
    .select('slug')
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (existingEmployer) {
    redirect(`/employers/${existingEmployer.slug}`)
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Employer account</p>

            <h1 className="page-title-dark mt-6">
              Create your employer profile.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Add real company information so career seekers can understand who
              you are, where you are located, and how to learn more about your organization.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <EmployerProfileForm userId={user.id} userEmail={user.email || ''} />
          </div>
        </div>
      </section>
    </main>
  )
}