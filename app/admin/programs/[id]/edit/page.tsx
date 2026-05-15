import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import AdminProgramEditForm from '@/components/admin/AdminProgramEditForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

type PageProps = {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: `Edit Program — ${siteConfig.name}`,
  description: 'Admin-only training program editing.',
}

export default async function EditAdminProgramPage({ params }: PageProps) {
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

  const { data: program } = await supabase
    .from('programs')
    .select(
      `
      id,
      slug,
      name,
      provider_name,
      program_type,
      trade_slug,
      location,
      state,
      duration,
      cost,
      description,
      requirements,
      outcomes,
      website_url,
      is_active
    `
    )
    .eq('id', params.id)
    .maybeSingle()

  if (!program) {
    redirect('/admin/programs')
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
              Edit program record.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Update real training program information. Keep records accurate and avoid placeholder data.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <AdminProgramEditForm program={program} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}