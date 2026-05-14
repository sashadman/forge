import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import OpportunityForm from '@/components/employers/OpportunityForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Create Opportunity — ${siteConfig.name}`,
  description:
    'Create a real skilled-trades job, apprenticeship, trainee, or pre-apprenticeship listing.',
}

export default async function NewOpportunityPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/employers/sign-in')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select('id, name, slug')
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
            <p className="eyebrow-dark">Employer opportunity</p>

            <h1 className="page-title-dark mt-6">
              Create a real opportunity listing.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Add a real job, apprenticeship, trainee role, or pre-apprenticeship
              opportunity connected to {employer.name}. Do not post test,
              placeholder, or fake listings.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <OpportunityForm employerId={employer.id} employerSlug={employer.slug} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}