import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import AdminProgramForm from '@/components/admin/AdminProgramForm'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Add Program — ${siteConfig.name}`,
  description: 'Admin-only manual training program creation.',
}

export default async function NewAdminProgramPage() {
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

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Admin</p>

            <h1 className="page-title-dark mt-6">
              Add a real training program.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Manually add a real apprenticeship, trade school, community college,
              workforce program, or employer training pathway.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <AdminProgramForm />
          </div>
        </div>
      </section>
    </main>
  )
}