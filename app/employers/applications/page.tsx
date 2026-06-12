import type { Metadata } from 'next'
import Link from 'next/link'
import { BriefcaseBusiness, Inbox, UsersRound } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PageHero from '@/components/ui/PageHero'
import BackLink from '@/components/ui/BackLink'
import EmptyState from '@/components/ui/EmptyState'
import NextStepPanel from '@/components/ui/NextStepPanel'
import ApplicationReviewCard from '@/components/applications/ApplicationReviewCard'
import { getEmployerApplicationsPageData } from '@/lib/employers/get-employer-applications-page-data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Applicant Review — ${siteConfig.name}`,
  description: 'Review applications submitted to your employer jobs and apprenticeships.',
}

export default async function EmployerApplicationsPage() {
  const { employer, applications, stats } =
    await getEmployerApplicationsPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Employer applicant review"
        title={`Review applications for ${employer.name}.`}
        description="Review submitted application packages, readiness snapshots, intro messages, and timeline history for your jobs and apprenticeships."
        actions={
          <BackLink
            href="/employers/dashboard"
            label="Back to employer dashboard"
            variant="light"
          />
        }
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <ApplicationStats stats={stats} />

          <div className="mt-8">
            <NextStepPanel
              title={
                applications.length > 0
                  ? 'Move applicants through a clear review process.'
                  : 'Applications will appear here after seekers apply.'
              }
              description={
                applications.length > 0
                  ? 'Review each application package, update the status, and keep internal notes so your hiring workflow stays organized.'
                  : 'If no applications are coming in, review your employer profile and active listings to make sure they are clear and attractive.'
              }
              primaryHref={
                applications.length > 0
                  ? '/employers/applications'
                  : '/employers/dashboard'
              }
              primaryLabel={
                applications.length > 0
                  ? 'Review below'
                  : 'Manage listings'
              }
              secondaryHref="/employers/profile"
              secondaryLabel="Improve profile"
              icon={<UsersRound className="h-6 w-6" />}
            />
          </div>

          {applications.length > 0 ? (
            <div className="mt-8 grid gap-6">
              {applications.map((application) => (
                <ApplicationReviewCard
                  key={application.id}
                  application={application}
                  viewer="employer"
                />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                icon={<Inbox className="h-6 w-6" />}
                title="No applications yet"
                description="Applications will appear here when seekers apply to your active jobs and apprenticeships. The best next step is to review your listings and make sure they clearly explain the role, requirements, pay, schedule, and how to apply."
                primaryHref="/employers/dashboard"
                primaryLabel="Manage listings"
                secondaryHref="/employers/profile"
                secondaryLabel="Improve profile"
              />
            </div>
          )}

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <BriefcaseBusiness className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Review standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Clear status updates create a better applicant experience.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  Keep application statuses accurate. Use internal notes for your
                  team, and move applicants forward only when you have actually
                  reviewed or contacted them.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/employers/dashboard" className="btn-light">
                    Manage listings
                  </Link>

                  <Link
                    href={`/employers/${employer.slug}`}
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Public profile
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function ApplicationStats({
  stats,
}: {
  stats: {
    total: number
    submitted: number
    reviewed: number
    contacted: number
    interviewing: number
    offered: number
    closed: number
  }
}) {
  return (
    <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-7">
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Submitted" value={stats.submitted} />
      <StatCard label="Reviewed" value={stats.reviewed} />
      <StatCard label="Contacted" value={stats.contacted} />
      <StatCard label="Interviewing" value={stats.interviewing} />
      <StatCard label="Offered" value={stats.offered} />
      <StatCard label="Closed" value={stats.closed} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="content-panel">
      <p className="eyebrow">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}