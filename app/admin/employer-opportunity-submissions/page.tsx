import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  BriefcaseBusiness,
  Clock3,
  Database,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import PageHero from '@/components/ui/PageHero'
import BackLink from '@/components/ui/BackLink'
import EmptyState from '@/components/ui/EmptyState'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { createClient } from '@/lib/supabase/server'
import AdminEmployerOpportunitySubmissionCard, {
  type AdminEmployerOpportunitySubmission,
} from '@/components/admin/employer-opportunity-submissions/AdminEmployerOpportunitySubmissionCard'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Employer Opportunity Submissions — ${siteConfig.name}`,
  description: 'Admin review queue for employer-submitted opportunities.',
}

async function requireAdmin() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    redirect('/')
  }
}

export default async function AdminEmployerOpportunitySubmissionsPage() {
  const supabase = createClient()
  await requireAdmin()

  const { data } = await supabase
    .from('employer_opportunity_submissions')
    .select(
      `
      id,
      title,
      opportunity_type,
      trade_slug,
      location,
      state,
      pay_range,
      schedule,
      description,
      requirements,
      benefits,
      application_url,
      external_url,
      status,
      admin_notes,
      approved_opportunity_id,
      created_at,
      employers (
        name,
        slug,
        is_verified
      )
      `
    )
    .order('created_at', { ascending: false })

  const submissions = (data ?? []) as AdminEmployerOpportunitySubmission[]

  const submittedCount = submissions.filter(
    (submission) => submission.status === 'submitted'
  ).length

  const approvedCount = submissions.filter(
    (submission) => submission.status === 'approved'
  ).length

  const rejectedCount = submissions.filter(
    (submission) => submission.status === 'rejected'
  ).length

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Admin employer submissions"
        title="Review employer-submitted opportunities before they go public."
        description="Approve only real, useful, current opportunities. Rejected submissions return to the employer with notes so they can improve quality before publication."
        actions={<BackLink href="/admin" label="Back to admin" variant="light" />}
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Awaiting review"
              value={submittedCount}
              icon={<Clock3 className="h-7 w-7" />}
            />

            <MetricCard
              label="Approved"
              value={approvedCount}
              icon={<ShieldCheck className="h-7 w-7" />}
            />

            <MetricCard
              label="Rejected"
              value={rejectedCount}
              icon={<FileCheck2 className="h-7 w-7" />}
            />

            <MetricCard
              label="Total submissions"
              value={submissions.length}
              icon={<BriefcaseBusiness className="h-7 w-7" />}
            />
          </div>

          <div className="mt-8">
            <NextStepPanel
              title={
                submittedCount > 0
                  ? 'Review submitted opportunities before seekers see them.'
                  : 'No employer submissions are waiting for review.'
              }
              description={
                submittedCount > 0
                  ? 'Approve listings only when they are real, understandable, and connected to an active employer profile. Reject unclear submissions with specific notes.'
                  : 'Employer-submitted listings will appear here. Admin-created sourced listings still live in the main opportunity review page.'
              }
              primaryHref="/admin/opportunities"
              primaryLabel="Main opportunity review"
              secondaryHref="/admin/employers"
              secondaryLabel="Review employers"
              icon={<Database className="h-6 w-6" />}
            />
          </div>

          {submissions.length > 0 ? (
            <div className="mt-8 grid gap-5">
              {submissions.map((submission) => (
                <AdminEmployerOpportunitySubmissionCard
                  key={submission.id}
                  submission={submission}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                icon={<BriefcaseBusiness className="h-6 w-6" />}
                title="No employer opportunity submissions yet"
                description="When employers submit jobs, apprenticeships, trainee roles, or pre-apprenticeships for review, they will appear here before becoming public."
                primaryHref="/admin/opportunities"
                primaryLabel="Open opportunity review"
                secondaryHref="/admin/employers"
                secondaryLabel="Review employers"
              />
            </div>
          )}

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Review standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Employer-submitted does not mean automatically public.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  This review queue protects seekers from fake, vague, stale, or
                  low-quality listings. Keep the public directory smaller but
                  more trustworthy.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/admin/opportunities" className="btn-light">
                    Main opportunities
                  </Link>

                  <Link
                    href="/admin/employers"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Employer records
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
}) {
  return (
    <div className="content-panel">
      <div className="text-orange-600">{icon}</div>
      <p className="eyebrow mt-5">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}
