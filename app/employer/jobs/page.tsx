// app/employer/jobs/page.tsx

import Link from 'next/link'
import { redirect } from 'next/navigation'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
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

      <main className="min-h-screen bg-slate-50">
        <section className="section-shell py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
                Employer workspace
              </p>
              <h1 className="mt-3 text-4xl font-black text-slate-950">
                Manage jobs
              </h1>
              <p className="mt-3 text-slate-600">
                Create, review, and manage your Ara Skills job posts.
              </p>
            </div>

            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Post a new job
            </Link>
          </div>

          <div className="mt-10">
            {employerJobs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">
                  No jobs posted yet.
                </h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Start by creating your first skilled-trades opportunity.
                  Draft jobs stay private until you publish them.
                </p>

                <Link
                  href="/employer/jobs/new"
                  className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Create first job
                </Link>
              </div>
            ) : (
              <div className="grid gap-5">
                {employerJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                          {job.status}
                        </span>

                        <h2 className="mt-4 text-2xl font-black text-slate-950">
                          {job.title}
                        </h2>

                        <p className="mt-2 font-bold text-slate-700">
                          {job.company_name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {[job.city, job.state].filter(Boolean).join(', ') ||
                            job.location ||
                            'Location not listed'}
                        </p>
                      </div>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                      >
                        View public page
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}