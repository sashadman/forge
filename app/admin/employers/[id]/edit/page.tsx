import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import AdminEmployerEditForm from '@/components/admin/AdminEmployerEditForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

type PageProps = {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: `Edit Employer — ${siteConfig.name}`,
  description: 'Admin-only employer profile editing.',
}

export default async function EditAdminEmployerPage({ params }: PageProps) {
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
    .eq('id', params.id)
    .maybeSingle()

  if (!employer) {
    redirect('/admin/employers')
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
              Edit employer record.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Update real employer information, verification status, visibility,
              website, and social links.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <AdminEmployerEditForm employer={employer} />
          </div>
        </div>
      </section>
    </main>
  )
}