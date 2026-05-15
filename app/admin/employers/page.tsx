import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, ExternalLink, Plus, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Manage Employers — ${siteConfig.name}`,
  description: 'Admin list of employer records.',
}

export default async function AdminEmployersPage() {
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

  const { data: employers } = await supabase
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
      is_verified,
      is_active,
      created_at
    `
    )
    .order('created_at', { ascending: false })

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Admin</p>

              <h1 className="page-title-dark mt-6">
                Employer records.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review real employer profiles stored in the platform.
              </p>
            </div>

            <Link href="/admin/employers/new" className="btn-primary">
              Add employer
              <Plus className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="content-panel -mt-12">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Employer directory</p>
                <h2 className="section-title mt-3">
                  {employers?.length ?? 0} employer records
                </h2>
              </div>

              <Link href="/admin" className="btn-outline px-5 py-2 text-sm">
                Back to admin
              </Link>
            </div>

            {employers && employers.length > 0 ? (
              <div className="mt-8 grid gap-5">
                {employers.map((employer) => (
                  <div key={employer.id} className="card bg-slate-50">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-orange">
                            {employer.is_verified ? 'Verified' : 'Not verified'}
                          </span>

                          <span className="badge-slate">
                            {employer.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-slate-950">
                          {employer.name}
                        </h3>

                        <p className="mt-2 font-semibold text-slate-600">
                          {employer.industry || 'Industry not listed'}
                        </p>

                        <p className="muted-text mt-4 line-clamp-2">
                          {employer.description}
                        </p>

                        <p className="mt-4 text-sm font-semibold text-slate-500">
                          {employer.location}, {employer.state}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                        <Link
                          href={`/employers/${employer.slug}`}
                          className="btn-dark px-5 py-3 text-sm"
                        >
                          Public profile
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                          <ShieldCheck className="h-4 w-4" />
                          Admin reviewed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                <h3 className="text-xl font-bold text-slate-950">
                  No employers yet
                </h3>

                <p className="muted-text mt-2">
                  Add only real employers after checking their information.
                </p>

                <Link href="/admin/employers/new" className="btn-primary mt-5">
                  Add employer
                  <Plus className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}