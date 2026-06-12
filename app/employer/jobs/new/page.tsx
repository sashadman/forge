// app/employer/jobs/new/page.tsx

import { redirect } from 'next/navigation'
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

      <main className="min-h-screen bg-slate-50">
        <section className="section-shell py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
              Employer workspace
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Post a job
            </h1>

            <p className="mt-3 text-slate-600">
              Create a skilled-trades job for Ara Skills career seekers. You
              can save it as a draft or publish it immediately.
            </p>
          </div>

          <form
            action={createJob}
            className="mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="grid gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="text-sm font-black text-slate-950"
                >
                  Job title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  placeholder="Electrician Apprentice"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label
                  htmlFor="company_name"
                  className="text-sm font-black text-slate-950"
                >
                  Company name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  required
                  placeholder="Ara Electrical Services"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="text-sm font-black text-slate-950"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    placeholder="San Diego"
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="text-sm font-black text-slate-950"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    placeholder="CA"
                    maxLength={2}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="trade_category"
                    className="text-sm font-black text-slate-950"
                  >
                    Trade category
                  </label>
                  <select
                    id="trade_category"
                    name="trade_category"
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
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
                    className="text-sm font-black text-slate-950"
                  >
                    Employment type
                  </label>
                  <select
                    id="employment_type"
                    name="employment_type"
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
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
                  className="text-sm font-black text-slate-950"
                >
                  Pay / salary
                </label>
                <input
                  id="salary_text"
                  name="salary_text"
                  placeholder="$22 - $30 per hour"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label
                  htmlFor="description_summary"
                  className="text-sm font-black text-slate-950"
                >
                  Short summary
                </label>
                <textarea
                  id="description_summary"
                  name="description_summary"
                  rows={3}
                  placeholder="Write a short summary of the opportunity."
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label
                  htmlFor="full_description"
                  className="text-sm font-black text-slate-950"
                >
                  Full job description
                </label>
                <textarea
                  id="full_description"
                  name="full_description"
                  rows={8}
                  placeholder="Responsibilities, requirements, schedule, benefits, and application instructions."
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
                  className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Save job
                </button>

                <a
                  href="/employer/jobs"
                  className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-black text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
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