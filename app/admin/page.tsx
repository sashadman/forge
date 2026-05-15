import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Admin — ${siteConfig.name}`,
  description: 'Admin tools for managing real Forge platform records.',
}

export default async function AdminPage() {
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

  const { count: employerCount } = await supabase
    .from('employers')
    .select('id', { count: 'exact', head: true })

  const { count: opportunityCount } = await supabase
    .from('opportunities')
    .select('id', { count: 'exact', head: true })

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Admin</p>

            <h1 className="page-title-dark mt-6">
              Manage real platform records.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Use this area only for verified, real employers and platform data.
              No fake employers, filler listings, or placeholder records.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-3">
            <div className="content-panel">
              <Building2 className="h-8 w-8 text-orange-600" />
              <p className="eyebrow mt-5">Employers</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                {employerCount ?? 0}
              </h2>
              <p className="muted-text mt-3">
                Employer profiles currently stored in Forge.
              </p>
            </div>

            <div className="content-panel">
              <BriefcaseBusiness className="h-8 w-8 text-orange-600" />
              <p className="eyebrow mt-5">Opportunities</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                {opportunityCount ?? 0}
              </h2>
              <p className="muted-text mt-3">
                Opportunity records connected to employers.
              </p>
            </div>

            <div className="content-panel">
              <ShieldCheck className="h-8 w-8 text-orange-600" />
              <p className="eyebrow mt-5">Access</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Admin
              </h2>
              <p className="muted-text mt-3">
                This page is protected by your profile role.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Link href="/admin/employers" className="card card-hover group">
              <h2 className="text-2xl font-bold text-slate-950">
                Manage employers
              </h2>

              <p className="muted-text mt-3">
                Review employer records and access public profile pages.
              </p>

              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-700">
                Open employer admin
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link href="/admin/employers/new" className="card card-hover group">
              <h2 className="text-2xl font-bold text-slate-950">
                Add real employer
              </h2>

              <p className="muted-text mt-3">
                Manually add a real employer after checking the information.
              </p>

              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-700">
                Create employer record
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}