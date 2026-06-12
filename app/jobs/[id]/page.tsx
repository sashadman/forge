// app/jobs/[id]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/types/job'

type JobDetailPageProps = {
  params: {
    id: string
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    notFound()
  }

  const job = data as Job

  return (
    <>
      <SiteNavbar />

      <main className="page-shell">
        <section className="hero-dark">
          <div className="hero-fade" />

          <div className="section-shell relative py-16">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-100 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to jobs
            </Link>

            <div className="mt-8 flex flex-wrap gap-2">
              {job.is_external ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-orange-100">
                  <ExternalLink className="h-3.5 w-3.5" />
                  External Opportunity
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Ara Skills Employer
                </span>
              )}

              {job.trade_category && (
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {job.trade_category}
                </span>
              )}
            </div>

            <h1 className="page-title-dark mt-6 max-w-4xl">
              {job.title}
            </h1>

            <p className="mt-4 text-xl font-bold text-slate-200">
              {job.company_name}
            </p>

            <p className="mt-2 inline-flex items-center gap-2 text-slate-300">
              <MapPin className="h-4 w-4" />
              {[job.city, job.state].filter(Boolean).join(', ') ||
                job.location ||
                'Location not listed'}
            </p>
          </div>
        </section>

        <section className="section-shell py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <article className="content-panel p-8">
              <p className="eyebrow">Role brief</p>

              <h2 className="section-title mt-3">
                Job details
              </h2>

              {job.description_summary && (
                <p className="mt-5 leading-7 text-slate-700">
                  {job.description_summary}
                </p>
              )}

              {job.full_description && (
                <div className="mt-8 whitespace-pre-wrap leading-7 text-slate-700">
                  {job.full_description}
                </div>
              )}

              {!job.description_summary && !job.full_description && (
                <p className="mt-5 text-slate-600">
                  Details are limited. Use the application link for the full
                  job description.
                </p>
              )}
            </article>

            <aside className="content-panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-950">
                Opportunity summary
              </h2>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-black text-slate-950">Company</dt>
                  <dd className="mt-1 text-slate-600">{job.company_name}</dd>
                </div>

                <div>
                  <dt className="font-black text-slate-950">Location</dt>
                  <dd className="mt-1 text-slate-600">
                    {[job.city, job.state].filter(Boolean).join(', ') ||
                      job.location ||
                      'Not listed'}
                  </dd>
                </div>

                {job.employment_type && (
                  <div>
                    <dt className="font-black text-slate-950">
                      Employment type
                    </dt>
                    <dd className="mt-1 text-slate-600">
                      {job.employment_type}
                    </dd>
                  </div>
                )}

                {job.salary_text && (
                  <div>
                    <dt className="font-black text-slate-950">Pay</dt>
                    <dd className="mt-1 text-slate-600">{job.salary_text}</dd>
                  </div>
                )}

                {job.source_name && (
                  <div>
                    <dt className="font-black text-slate-950">Source</dt>
                    <dd className="mt-1 text-slate-600">{job.source_name}</dd>
                  </div>
                )}
              </dl>

              {job.apply_url ? (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-8 w-full"
                >
                  {job.is_external
                    ? 'Apply on Employer Site'
                    : 'Apply for this job'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href="/dashboard"
                  className="btn-primary mt-8 w-full"
                >
                  Apply through Ara Skills
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {job.is_external && (
                <p className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs font-semibold leading-5 text-slate-700">
                  This is an external opportunity. Ara Skills helps you discover
                  the job, but the application is completed on the original
                  employer or partner site.
                </p>
              )}
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
