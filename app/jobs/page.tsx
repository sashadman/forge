// app/jobs/page.tsx

import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
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

      <main className="page-shell">
        <section className="hero-dark">
          <div className="hero-fade" />

          <div className="section-shell relative py-20">
            <p className="eyebrow-dark">
              <BriefcaseBusiness className="h-4 w-4" />
              Skilled-trades jobs
            </p>

            <h1 className="page-title-dark mt-6 max-w-4xl">
              Find real skilled-trades opportunities.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Browse jobs posted by Ara Skills employers and trusted external
              hiring sources. External jobs will take you to the original
              application page.
            </p>

            <div className="mt-8 rounded-lg border border-white/10 bg-white/10 p-4 text-sm leading-6 text-slate-200 backdrop-blur">
              Ara Skills helps you discover skilled-trades opportunities. Some
              jobs are posted directly by employers, while others link to
              trusted external hiring pages.
            </div>
          </div>
        </section>

        <section className="section-shell py-12">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Live board</p>

              <h2 className="section-title mt-3">
                Open opportunities
              </h2>
              <p className="muted-text mt-2">
                {activeJobs.length} active job
                {activeJobs.length === 1 ? '' : 's'} available.
              </p>
            </div>

            <Link
              href="/employer/jobs/new"
              className="btn-primary"
            >
              Post a job
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {activeJobs.length === 0 ? (
            <div className="content-panel border-dashed p-10">
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
                  className="card card-hover block"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {job.is_external ? (
                          <span className="trust-badge">
                            <ExternalLink className="h-3.5 w-3.5 text-orange-600" />
                            External Opportunity
                          </span>
                        ) : (
                          <span className="trust-badge">
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
                            Ara Skills Employer
                          </span>
                        )}

                        {job.is_verified && (
                          <span className="badge-success">
                            Verified
                          </span>
                        )}

                        {job.trade_category && (
                          <span className="badge-slate">
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

                      <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <MapPin className="h-4 w-4" />
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

                      <p className="btn-dark mt-4">
                        View job
                        <ArrowRight className="h-4 w-4" />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
