// app/employer/jobs/new/page.tsx

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BriefcaseBusiness, CheckCircle2 } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { createClient } from '@/lib/supabase/server'

async function createJob(formData: FormData) {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const title = String(formData.get('title') ?? '').trim()
  const companyName = String(formData.get('company_name') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const state = String(formData.get('state') ?? '').trim()
  const tradeCategory = String(formData.get('trade_category') ?? '').trim()
  const employmentType = String(formData.get('employment_type') ?? '').trim()
  const salaryText = String(formData.get('salary_text') ?? '').trim()
  const descriptionSummary = String(
    formData.get('description_summary') ?? ''
  ).trim()
  const fullDescription = String(formData.get('full_description') ?? '').trim()
  const publishNow = formData.get('publish_now') === 'on'

  if (!title || !companyName) {
    throw new Error('Job title and company name are required.')
  }

  const status = publishNow ? 'active' : 'draft'

  const { error } = await supabase.from('jobs').insert({
    employer_id: user.id,
    title,
    company_name: companyName,
    city: city || null,
    state: state || null,
    location: [city, state].filter(Boolean).join(', ') || null,
    trade_category: tradeCategory || null,
    employment_type: employmentType || null,
    salary_text: salaryText || null,
    description_summary: descriptionSummary || null,
    full_description: fullDescription || null,
    source_type: 'direct_employer',
    source_name: 'Ara Skills',
    is_external: false,
    is_verified: false,
    status,
    posted_at: publishNow ? new Date().toISOString() : null,
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect('/employer/jobs')
}

export default async function NewEmployerJobPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      <SiteNavbar />

      <main className="page-shell">
        <section className="hero-dark">
          <div className="hero-fade" />

          <div className="section-shell relative py-14">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-100 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to jobs
            </Link>

            <p className="eyebrow-dark mt-8">
              <BriefcaseBusiness className="h-4 w-4" />
              Employer workspace
            </p>

            <h1 className="page-title-dark mt-5 max-w-4xl">
              Post a job
            </h1>

            <p className="lead-text-dark mt-5 max-w-3xl">
              Create a skilled-trades job for Ara Skills career seekers. You
              can save it as a draft or publish it immediately.
            </p>
          </div>
        </section>

        <section className="section-shell py-12">
          <form
            action={createJob}
            className="content-panel max-w-3xl p-8"
          >
            <div className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                <p className="text-sm font-semibold leading-6 text-slate-800">
                  Direct employer jobs should be real openings with clear pay,
                  location, requirements, and current application instructions.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="label"
                >
                  Job title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  placeholder="Electrician Apprentice"
                  className="input-field mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="company_name"
                  className="label"
                >
                  Company name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  required
                  placeholder="Ara Electrical Services"
                  className="input-field mt-2"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="label"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    placeholder="San Diego"
                    className="input-field mt-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="label"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    placeholder="CA"
                    maxLength={2}
                    className="input-field mt-2"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="trade_category"
                    className="label"
                  >
                    Trade category
                  </label>
                  <select
                    id="trade_category"
                    name="trade_category"
                    className="select-field mt-2 w-full"
                  >
                    <option value="">Select category</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Welding">Welding</option>
                    <option value="Construction">Construction</option>
                    <option value="Solar">Solar</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="employment_type"
                    className="label"
                  >
                    Employment type
                  </label>
                  <select
                    id="employment_type"
                    name="employment_type"
                    className="select-field mt-2 w-full"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="salary_text"
                  className="label"
                >
                  Pay / salary
                </label>
                <input
                  id="salary_text"
                  name="salary_text"
                  placeholder="$22 - $30 per hour"
                  className="input-field mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="description_summary"
                  className="label"
                >
                  Short summary
                </label>
                <textarea
                  id="description_summary"
                  name="description_summary"
                  rows={3}
                  placeholder="Write a short summary of the opportunity."
                  className="input-field mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="full_description"
                  className="label"
                >
                  Full job description
                </label>
                <textarea
                  id="full_description"
                  name="full_description"
                  rows={8}
                  placeholder="Responsibilities, requirements, schedule, benefits, and application instructions."
                  className="input-field mt-2"
                />
              </div>

              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="publish_now"
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <span>
                  <span className="block text-sm font-black text-slate-950">
                    Publish now
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    If unchecked, this job will be saved as a draft.
                  </span>
                </span>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save job
                </button>

                <a
                  href="/employer/jobs"
                  className="btn-outline"
                >
                  Cancel
                </a>
              </div>
            </div>
          </form>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
