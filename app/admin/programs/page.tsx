import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
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
  description: 'Admin review page for training program data quality.',
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
      requirements,
      outcomes,
      website_url,
      is_active,
      created_at
    `
    )
    .order('created_at', { ascending: false })

  const totalPrograms = programs?.length ?? 0
  const activeCount = programs?.filter((program) => program.is_active).length ?? 0
  const inactiveCount =
    programs?.filter((program) => !program.is_active).length ?? 0

  const strongQualityCount =
    programs?.filter((program) => {
      const qualityItems = [
        Boolean(program.name),
        Boolean(program.provider_name),
        Boolean(program.program_type),
        Boolean(program.trade_slug),
        Boolean(program.location && program.state),
        program.description.trim().length >= 100,
        Boolean(program.duration),
        Boolean(program.cost),
        Boolean(program.requirements && program.requirements.length > 0),
        Boolean(program.outcomes && program.outcomes.length > 0),
        Boolean(program.website_url),
      ]

      const qualityScore = Math.round(
        (qualityItems.filter(Boolean).length / qualityItems.length) * 100
      )

      return qualityScore >= 80
    }).length ?? 0

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Admin data quality</p>

              <h1 className="page-title-dark mt-6">
                Program quality workflow.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review real training programs, pathway completeness, provider
                links, eligibility requirements, outcomes, and public visibility.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/admin/programs/new" className="btn-primary">
                Add program
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/admin" className="btn-light">
                Back to admin
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-4">
            <StatusPanel label="Total programs" value={`${totalPrograms}`} />
            <StatusPanel label="Active" value={`${activeCount}`} />
            <StatusPanel label="Inactive" value={`${inactiveCount}`} />
            <StatusPanel
              label="Strong quality"
              value={`${strongQualityCount}`}
            />
          </div>

          <div className="content-panel mt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Program directory</p>

                <h2 className="section-title mt-3">
                  {totalPrograms} program records
                </h2>

                <p className="muted-text mt-3 max-w-2xl">
                  Use this page to review program quality. Keep public records
                  useful, accurate, and based on real provider information. Do
                  not add placeholder or filler programs.
                </p>
              </div>

              <Link
                href="/admin/opportunities"
                className="btn-outline px-5 py-2 text-sm"
              >
                Review opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {programs && programs.length > 0 ? (
              <div className="mt-8 grid gap-5">
                {programs.map((program) => {
                  const qualityItems = [
                    Boolean(program.name),
                    Boolean(program.provider_name),
                    Boolean(program.program_type),
                    Boolean(program.trade_slug),
                    Boolean(program.location && program.state),
                    program.description.trim().length >= 100,
                    Boolean(program.duration),
                    Boolean(program.cost),
                    Boolean(program.requirements && program.requirements.length > 0),
                    Boolean(program.outcomes && program.outcomes.length > 0),
                    Boolean(program.website_url),
                  ]

                  const qualityScore = Math.round(
                    (qualityItems.filter(Boolean).length / qualityItems.length) *
                      100
                  )

                  const strongQuality = qualityScore >= 80

                  return (
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

                            <span
                              className={
                                strongQuality ? 'badge-orange' : 'badge-slate'
                              }
                            >
                              {qualityScore}% quality
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

                          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <MiniCheck
                              label="Website"
                              complete={Boolean(program.website_url)}
                            />
                            <MiniCheck
                              label="Duration"
                              complete={Boolean(program.duration)}
                            />
                            <MiniCheck
                              label="Requirements"
                              complete={Boolean(
                                program.requirements &&
                                  program.requirements.length > 0
                              )}
                            />
                            <MiniCheck
                              label="Outcomes"
                              complete={Boolean(
                                program.outcomes && program.outcomes.length > 0
                              )}
                            />
                          </div>

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

                          <Link
                            href={`/admin/programs/${program.id}/edit`}
                            className="btn-outline px-5 py-3 text-sm"
                          >
                            Review / edit
                            <ArrowRight className="h-4 w-4" />
                          </Link>

                          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                            {strongQuality ? (
                              <ShieldCheck className="h-4 w-4 text-orange-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-slate-500" />
                            )}
                            {strongQuality ? 'Strong record' : 'Needs detail'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
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

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link href="/admin/programs/new" className="btn-primary">
                        Add program
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link href="/admin" className="btn-dark">
                        Back to admin
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
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

function StatusPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-panel">
      <p className="eyebrow">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}

function MiniCheck({
  label,
  complete,
}: {
  label: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        {complete ? (
          <CheckCircle2 className="h-4 w-4 text-orange-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-slate-400" />
        )}

        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
    </div>
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