import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BriefcaseBusiness, Inbox } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ApplicationReviewCard from '@/components/applications/ApplicationReviewCard'
import { getEmployerApplicationsPageData } from '@/lib/employers/get-employer-applications-page-data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Applicant Review — ${siteConfig.name}`,
  description: 'Review applications submitted to your employer opportunities.',
}

export default async function EmployerApplicationsPage() {
  const { employer, applications, stats } =
    await getEmployerApplicationsPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Employer applicant review</p>

              <h1 className="page-title-dark mt-6">
                Review applications for {employer.name}.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review submitted application packages, readiness snapshots, intro
                messages, and application timeline history for your opportunities.
              </p>
            </div>

            <Link
              href="/employers/dashboard"
              className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Employer dashboard
            </Link>
          </div>
        </div>
      </section>

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
            <EmptyApplicationsState />
          )}
        </div>
      </section>

      <SiteFooter />
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

function EmptyApplicationsState() {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8">
      <Inbox className="h-10 w-10 text-orange-600" />

      <h2 className="mt-5 text-2xl font-bold text-slate-950">
        No applications yet
      </h2>

      <p className="muted-text mt-3 max-w-2xl">
        Applications will appear here when seekers apply to your active
        opportunities.
      </p>

      <Link href="/employers/dashboard" className="btn-dark mt-6">
        <BriefcaseBusiness className="h-4 w-4" />
        Manage opportunities
      </Link>
    </div>
  )
}