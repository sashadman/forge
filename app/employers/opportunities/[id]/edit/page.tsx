import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import OpportunityEditForm from '@/components/employers/OpportunityEditForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

type PageProps = {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: `Edit Opportunity — ${siteConfig.name}`,
  description: 'Edit or deactivate an employer opportunity listing.',
}

export default async function EditOpportunityPage({ params }: PageProps) {
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

  const { data: opportunity } = await supabase
    .from('opportunities')
    .select(
      `
      id,
      employer_id,
      title,
      slug,
      opportunity_type,
      trade_slug,
      location,
      state,
      pay_range,
      schedule,
      description,
      requirements,
      benefits,
      application_url,
      is_active
    `
    )
    .eq('id', params.id)
    .eq('employer_id', employer.id)
    .maybeSingle()

  if (!opportunity) {
    redirect('/employers/dashboard')
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Manage listing</p>

            <h1 className="page-title-dark mt-6">
              Edit opportunity listing.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Update this listing or deactivate it when the opportunity is no longer available.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <OpportunityEditForm
              employerSlug={employer.slug}
              opportunity={opportunity}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}