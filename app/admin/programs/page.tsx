import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Manage Programs — ${siteConfig.name}`,
  description: 'Admin review page for training program records.',
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function AdminProgramsPage() {
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

  const { data: programs } = await supabase
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
      website_url,
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
                Program records.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review training programs, apprenticeships, workforce programs,
                and pathway records stored in the platform.
              </p>
            </div>

            <Link href="/admin" className="btn-light">
              Back to admin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="content-panel -mt-12">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Program directory</p>

                <h2 className="section-title mt-3">
                  {programs?.length ?? 0} program records
                </h2>

                <p className="muted-text mt-3 max-w-2xl">
                  Use this page to review real public-directory program records.
                  Do not add placeholder or filler programs.
                </p>
              </div>

              <Link href="/admin/opportunities" className="btn-outline px-5 py-2 text-sm">
                Review opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {programs && programs.length > 0 ? (
              <div className="mt-8 grid gap-5">
                {programs.map((program) => (
                  <div key={program.id} className="card bg-slate-50">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-orange">
                            {formatProgramType(program.program_type)}
                          </span>

                          <span className="badge-slate">
                            {program.is_active ? 'Active' : 'Inactive'}
                          </span>

                          <span className="badge-slate">
                            {program.trade_slug}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-slate-950">
                          {program.name}
                        </h3>

                        <p className="mt-2 font-semibold text-slate-600">
                          {program.provider_name}
                        </p>

                        <p className="muted-text mt-4 line-clamp-3">
                          {program.description}
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          <MiniDetail
                            label="Location"
                            value={`${program.location}, ${program.state}`}
                          />

                          <MiniDetail
                            label="Duration"
                            value={program.duration || 'See provider'}
                          />

                          <MiniDetail
                            label="Cost"
                            value={program.cost || 'See provider'}
                          />
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                        {program.is_active && (
                          <Link
                            href={`/programs/${program.slug}`}
                            className="btn-dark px-5 py-3 text-sm"
                          >
                            Public program
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}

                        {program.website_url && (
                          <a
                            href={program.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline px-5 py-3 text-sm"
                          >
                            Provider site
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}

                        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                          <ShieldCheck className="h-4 w-4" />
                          Admin review
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                <div className="flex items-start gap-4">
                  <GraduationCap className="mt-1 h-6 w-6 text-orange-600" />

                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      No program records yet
                    </h3>

                    <p className="muted-text mt-2">
                      Program records will appear here when real directory data
                      is added to the platform.
                    </p>

                    <Link href="/admin" className="btn-dark mt-5">
                      Back to admin
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  )
}