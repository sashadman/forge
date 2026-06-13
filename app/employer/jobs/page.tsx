// app/employer/jobs/page.tsx

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, BriefcaseBusiness, MapPin } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/types/job'

export default async function EmployerJobsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Employer jobs fetch error:', error)
  }

  const employerJobs = (jobs ?? []) as Job[]

  return (
    <>
      <SiteNavbar />

      <main className="page-shell">
        <section className="hero-dark">
          <div className="hero-fade" />

          <div className="section-shell relative py-14">
            <p className="eyebrow-dark">
              <BriefcaseBusiness className="h-4 w-4" />
              Employer workspace
            </p>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="page-title-dark max-w-4xl">
                  Manage jobs
                </h1>

                <p className="lead-text-dark mt-4 max-w-3xl">
                  Create, review, and manage your Ara Skills job posts.
                </p>
              </div>

              <Link
                href="/employer/jobs/new"
                className="btn-primary shrink-0"
              >
                Post a new job
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell py-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Hiring board</p>
              <h2 className="section-title mt-3">
                Your job posts
              </h2>
              <p className="muted-text mt-2">
                {employerJobs.length} record
                {employerJobs.length === 1 ? '' : 's'} in your workspace.
              </p>
            </div>
          </div>

          <div className="mt-10">
            {employerJobs.length === 0 ? (
              <div className="content-panel border-dashed p-10">
                <h2
                  className="text-xl font-black"
                  style={{ color: 'var(--text-primary)' }}
                >
                  No jobs posted yet.
                </h2>
                <p
                  className="mt-3 max-w-2xl"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Start by creating your first skilled-trades opportunity.
                  Draft jobs stay private until you publish them.
                </p>

              </div>
            ) : (
              <div className="grid gap-5">
                {employerJobs.map((job) => (
                  <div
                    key={job.id}
                    className="card"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <span className="badge-slate">
                          {job.status}
                        </span>

                        <h2
                          className="mt-4 text-2xl font-black"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {job.title}
                        </h2>

                        <p
                          className="mt-2 font-bold"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {job.company_name}
                        </p>

                        <p
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <MapPin className="h-4 w-4" />
                          {[job.city, job.state].filter(Boolean).join(', ') ||
                            job.location ||
                            'Location not listed'}
                        </p>
                      </div>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="btn-outline"
                      >
                        View public page
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
