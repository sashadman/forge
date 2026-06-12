import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import AdminOpportunityEditForm from '@/components/admin/AdminOpportunityEditForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

type PageProps = {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: `Edit Opportunity — ${siteConfig.name}`,
  description: 'Admin-only opportunity listing editing.',
}

export default async function EditAdminOpportunityPage({ params }: PageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
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
      is_active,
      employers (
        name,
        slug
      )
    `
    )
    .eq('id', params.id)
    .maybeSingle()

  if (!opportunity) {
    redirect('/admin/opportunities')
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Admin</p>

            <h1 className="page-title-dark mt-6">
              Edit opportunity record.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Update real opportunity listing information and public visibility.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <AdminOpportunityEditForm opportunity={opportunity} />
          </div>
        </div>
      </section>
    </main>
  )
}