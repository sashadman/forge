// app/jobs/[id]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
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

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 text-white">
          <div className="section-shell py-16">
            <Link
              href="/jobs"
              className="text-sm font-bold text-cyan-200 transition hover:text-white"
            >
              ← Back to jobs
            </Link>

            <div className="mt-8 flex flex-wrap gap-2">
              {job.is_external ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                  External Opportunity
                </span>
              ) : (
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800">
                  Ara Skills Employer
                </span>
              )}

              {job.trade_category && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  {job.trade_category}
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              {job.title}
            </h1>

            <p className="mt-4 text-xl font-bold text-slate-200">
              {job.company_name}
            </p>

            <p className="mt-2 text-slate-300">
              {[job.city, job.state].filter(Boolean).join(', ') ||
                job.location ||
                'Location not listed'}
            </p>
          </div>
        </section>

        <section className="section-shell py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
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

            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
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
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  {job.is_external
                    ? 'Apply on original site'
                    : 'Apply for this job'}
                </a>
              ) : (
                <Link
                  href="/dashboard"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Apply through Ara Skills
                </Link>
              )}

              {job.is_external && (
                <p className="mt-4 text-xs leading-5 text-slate-500">
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