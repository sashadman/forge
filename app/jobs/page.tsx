// app/jobs/page.tsx

import Link from 'next/link'
import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/types/job'

export const metadata: Metadata = {
  title: 'Skilled Trades Jobs — Ara Skills',
  description:
    'Explore skilled-trades jobs, apprenticeships, and external opportunities.',
}

export default async function JobsPage() {
  const supabase = createClient()

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('posted_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Jobs fetch error:', error)
  }

  const activeJobs = (jobs ?? []) as Job[]

  return (
    <>
      <SiteNavbar />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 text-white">
          <div className="section-shell py-20">
            <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
              Skilled-trades jobs
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
              Find real skilled-trades opportunities.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Browse jobs posted by Ara Skills employers and trusted external
              hiring sources. External jobs will take you to the original
              application page.
            </p>
          </div>
        </section>

        <section className="section-shell py-12">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Open opportunities
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {activeJobs.length} active job
                {activeJobs.length === 1 ? '' : 's'} available.
              </p>
            </div>

            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Post a job
            </Link>
          </div>

          {activeJobs.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-950">
                No jobs are active yet.
              </h3>
              <p className="mt-3 max-w-2xl text-slate-600">
                Ara Skills is preparing job listings for skilled-trades career
                seekers. Employers can already begin posting opportunities.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {activeJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {job.is_external ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                            External Opportunity
                          </span>
                        ) : (
                          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800">
                            Ara Skills Employer
                          </span>
                        )}

                        {job.is_verified && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                            Verified
                          </span>
                        )}

                        {job.trade_category && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {job.trade_category}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-2xl font-black text-slate-950">
                        {job.title}
                      </h3>

                      <p className="mt-2 font-bold text-slate-700">
                        {job.company_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {[job.city, job.state].filter(Boolean).join(', ') ||
                          job.location ||
                          'Location not listed'}
                      </p>

                      {job.description_summary && (
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                          {job.description_summary}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-left lg:text-right">
                      {job.salary_text && (
                        <p className="text-sm font-black text-slate-950">
                          {job.salary_text}
                        </p>
                      )}

                      <p className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
                        View job
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  )
}