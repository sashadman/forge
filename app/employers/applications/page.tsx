import type { Metadata } from 'next'
import { Inbox } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PageHero from '@/components/ui/PageHero'
import BackLink from '@/components/ui/BackLink'
import EmptyState from '@/components/ui/EmptyState'
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
              />
            </div>
          )}
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
      <h2
        className="mt-3 text-3xl font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </h2>
    </div>
  )
}
